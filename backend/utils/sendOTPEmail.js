const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    // port: 587,
    // secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for email verification",
    text: crypto.randomInt(100000, 999999).toString(),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(400).json({ resp: error });
    }
    console.log("Email sent: " + info.response);
    return res.status(200).json({ resp: "OTP sent to email" });
  });
  return;
};

module.exports = { sendOTPEmail };
