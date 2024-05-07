import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import mongoose from "mongoose";
import { resolvers, typeDefs } from "./schema.js";
const DB_URL = "mongodb://127.0.0.1/pet-adoption";

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.use(cors());
app.use(express.json());
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Handle database connection events
db.on("error", (error) => {
  console.error(`MongoDB connection error: ${error}`);
});

db.once("open", () => {
  console.log("Connected to MongoDB database");
});

await server.start();

app.get("/", (req, res) => res.send("wergt"));

app.use("/graphql", expressMiddleware(server));

app.listen(8000, () => console.log("Serevr Started at PORT 8000"));
