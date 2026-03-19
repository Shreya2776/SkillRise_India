// src/services/evaluation.service.js
import { evaluateAnswer } from "./llm.service.js";
import { validateScores, calculateOverallScore } from "../utils/scoring.js";

/**
 * Process a candidate's answer through the evaluation LLM.
 *
 * Returns a normalised evaluation object:
 * {
 *   score: { technical, clarity, communication, logic, overall },
 *   feedback: string,
 *   strengths: string[],
 *   improvements: string[],
 *   improvedAnswer: string,
 *   conversationalResponse: string,
 *   isFollowUpNeeded: boolean,
 * }
 */
export async function processAnswer({ role, level, question, answer }) {
    const raw = await evaluateAnswer({ role, level, question, answer });

    // ── Score normalisation ────────────────────────────────────────────────────
    const score = raw.score ? validateScores(raw.score) : defaultScore();
    score.overall = calculateOverallScore(score);

    // ── Strengths / Improvements ───────────────────────────────────────────────
    // LLM may return these directly or we derive them from feedback text.
    const strengths = normaliseArray(raw.strengths) || deriveStrengths(score);
    const improvements = normaliseArray(raw.improvements) || deriveImprovements(score);

    return {
        score,
        feedback: raw.feedback ?? "No feedback provided.",
        strengths,
        improvements,
        improvedAnswer: raw.improvedAnswer ?? raw.betterAnswer ?? "",
        conversationalResponse: raw.conversationalResponse ?? "",
        isFollowUpNeeded: raw.isFollowUpNeeded ?? score.overall < 7,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function defaultScore() {
    return { technical: 5, clarity: 5, communication: 5, logic: 5, overall: 5 };
}

function normaliseArray(val) {
    if (Array.isArray(val) && val.length > 0) return val;
    return null;
}

function deriveStrengths(score) {
    const out = [];
    if (score.technical >= 7) out.push("Solid technical knowledge demonstrated.");
    if (score.clarity >= 7) out.push("Clear and well-structured explanation.");
    if (score.communication >= 7) out.push("Effective communication of thought process.");
    if (score.logic >= 7) out.push("Good awareness of trade-offs.");
    return out.length ? out : ["Attempted the question with reasonable effort."];
}

function deriveImprovements(score) {
    const out = [];
    if (score.technical < 6) out.push("Deepen technical knowledge on this topic.");
    if (score.clarity < 6) out.push("Structure answers more clearly (situation → approach → result).");
    if (score.communication < 6) out.push("Articulate your thinking process step by step.");
    if (score.logic < 6) out.push("Consider edge cases and trade-offs explicitly.");
    return out.length ? out : ["Review the ideal answer and practise explaining it aloud."];
}

