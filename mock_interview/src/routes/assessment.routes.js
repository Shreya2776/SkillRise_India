// src/routes/assessment.routes.js
import { Router } from "express";
import { generate, submit, getResult } from "../controllers/assessment.controller.js";

const router = Router();

router.post("/generate",   generate);
router.post("/submit",     submit);
router.get("/result/:id",  getResult);

export default router;