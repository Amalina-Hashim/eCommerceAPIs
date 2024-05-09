const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

router.post("/add-to-favorites", favoriteController.addToFavorites);
router.post("/remove-from-favorites", favoriteController.removeFromFavorites);

module.exports = router;
