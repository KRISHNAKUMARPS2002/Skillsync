const mongoose = require("mongoose"); // ✅ Import mongoose

const learningPathSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skills: [{ type: String, required: true }],
    careerGoal: { type: String, required: true },
    generatedPath: { type: String, required: true },
  },
  { timestamps: true }
);

const LearningPath = mongoose.model("LearningPath", learningPathSchema);
module.exports = LearningPath;
