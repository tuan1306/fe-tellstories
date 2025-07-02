"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-label";
import { Loader2Icon, SwatchBook } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ImageSwiper from "@/components/misc/imageswiper/ImageSwiper";
import { logInSchema } from "@/utils/validators/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";

// This login form does not use react hook form (will update later!!!! ＼(º □ º l|l)/)

export default function Login() {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      const validated = logInSchema.parse({ email, password });

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const error = await res.json();
        setErr(error.message || "Login failed");
        return;
      }
    } catch (err) {
      setErr(
        err instanceof Error ? "Unauthorized Account" : "Something went wrong"
      );
    } finally {
      setLoading(false);
      router.push("/owner/dashboard");
    }
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-l from-[#102134] from-[60%] to-[#2F629A] to-[100%]">
      {/* funny layered circles */}
      <div className="absolute top-0 right-0 z-0">
        <div className="absolute top-[-110px] right-[-110px] w-[280px] h-[280px] rounded-full bg-[#1A293F] rotate-45 shadow-2xl/40" />
        <div className="absolute top-[-130px] right-[-130px] w-[280px] h-[280px] rounded-full bg-[#293E5C] rotate-45 shadow-xl/20" />
        <div className="absolute top-[-150px] right-[-150px] w-[280px] h-[280px] rounded-full bg-[#475F81] rotate-45 shadow-md/10" />
      </div>

      {/* Image slider */}
      <div className="h-screen flex bg-gradient-to-l from-[#102134] from-[60%] to-[#2F629A] to-[100%]">
        <div className="w-1/2 h-screen bg-slate-disable flex justify-center items-center">
          <div className="w-[90%] h-[95%] flex relative shadow-[-10px_12px_13px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 z-0 rounded-[18px] overflow-hidden">
              <ImageSwiper />
            </div>
            <div className="absolute top-6 left-6 text-white flex gap-2">
              <SwatchBook className="drop-shadow-lg/80" />
              <p className="text-xl font-bold text-shadow-lg/80">
                StoryTeller Inc
              </p>
            </div>
            <div className="absolute bottom-5 left-0 right-0 text-white flex justify-center items-center">
              <p className="text-4xl text-shadow-lg/80 text-center tracking-wide pb-8">
                Make stories
                <br />
                Change life
              </p>
            </div>
          </div>
        </div>

        {/* The login part */}
        <div className="w-1/2 h-screen bg-slate-disable flex justify-center items-center text-white">
          <div className="flex justify-center items-center flex-col gap-10">
            <h1 className="text-5xl font-semibold text-shadow-[7px_6px_5px_rgba(0,0,0,0.6)] tracking-wider">
              Log in
            </h1>
            {/* I can use Zod but I'm not sure whether using it on login is good @@ */}
            <form
              className="flex flex-col items-center gap-5 w-100"
              id="login"
              onSubmit={handleSubmit}
            >
              <div className="w-full">
                <Label htmlFor="email" className="text-[14px] font-normal ml-3">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  className="bg-[#060D14] border-none w-full h-15 shadow-xl/35"
                />
              </div>

              <div className="w-full">
                <Label
                  htmlFor="password"
                  className="text-[14px] font-normal ml-3"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  className="bg-[#060D14] border-none w-full h-15 shadow-xl/35"
                />
              </div>

              {/* Checkbox & link */}
              <div className="flex justify-between items-center w-full px-5 text-sm">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="rememberme"
                    className="h-4 w-4 bg-gray-700 data-[state=checked]:bg-white data-[state=checked]:text-black cursor-pointer"
                  />
                  <Label htmlFor="rememberme" className="text-sm">
                    Remember me?
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="hover:underline cursor-pointer underline-offset-3"
                >
                  Forgot password?
                </Link>
              </div>

              {err && (
                <p className="text-red-500 flex w-full justify-center-safe -mb-5">
                  {err}
                </p>
              )}

              <Button
                className="w-55 h-18 mt-5 bg-[#395B8C] text-xl font-semibold shadow-[1px_8px_7px_rgba(0,0,0,0.5)] hover:cursor-pointer"
                type="submit"
                disabled={loading}
              >
                {loading && <Loader2Icon className="animate-spin" />}
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
