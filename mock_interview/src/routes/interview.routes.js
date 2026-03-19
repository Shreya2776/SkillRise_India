// src/routes/interview.routes.js
import { Router } from "express";
import multer from "multer";
import {
  startInterview,
  submitAnswer,
  getReport,
} from "../controllers/interview.controller.js";
import { uploadResume, getResume } from "../controllers/resume.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/start", startInterview);
router.post("/answer", submitAnswer);
router.get("/report", getReport);

export default router;