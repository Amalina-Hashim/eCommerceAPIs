const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/adminAuthController");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/signup", adminAuthController.signup);
router.post("/login", adminAuthController.login);
router.post("/logout", authenticateToken, adminAuthController.logout); 

module.exports = router;
