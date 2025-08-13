"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  KeyRound,
  Loader2Icon,
  MailOpen,
  SquareAsterisk,
  SwatchBook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageSwiper from "@/components/misc/imageswiper/ImageSwiper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();

  // Cooldown (60s)
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleResendCode() {
    setErr("");
    setResendLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const error = await res.json();
        setErr(error.message || "Gửi lại mã thất bại.");
      } else {
        setCooldown(60);
      }
    } catch {
      setErr("Có lỗi xảy ra khi gửi lại mã.");
    } finally {
      setResendLoading(false);
    }
  }

  // The auto-submit OTP after mail & OTP are filled.
  useEffect(() => {
    if (otp.length === 6) {
      const verifyToken = async () => {
        setLoading(true);
        setErr("");

        try {
          const res = await fetch("/api/auth/verify-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Email: email,
              Token: otp,
              Purpose: "ResetPassword",
            }),
          });

          if (!res.ok) {
            const error = await res.json();
            setErr(error.message || "Mã OTP không hợp lệ.");
            setOtpVerified(false);
            return;
          }

          setOtpVerified(true);
        } catch {
          setErr("Xác thực thất bại. Vui lòng thử lại.");
        } finally {
          setLoading(false);
        }
      };
      verifyToken();
    }
  }, [otp, email]);

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: email,
          Token: otp,
          Purpose: "ResetPassword",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setErr(error.message || "Mã OTP không hợp lệ.");
        setOtpVerified(false);
        return;
      }

      setOtpVerified(true);
    } catch {
      setErr("Xác thực thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token: otp,
          newPassword,
          confirmNewPassword: confirmPassword,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setErr(error.message || "Đặt lại mật khẩu thất bại");
        return;
      }

      router.push("/login");
    } catch {
      setErr("Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setShowOtp(true);
    } catch {
      setShowOtp(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-l from-[#102134] from-[60%] to-[#2F629A] to-[100%]">
      {/* Background Circles */}
      <div className="absolute top-0 right-0 z-0">
        <div className="absolute top-[-110px] right-[-110px] w-[280px] h-[280px] rounded-full bg-[#1A293F] rotate-45 shadow-2xl/40" />
        <div className="absolute top-[-130px] right-[-130px] w-[280px] h-[280px] rounded-full bg-[#293E5C] rotate-45 shadow-xl/20" />
        <div className="absolute top-[-150px] right-[-150px] w-[280px] h-[280px] rounded-full bg-[#475F81] rotate-45 shadow-md/10" />
      </div>

      {/* Image Slider */}
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
                Tạo nên câu chuyện
                <br />
                Thay đổi cuộc sống
              </p>
            </div>
          </div>
        </div>

        {/* Forgot Password Form */}
        <div className="w-1/2 h-screen bg-slate-disable flex justify-center items-center text-white">
          <div className="flex justify-center items-center flex-col gap-10">
            <form
              onSubmit={
                !showOtp
                  ? handleForgotPassword
                  : !otpVerified
                  ? handleVerifyOtp
                  : handleResetPassword
              }
            >
              <Card className="w-[550px] p-5 shadow-2xl bg-[#1A293F] border-none text-white">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-xl border-2 border-gray-600 shadow-md bg-white">
                    {otpVerified ? (
                      <SquareAsterisk className="w-6 h-6 text-primary" />
                    ) : showOtp ? (
                      <MailOpen className="w-6 h-6 text-primary" />
                    ) : (
                      <KeyRound className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <CardTitle className="text-xl">
                    {otpVerified
                      ? "Đặt lại mật khẩu"
                      : showOtp
                      ? "Nhập mã OTP"
                      : "Quên mật khẩu"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {otpVerified
                      ? "Nhập mật khẩu mới bên dưới."
                      : showOtp
                      ? "Vui lòng nhập mã OTP được gửi đến email của bạn."
                      : "Vui lòng nhập email để nhận mã đặt lại mật khẩu."}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {!showOtp && !otpVerified && (
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Nhập email ở đây..."
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  )}

                  {showOtp && !otpVerified && (
                    <div className="grid gap-2 justify-center items-center text-center mb-4">
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            className="w-10 h-16 text-xl rounded-lg border"
                            index={0}
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            className="w-10 h-16 text-xl rounded-lg border"
                            index={1}
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            className="w-10 h-16 text-xl rounded-lg border"
                            index={2}
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            className="w-10 h-16 text-xl rounded-lg border"
                            index={3}
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            className="w-10 h-16 text-xl rounded-lg border"
                            index={4}
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            className="w-10 h-16 text-xl rounded-lg border"
                            index={5}
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  )}

                  {otpVerified && (
                    <>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="newPassword">Mật khẩu mới</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="confirmPassword">
                            Xác nhận mật khẩu
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {showOtp && !otpVerified && (
                    <div className="text-right flex justify-end items-center gap-2">
                      {cooldown > 0 && (
                        <span className="text-gray-300 text-sm">
                          {cooldown}s
                        </span>
                      )}

                      {/* Separator */}
                      {cooldown > 0 && <span className="text-gray-600">|</span>}

                      <Link
                        href="#"
                        className={`text-white hover:underline text-sm ${
                          cooldown > 0 ? "pointer-events-none opacity-30" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (cooldown === 0) handleResendCode();
                        }}
                      >
                        {resendLoading ? "Đang gửi lại..." : "Gửi lại mã"}
                      </Link>
                    </div>
                  )}

                  {err && (
                    <p className="text-red-500 text-sm text-center">{err}</p>
                  )}
                </CardContent>

                <CardFooter className="flex-col gap-2">
                  <Button
                    className="w-full bg-[#395B8C] cursor-pointer"
                    type="submit"
                    disabled={loading}
                  >
                    {loading && <Loader2Icon className="animate-spin mr-2" />}
                    {otpVerified
                      ? "Đặt lại mật khẩu"
                      : showOtp
                      ? "Xác nhận OTP"
                      : "Gửi mã OTP"}
                  </Button>

                  {!otpVerified && (
                    <Button
                      className="w-full bg-[#FFFFFF] text-black hover:bg-gray-400 cursor-pointer"
                      type="button"
                      onClick={() => {
                        if (showOtp) {
                          setShowOtp(false);
                        } else {
                          router.push("/login");
                        }
                      }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {"Quay lại"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
