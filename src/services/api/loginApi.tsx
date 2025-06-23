import { z } from "zod";
import { logInSchema } from "@/utils/validators/schemas";

export async function logIn(unsafeData: z.infer<typeof logInSchema>) {
  // Zod for checking the data format is correct
  const result = logInSchema.safeParse(unsafeData);
  if (!result.success) throw new Error("Invalid input");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.data),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Login failed");
  }

  const { data: token } = await res.json();
  if (!token) throw new Error("Token missing");
  localStorage.setItem("token", token);
}
