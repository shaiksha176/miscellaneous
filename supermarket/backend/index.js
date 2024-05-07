import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRouter from "./routes/product.js";
import categoryRouter from "./routes/category.js";
import customerRouter from "./routes/customer.js";
import wishlistRouter from "./routes/wishlist.js";
import cartRouter from "./routes/cart.js";
import orderRouter from "./routes/order.js";
import googleAuth from "passport-google-oauth20";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import Customer from "./models/customer.js";
const GoogleStrategy = googleAuth.Strategy;
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/customer", customerRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// MongoDB connection URL


app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback", // Update with your redirect URL
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user data here, e.g., save user to a database
      // console.log(profile);
      const customer = new Customer({
        username: profile.displayName,
      })
      // const user = new User({
      //   name: profile.provider,
      // });

      // // Save the new customer to the database
      customer.save().then((data) => console.log(data));
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failed",
    successRedirect: "http://localhost:3001/",
  }),
);

app.get("/auth/failed", (req, res) => {
  res.send("Google Authentication Failed");
});

app.get("/success", (req, res) => {
  const userProfile = req.user;
  res.json({ userProfile });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to destroy the session:", err);
    }
    res.redirect("http://localhost:3001/login");
  });
});

async function connectToDatabase() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

async function startServer() {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Call the function to start the server
startServer();
