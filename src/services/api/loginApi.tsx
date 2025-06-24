"use server";

import { z } from "zod";
import { logInSchema } from "@/utils/validators/schemas";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

type RawJwtPayload = {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
};

export async function logIn(unsafeData: z.infer<typeof logInSchema>) {
  try {
    const cookieStore = await cookies();

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

    const responseJson = await res.json();
    if (!res.ok) {
      const errorMessage =
        typeof responseJson.message === "string"
          ? responseJson.message
          : "Login failed";
      throw new Error(errorMessage);
    }

    const token = responseJson.data;
    if (!token || typeof token !== "string") {
      throw new Error("Auth token missing");
    }

    const decoded = jwtDecode<RawJwtPayload>(token);
    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log("User role:", role);

    if (role !== "Admin") throw new Error("Unauthorized role");

    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  } catch (err) {
    console.error("Something wrong on the login API: ", err);
    throw err;
  }
}
