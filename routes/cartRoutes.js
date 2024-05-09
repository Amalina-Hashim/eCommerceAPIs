const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateToken = require("../middleware/authenticateToken"); // Import the authenticateToken middleware

// Apply the authenticateToken middleware to routes that require authentication
router.post("/add-to-cart", authenticateToken, cartController.addToCart);
router.post(
  "/remove-from-cart",
  authenticateToken,
  cartController.removeFromCart
);

// No need to protect the getUserCart route if it's not accessing sensitive data
router.get("/:userId", cartController.getUserCart);

module.exports = router;
