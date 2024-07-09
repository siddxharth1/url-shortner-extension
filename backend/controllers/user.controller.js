const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createToken = require("../utils/createToken");
const URL = require("../models/url.model");

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

const handleUserSignup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ resp: "please provide all fields" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ resp: "password not matching" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userResp = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(userResp._id);
    return res.status(200).json({ email: userResp.email, token });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({ resp: "email already exists" });
    }
    return res.status(400).json({ resp: error });
  }
};

const handleGetUserInfo = async (req, res) => {
  const user = req.user._id;
  const data = await User.findOne({ _id: user }).select("-password");
  const numberOfUrlsCreated = await URL.find({
    createdBy: user,
  }).countDocuments();
  res.json({ data, numberOfUrlsCreated });
};

module.exports = { handleUserLogin, handleUserSignup, handleGetUserInfo };
