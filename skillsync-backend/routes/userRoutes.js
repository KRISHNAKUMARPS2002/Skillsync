const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} = require("../controllers/userController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, getUserProfile);
router.put("/me", authMiddleware, updateUserProfile);
router.get("/all", authMiddleware, adminMiddleware, getAllUsers); // 🔹 Only Admins

module.exports = router;
