// src/services/llm.service.js
/**
 * LLM Abstraction Layer
 * ─────────────────────
 * Single entry point for all LLM calls. Swap providers via LLM_PROVIDER env var.
 * Supports: Gemini (default), OpenAI, Grok.
 *
 * All prompt-specific logic is co-located here so callers stay clean.
 */
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { extractJSON } from "../utils/extractJSON.js";
import dotenv from "dotenv";

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// Provider factory — swap via LLM_PROVIDER=openai|grok|gemini
// ─────────────────────────────────────────────────────────────────────────────
function buildPrimaryLlm() {
    const provider = (process.env.LLM_PROVIDER || "gemini").toLowerCase();
    switch (provider) {
        case "openai":
            return new ChatOpenAI({
                model: process.env.OPENAI_MODEL || "gpt-4o",
                apiKey: process.env.OPENAI_API_KEY,
                temperature: 0.8,
            });
        case "gemini":
        default:
            return new ChatGoogleGenerativeAI({
                model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
                apiKey: process.env.GOOGLE_API_KEY,
                temperature: 0.8,
            });
    }
}

function buildFallbackLlm() {
    return new ChatOpenAI({
        model: "grok-beta",
        configuration: { baseURL: "https://api.x.ai/v1" },
        apiKey: process.env.GROK_API_KEY,
        temperature: 0.8,
    });
}

const primaryLlm = buildPrimaryLlm();
const fallbackLlm = buildFallbackLlm();
const parser = new StringOutputParser();

// ─────────────────────────────────────────────────────────────────────────────
// Core abstraction: generateResponse(prompt, options)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Universal LLM call.
 * @param {string} prompt       - The fully-rendered prompt string.
 * @param {object} [options]
 * @param {boolean} [options.json=false]    - Parse response as JSON.
 * @param {boolean} [options.fallback=true] - Use Grok fallback on failure.
 * @param {number}  [options.temperature]   - Override temperature.
 * @returns {Promise<string|object>}
 */
export async function generateResponse(prompt, options = {}) {
    const { json = false, fallback = true, temperature } = options;

    const llm = temperature
        ? primaryLlm.bind({ temperature })
        : primaryLlm;

    const invoke = async (model) => {
        const messages = [{ role: "user", content: prompt }];
        const result = await model.invoke(messages);
        return typeof result === "string" ? result : result.content;
    };

    let raw;
    try {
        raw = await invoke(llm);
    } catch (primaryErr) {
        if (!fallback) throw primaryErr;
        console.warn(`[LLM] Primary failed: ${primaryErr?.message?.slice(0, 80)}`);
        console.warn("[LLM] Switching to Grok fallback...");
        raw = await invoke(fallbackLlm);
    }

    return json ? extractJSON(raw) : raw;
}

// ─────────────────────────────────────────────────────────────────────────────
// Chain factory (for template-based calls — used internally only)
// ─────────────────────────────────────────────────────────────────────────────
function buildChain(llmInstance, templateString) {
    const prompt = PromptTemplate.fromTemplate(templateString);
    return prompt.pipe(llmInstance).pipe(parser);
}

