import mongoose from "mongoose";
const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: String,
  breed: String,
  age: Number,
  description: String,
  photos: [String],
  status: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  adoptionFee: Number,
  location: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Pet = mongoose.model("Pet", petSchema);

// Add a pre hook for the 'remove' operation
petSchema.pre("deleteOne", async function (next) {
  try {
    // Retrieve the user owning this pet
    const user = await mongoose.model("User").findById(this.owner);
    console.log(user);
    if (user) {
      // Remove the pet's ID from the user's 'pets' array
      user.pets.pull(this._id);
      await user.save();
    }

    next();
  } catch (err) {
    next(err);
  }
});

export default Pet;
