require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
// const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" })); // Adjust for Vite
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use('/api/subjects', subjectRoutes);

app.use("/uploads", express.static("uploads"));
console.log("JWT_SECRET:", process.env.JWT_SECRET);


