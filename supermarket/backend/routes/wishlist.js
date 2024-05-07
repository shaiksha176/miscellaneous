// Import necessary modules and setup Express Router
import express from "express";
import mongoose from "mongoose";
import Wishlist from "../models/wishlist.js";
import Customer from "../models/customer.js";

const router = express.Router();

// Route to get a customer's wishlist by customer ID
router.get("/customer/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // Check if the customer ID is valid
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Invalid customer ID." });
    }

    // Find the customer's wishlist
    const wishlist = await Wishlist.findOne({ customer: customerId }).populate(
      "products.product",
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found." });
    }

    return res.status(200).json(wishlist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { customerId, productId } = req.body;

    // Check if the customer ID is valid
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Invalid customer ID." });
    }

    // Check if the customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Check if the product ID is valid
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    // Find the customer's wishlist or create one if it doesn't exist
    let wishlist = await Wishlist.findOne({ customer: customerId });
    if (!wishlist) {
      wishlist = new Wishlist({ customer: customerId, products: [] });
    }

    // Check if the product is already in the wishlist
    const productIndex = wishlist.products.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (productIndex !== -1) {
      return res
        .status(400)
        .json({ message: "Product already in the wishlist." });
    }

    // Add the product to the wishlist
    wishlist.products.push({ product: productId });
    await wishlist.save();

    return res.status(200).json({ message: "Product added to the wishlist." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to remove a product from a customer's wishlist
router.delete("/:customerId/:productId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const productId = req.params.productId;

    // Check if the customer and product IDs are valid
    if (
      !mongoose.Types.ObjectId.isValid(customerId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid customer or product ID." });
    }

    // Find the customer's wishlist
    const wishlist = await Wishlist.findOne({ customer: customerId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found." });
    }

    // Check if the product is in the wishlist
    const productIndex = wishlist.products.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (productIndex === -1) {
      return res
        .status(400)
        .json({ message: "Product not found in the wishlist." });
    }

    // Remove the product from the wishlist
    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    return res
      .status(200)
      .json({ message: "Product removed from the wishlist." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to delete a customer's wishlist by customer ID
router.delete("/:customerId/delete", async (req, res) => {
  try {
    const deletedWishlist = await Wishlist.findOneAndRemove({
      customer: req.params.customerId,
    });
    if (!deletedWishlist) {
      return res.status(404).json({ message: "Wishlist not found." });
    }
    res.status(204).end(); // No content (successful deletion)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete the wishlist." });
  }
});

// Export the router
export default router;
