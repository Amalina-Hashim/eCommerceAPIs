const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateToken = require("../middleware/authenticateToken"); 


router.post("/add-to-cart", authenticateToken, cartController.addToCart);
router.post(
  "/remove-from-cart",
  authenticateToken,
  cartController.removeFromCart
);

router.get("/:userId", cartController.getUserCart);

module.exports = router;
