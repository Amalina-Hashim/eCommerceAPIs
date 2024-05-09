const Order = require("../models/Order");

exports.checkout = async (req, res) => {
  try {
    const { userId, products, orderId } = req.body; 
    const newOrder = new Order({ user: userId, products, orderId }); 
    await newOrder.save();

    res.json({ message: "Checkout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