async function invokeWithFallback(primaryChain, fallbackChain, inputs) {
    try {
        return await primaryChain.invoke(inputs);
    } catch (err) {
        console.warn(`[LLM] Primary chain failed: ${err?.message?.slice(0, 80)}`);
        return fallbackChain.invoke(inputs);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────────────────────────────────────

const QUESTION_TEMPLATE = `
You are a senior technical interviewer at a top-tier product company (Google, Meta, Amazon, Stripe, Atlassian).

Ask ONE highly realistic interview question for a {role} ({level} level) on the skill: {skills}.
Question type: {category} | Difficulty: {difficulty}

Category guidelines:
- Concept: Probe WHY systems behave a certain way. ("Why does React sometimes re-render unnecessarily?")
- Implementation: Small but realistic coding challenge. ("Implement a rate limiter without external libraries.")
- Debugging: Real production bug scenario. ("Your API memory grows under load — how do you debug?")
- Optimization: Performance / scalability trade-offs. ("How would you scale a real-time chat to 1M users?")

Difficulty:
- easy: Core fundamentals, junior level.
- medium: Real-world trade-offs, mid-level.
- hard: Senior architecture, performance tuning, deep system behaviour.

Rules:
1. Sound like a real human interviewer. Start directly with the question.
2. Optionally open with a brief scenario: "You're building a payments service..."
3. Avoid textbook language: "Explain", "Define", "Describe".
4. Never repeat: {previousQuestions}
5. Max 50 words.
6. Output ONLY the question text.
`;

const FOLLOWUP_TEMPLATE = `
You are a senior interviewer probing a vague answer in a real technical interview.

Role: {role} | Level: {level}
Original Question: {question}
Candidate's Answer: {answer}
Gap: {feedback}

Write a sharp, targeted follow-up that:
1. Directly targets the specific gap.
2. Sounds like natural interviewer speech.
3. Does NOT restate the original question.
4. Has a clear correct answer.

Good patterns:
- "You mentioned [X] — can you walk me through what's happening under the hood?"
- "What would break in your approach if [edge case]?"
- "How does that differ from [alternative]?"

Output ONLY the follow-up question. No intro, no labels.
`;

const EVAL_TEMPLATE = `
You are a senior technical interviewer completing a scorecard.

Role: {role} ({level} level)
Question: {question}
Candidate's answer: {answer}

Apply a rigorous, honest hire bar.

Return ONLY valid JSON (no markdown fences):
{{
  "score": {{
    "technical":     <1-10>,
    "clarity":       <1-10>,
    "communication": <1-10>,
    "logic":         <1-10>,
    "overall":       <1-10 holistic>
  }},
  "feedback":              "<2-3 sentence debrief note>",
  "conversationalResponse": "<1 sentence the interviewer says live without revealing the score>",
  "improvedAnswer":         "<ideal senior answer with examples and edge cases>",
  "isFollowUpNeeded":      <true if overall < 7 or significant gaps>
}}
`;

const REPORT_TEMPLATE = `
You are a hiring committee member writing a post-interview assessment.

Role: {role} ({level} level)
Transcript:
{transcript}

Return ONLY valid JSON (no markdown):
{{
  "overallScore": <1-100 — 70+ Hire, 50-70 Borderline, <50 No Hire>,
  "summary":    "<One precise sentence capturing overall performance>",
  "strengths":  ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "weaknesses": ["<concrete gap 1>", "<concrete gap 2>", "<concrete gap 3>"],
  "suggestedTopics": ["<resource 1>", "<resource 2>", "<resource 3>", "<resource 4>", "<resource 5>"],
  "questionAnalysis": [
    {{
      "question":    "<original question>",
      "answer":      "<condensed answer>",
      "score":       <1-10>,
      "feedback":    "<1-2 sentence critique>",
      "betterAnswer":"<what a strong answer would have included>"
    }}
  ]
}}
`;

const MCQ_TEMPLATE = `
You are a technical assessment designer.

Generate {count} multiple-choice questions to assess a {role} candidate on these skills: {skills}.
Difficulty target: {difficulty}

Each question must be unambiguous, have exactly one correct answer, and test real applied knowledge.

Return ONLY valid JSON array (no markdown):
[
  {{
    "id":       "<uuid or sequential string>",
    "question": "<question text>",
    "options":  {{ "A": "...", "B": "...", "C": "...", "D": "..." }},
    "answer":   "<A|B|C|D>",
    "skill":    "<which skill this tests>",
    "difficulty": "{difficulty}"
  }}
]
`;

// ─────────────────────────────────────────────────────────────────────────────
// Build chains once at startup
// ─────────────────────────────────────────────────────────────────────────────
const chains = {
    question: [buildChain(primaryLlm, QUESTION_TEMPLATE), buildChain(fallbackLlm, QUESTION_TEMPLATE)],
    followUp: [buildChain(primaryLlm, FOLLOWUP_TEMPLATE), buildChain(fallbackLlm, FOLLOWUP_TEMPLATE)],
    evaluate: [buildChain(primaryLlm, EVAL_TEMPLATE), buildChain(fallbackLlm, EVAL_TEMPLATE)],
    report: [buildChain(primaryLlm, REPORT_TEMPLATE), buildChain(fallbackLlm, REPORT_TEMPLATE)],
    mcq: [buildChain(primaryLlm, MCQ_TEMPLATE), buildChain(fallbackLlm, MCQ_TEMPLATE)],
};

// ─────────────────────────────────────────────────────────────────────────────
// Exported domain functions (called by services — never by controllers)
// ─────────────────────────────────────────────────────────────────────────────

export async function generateQuestion({
    role, level, skills, category, difficulty, questionNumber, previousQuestions,
}) {
    return invokeWithFallback(chains.question[0], chains.question[1], {
        role,
        level,
        category: category || "Concept",
        difficulty: difficulty || "medium",
        skills: Array.isArray(skills) ? skills.join(", ") : skills,
        questionNumber: String(questionNumber),
        previousQuestions: previousQuestions?.length ? previousQuestions.join(" | ") : "None",
    });
}

export async function generateFollowUp({ role, level, question, answer, feedback }) {
    return invokeWithFallback(chains.followUp[0], chains.followUp[1], {
        role, level, question, answer, feedback,
    });
}

export async function evaluateAnswer({ role, level, question, answer }) {
    const raw = await invokeWithFallback(chains.evaluate[0], chains.evaluate[1], {
        role, level, question, answer,
    });
    return extractJSON(raw);
}

export async function generateMCQs({ role, skills, difficulty = "medium", count = 7 }) {
    const raw = await invokeWithFallback(chains.mcq[0], chains.mcq[1], {
        role,
        skills: Array.isArray(skills) ? skills.join(", ") : skills,
        difficulty,
        count: String(count),
    });
    return extractJSON(raw);
}

export async function generateFinalReport({ role, level, history }) {
    // Build per-skill score map from history
    const skillMap = {};
    history.forEach((h) => {
        if (!h.skill) return;
        if (!skillMap[h.skill]) skillMap[h.skill] = [];
        skillMap[h.skill].push(h.evaluation?.score?.overall ?? 0);
    });

    const skillScores = Object.fromEntries(
        Object.entries(skillMap).map(([skill, scores]) => [
            skill,
            Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        ])
    );

    const transcript = history
        .map(
            (h, i) =>
                `Q${i + 1} [${h.skill}]: ${h.question}\n` +
                `Candidate: ${h.answer}\n` +
                `Score: ${h.evaluation?.score?.overall ?? 0}/10\n` +
                `Notes: ${h.evaluation?.feedback}`
        )
        .join("\n\n");

    const raw = await invokeWithFallback(chains.report[0], chains.report[1], {
        role, level, transcript,
    });
    const report = extractJSON(raw);

    return { ...report, skillScores };
}
