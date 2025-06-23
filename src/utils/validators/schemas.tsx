import { z } from "zod";

// The password field may change
export const logInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
