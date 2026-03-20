require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Route imports
const authRoutes = require("./routes/auth");
const interviewRoutes = require("./routes/interviews");
const vapiRoutes = require("./routes/vapi");

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use("/api/", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/vapi", vapiRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Interview Prep API is running", timestamp: new Date() });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);

  // Ensure Guest User exists (Auth-Free Mode)
  try {
    const User = require("./models/User");
    const GUEST_ID = "6673f0000000000000000000";
    const guestExists = await User.findById(GUEST_ID);
    if (!guestExists) {
      await User.create({
        _id: GUEST_ID,
        name: "Guest User",
        email: "guest@interviewai.com",
        password: "password123", // required by model
      });
      console.log("✅ Guest User created for Auth-Free Mode.");
    }
  } catch (error) {
    console.warn("⚠️ Could not ensure Guest User:", error.message);
  }
});
