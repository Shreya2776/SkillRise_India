const express = require("express");
const { generateVapiToken, generateQuestions } = require("../controllers/vapiController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // All Vapi routes are protected

// Fix the /token route to use the new generateVapiToken
router.post("/token", generateVapiToken);
router.post("/generate-questions", generateQuestions);

module.exports = router;
