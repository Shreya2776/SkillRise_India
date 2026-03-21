// routes/profileRoutes.js

import express from "express";
import { saveProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/save", protect, saveProfile);
// router.get("/me", protect, getMyProfile);
export default router;