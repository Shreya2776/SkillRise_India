// src/controllers/interview.controller.js
import {
  startInterviewSession,
  submitAnswerToSession,
  fetchReport,
} from "../services/interview.service.js";

// POST /api/interview/start
// Body: { role, level, skills, maxQuestions?, initialDifficulty? }
export async function startInterview(req, res) {
  try {
    const { role, level, skills, maxQuestions, initialDifficulty } = req.body;
    const result = await startInterviewSession({
      role,
      level,
      skills,
      maxQuestions,
      initialDifficulty,
    });
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    console.error("[Controller] startInterview:", err.message);
    res.status(err.message.includes("required") ? 400 : 500).json({
      success: false,
      error: err.message || "Failed to start interview session.",
    });
  }
}

// POST /api/interview/answer
// Body: { sessionId, answer }
export async function submitAnswer(req, res) {
  try {
    const { sessionId, answer } = req.body;
    const result = await submitAnswerToSession({ sessionId, answer });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error("[Controller] submitAnswer:", err.message);
    const status = err.message.includes("not found") ? 404
      : err.message.includes("required") ? 400
        : 500;
    res.status(status).json({
      success: false,
      error: err.message || "Failed to process answer.",
    });
  }
}

// GET /api/interview/report?sessionId=xxx
export async function getReport(req, res) {
  try {
    const { sessionId } = req.query;
    const report = await fetchReport({ sessionId });
    res.status(200).json({ success: true, report });
  } catch (err) {
    console.error("[Controller] getReport:", err.message);
    res.status(err.message.includes("not found") ? 404 : 500).json({
      success: false,
      error: err.message || "Failed to generate report.",
    });
  }
}
