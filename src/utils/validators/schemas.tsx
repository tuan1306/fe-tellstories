import { z } from "zod";

// The password field may change
export const logInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// May change based on business
export const addUserSchema = z.object({
  email: z.string().email(),
  userName: z.string().min(6, { message: "Please add the damn username" }),
  displayName: z.string().min(1),
  avatarUrl: z.string().optional(),
  userType: z.enum(["Admin", "User"]).optional(),
  status: z.enum(["Active", "Disabled", "Banned"]).optional(),
  phoneNumber: z.string().optional(),
  password: z.string().regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: "Password must contain a special character",
  }),
  dob: z.date(),
});
