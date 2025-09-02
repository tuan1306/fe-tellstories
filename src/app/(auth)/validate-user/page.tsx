"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CheckCheck,
  Loader2Icon,
  MailOpen,
  ShieldCheck,
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

export default function ValidateAccountPage() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();

  // Cooldown for resend OTP
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleResendCode() {
    setErr("");
    setResendLoading(true);
    try {
      const res = await fetch("/api/auth/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const error = await res.json();
        setErr(error.message || "Không thể gửi lại mã.");
      } else {
        setCooldown(60);
      }
    } catch {
      setErr("Có lỗi xảy ra khi gửi lại mã.");
    } finally {
      setResendLoading(false);
    }
  }

  // Auto-verify OTP
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOtp();
    }
  }, [otp]);

  async function handleVerifyOtp(e?: React.FormEvent<HTMLFormElement>) {
    if (e) e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: email,
          Token: otp.toUpperCase(),
          Purpose: "EmailConfirmation",
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

  async function handleStartValidation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await fetch("/api/auth/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setShowOtp(true);
    } catch {
      setErr("Không thể bắt đầu xác thực tài khoản.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-l from-[#102134] from-[60%] to-[#2F629A] to-[100%]">
      {/* Background circles */}
      <div className="absolute top-0 right-0 z-0">
        <div className="absolute top-[-110px] right-[-110px] w-[280px] h-[280px] rounded-full bg-[#1A293F]" />
        <div className="absolute top-[-130px] right-[-130px] w-[280px] h-[280px] rounded-full bg-[#293E5C]" />
        <div className="absolute top-[-150px] right-[-150px] w-[280px] h-[280px] rounded-full bg-[#475F81]" />
      </div>

      <div className="h-screen flex">
        {/* Image side */}
        <div className="w-1/2 h-screen flex justify-center items-center">
          <div className="w-[90%] h-[95%] relative shadow-[-10px_12px_13px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 rounded-[18px] overflow-hidden">
              <ImageSwiper />
            </div>
            <div className="absolute top-6 left-6 text-white flex gap-2">
              <SwatchBook />
              <p className="text-xl font-bold">StoryTeller Inc</p>
            </div>
            <div className="absolute bottom-5 left-0 right-0 text-white text-center">
              <p className="text-4xl font-semibold tracking-wide pb-8">
                Xác thực tài khoản của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Validation form */}
        <div className="w-1/2 h-screen flex justify-center items-center text-white">
          <form
            onSubmit={
              !showOtp
                ? handleStartValidation
                : !otpVerified
                ? handleVerifyOtp
                : undefined
            }
          >
            <Card className="w-[550px] p-5 shadow-2xl bg-[#1A293F] border-none text-white">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="p-3 rounded-xl border-2 border-gray-600 bg-white">
                  {otpVerified ? (
                    <CheckCheck className="w-6 h-6 text-primary" />
                  ) : showOtp ? (
                    <MailOpen className="w-6 h-6 text-primary" />
                  ) : (
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  )}
                </div>
                <CardTitle className="text-xl">
                  {otpVerified
                    ? "Xác thực thành công"
                    : showOtp
                    ? "Xác minh OTP"
                    : "Xác thực tài khoản"}
                </CardTitle>
                <CardDescription className="text-base">
                  {otpVerified
                    ? "Tài khoản của bạn đã được xác thực. Bạn có thể đăng nhập ngay."
                    : showOtp
                    ? "Nhập mã OTP đã được gửi đến email của bạn."
                    : "Nhập email để bắt đầu xác thực tài khoản."}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {!showOtp && !otpVerified && (
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}

                {showOtp && !otpVerified && (
                  <div className="grid gap-2 justify-center text-center mb-4">
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      value={otp}
                      onChange={(value) => setOtp(value.toUpperCase())}
                    >
                      {[...Array(6)].map((_, i) => (
                        <InputOTPGroup key={i}>
                          <InputOTPSlot
                            index={i}
                            className="w-10 h-16 text-xl rounded-lg border uppercase"
                          />
                        </InputOTPGroup>
                      ))}
                    </InputOTP>
                  </div>
                )}

                {otpVerified && (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-center text-green-400 font-semibold">
                      Tài khoản đã được xác thực thành công!
                    </p>
                    <Button
                      className="w-full bg-[#395B8C] cursor-pointer"
                      type="button"
                      onClick={() => router.push("/login")}
                    >
                      Đi đến trang đăng nhập
                    </Button>
                  </div>
                )}

                {showOtp && !otpVerified && (
                  <div className="text-right flex justify-end gap-2">
                    {cooldown > 0 && (
                      <span className="text-gray-300 text-sm">{cooldown}s</span>
                    )}
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
                  <p className="text-red-500 text-sm text-center mt-5">{err}</p>
                )}
              </CardContent>

              <CardFooter className="flex-col gap-2">
                {!otpVerified && (
                  <Button
                    className="w-full bg-[#395B8C] cursor-pointer"
                    type="submit"
                    disabled={loading}
                  >
                    {loading && <Loader2Icon className="animate-spin mr-2" />}
                    {showOtp ? "Xác minh OTP" : "Gửi mã OTP"}
                  </Button>
                )}

                {!otpVerified && (
                  <Button
                    className="w-full bg-white text-black hover:bg-gray-400 cursor-pointer"
                    type="button"
                    onClick={() => {
                      if (showOtp) setShowOtp(false);
                      else router.push("/login");
                    }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                  </Button>
                )}
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
