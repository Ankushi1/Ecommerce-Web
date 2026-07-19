// models/Order.js

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  category: String,
  payment: String,
  userId: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);