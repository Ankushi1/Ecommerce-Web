// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Models
const Product = require("./models/Product");
const User = require("./models/User");

// ---------------- AUTH MIDDLEWARE ----------------
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]; // your existing line is correct

  if (!token) return res.status(401).json({ message: "No token, access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "mySecretKey");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// ---------------- APP INIT ----------------
const app = express();
app.use(cors());
app.use(express.json());

// ---------------- MONGODB ATLAS CONNECTION ----------------
const MONGO_URI = "mongodb+srv://ankushivishwakarma01_db_user:ankushi7@cluster0.bdkdrlw.mongodb.net/ecommerce?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));
// ---------------- SIGNUP ----------------
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    const oldUser = await User.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, isAdmin: false });

    res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- LOGIN ----------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "mySecretKey",
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- PRODUCTS CRUD ----------------
// ---------------- PRODUCTS CRUD ----------------

// CREATE product (protected)
app.post("/api/products", authMiddleware, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE product (protected)
app.put("/api/products/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product (protected)
app.delete("/api/products/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));