const Order = require("../models/Order");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "username email"); // Populate user details
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markOrderAsShipped = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.shipped = true;
    await order.save();
    res.json({ message: "Order marked as shipped" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
