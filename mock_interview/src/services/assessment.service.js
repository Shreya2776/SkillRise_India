// src/services/assessment.service.js
import { generateMCQs } from "./llm.service.js";
import { Assessment } from "../models/assessment.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// Difficulty Engine
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Map a raw percentage score (0–100) to a difficulty label.
 * 0–40%  → easy
 * 40–70% → medium
 * 70–100%→ hard
 */
export function mapScoreToDifficulty(percentageScore) {
    if (percentageScore >= 70) return "hard";
    if (percentageScore >= 40) return "medium";
    return "easy";
}

/**
 * Score a set of MCQ answers and return { correctCount, total, percentage, difficulty }.
 */
export function scoreAssessment(questions, answers) {
    let correct = 0;
    questions.forEach((q, idx) => {
        const userAnswer = answers[idx]?.selected ?? answers[q.id]?.selected;
        if (userAnswer && userAnswer.toUpperCase() === q.answer.toUpperCase()) {
            correct++;
        }
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const difficulty = mapScoreToDifficulty(percentage);

    return { correctCount: correct, total, percentage, difficulty };
}

// ─────────────────────────────────────────────────────────────────────────────
// Service functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate 5–10 MCQs based on role and skills.
 * candidateType influences count: fresher → 5, experienced → 8, senior → 10
 */
export async function generateAssessmentQuestions({ candidateType, role, skills }) {
    const countMap = { fresher: 5, experienced: 8, senior: 10 };
    const count = countMap[candidateType?.toLowerCase()] ?? 7;

    // Freshers start at easy; others start at medium for the pre-assessment
    const difficulty = candidateType?.toLowerCase() === "fresher" ? "easy" : "medium";

    const questions = await generateMCQs({ role, skills, difficulty, count });
    return questions;
}

/**
 * Score answers, persist result, and return difficulty recommendation.
 */
export async function submitAssessment({
    userId, candidateType, role, skills, questions, answers,
}) {
    const { correctCount, total, percentage, difficulty } = scoreAssessment(
        questions,
        answers
    );

    const record = await Assessment.create({
        userId: userId || "anonymous",
        candidateType,
        role,
        skills,
        questions,
        answers,
        score: percentage,
        difficultyLevel: difficulty,
    });

    return {
        id: record._id,
        correctCount,
        total,
        percentage,
        difficulty,
        message: `Score: ${percentage}% → Interview difficulty set to "${difficulty}"`,
    };
}

/**
 * Fetch a previously saved assessment result.
 */
export async function fetchAssessmentResult(id) {
    const record = await Assessment.findById(id).lean();
    if (!record) throw new Error("Assessment not found");
    return record;
}