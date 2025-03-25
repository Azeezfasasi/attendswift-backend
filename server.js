require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const AcademicSession = require("./models/AcademicSession");

const app = express();

const allowedOrigins = [
  'http://localhost:5173',  // Local Development
  'https://attendswift.netlify.app' // Netlify Production
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies if necessary
}));

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
const academicSessionRoutes = require("./routes/academicSessionRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use("/api/academicsessions", academicSessionRoutes);

app.use("/uploads", express.static("uploads"));
console.log("JWT_SECRET:", process.env.JWT_SECRET);


