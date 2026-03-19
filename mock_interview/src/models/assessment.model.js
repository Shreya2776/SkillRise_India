// src/models/assessment.model.js
import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    userId:         { type: String, default: "anonymous" },
    candidateType:  { type: String, enum: ["fresher", "experienced", "senior"], default: "experienced" },
    role:           { type: String, required: true },
    skills:         { type: [String], required: true },
    questions:      { type: Array,   required: true },
    answers:        { type: Array,   default: [] },
    score:          { type: Number,  min: 0, max: 100 },
    correctCount:   { type: Number,  default: 0 },
    totalQuestions: { type: Number,  default: 0 },
    difficultyLevel: {
      type:    String,
      enum:    ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export const Assessment = mongoose.model("Assessment", assessmentSchema);

