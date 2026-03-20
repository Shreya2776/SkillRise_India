const { gemini2Flash } = require("../config/googleAI");

// @desc    Generate a session token for Vapi (Secure Server-Side Flow)
// @route   POST /api/vapi/token
// @access  Private
const generateVapiToken = async (req, res, next) => {
  try {
    console.log("📡 Requesting session token from Vapi...");
    const response = await fetch("https://api.vapi.ai/token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!data.token) {
      console.error("❌ Vapi Token Error:", data);
      return res.status(500).json({ error: "Token generation failed" });
    }

    console.log("✅ Vapi Token issued successfully.");
    res.json({ token: data.token });

  } catch (err) {
    console.error("❌ Vapi Token Backend Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Generate interview questions using Gemini 2.0 Flash
// @route   POST /api/vapi/generate-questions
// @access  Private
const generateQuestions = async (req, res, next) => {
  try {
    const { userCategory, role, type, level, techstack, amount = 5 } = req.body;

    let categoryContext = "";
    if (userCategory === "blue-collar") {
      categoryContext = `
Context for Generation:
- Blue Collar: Focus on safety, situational awareness, equipment mastery, and reliability. 100% practical.`;
    } else if (userCategory === "white-collar") {
      categoryContext = `
Context for Generation:
- White Collar: Focus on technical architecture, leadership, and professional experience.`;
    } else if (userCategory === "student") {
      categoryContext = `
Context for Generation:
- Student: Focus on core fundamentals, learning aptitude, and projects.`;
    }

    const prompt = `Generate exactly ${amount} interview questions for a ${level} ${role} in the ${userCategory} sector.
Interview Track: ${type}
${techstack?.length ? `Key Skills/Tools: ${techstack.join(", ")}` : ""}
${categoryContext}

Return ONLY a valid JSON array of strings.`;

    const result = await gemini2Flash.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const questions = JSON.parse(text);

    res.json({ success: true, questions });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateVapiToken, generateQuestions };
