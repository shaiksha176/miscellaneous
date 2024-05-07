import express from "express";
import Category from "../models/category.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    // Create a new order instance
    const newCategory = new Category({
      name,
      description,
      imageUrl,
    });

    // Save the new order to the database
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create the category." });
  }
});

// Route to get a list of all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve categories." });
  }
});

export default router;
