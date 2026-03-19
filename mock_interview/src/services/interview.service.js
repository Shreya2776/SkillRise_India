// src/services/interview.service.js
/**
 * Interview Service
 * ─────────────────
 * Thin orchestration layer between the controller and the LangGraph.
 * Does NOT contain business logic — delegates entirely to the graph.
 */
import {
  startInterview,
  submitAnswer,
  getReport,
} from "../graphs/interview.graph.js";

export async function startInterviewSession({ role, level, skills, maxQuestions, initialDifficulty }) {
  if (!role) throw new Error("role is required");
  if (!level) throw new Error("level is required");
  if (!skills?.length) throw new Error("skills array is required and must be non-empty");

  return startInterview({ role, level, skills, maxQuestions, initialDifficulty });
}

export async function submitAnswerToSession({ sessionId, answer }) {
  if (!sessionId) throw new Error("sessionId is required");
  if (!answer?.trim()) throw new Error("answer cannot be empty");

  return submitAnswer({ sessionId, answer: answer.trim() });
}

export async function fetchReport({ sessionId }) {
  if (!sessionId) throw new Error("sessionId is required");
  return getReport({ sessionId });
}