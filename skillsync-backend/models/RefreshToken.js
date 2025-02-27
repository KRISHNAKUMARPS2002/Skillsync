const mongoose = require("mongoose");
const crypto = require("crypto");

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" }, // Auto-delete after 7 days
});

refreshTokenSchema.pre("save", function (next) {
  this.token = crypto.createHash("sha256").update(this.token).digest("hex"); // Hash token
  next();
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
