import { geminiModel } from "../config/googleAI.js";
import { extractJSON } from "../utils/aiParsers.js";

/**
 * PRODUCTION-READY AI UTILITIES (GEMINI 1.5 FLASH)
 */

const withTimeout = (promise, ms = 20000) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout: AI did not respond within ${ms / 1000}s`)), ms)
  );
  return Promise.race([promise, timeout]);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async (fn, retries = 2) => {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries) {
        const waitSec = (i + 1) * 5; // 5s, 10s backoff
        console.warn(`⚠️ [AI SERVICE] Attempt ${i + 1} failed. Retrying in ${waitSec}s...`);
        await delay(waitSec * 1000);
      }
    }
  }
  throw lastError;
};

/**
 * GENERATE QUESTIONS (Production Prompt Engine)
 */
export const generateQuestions = async (
  role,
  techStack,
  difficulty,
  type = "technical",
  count = 5
) => {
  const isGenericSkills = !techStack || techStack === "General" || techStack.trim() === "";
  const skills = isGenericSkills 
    ? `(No specific skills provided — derive relevant tools, skills, and domain knowledge from the "${role}" role itself)` 
    : techStack;

  const prompt = `
Generate EXACTLY ${count} high-quality interview questions.

CONTEXT:
- Role: ${role}
- Skills/Tools: ${skills}
- Difficulty Level: ${difficulty} (junior / mid / senior)
- Interview Type: ${type} (technical / behavioral / mixed)

INSTRUCTIONS:

1. Question Count:
   - Generate EXACTLY ${count} questions.
   - Do NOT exceed or reduce the count.

2. Skill Relevance:
   - At least 70-80% questions MUST be based on the provided skills/tools.
   - If skills are empty, generate role-specific questions.

3. Interview Type Handling:
   - If "technical": Focus on problem-solving, tools, real-world tasks.
   - If "behavioral": Focus on communication, teamwork, decision-making.
   - If "mixed": Combine both (roughly 50-50).

4. Blue-Collar Support:
   - If role is blue-collar (e.g., electrician, driver, security guard, forklift operator):
     Ask practical, real-life, job-based questions.
     Focus on safety, tools, situations, on-site decisions.
     Avoid theoretical/software-heavy questions.

5. Scenario-Based Questions (VERY IMPORTANT):
   - At least 50% questions MUST be scenario-based.
   - Use formats like:
     "What would you do if..."
     "How would you handle..."
     "Suppose you are in a situation where..."

6. Difficulty Control:
   - Junior: basic + simple scenarios
   - Mid: moderate + practical situations
   - Senior: complex + decision-making + edge cases

7. Language & Simplicity (CRITICAL):
   - Use plain, simple English. 
   - Each question must be SHORT (max 20 words).
   - ONE SENTENCE ONLY. No multi-part questions.
   - Friendly and conversational tone.

8. Quality Rules:
   - No multi-sentence questions.
   - No generic questions like "Tell me about yourself".
   - No repetition.
   - No explanations.

9. Output Format:
   - Return ONLY a valid JSON array of strings.
   - No markdown.

Example Output:
["How do you handle a short circuit?", "What tools do you use for wiring?"]
`;

  try {
    const rawResult = await withRetry(async () => {
      const result = await withTimeout(
        geminiModel.generateContent(prompt)
      );
      const response = await result.response;
      return response.text();
    });

    const parsed = extractJSON(rawResult);

    if (!Array.isArray(parsed)) {
      throw new Error("AI returned non-array format");
    }

    return parsed.slice(0, count);

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
