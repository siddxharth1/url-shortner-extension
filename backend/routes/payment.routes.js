const express = require("express");
require("dotenv").config();
const crypto = require("crypto");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
const Razorpay = require("razorpay");
const Payment = require("../models/payment.model");
const User = require("../models/user.model");
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/premium", async (req, res) => {
  const { id } = req.body;
  try {
    const option = {
      amount: 200,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(option, async (err, order) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      console.log(order);
      res.status(200).json(order);
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(err);
  }
});

router.post("/verify", requireAuth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const { id } = req.user;
  console.log(req.body);
  console.log(req.user);

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");
    const isAuthentic = expectedSign === razorpay_signature;
    if (isAuthentic) {
      const payment = new Payment({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
        user: id,
      });

      await payment.save();
      await User.findByIdAndUpdate(id, { isPremium: true });

      res.status(200).json({ message: "Payment successful" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
