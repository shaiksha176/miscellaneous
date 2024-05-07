// Import necessary modules and setup Express Router
import express from "express";
const router = express.Router();
import Cart from "../models/cart.js";
import Product from "../models/product.js";

// Route to add a product to the cart and update product quantity
router.post("/", async (req, res) => {
  try {
    const { productId, quantity, price, customerId } = req.body;
    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      // If the cart doesn't exist for the customer, create a new one
      const newCart = new Cart({
        customer: customerId,
        items: [{ product: productId, quantity, price }],
      });
      await newCart.save();
    } else {
      // If the cart exists, check if the product is already in the cart
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
      );

      if (existingItem) {
        // If the product is already in the cart, update the quantity
        existingItem.quantity += quantity;
        existingItem.price = price;
      } else {
        // If the product is not in the cart, add it as a new item
        cart.items.push({ product: productId, quantity, price });
      }

      // Update the product's quantity in stock
      const product = await Product.findById(productId);
      if (product) {
        product.quantityInStock -= quantity;
        await product.save();
      }

      await cart.save();
    }

    res.json({ message: "Product added to the cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get a customer's cart by customer ID
router.get("/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // Find the cart for the current customer
    const cart = await Cart.findOne({ customer: customerId }).populate(
      "items.product",
    );

    if (!cart) {
      return res.json({ items: [] }); // Cart is empty
    }

    res.json({ items: cart.items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to remove a product from the cart and add the quantity back to stock
router.delete("/", async (req, res) => {
  try {
    // Assuming you have user authentication and can obtain the customer ID
    const { productId, customerId } = req.body;

    // Find the cart for the current customer
    const cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the index of the product in the cart items
    const productIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in the cart" });
    }

    // Get the quantity being removed
    const removedQuantity = cart.items[productIndex].quantity;

    // Update the product's quantity in stock
    const product = await Product.findById(productId);
    if (product) {
      product.quantityInStock += removedQuantity;
      await product.save();
    }

    // Remove the product from the cart
    cart.items.splice(productIndex, 1);
    await cart.save();

    res.json({ message: "Product removed from the cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to add a product to a customer's cart
router.post("/:customerId/add", async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    const customerCart = await Cart.findOne({
      customer: req.params.customerId,
    });

    if (!customerCart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const existingItemIndex = customerCart.items.findIndex(
      (item) => item.product == productId,
    );

    if (existingItemIndex !== -1) {
      // Update the quantity and price of an existing item in the cart
      customerCart.items[existingItemIndex].quantity += quantity;
      customerCart.items[existingItemIndex].price += price;
    } else {
      // Add a new item to the cart
      customerCart.items.push({ product: productId, quantity, price });
    }

    await customerCart.save();

    res.status(200).json(customerCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add the product to the cart." });
  }
});

// Route to update the quantity of a product in a customer's cart
router.put("/:customerId/update/:productId", async (req, res) => {
  try {
    const { quantity, price } = req.body;
    const customerCart = await Cart.findOne({
      customer: req.params.customerId,
    });

    if (!customerCart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const existingItemIndex = customerCart.items.findIndex(
      (item) => item.product == req.params.productId,
    );

    if (existingItemIndex !== -1) {
      // Update the quantity and price of the item in the cart
      customerCart.items[existingItemIndex].quantity = quantity;
      customerCart.items[existingItemIndex].price = price;
      await customerCart.save();
      res.status(200).json(customerCart);
    } else {
      return res
        .status(404)
        .json({ message: "Product not found in the cart." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update the cart item." });
  }
});

// Route to remove a product from a customer's cart
router.delete("/:customerId/remove/:productId", async (req, res) => {
  try {
    const customerCart = await Cart.findOne({
      customer: req.params.customerId,
    });

    if (!customerCart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const existingItemIndex = customerCart.items.findIndex(
      (item) => item.product == req.params.productId,
    );

    if (existingItemIndex !== -1) {
      // Remove the item from the cart
      customerCart.items.splice(existingItemIndex, 1);
      await customerCart.save();
      res.status(204).end(); // No content (successful removal)
    } else {
      return res
        .status(404)
        .json({ message: "Product not found in the cart." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to remove the product from the cart." });
  }
});

// Route to delete a customer's cart by customer ID

export default router;
