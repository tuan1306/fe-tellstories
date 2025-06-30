"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Loader2Icon, SwatchBook } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageSwiper from "@/components/misc/imageswiper/ImageSwiper";
import { logInSchema } from "@/utils/validators/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

      const res = await fetch("/api/login", {
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

        {/* The forgotpass part */}
        <div className="w-1/2 h-screen bg-slate-disable flex justify-center items-center text-white">
          <div className="flex justify-center items-center flex-col gap-10">
            <Card className="w-[550px] h-[250px] p-5 shadow-2xl bg-[#1A293F] border-none text-white">
              <CardHeader className="">
                <CardTitle>Forgot password</CardTitle>
                <CardDescription>
                  Please enter the email address you would like to reset.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>
                  </div>
                </form>
                {err && (
                  <p className="text-red-500 flex w-full justify-center-safe -mb-5">
                    {err}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  className=" w-full hover:cursor-pointer hover:bg-[#7b9bcb]"
                  type="submit"
                  disabled={loading}
                >
                  {loading && <Loader2Icon className="animate-spin" />}
                  Request Email
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
