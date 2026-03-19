// src/graphs/interview.graph.js
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import { getNextQuestion, getFollowUpQuestion } from "../services/question.service.js";
import { processAnswer } from "../services/evaluation.service.js";
import { generateFinalReport } from "../services/llm.service.js";
import { saveSessionToDb, loadSessionFromDb } from "../services/session.service.js";

// ─────────────────────────────────────────────────────────────────────────────
// State Schema (LangGraph Annotation API — replaces raw `channels` object)
// ─────────────────────────────────────────────────────────────────────────────
const InterviewStateAnnotation = Annotation.Root({
  id:              Annotation({ reducer: (_, v) => v, default: () => null }),
  role:            Annotation({ reducer: (_, v) => v, default: () => null }),
  level:           Annotation({ reducer: (_, v) => v, default: () => null }),
  skills:          Annotation({ reducer: (_, v) => v, default: () => [] }),
  testedSkills:    Annotation({ reducer: (_, v) => v, default: () => [] }),
  currentSkill:    Annotation({ reducer: (_, v) => v, default: () => null }),
  categoryIndex:   Annotation({ reducer: (_, v) => v, default: () => 0 }),
  maxQuestions:    Annotation({ reducer: (_, v) => v, default: () => 5 }),
  followUpUsed:    Annotation({ reducer: (_, v) => v, default: () => false }),
  difficulty:      Annotation({ reducer: (_, v) => v, default: () => "medium" }),
  state:           Annotation({ reducer: (_, v) => v, default: () => "init" }),
  currentQuestion: Annotation({ reducer: (_, v) => v, default: () => null }),
  questionNumber:  Annotation({ reducer: (_, v) => v, default: () => 1 }),
  history:         Annotation({ reducer: (_, v) => v, default: () => [] }),
  pendingAnswer:   Annotation({ reducer: (_, v) => v, default: () => null }),
  report:          Annotation({ reducer: (_, v) => v, default: () => null }),
});

// ─────────────────────────────────────────────────────────────────────────────
// In-memory session store (primary fast path; DB is the fallback/persistence)
// ─────────────────────────────────────────────────────────────────────────────
const sessions = new Map();

