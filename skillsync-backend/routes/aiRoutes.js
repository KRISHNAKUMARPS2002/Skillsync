const express = require("express");
const { generateLearningPath } = require("../controllers/aiController"); // ✅ Ensure correct import
const { authMiddleware } = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiting for learning path generation
const learningPathLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow max 5 requests per 15 minutes
  message: { error: "Too many requests, try again later." },
});

// ✅ Debugging: Check if `generateLearningPath` is undefined
if (!generateLearningPath) {
  console.error("❌ generateLearningPath is not defined in aiRoutes.js!");
}

router.post(
  "/generate-learning-path",
  authMiddleware,
  learningPathLimiter,
  generateLearningPath // ✅ Ensure this function is correctly imported
);

module.exports = router;
