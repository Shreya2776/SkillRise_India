const Interview = require("../models/Interview");
const User = require("../models/User");
const { gemini2Flash, gemini2FlashText } = require("../config/googleAI");

// @desc    Create interview session
// @route   POST /api/interviews
// @access  Private
const createInterview = async (req, res, next) => {
  try {
    const { userCategory, role, type, level, techstack, questions } = req.body;

    const interview = await Interview.create({
      user: req.user.id,
      userCategory: userCategory || "white-collar",
      role,
      type,
      level: level || "mid",
      techstack: techstack || [],
      questions: questions || [],
      status: "pending",
    });

    res.status(201).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all interviews for user
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const [interviews, total] = await Promise.all([
      Interview.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-transcript"),
      Interview.countDocuments(filter),
    ]);

    res.json({
      success: true,
      interviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
// @access  Private
const getInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    res.json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview (transcript, status)
// @route   PUT /api/interviews/:id
// @access  Private
const updateInterview = async (req, res, next) => {
  try {
    const { transcript, status, duration } = req.body;

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    if (transcript) interview.transcript = transcript;
    if (status) interview.status = status;
    if (duration) interview.duration = duration;

    await interview.save();
    res.json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit feedback for interview
// @route   POST /api/interviews/:id/feedback
// @access  Private
const submitFeedback = async (req, res, next) => {
  try {
    const { totalScore, feedback } = req.body;

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    interview.totalScore = totalScore;
    interview.feedback = feedback;
    interview.status = "completed";
    interview.finalized = true;

    await interview.save();

    // Update user stats
    const allInterviews = await Interview.find({
      user: req.user.id,
      status: "completed",
      totalScore: { $ne: null },
    });

    const avgScore =
      allInterviews.reduce((sum, i) => sum + i.totalScore, 0) /
      allInterviews.length;

    await User.findByIdAndUpdate(req.user.id, {
      interviewCount: allInterviews.length,
      averageScore: Math.round(avgScore),
    });

    res.json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate adaptive next question using Gemini 2.0 Flash
// @route   POST /api/interviews/:id/next-question
// @access  Private
const generateNextQuestion = async (req, res, next) => {
  try {
    const { transcript } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    const transcriptText = transcript
      .map((t) => `${t.role === "assistant" ? "Interviewer" : "Candidate"}: ${t.content}`)
      .join("\n");

    const prompt = `You are a professional, strict, but encouraging job interviewer. Your goal is to conduct a realistic interview and decide the next best question based on the candidate's last answer.

Interview Details:
- Category: ${interview.userCategory}
- Role: ${interview.role}
- Level: ${interview.level}
- Track: ${interview.type}
- Context/Skills: ${interview.techstack.join(", ") || "General"}

Planned Questions (Reference Guide):
${interview.questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Current Transcript:
${transcriptText}

INSTRUCTIONS:
1. Analyze the candidate's LAST answer ONLY.
2. If the answer was vague or too short, ask a specific follow-up question to probe deeper.
3. If the answer was solid, move to the NEXT logical topic in the planned questions list.
4. If most planned topics have been discussed sufficiently, return the string "END_INTERVIEW".
5. Keep your response concise and conversational, like a real human interviewer.
6. RETURN ONLY THE TEXT FOR THE NEXT QUESTION or "END_INTERVIEW". No JSON, no markdown.`;

    const result = await gemini2FlashText.generateContent(prompt);
    const apiResponse = await result.response;
    const nextQuestion = apiResponse.text().trim();

    res.json({ success: true, nextQuestion });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI feedback (calls Google AI Gemini 2.0 Flash)
// @route   POST /api/interviews/:id/generate-feedback
// @access  Private
const generateFeedback = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    if (!interview.transcript || interview.transcript.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No transcript available" });
    }

    const transcriptText = interview.transcript
      .map((t) => `${t.role === "assistant" ? "Interviewer" : "Candidate"}: ${t.content}`)
      .join("\n");

    const prompt = `You are an expert interview coach and senior hiring manager. Analyze this interview transcript and provide a deep, structured evaluation.

Transcript:
${transcriptText}

Provide a JSON response with this exact structure:
{
  "totalScore": <number 0-100>,
  "feedback": {
    "categoryScores": {
      "communication": { "score": <0-100>, "comment": "<specific feedback>" },
      "technicalKnowledge": { "score": <0-100>, "comment": "<specific feedback>" },
      "problemSolving": { "score": <0-100>, "comment": "<specific feedback>" },
      "culturalFit": { "score": <0-100>, "comment": "<specific feedback>" },
      "confidenceClarity": { "score": <0-100>, "comment": "<specific feedback>" }
    },
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "areasForImprovement": ["<area 1>", "<area 2>", "<area 3>"],
    "finalAssessment": "<3-5 sentence overall expert assessment>"
  }
}

Return ONLY valid JSON. No markdown.`;

    const result = await gemini2Flash.generateContent(prompt);
    const apiResponse = await result.response;
    const feedbackData = JSON.parse(apiResponse.text());

    // Save the feedback
    interview.totalScore = feedbackData.totalScore;
    interview.feedback = feedbackData.feedback;
    interview.status = "completed";
    interview.finalized = true;
    await interview.save();

    // Update user stats
    const allInterviews = await Interview.find({
      user: req.user.id,
      status: "completed",
      totalScore: { $ne: null },
    });
    const avgScore =
      allInterviews.reduce((sum, i) => sum + i.totalScore, 0) /
      allInterviews.length;
    await User.findByIdAndUpdate(req.user.id, {
      interviewCount: allInterviews.length,
      averageScore: Math.round(avgScore),
    });

    res.json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private
const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    res.json({ success: true, message: "Interview deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user stats
// @route   GET /api/interviews/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [total, completed, byType, recent] = await Promise.all([
      Interview.countDocuments({ user: userId }),
      Interview.countDocuments({ user: userId, status: "completed" }),
      Interview.aggregate([
        { $match: { user: require("mongoose").Types.ObjectId.createFromHexString(userId) } },
        { $group: { _id: "$type", count: { $sum: 1 }, avgScore: { $avg: "$totalScore" } } },
      ]),
      Interview.find({ user: userId, status: "completed" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("role type totalScore createdAt"),
    ]);

    res.json({
      success: true,
      stats: {
        totalInterviews: total,
        completedInterviews: completed,
        byType,
        recentInterviews: recent,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInterview,
  getInterviews,
  getInterview,
  updateInterview,
  submitFeedback,
  generateNextQuestion,
  generateFeedback,
  deleteInterview,
  getStats,
};
