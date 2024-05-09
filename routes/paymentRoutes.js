const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/make-payment", paymentController.makePayment);
router.post("/make-payment/:userId", paymentController.makePayment);

module.exports = router;
