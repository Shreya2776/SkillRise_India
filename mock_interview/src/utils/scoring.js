// src/utils/scoring.js

/**
 * Clamp all score fields to [1, 10] and coerce to integers.
 * Ensures the LLM output doesn't break the UI or database constraints.
 */
export function validateScores(score = {}) {
  const clamp = (v) => Math.min(10, Math.max(1, Math.round(Number(v) || 5)));
  
  // Calculate a weighted overall score if the LLM provided one was missing or invalid
  const overall = score.overall 
    ? clamp(score.overall) 
    : calculateOverallScore(score);

  return {
    technical:     clamp(score.technical),
    clarity:       clamp(score.clarity),
    communication: clamp(score.communication),
    logic:         clamp(score.logic),
    overall:       overall,
  };
}

/**
 * Weighted composite score.
 * technical 40% | clarity 20% | communication 20% | logic 20%
 * Higher weight on technical skills for a realistic engineering hiring bar.
 */
export function calculateOverallScore(score = {}) {
  const t = Number(score.technical) || 5;
  const c = Number(score.clarity) || 5;
  const cm = Number(score.communication) || 5;
  const l = Number(score.logic) || 5;

  return Math.min(
    10,
    Math.max(
      1,
      Math.round(t * 0.4 + c * 0.2 + cm * 0.2 + l * 0.2)
    )
  );
}

/**
 * Convert a 1-10 score to a human-readable label.
 * Used for badge generation and quick summary text in the UI.
 */
export function scoreLabel(overall) {
  if (overall >= 9) return "Exceptional";
  if (overall >= 7) return "Strong";
  if (overall >= 5) return "Adequate";
  if (overall >= 3) return "Weak";
  return "Poor";
}
