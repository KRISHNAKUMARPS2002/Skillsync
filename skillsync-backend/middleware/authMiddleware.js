const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) return res.status(404).json({ message: "User not found" });

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

// 🔹 Admin Middleware
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  next();
};

module.exports = { authMiddleware, adminMiddleware };
