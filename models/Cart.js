const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { strictPopulate: false }
);

cartSchema.virtual("totalAmount").get(function () {
  return this.products.reduce((acc, current) => {
    return acc + current.product.price * current.quantity;
  }, 0);
});

module.exports = mongoose.model("Cart", cartSchema);
