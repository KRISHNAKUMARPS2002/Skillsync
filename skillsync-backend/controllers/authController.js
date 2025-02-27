const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate Access & Refresh Tokens
const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  // Store Refresh Token in DB
  await RefreshToken.create({ userId: user._id, token: refreshToken });

  return { accessToken, refreshToken };
};

// Register User with Optional Admin Role
exports.register = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    // Send refresh token in HTTP-Only Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Google Login
exports.googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: "",
        avatar: picture,
        isAdmin: false, // Default role
      });
      await user.save();
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    // Send refresh token in HTTP-Only Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user });
  } catch (error) {
    res.status(500).json({ error: "Google Authentication Failed" });
  }
};

// Refresh Token API
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: "Access Denied" });

  try {
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken)
      return res.status(403).json({ message: "Invalid Refresh Token" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      user
    );

    // Delete old refresh token & store new one
    await RefreshToken.findOneAndDelete({ token: refreshToken });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

// Logout API (Improved)
exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  const { googleAccessToken } = req.body;

  try {
    // Remove refresh token from DB
    if (refreshToken) {
      await RefreshToken.findOneAndDelete({ token: refreshToken });
    }

    // Revoke Google token if user is logged in via Google
    if (googleAccessToken) {
      await axios.post(
        `https://oauth2.googleapis.com/revoke?token=${googleAccessToken}`,
        {},
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};
