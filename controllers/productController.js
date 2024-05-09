const Product = require("../models/Product");
const User = require("../models/User");
const Favorite = require("../models/Favorite");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    const productsWithUpdatedImages = products.map((product) => {
      const updatedImages = product.images.map((image) => {
        if (image.startsWith("uploads/")) {
          return `${req.protocol}://${req.get("host")}/${image}`;
        } else {
          return image;
        }
      });

      return {
        ...product.toObject(),
        images: updatedImages,
      };
    });

    res.json(productsWithUpdatedImages);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedImages = product.images.map((image) => {
      if (image.startsWith("uploads/")) {
        return `${req.protocol}://${req.get("host")}/${image}`;
      } else {
        return image;
      }
    });

    const productWithUpdatedImages = {
      ...product.toObject(),
      images: updatedImages,
    };

    res.json(productWithUpdatedImages);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
   
    const productsWithUpdatedImages = products.map((product) => {
      const updatedImages = product.images.map((image) => {
        if (image.startsWith("uploads/")) {
          return `${req.protocol}://${req.get("host")}/${image}`;
        } else {
          return image;
        }
      });

      return {
        ...product.toObject(),
        images: updatedImages,
      };
    });

    res.json(productsWithUpdatedImages);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getFavoriteProducts = async (req, res) => {
  try {
    const { userId } = req.query; // Access userId from query parameter

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const favorites = await Favorite.find({ user: userId }).populate(
      "products"
    );

    if (!favorites || favorites.length === 0) {
      return res
        .status(404)
        .json({ error: "Favorites not found for this user" });
    }

    const favoriteProducts = favorites.reduce((products, favorite) => {
      products.push(...favorite.products);
      return products;
    }, []);

    const productsWithUpdatedImages = favoriteProducts.map((product) => {
      const updatedImages = product.images.map((image) => {
        if (image.startsWith("uploads/")) {
          return `${req.protocol}://${req.get("host")}/${image}`;
        } else {
          return image;
        }
      });

      return {
        ...product.toObject(),
        images: updatedImages,
      };
    });

    const token = req.headers["authorization"];

    if (token && token.startsWith("Bearer ")) {
      const tokenValue = token.substring(7); // Remove "Bearer " prefix
      res.header("x-auth-token", tokenValue); // Set the token in the response header
    }

    res.json({ success: true, favoriteProducts: productsWithUpdatedImages });
  } catch (error) {
    console.error("Error fetching favorite products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.addProduct = async (req, res) => {
  try {
    const { name, category, price, description, images } = req.body;
    const product = new Product({
      name,
      category,
      price,
      description,
      images,
    });
    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.favorites) {
      user.favorites = [];
    }

    const isFavorite = user.favorites.includes(productId);

    if (isFavorite) {
      user.favorites = user.favorites.filter((favId) => favId !== productId);
      await user.save();
      res.json({ success: true, message: "Product removed from favorites" });
    } else {
      user.favorites.push(productId);
      await user.save();
      res.json({ success: true, message: "Product added to favorites" });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;

    // Extract file paths from req.files if multer processed the upload
    const images = req.files.map((file) => file.path);

    const isFavorite = req.body.isFavorite || false;

    const product = new Product({
      name,
      category,
      price,
      description,
      images,
      isFavorite,
    });

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

