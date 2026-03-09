// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
  });

  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  if (user.role !== role)
    return res.status(403).json({ message: "Role mismatch" });

  const token = generateToken(user._id.toString());

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
  });

  res.json({ user });
};

export const me = async (req: any, res: Response) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};