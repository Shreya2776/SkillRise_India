// src/models/resume.model.js
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId:     { type: String, default: "anonymous", index: true }, // Indexed for dashboard list fetching
    filename:   String,
    role:       String,
    skills:     [String],
    experience: String,
    education:  String,
    projects:   [String],
    rawText:    { type: String, select: false }, // excluded from default queries
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);
