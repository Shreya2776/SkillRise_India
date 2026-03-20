const express = require("express");
const {
  createInterview,
  getInterviews,
  getInterview,
  updateInterview,
  submitFeedback,
  generateFeedback,
  deleteInterview,
  getStats,
  generateNextQuestion,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // All interview routes are protected

router.get("/stats", getStats);
router.route("/").get(getInterviews).post(createInterview);
router.route("/:id").get(getInterview).put(updateInterview).delete(deleteInterview);
router.post("/:id/feedback", submitFeedback);
router.post("/:id/generate-feedback", generateFeedback);
router.post("/:id/next-question", generateNextQuestion);

module.exports = router;
