const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const CartController = require("../controllers/cartController");

exports.makePayment = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { amount, currency, description, source, orderId, userId, items } =
      req.body;

    const charge = await stripe.charges.create({
      amount,
      currency,
      description,
      source,
    });

    let order = await Order.findOne({ orderId: orderId });

    if (!order) {
      order = new Order({
        user: userId,
        orderId: orderId,
        paymentStatus: "paid",
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      });

      await order.save();
    } else {
      items.forEach((item) => {
        order.items.push({
          product: item.product,
          quantity: item.quantity,
        });
      });
      order.paymentStatus = "paid";

      await order.save();
    }

    

    res.json({ message: "Payment successful", charge, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
