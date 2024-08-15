const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "ABC";

const Admin = require("../models/Admin");
const API = require("../models/Api");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

router.post("/admin/signup", async (req, res) => {
  try {
    const { email, password, phone, username } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      phone,
    });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Admin Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user;

    user = await Admin.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(402).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/api/add", verifyToken, async (req, res) => {
  try {
    const { name, endpoint, owner, status } = req.body;

    // Validate the required fields
    if (!name || !endpoint || !owner || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAPI = new API({
      name,
      endpoint,
      owner,
      status,
      lastScanned: new Date(),
    });

    await newAPI.save();

    res.status(201).json({ message: "API added successfully" });
  } catch (error) {
    console.error("Error adding API:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/api/all", verifyToken, async (req, res) => {
  try {
    const apis = await API.find();
    res.status(200).json(apis);
  } catch (error) {
    console.error("Error fetching API:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
