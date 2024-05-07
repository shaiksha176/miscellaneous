import mongoose from "mongoose";
const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the "Product" collection
    required: true,
  },
  quantitySold: {
    type: Number,
    required: true,
  },
  saleAmount: {
    type: Number,
    required: true,
  },
  saleDate: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Sale model
module.exports = mongoose.model("Sale", saleSchema);
