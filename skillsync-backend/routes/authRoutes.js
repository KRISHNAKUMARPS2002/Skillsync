const express = require("express");
const {
  register,
  login,
  googleAuth,
  refreshToken,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth); // Google OAuth
router.get("/refresh", refreshToken);
router.post("/logout", logout); // Changed to POST for Google token revocation

module.exports = router;
