import mongoose from "mongoose";
const wishlistSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", // Reference to the "Customer" collection
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the "Product" collection
        required: true,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Create and export the Wishlist model
const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
