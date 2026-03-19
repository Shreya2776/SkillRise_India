// src/controllers/resume.controller.js
import { parseResume, extractResumeData } from "../services/resume.service.js";
import { Resume } from "../models/resume.model.js";

// POST /api/resume/upload
// multipart/form-data, field: "resume"
export async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file provided." });
    }

    const rawText   = await parseResume(req.file);
    const extracted = await extractResumeData(rawText);

    // Persist to DB
    const saved = await Resume.create({
      userId:     req.body.userId || "anonymous",
      filename:   req.file.originalname,
      rawText,    // stored but excluded from default queries via `select: false`
      ...extracted,
    });

    res.status(201).json({
      success:  true,
      resumeId: saved._id,
      // Destructured flattened properties
      role:     extracted.role,
      skills:   extracted.skills,
      experience: extracted.experience,
      education:  extracted.education,
      projects:   extracted.projects,
      // ⚠️ Backwards compatibility node for existing front-end binding
      extracted_data: extracted
    });
  } catch (err) {
    console.error("[Controller] uploadResume:", err.message);
    res.status(500).json({ success: false, error: err.message || "Resume processing failed." });
  }
}

// GET /api/resume/:id
export async function getResume(req, res) {
  try {
    const resume = await Resume.findById(req.params.id).lean();
    if (!resume) return res.status(404).json({ success: false, error: "Resume not found." });
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
