// src/routes/resume.routes.js
import { Router } from "express";
import multer     from "multer";
import { uploadResume, getResume } from "../controllers/resume.controller.js";
import { asyncWrap } from "../middleware/errorHandler.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB cap
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    
    const err = new Error("Only PDF, DOCX, and TXT files are accepted.");
    err.status = 400; // Inject status safely handling by global router
    cb(err); 
  },
});

router.post("/upload", upload.single("resume"), asyncWrap(uploadResume));
router.get("/:id",     asyncWrap(getResume));

export default router;
