const mongoose = require("mongoose");

const feedbackCategorySchema = new mongoose.Schema({
  score: { type: Number, min: 0, max: 100 },
  comment: String,
});

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userCategory: {
      type: String,
      enum: ["white-collar", "blue-collar", "student"],
      default: "white-collar",
    },
    role: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["technical", "behavioral", "mixed", "situational"],
      required: true,
    },
    level: {
      type: String,
      enum: ["junior", "mid", "senior"],
      default: "mid",
    },
    techstack: {
      type: [String],
      default: [],
    },
    questions: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    finalized: {
      type: Boolean,
      default: false,
    },
    // Feedback fields
    totalScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    feedback: {
      categoryScores: {
        communication: feedbackCategorySchema,
        technicalKnowledge: feedbackCategorySchema,
        problemSolving: feedbackCategorySchema,
        culturalFit: feedbackCategorySchema,
        confidenceClarity: feedbackCategorySchema,
      },
      strengths: [String],
      areasForImprovement: [String],
      finalAssessment: String,
    },
    transcript: {
      type: [
        {
          role: { type: String, enum: ["user", "assistant"] },
          content: String,
        },
      ],
      default: [],
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster queries
interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Interview", interviewSchema);
