const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  payment_id: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
