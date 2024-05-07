import User from "./models/user.js";
import Pet from "./models/pet.js";
export const typeDefs = `#graphql
  type User {
    _id: ID
    username: String
    email: String
    firstName: String
    lastName: String
    phoneNumber: String
    location: String
    pets: [Pet],
    password:String,
  }

  type Pet {
    _id: ID
    name: String
    type: String
    breed: String
    age: Int
    description: String
    photos: [String]
    status: String
    owner: User
    adoptionFee: Float
    location: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    getUserById(id: ID!): User
    getAllUsers: [User]
    getPetById(id: ID!): Pet
    getAllPets: [Pet]
    getPetsByStatus(status:String): [Pet]
  }

  input UserInput {
    username: String
    email: String
    firstName: String
    lastName: String
    phoneNumber: String
    location: String,
    password:String,
  }

  input PetInput {
    name: String
    type: String
    breed: String
    age: Int
    description: String
    photos: [String]
    status: String
    owner: ID
    adoptionFee: Float
    location: String
  }

  type Mutation {
    createUser(input: UserInput!): User
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): User
    createPet(input: PetInput!): Pet
    updatePet(id: ID!, input: PetInput!): Pet
    deletePet(id: ID!): Pet
  }

`;

export const resolvers = {
  Query: {
    getUserById: async (_, { id }) => User.findById(id),
    getAllUsers: async () => User.find(),
    getPetById: async (_, { id }) => Pet.findById(id),
    getAllPets: async () => Pet.find(),
    getPetsByStatus: async (_, { status }) => Pet.find({ status }),
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const user = new User(input);
      return user.save();
    },
    updateUser: async (_, { id, input }) => {
      return User.findByIdAndUpdate(id, input, { new: true });
    },
    deleteUser: async (_, { id }) => {
      return User.findByIdAndRemove(id);
    },
    createPet: async (_, { input }) => {
      const pet = new Pet(input);
      // Update the User's pets array
      const user = await User.findById(input.owner);
      user.pets.push(pet._id); // Add the new pet's ID to the array
      await user.save();
      return pet.save();
    },
    updatePet: async (_, { id, input }) => {
      return Pet.findByIdAndUpdate(id, input, { new: true });
    },
    deletePet: async (_, { id }) => {
      return Pet.findByIdAndDelete(id);
    },
  },
  User: {
    pets: async (user) => Pet.find({ owner: user._id }),
  },
  Pet: {
    owner: async (pet) => User.findById(pet.owner),
  },
};
