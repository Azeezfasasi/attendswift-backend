const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer header
  
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded user data
      console.log(req.user) // Log user data
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  };

module.exports = authenticate;
