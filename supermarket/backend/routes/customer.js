// Import necessary modules and setup Express Router
import express from "express";
const router = express.Router();
import Customer from "../models/customer.js";

// Route to create a new customer
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Create a new customer instance
    const newCustomer = new Customer({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });

    // Save the new customer to the database
    const savedCustomer = await newCustomer.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create the customer." });
  }
});

// Route to get all customers
router.get("/", async (req, res) => {
  try {
    const customer = await Customer.find();
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve customer information." });
  }
});

// Route to get customer information by ID
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve customer information." });
  }
});

// Route to update customer details by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found." });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update customer details." });
  }
});

// Route to delete a customer by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndRemove(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found." });
    }
    res.status(204).end(); // No content (successful deletion)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete the customer." });
  }
});

// Export the router
export default router;
