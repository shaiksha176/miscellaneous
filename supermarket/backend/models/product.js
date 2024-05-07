import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Reference to the "Category" collection
    required: true,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128, // Use Decimal128 for price
    required: true,
  },
  discountPrice: {
    type: mongoose.Schema.Types.Decimal128, // Use Decimal128 for price
  },
  quantityInStock: {
    type: Number,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
  },
  ratings: [
    {
      rating: Number,
      review: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer", // Reference to the "Customer" collection
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Product model
const Product = mongoose.model("Product", productSchema);

export default Product;
