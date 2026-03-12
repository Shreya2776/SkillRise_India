import express from "express";
import { analyzeResume } from "../controllers/resume.controller";
import { upload } from "../middleware/upload.middleware";

const router = express.Router();

/*
POST /api/resume/analyze
*/
router.post("/analyze", upload.single("resume"), analyzeResume);

export default router;