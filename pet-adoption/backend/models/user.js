import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  phoneNumber: String,
  location: String,
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
});

const User = mongoose.model("User", userSchema);

export default User;
