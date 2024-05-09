const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Reference to the Product model
      quantity: { type: Number, default: 1 },
    },
  ],
  orderId: { type: String, required: true },
  shipped: { type: Boolean, default: false },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentMethod: { type: String },
});


module.exports = mongoose.model("Order", orderSchema);
