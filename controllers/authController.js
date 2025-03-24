const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Create an admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@attendswift.com" });

    if (existingAdmin) {
      // console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = new User({
      name: "Admin User",
      email: "admin@attendswift.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

// Register a new user with role selection
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate role
    const allowedRoles = ["parent", "teacher"]; // Admin should be manually created
    const assignedRole = allowedRoles.includes(role) ? role : "teacher"; // Default to "parent"

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Find user in database
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Verify password (assuming bcrypt)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // ✅ FIX: Ensure response includes `user`
  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};


// Get user profile details
const getUser = async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select("-password"); // Exclude password
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Fetch all users except passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Logout a user
const logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { register, login, logout, createAdminUser, getUser, getAllUsers };
