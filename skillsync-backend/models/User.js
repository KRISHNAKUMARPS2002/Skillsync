const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  refreshToken: String,
  googleId: String,
  profilePic: String,
  googleId: { type: String, unique: true, sparse: true },
  skills: [String],
  learningPath: [{ type: mongoose.Schema.Types.ObjectId, ref: "LearningPath" }],
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
