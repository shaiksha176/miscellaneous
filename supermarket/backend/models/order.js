import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
 
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", // Reference to the "Customer" collection
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the "Product" collection
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered"],
    default: "Pending",
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  paymentDetails: {
    paymentMethod: {
      type: String,
      enum: ["Debit/Credit Card", "Cash on Delivery"],
      required: true,
    },
    cardNumber: String,
    cardHolderName: String,
    expirationDate: String,
    cvv: String,
  },
});

// Create and export the Order model
const Order = mongoose.model("Order", orderSchema);

export default Order;
