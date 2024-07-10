const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createToken = require("../utils/createToken");
const URL = require("../models/url.model");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");
const TempUser = require("../models/UserOTPVerification.model");

const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  if (!email || !password) {
    return res.status(400).json({ resp: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ resp: "User not found" });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      return res.status(400).json({ resp: "Invalid password" });
    }
    const token = createToken(user._id);
    return res.status(200).json({ resp: "found user", token, email });
  } catch (error) {
    res.status(400).json({ resp: error });
  }
};

const handleOTPVerification = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp);

  const findTempUser = await TempUser.findOne({ email });
  if (!findTempUser) {
    return res.status(400).json({ resp: "User not found" });
  }
  if (findTempUser.otp !== Number(otp)) {
    return res.status(400).json({ resp: "Invalid OTP" });
  }

  try {
    const userResp = await User.create({
      name: findTempUser.name,
      email: findTempUser.email,
      password: findTempUser.password,
    });

    // const token = createToken(userResp._id);
    await TempUser.deleteOne({ email });
    return res.status(200).json({ resp: "account successfully created" });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({ resp: "email already exists" });
    }
    return res.status(400).json({ resp: error });
  }

  // if (email !== requestUser.email) {
  //   return res.status(400).json({ resp: "email not matching" });
  // }
};

const handleUserSignup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ resp: "please provide all fields" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ resp: "password not matching" });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ resp: "email already exists" });
  }

  const checkIfTempUserExists = await TempUser.findOne({ email });
  if (checkIfTempUserExists) {
    await TempUser.deleteOne({ email });
  }
  console.log(process.env.EMAIL);
  console.log(process.env.EMAIL_PASSWORD);
  const otp = crypto.randomInt(100000, 999999).toString();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for email verification",
    text: otp,
  };
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const tempUser = await TempUser.create({
    name,
    email,
    password: hashedPassword,
    otp,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(400).json({ resp: error });
    }
    console.log("Email sent: " + info.response);
    return res.status(200).json({ resp: "OTP sent to email" });
  });
};

const handleGetUserInfo = async (req, res) => {
  const user = req.user._id;
  const data = await User.findOne({ _id: user }).select("-password");
  const numberOfUrlsCreated = await URL.find({
    createdBy: user,
  }).countDocuments();
  res.json({ data, numberOfUrlsCreated });
};

module.exports = {
  handleUserLogin,
  handleUserSignup,
  handleGetUserInfo,
  handleOTPVerification,
};
