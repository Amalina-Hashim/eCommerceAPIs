const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");

// Routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", authenticateToken, userController.logout);
router.get("/profile", authenticateToken, userController.getUserInfo);
router.put("/profile", authenticateToken, userController.updateUserProfile);

module.exports = router;
