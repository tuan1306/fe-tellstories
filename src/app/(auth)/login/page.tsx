"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-label";
import { HelpCircle, Loader2Icon, SwatchBook } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ImageSwiper from "@/components/misc/imageswiper/ImageSwiper";
import { logInSchema } from "@/utils/validators/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Login() {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");

    const form = e.currentTarget;
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value.trim();

    if (!email || !password) {
      setErr("Vui lòng nhập cả email và mật khẩu");
      return;
    }

    setLoading(true);

    try {
      const validated = logInSchema.parse({ email, password });

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validated,
          rememberMe,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setErr(error.message || "Đăng nhập thất bại");
        return;
      }
      router.push("/owner/dashboard");
    } catch (err) {
      setErr(
        err instanceof Error
          ? "Tài khoản hoặc mật khẩu không chính xác"
          : "Đã xảy ra lỗi"
      );
    } finally {
      setLoading(false);
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
                TellStories Inc
              </p>
            </div>
            <div className="absolute bottom-5 left-0 right-0 text-white flex justify-center items-center">
              <p className="text-4xl font-semibold text-shadow-lg/80 text-center tracking-wide pb-12">
                Kể câu chuyện của bạn
                <br />
                Chạm đến trái tim mọi người
              </p>
            </div>
          </div>
        </div>

        {/* The login part */}
        <div className="w-1/2 h-screen bg-slate-disable flex justify-center items-center text-white">
          <div className="flex justify-center items-center flex-col gap-10">
            <h1 className="text-5xl font-semibold text-shadow-[7px_6px_5px_rgba(0,0,0,0.6)] tracking-wider">
              Đăng nhập
            </h1>
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
                  placeholder="Nhập email"
                  className="bg-[#060D14] border-none w-full h-15 shadow-xl/35"
                />
              </div>

              <div className="w-full">
                <Label
                  htmlFor="password"
                  className="text-[14px] font-normal ml-3"
                >
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Nhập mật khẩu"
                  className="bg-[#060D14] border-none w-full h-15 shadow-xl/35"
                />
              </div>

              {/* Checkbox & link */}
              <div className="flex justify-between items-center w-full px-5 text-sm">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />
                  <Label htmlFor="remember">Ghi nhớ đăng nhập</Label>

                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="text-sm max-w-xs">
                      Nếu đánh dấu thì không cần đăng nhập lại trong vòng 30
                      ngày.
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Link
                  href="/forgot-password"
                  className="hover:underline cursor-pointer underline-offset-3"
                >
                  Quên mật khẩu?
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
                Đăng nhập
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
