const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.warn("⚠️ GOOGLE_GENERATIVE_AI_API_KEY is missing in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "dummy_key");

// Models
const gemini2Flash = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  generationConfig: { 
    responseMimeType: "application/json" 
  }
});

const gemini2FlashText = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash" 
});

module.exports = {
  genAI,
  gemini2Flash,
  gemini2FlashText
};
