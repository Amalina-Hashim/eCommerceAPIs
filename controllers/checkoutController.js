const Order = require("../models/Order");

exports.checkout = async (req, res) => {
  try {
    const { userId, products, orderId } = req.body; // Add orderId to the destructuring

    // Create a new order with orderId
    const newOrder = new Order({ user: userId, products, orderId }); // Include orderId
    await newOrder.save();

    res.json({ message: "Checkout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

