export type Role = "USER" | "RECRUITER" | "ADMIN";

export interface User {
  _id: string;
  email: string;
  name: string;
  role: Role;
}