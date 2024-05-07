import mongoose from "mongoose";
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the "Product" collection
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Ensure the quantity is at least 1
  },
  price: {
    type: mongoose.Schema.Types.Decimal128, // Use Decimal128 for price
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", // Reference to the "Customer" collection
    required: true,
  },
  items: [cartItemSchema], // An array of cart items
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Cart model
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
