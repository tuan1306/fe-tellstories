import { z } from "zod";

// The password field may change
export const logInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// May change based on business
export const addUserSchema = z.object({
  email: z.string().email(),
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

export const editUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1),
  avatarUrl: z.string().optional(),
  userType: z.enum(["Admin", "User"]).optional(),
  status: z.enum(["Active", "Disabled", "Banned"]).optional(),
  phoneNumber: z.string().optional(),
  dob: z.date(),
});

export const addStorySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string(),
  isDraft: z.boolean(),
  coverImageUrl: z.string().optional(),
  language: z.enum(["ENG", "VIE"]),
  duration: z.number(),
  ageRange: z.enum(["1-3", "3-5", "5-8", "8-10", "10+"]),
  readingLevel: z.enum(["Sơ cấp", "Trung cấp", "Nâng cao"]),
  isAIGenerated: z.boolean(),
  backgroundMusicUrl: z.string(),
  panels: z.array(
    z.object({
      content: z.string(),
      imageUrl: z.string(),
      audioUrl: z.string(),
      isEndPanel: z.boolean(),
      languageCode: z.string(),
      panelNumber: z.number(),
    })
  ),
  tags: z.object({
    tagNames: z.array(z.string()),
  }),
  meta: z.object({
    isPublished: z.boolean(),
    isCommunity: z.boolean(),
    isFeatured: z.boolean(),
  }),
});

export const subscriptionSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  type: z.string().min(1),
  durationDays: z.number().min(1),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});
