// src/services/resume.service.js
import mammoth             from "mammoth";
import { createRequire }   from "module";
import { generateResponse } from "./llm.service.js";

const require = createRequire(import.meta.url);
const pdf     = require("pdf-parse");

// ─────────────────────────────────────────────────────────────────────────────
// Step 1: Extract raw text from PDF / DOCX / plain buffer
// ─────────────────────────────────────────────────────────────────────────────
export async function parseResume(file) {
  if (!file?.buffer) throw new Error("No file uploaded or file buffer missing.");

  const mime = file.mimetype || "";

  if (mime === "application/pdf") {
    const data = await pdf(file.buffer);
    return data.text;
  }

  if (mime.includes("word") || mime.includes("openxmlformats")) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  // Fallback: treat as plain text (txt, etc.)
  return file.buffer.toString("utf-8");
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2: Extract structured data from raw text via LLM
// ─────────────────────────────────────────────────────────────────────────────
export async function extractResumeData(text) {
  if (!text?.trim()) {
    throw new Error("Extracted resume text is empty — cannot parse.");
  }

  const prompt = `
Extract structured data from the resume text below.
Return ONLY a strictly valid JSON object. No markdown, no explanation.

Required keys:
- "role":       String — most likely job title this resume targets (e.g. "Frontend Developer")
- "skills":     String[] — technical skills, frameworks, tools (e.g. ["React", "Node.js", "PostgreSQL"])
- "experience": String — total experience summary (e.g. "2 years as a Full Stack Developer")
- "education":  String — primary degree (e.g. "B.Tech Computer Science, IIT Delhi")
- "projects":   String[] — 2-4 notable project descriptions in one sentence each

Resume Text:
---
${text.slice(0, 8000)}
---
`;

  try {
    const result = await generateResponse(prompt, { json: true, fallback: true });
    return sanitiseResumeData(result);
  } catch (err) {
    console.error("[ResumeService] LLM extraction failed:", err.message);
    return fallbackResumeData();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function sanitiseResumeData(data) {
  return {
    role:       typeof data.role       === "string" ? data.role       : "Software Developer",
    skills:     Array.isArray(data.skills)          ? data.skills     : [],
    experience: typeof data.experience === "string" ? data.experience : "Unknown",
    education:  typeof data.education  === "string" ? data.education  : "Unknown",
    projects:   Array.isArray(data.projects)        ? data.projects   : [],
  };
}

function fallbackResumeData() {
  return {
    role:       "Software Developer",
    skills:     [],
    experience: "Unknown",
    education:  "Unknown",
    projects:   [],
  };
}
