// src/models/report.model.js
import mongoose from "mongoose";

const questionAnalysisSchema = new mongoose.Schema(
  {
    question:    String,
    answer:      String,
    skill:       String,
    score:       Number,
    feedback:    String,
    betterAnswer: String,
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    sessionId:     { type: String, required: true, unique: true, index: true },
    userId:        { type: String, default: "anonymous", index: true },
    role:          { type: String, required: true },
    level:         { type: String, required: true },
    overallScore:  { type: Number, min: 0, max: 100 },
    summary:       String,
    strengths:     [String],
    weaknesses:    [String],
    suggestedTopics: [String],
    skillScores:   { type: Map, of: Number },
    questionAnalysis: [questionAnalysisSchema],
  },
  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
