const Favorite = require("../models/Favorite");
const jwt = require("jsonwebtoken");

exports.addToFavorites = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let userId;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
      console.log("User ID:", decoded._id);
      userId = decoded._id;

      // Move the code that uses decoded inside this block
      const { productId } = req.body;

      let favorites = await Favorite.findOne({ user: userId });

      if (!favorites) {
        favorites = new Favorite({ user: userId, products: [] });
      }

      favorites.products.push(productId);
      await favorites.save();

      res.set("x-auth-token", token); // Move this line above res.json()
      res.json({
        message: "Product added to favorites",
      });
    } else {
      // Handle the case where no token is provided
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let userId;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
      console.log("User ID:", decoded._id);
      userId = decoded._id;

      const { productId } = req.body;

      let favorites = await Favorite.findOne({ user: userId });

      if (!favorites) {
        // If no favorites document exists, create a new one
        favorites = new Favorite({ user: userId, products: [] });
      }

      // Check if favorites.products exists and is not null before filtering
      if (favorites.products && Array.isArray(favorites.products)) {
        // Modify the products array by filtering out the productId to be removed
        favorites.products = favorites.products.filter(
          (p) => p && p.toString() !== productId
        );
      }

      // Save the modified or newly created favorites document
      await favorites.save();

      // Respond with success message
      res.set("x-auth-token", token);
      return res.json({ message: "Product removed from favorites" });
    } else {
      // Handle unauthorized access
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error removing from favorites:", error);
    return res.status(500).json({ message: error.message });
  }
};


