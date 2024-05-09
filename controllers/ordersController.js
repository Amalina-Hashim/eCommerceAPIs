const Order = require("../models/Order");

exports.getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId })
      .populate({
        path: "items",
        populate: {
          path: "product",
          model: "Product",
        },
      })
      .populate("user", "name email");

    if (!orders) {
      return res.status(404).json({ message: "No orders found for the user" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res
      .status(500)
      .json({ message: "Error retrieving orders", error: error.message });
  }
};
