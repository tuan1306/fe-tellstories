import { z } from "zod";

// The password field may change
export const logInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional().default(false),
});

// May change based on business
export const addUserSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  displayName: z
    .string()
    .min(1, { message: "Tên hiển thị không được để trống" }),
  avatarUrl: z.string().optional(),
  userType: z.enum(["Admin", "Moderator", "User"]).optional(),
  status: z.enum(["Active", "Suspended", "Banned"]).optional(),
  phoneNumber: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
    .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
      message: "Mật khẩu phải chứa ít nhất 1 số và 1 ký tự đặc biệt",
    }),
  dob: z.date(),
});

export const editUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1),
  avatarUrl: z.string().optional(),
  userType: z.enum(["Admin", "Moderator", "User"]).optional(),
  status: z.enum(["Active", "Suspended", "Banned"]).optional(),
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
  name: z.string().min(1, { message: "Tên gói không được để trống" }),
  price: z
    .number({
      required_error: "Giá tiền là bắt buộc",
      invalid_type_error: "Giá phải là số",
    })
    .min(0, { message: "Giá phải lớn hơn hoặc bằng 0" }),
  pointsCost: z
    .number({
      required_error: "Số điểm là bắt buộc",
      invalid_type_error: "Số điểm phải là số",
    })
    .min(0, { message: "Số điểm phải lớn hơn hoặc bằng 0" }),
  type: z.string().optional(),
  rewardPoints: z
    .number({ invalid_type_error: "Số điểm thưởng phải là số" })
    .min(0, { message: "Số điểm thưởng phải lớn hơn hoặc bằng 0" })
    .optional(),
  durationDays: z
    .number({ invalid_type_error: "Số ngày phải là số" })
    .min(1, { message: "Số ngày phải lớn hơn hoặc bằng 1" }),
  isActive: z.boolean(),
  purchaseMethod: z
    .string()
    .min(1, { message: "Phương thức mua hàng không được để trống" }),
  isDefault: z.boolean(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Mật khẩu hiện tại không được để trống" }),
    newPassword: z
      .string()
      .min(8, { message: "Mật khẩu mới phải có ít nhất 8 ký tự" })
      .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
        message: "Mật khẩu mới phải chứa ít nhất 1 số và 1 ký tự đặc biệt",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu mới" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, { message: "Tên hiển thị không được để trống" }),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().optional(),
  avatarUrl: z.string().optional(),
  dob: z.string().optional(),
  status: z.string().optional(),
});
