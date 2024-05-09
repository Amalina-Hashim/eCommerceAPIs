const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, set: setPriceWithTwoDecimalPlaces },
  description: { type: String },
  images: [{ type: String }],
  isFavorite: { type: Boolean, default: false },
});

function setPriceWithTwoDecimalPlaces(price) {
  console.log("Setting price:", price);
  return parseFloat(price).toFixed(2);
}


module.exports = mongoose.model("Product", productSchema);
