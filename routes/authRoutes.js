const express = require("express");
const { getUser, getAllUsers, register, login, logout, createAdminUser } = require("../controllers/authController");
const upload = require("../middleware/uploadMiddleware");
const authenticate = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Ensure admin user is created when the server starts
createAdminUser();

// Fetch user details (✅ Fixed duplicate route issue)
router.get("/user", authenticate, getUser);

// Fetch all users details for admins
router.get("/users", authenticate, getAllUsers);

// Upload profile image (✅ Fixed incorrect route)
router.post("/upload-profile", authenticate, upload.single("profileImage"), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.profileImage = `/uploads/${req.file.filename}`;
        await user.save();

        res.json({ message: "Profile image updated", profileImage: user.profileImage });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Authentication Routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// ✅ Update User Profile Route
router.put("/update-profile", authenticate, async (req, res) => {
    try {
      const { name, email, role } = req.body;
      const userId = req.user.id; // Extract user ID from authenticated token
  
      // Update user in database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, role },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile." });
    }
  });
  

module.exports = router;
