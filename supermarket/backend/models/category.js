import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: String,
});

// Create and export the Category model
const Category = mongoose.model("Category", categorySchema);
export default Category;
