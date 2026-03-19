// src/services/report.service.js
import { generateFinalReport } from "./llm.service.js";
import { Report }              from "../models/report.model.js";

/**
 * Generate and persist a final interview report.
 * @param {object} params
 * @param {string} params.sessionId
 * @param {string} params.role
 * @param {string} params.level
 * @param {Array}  params.history
 * @param {string} [params.userId]
 */
export async function createReport({ sessionId, role, level, history, userId }) {
  if (!history?.length) throw new Error("Cannot generate report: history is empty.");

  const reportData = await generateFinalReport({ role, level, history });

  // Inject exact skill node tracking from explicit history into the LLM payload
  if (reportData.questionAnalysis && Array.isArray(reportData.questionAnalysis)) {
    reportData.questionAnalysis = reportData.questionAnalysis.map((node, index) => ({
      ...node,
      skill: history[index]?.skill || "General"
    }));
  }

  const saved = await Report.create({
    sessionId,
    userId:       userId || "anonymous",
    role,
    level,
    ...reportData,
  });

  return saved.toObject();
}

/**
 * Retrieve a previously saved report by sessionId.
 */
export async function getReportBySession(sessionId) {
  const report = await Report.findOne({ sessionId }).lean();
  if (!report) throw new Error("Report not found for this session.");
  return report;
}

/**
 * Retrieve a report by its MongoDB _id.
 */
export async function getReportById(id) {
  const report = await Report.findById(id).lean();
  if (!report) throw new Error("Report not found.");
  return report;
}
