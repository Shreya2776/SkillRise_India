// src/models/interviewSession.model.js
import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
    {
        score: {
            technical: { type: Number, min: 1, max: 10 },
            clarity: { type: Number, min: 1, max: 10 },
            communication: { type: Number, min: 1, max: 10 },
            logic: { type: Number, min: 1, max: 10 },
            overall: { type: Number, min: 1, max: 10 },
        },
        feedback: String,
        strengths: [String],
        improvements: [String],
        improvedAnswer: String,
        conversationalResponse: String,
        isFollowUpNeeded: Boolean,
    },
    { _id: false }
);

const historyEntrySchema = new mongoose.Schema(
    {
        skill: String,
        question: String,
        answer: String,
        evaluation: evaluationSchema,
        timestamp: { type: Date, default: Date.now },
    },
    { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
    {
        sessionId: { type: String, required: true, unique: true, index: true },
        userId: { type: String, default: "anonymous" },
        role: { type: String, required: true },
        level: { type: String, required: true },
        skills: { type: [String], required: true },
        difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
        state: { type: String, enum: ["init", "questioning", "reporting", "done"], default: "init" },
        maxQuestions: { type: Number, default: 5 },
        questionNumber: { type: Number, default: 1 },
        currentQuestion: String,
        currentSkill: String,
        categoryIndex: { type: Number, default: 0 },
        followUpUsed: { type: Boolean, default: false },
        testedSkills: { type: [String], default: [] },
        history: { type: [historyEntrySchema], default: [] },
        report: { type: mongoose.Schema.Types.Mixed, default: null },
    },
    { timestamps: true }
);

export const InterviewSessionModel = mongoose.model("InterviewSession", interviewSessionSchema);

// ─────────────────────────────────────────────────────────────────────────────
// Lightweight in-memory session class (used by graph internally)
// Keep for backward-compat with any code that imports this named export.
// ─────────────────────────────────────────────────────────────────────────────
export class InterviewSession {
    constructor(id, { role, level, skills }) {
        this.id = id;
        this.role = role;
        this.level = level;
        this.skills = skills;
        this.state = "init";
        this.currentQuestion = null;
        this.questionNumber = 1;
        this.history = [];
        this.report = null;
        this.createdAt = new Date();
    }

    addHistory(question, answer, evaluation) {
        this.history.push({ question, answer, evaluation, timestamp: new Date() });
    }

    isComplete(maxQuestions = 5) {
        return this.history.length >= maxQuestions;
    }
}