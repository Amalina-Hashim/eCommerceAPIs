const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/orders", adminController.getAllOrders);
router.put("/orders/:orderId/ship", adminController.markOrderAsShipped);

module.exports = router;
