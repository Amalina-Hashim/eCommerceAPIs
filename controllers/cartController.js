const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOneAndUpdate(
      { user: userId, status: "active" },
      {
        $addToSet: {
          products: {
            product: productId,
            quantity: quantity,
          },
        },
      },
      { upsert: true, new: true }
    );

    const totalAmount = cart.products.reduce((acc, current) => {
      return acc + current.product.price * current.quantity;
    }, 0);

    cart.totalAmount = totalAmount;
    await cart.save();

    res.json({ message: "Product added to cart", cart: cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId, cartId } = req.body;
    console.log("Requested to remove product ID:", productId);

    let cart = await Cart.findOneAndUpdate(
      { _id: cartId, user: userId, status: "active" }, 
      { $set: { updatedAt: new Date() } },
      { new: true }
    ).populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    console.log("Cart items before removal:");
    cart.products.forEach((p) => {
      console.log(
        `Product ID: ${p.product._id.toString()}, Name: ${
          p.product.name
        }, Quantity: ${p.quantity}`
      );
    });

    cart.products = cart.products.filter((p) => {
      const isSameProduct = p.product._id.toString() === productId;
      console.log(
        `Checking product: ${p.product._id.toString()} against ${productId}: ${isSameProduct}`
      );
      return !isSameProduct;
    });

    console.log("Cart items after removal, before save:");
    cart.products.forEach((p) => {
      console.log(
        `Remaining Product ID: ${p.product._id.toString()}, Name: ${
          p.product.name
        }, Quantity: ${p.quantity}`
      );
    });

    cart.totalAmount = cart.products.reduce((acc, current) => {
      return acc + current.product.price * current.quantity;
    }, 0);

    await cart.save();

    res.json({ message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getUserCart = async (req, res) => {
  console.log("Received userId:", req.params.userId);
  try {
    const userId = req.params.userId;

    let cart = await Cart.findOne({ user: userId, status: "active" }).populate({
      path: "products",
      populate: { path: "product", model: "Product" },
    });
    console.log("Cart query:", { user: userId });
    console.log("Cart found:", cart);

    if (!cart) {
      cart = { products: [] };
    }

    if (cart.products.length === 0) {
      return res.json({ cart: [] });
    }

    const updatedCart = cart.toObject();
    updatedCart.products = updatedCart.products.map((product) => {
      let updatedImages = [];
      if (product.images && Array.isArray(product.images)) {
        updatedImages = product.images.map((image) => {
          if (image.startsWith("uploads/")) {
            return `${req.protocol}://${req.get("host")}/${image}`;
          } else {
            return image;
          }
        });
      }

      return {
        ...product,
        images: updatedImages,
        quantity: product.quantity,
      };
    });

    res.json({ cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearCart = async (userId) => {
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("Cart not found for this user");
    }
    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();
    return { message: "Cart cleared" };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.checkout = async (req, res) => {
  try {
    const userId = req.params.userId;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({ message: "Checkout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