export function getSession(id) {
  return sessions.get(id) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Adaptive difficulty helper
// ─────────────────────────────────────────────────────────────────────────────
function resolveNextDifficulty(score, current) {
  if (score >= 8) return "hard";
  if (score < 5)  return "easy";
  // Score 5-7: stay at current to avoid thrashing
  return current;
}

// ─────────────────────────────────────────────────────────────────────────────
// Node: Generate Question
// ─────────────────────────────────────────────────────────────────────────────
async function nodeGenerateQuestion(state) {
  const previousQuestions = state.history.map((h) => h.question);

  // Skill rotation: prefer untested skills; cycle back when all tested
  const availableSkills = state.skills.filter(
    (s) => !state.testedSkills.includes(s)
  );
  const targetSkill =
    availableSkills.length > 0
      ? availableSkills[0]
      : state.skills[state.questionNumber % state.skills.length];

  // Category rotation
  const categories = ["Concept", "Implementation", "Debugging", "Optimization"];
  const currentCategory = categories[state.categoryIndex % categories.length];

  const question = await getNextQuestion({
    role: state.role,
    level: state.level,
    skills: [targetSkill],
    category: currentCategory,
    difficulty: state.difficulty,
    questionNumber: state.questionNumber,
    previousQuestions,
  });

  return {
    ...state,
    currentQuestion: question,
    currentSkill: targetSkill,
    categoryIndex: state.categoryIndex + 1,
    followUpUsed: false,
    state: "questioning",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Node: Evaluate Answer
// ─────────────────────────────────────────────────────────────────────────────
async function nodeEvaluateAnswer(state) {
  if (!state.pendingAnswer) return state;

  const evaluation = await processAnswer({
    role:     state.role,
    level:    state.level,
    question: state.currentQuestion,
    answer:   state.pendingAnswer,
  });

  const newEntry = {
    skill:      state.currentSkill,
    question:   state.currentQuestion,
    answer:     state.pendingAnswer,
    evaluation,
    timestamp:  new Date().toISOString(),
  };

  const updatedHistory = [...state.history, newEntry];
  const isDone = updatedHistory.length >= (state.maxQuestions || 5);

  const score = evaluation.score?.overall ?? 0;
  const nextDifficulty = resolveNextDifficulty(score, state.difficulty);

  // Follow-up logic:
  // - Only if score < 6 OR LLM flagged it
  // - Never if we already used a follow-up for this topic
  // - Never if the interview is done
  const shouldFollowUp =
    (score < 6 || evaluation.isFollowUpNeeded) &&
    !isDone &&
    !state.followUpUsed;

  let nextQuestion = null;
  let followUpUsed = state.followUpUsed;
  let updatedTestedSkills = [...state.testedSkills];

  if (shouldFollowUp) {
    nextQuestion = await getFollowUpQuestion({
      role:     state.role,
      level:    state.level,
      question: state.currentQuestion,
      answer:   state.pendingAnswer,
      feedback: evaluation.feedback,
    });
    followUpUsed = true;
  } else {
    // Close the topic — mark skill as tested
    if (state.currentSkill && !updatedTestedSkills.includes(state.currentSkill)) {
      updatedTestedSkills.push(state.currentSkill);
    }
    followUpUsed = false;
  }

  return {
    ...state,
    history:         updatedHistory,
    questionNumber:  state.questionNumber + 1,
    pendingAnswer:   null,
    currentQuestion: nextQuestion,
    difficulty:      nextDifficulty,
    testedSkills:    updatedTestedSkills,
    followUpUsed,
    state: isDone ? "reporting" : "questioning",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Node: Generate Final Report
// ─────────────────────────────────────────────────────────────────────────────
async function nodeGenerateReport(state) {
  const report = await generateFinalReport({
    role:    state.role,
    level:   state.level,
    history: state.history,
  });

  // Persist final session to DB (fire-and-forget; don't block response)
  saveSessionToDb({ ...state, report, state: "done" }).catch((err) =>
    console.error("[Graph] DB persist error:", err.message)
  );

  return { ...state, report, state: "done" };
}

// ─────────────────────────────────────────────────────────────────────────────
// Build LangGraph
// ─────────────────────────────────────────────────────────────────────────────
function buildInterruptibleGraph() {
  const graph = new StateGraph(InterviewStateAnnotation);

  graph.addNode("generate_question", nodeGenerateQuestion);
  graph.addNode("evaluate_answer",   nodeEvaluateAnswer);
  graph.addNode("generate_report",   nodeGenerateReport);

  // Entry: if we have a pending answer, evaluate; otherwise generate a question
  graph.addConditionalEdges(START, (state) => {
    if (state.pendingAnswer) return "evaluate_answer";
    return "generate_question";
  });

  // After evaluation: done → report; follow-up ready → END (question already set);
  // otherwise → generate next question
  graph.addConditionalEdges("evaluate_answer", (state) => {
    if (state.state === "reporting") return "generate_report";
    if (state.currentQuestion)       return END; // follow-up pre-generated
    return "generate_question";
  });

  graph.addEdge("generate_question", END);
  graph.addEdge("generate_report",   END);

  return graph.compile();
}

const interviewGraph = buildInterruptibleGraph();

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Start a new interview session.
 * Accepts an optional `initialDifficulty` from the pre-assessment engine.
 */
export async function startInterview({
  role,
  level,
  skills,
  maxQuestions,
  initialDifficulty = "medium",
}) {
  const sessionId = uuidv4();
  const initialState = {
    id:              sessionId,
    role,
    level,
    skills,
    maxQuestions:    maxQuestions || 5,
    testedSkills:    [],
    currentSkill:    null,
    categoryIndex:   0,
    followUpUsed:    false,
    difficulty:      initialDifficulty,
    state:           "init",
    currentQuestion: null,
    questionNumber:  1,
    history:         [],
    pendingAnswer:   null,
    report:          null,
  };

  const result = await interviewGraph.invoke(initialState);
  sessions.set(result.id, result);

  return {
    sessionId:      result.id,
    question:       result.currentQuestion,
    questionNumber: result.questionNumber,
    skill:          result.currentSkill,
    difficulty:     result.difficulty,
    maxQuestions:   result.maxQuestions,
  };
}

/**
 * Submit an answer and advance the graph.
 */
export async function submitAnswer({ sessionId, answer }) {
  // Try memory first, fall back to DB (e.g., after server restart)
  let session = sessions.get(sessionId);
  if (!session) {
    session = await loadSessionFromDb(sessionId);
    if (!session) throw new Error("Session not found");
    sessions.set(sessionId, session);
  }

  if (session.state === "done") throw new Error("Interview already completed");

  const inputState = { ...session, pendingAnswer: answer };
  const result = await interviewGraph.invoke(inputState);
  sessions.set(sessionId, result);

  const lastEvaluation = result.history.at(-1).evaluation;

  const base = {
    score:                 lastEvaluation.score,
    feedback:              lastEvaluation.feedback,
    betterAnswer:          lastEvaluation.improvedAnswer,
    conversationalResponse: lastEvaluation.conversationalResponse,
  };

  if (result.state === "done") {
    return { ...base, nextQuestion: null, isComplete: true, report: result.report };
  }

  return {
    ...base,
    nextQuestion:   result.currentQuestion,
    questionNumber: result.questionNumber,
    skill:          result.currentSkill,
    difficulty:     result.difficulty,
    isComplete:     false,
  };
}

/**
 * Force-generate a report for an in-progress or completed session.
 */
export async function getReport({ sessionId }) {
  const session = sessions.get(sessionId) || (await loadSessionFromDb(sessionId));
  if (!session) throw new Error("Session not found");
  if (session.state === "done") return session.report;

  const result = await nodeGenerateReport(session);
  sessions.set(sessionId, result);
  return result.report;
}
