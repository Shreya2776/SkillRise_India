import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import resumeRoutes from "./routes/resume.routes";

import { connectDB } from "./config/db";
import "./config/passport";
import authRoutes from "./routes/auth.routes";


connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
console.log("Google ID:", process.env.GOOGLE_CLIENT_ID);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});