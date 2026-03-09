import express from "express";
import passport from "passport";
import {
  login,
  register,
  me,
  logout,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, me);
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: any, res) => {
    const token = req.user._id;

    res.cookie("token", token);

    res.redirect("http://localhost:3000/user/dashboard");
  }
);

export default router;