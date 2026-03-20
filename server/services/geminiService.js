import { geminiModel } from "../config/googleAI.js";
import { extractJSON } from "../utils/aiParsers.js";

/**
 * PRODUCTION-READY AI UTILITIES (GEMINI 1.5 FLASH)
 */

const withTimeout = (promise, ms = 10000) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout: AI did not respond within ${ms / 1000}s`)), ms)
  );
  return Promise.race([promise, timeout]);
};

const withRetry = async (fn, retries = 2) => {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries) console.warn(`⚠️ [AI SERVICE] Attempt ${i + 1} failed. Retrying...`);
    }
  }
  throw lastError;
};

/**
 * GENERATE QUESTIONS (10 items, Strict JSON)
 */
export const generateQuestions = async (role, techStack, difficulty) => {
  const prompt = `Generate exactly 10 unique interview questions for a ${role} position.
  Focus: ${techStack || "General Software Engineering"}
  Level: ${difficulty}
  
  RULES:
  1. Return ONLY a valid JSON array of 10 strings.
  2. No preamble, no explanation, no markdown.
  
  Example: ["Question 1", "Question 2", ...]`;

  try {
    const rawResult = await withRetry(async () => {
      const result = await withTimeout(geminiModel.generateContent(prompt));
      const response = await result.response;
      return response.text();
    });

    const parsed = extractJSON(rawResult);
    if (!Array.isArray(parsed)) throw new Error("AI returned JSON but it is not an array.");
    
    return parsed.slice(0, 10); // Enforce exact count
  } catch (err) {
    console.error("❌ [AI SERVICE] Question Generation Failed:", err.message);
    throw err;
  }
};

/**
 * EVALUATE INTERVIEW (Unified Structure)
 */
export const evaluateInterview = async (role, questions, answers) => {
  const transcript = questions.map((q, i) => ({
    question: q,
    answer: answers[i] || "Candidate provided no answer."
  }));

  const prompt = `Evaluate this ${role} interview transcript.
  Transcript: ${JSON.stringify(transcript, null, 2)}
  
  RULES:
  1. Return ONLY a JSON object with this exact structure:
     {
       "score": number (0-100),
       "strengths": [string],
       "weaknesses": [string],
       "suggestions": [string],
       "questionFeedback": [
         {
           "question": string,
           "rating": number (1-10),
           "comment": string
         }
       ]
     }`;

  try {
    const rawResult = await withRetry(async () => {
      const result = await withTimeout(geminiModel.generateContent(prompt), 15000); // Evaluation gets slightly more time
      const response = await result.response;
      return response.text();
    });

    const evaluation = extractJSON(rawResult);

    // 🛡️ Production Validation
    const required = ["score", "strengths", "weaknesses", "suggestions", "questionFeedback"];
    for (const field of required) {
      if (!evaluation[field]) throw new Error(`Missing ${field} in AI evaluation.`);
    }
    
    return evaluation;
  } catch (err) {
    console.error("❌ [AI SERVICE] Evaluation Failed:", err.message);
    throw err;
  }
};
