import mongoose from "mongoose";
const customerSchema = new mongoose.Schema({
  // Common fields for all authentication methods
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  username: String,
  // Fields for Google authentication
  googleId: String,

  // Fields for phone number authentication
  phoneNumberVerified: Boolean, // Indicates if the phone number is verified
  phoneNumberVerificationCode: String, // Store the verification code sent to the phone

  // Fields for email and password authentication
  password: String,
  isEmailVerified: Boolean, // Indicates if the email is verified
  emailVerificationCode: String, // Store the verification code sent to the email

  // Additional customer information
  address: String,
  // Other fields as needed for your application

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Customer model
const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
