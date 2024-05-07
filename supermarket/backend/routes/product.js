import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// Add a new product to the database
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      quantityInStock,
      imageURL,
      manufacturer,
    } = req.body;

    // Create a new product instance
    const newProduct = new Product({
      name,
      description,
      category,
      price,
      quantityInStock,
      imageURL,
      manufacturer,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add the product." });
  }
});

// Route to get a list of all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve products." });
  }
});

// Route to get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve the product." });
  }
});

// Route to update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update the product." });
  }
});

// Route to delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndRemove(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(204).end(); // No content (successful deletion)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete the product." });
  }
});

// Route to get products based on category
router.get("/category/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Find products that belong to the specified category
    const products = await Product.find({ category: categoryId });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve products by category." });
  }
});

export default router;
