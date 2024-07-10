const mongoose = require("mongoose");
const { create } = require("./user.model");

const tempUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
});

const TempUser = mongoose.model("TempUser", tempUserSchema);

module.exports = TempUser;
