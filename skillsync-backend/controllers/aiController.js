const { GoogleGenerativeAI } = require("@google/generative-ai");
const LearningPath = require("../models/LearningPath");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateLearningPath = async (req, res) => {
  const { skills, careerGoal } = req.body;

  try {
    // Check if cached response exists
    const existingPath = await LearningPath.findOne({
      user: req.user.id,
      skills,
      careerGoal,
    });

    if (existingPath) return res.json({ learningPath: existingPath });

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const response = await model.generateContent(
      `Generate a learning path for a person who wants to become a ${careerGoal} with skills: ${skills.join(
        ", "
      )}`
    );

    const learningPath = new LearningPath({
      user: req.user.id,
      skills,
      careerGoal,
      generatedPath: response.response.text(),
    });

    await learningPath.save();
    res.json({ learningPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateLearningPath };
