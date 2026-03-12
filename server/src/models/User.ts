// src/models/User.ts
import mongoose, { Document } from "mongoose";

export type Role = "USER" | "RECRUITER" | "ADMIN";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  googleId?: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["USER", "RECRUITER", "ADMIN"],
      default: "USER",
    },
    googleId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);