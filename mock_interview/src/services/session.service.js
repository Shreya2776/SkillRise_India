// src/services/session.service.js
import { InterviewSessionModel } from "../models/interviewSession.model.js";

/**
 * Session persistence layer.
 * Map is the hot path; MongoDB is the durable backup.
 * This allows recovery after server restarts without losing long-running interviews.
 */

export async function saveSessionToDb(session) {
  try {
    // Standardize field mapping for MongoDB schema
    const updateData = {
      sessionId:       session.id || session.sessionId,
      role:            session.role,
      level:           session.level,
      skills:          session.skills,
      difficulty:      session.difficulty,
      state:           session.state,
      maxQuestions:    session.maxQuestions,
      questionNumber:  session.questionNumber,
      currentQuestion: session.currentQuestion,
      currentSkill:    session.currentSkill,
      categoryIndex:   session.categoryIndex,
      followUpUsed:    session.followUpUsed,
      testedSkills:    session.testedSkills,
      history:         session.history,
      report:          session.report,
      updatedAt:       new Date(),
    };

    await InterviewSessionModel.findOneAndUpdate(
      { sessionId: updateData.sessionId },
      updateData,
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("[SessionService] DB save failed:", err.message);
    // Non-fatal — strictly for persistence/recovery
  }
}

export async function loadSessionFromDb(sessionId) {
  try {
    const doc = await InterviewSessionModel.findOne({ sessionId }).lean();
    if (!doc) return null;

    // Re-inflate into the graph/service state structure
    return {
      id:              doc.sessionId,
      role:            doc.role,
      level:           doc.level,
      skills:          doc.skills,
      difficulty:      doc.difficulty,
      state:           doc.state,
      maxQuestions:    doc.maxQuestions,
      questionNumber:  doc.questionNumber,
      currentQuestion: doc.currentQuestion,
      currentSkill:    doc.currentSkill,
      categoryIndex:   doc.categoryIndex,
      followUpUsed:    doc.followUpUsed,
      testedSkills:    doc.testedSkills || [],
      history:         doc.history || [],
      report:          doc.report || null,
      pendingAnswer:   null,
    };
  } catch (err) {
    console.error("[SessionService] DB load failed:", err.message);
    return null;
  }
}
