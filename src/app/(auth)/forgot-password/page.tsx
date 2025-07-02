"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Loader2Icon, SwatchBook } from "lucide-react";
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
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

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
              email,
              token: otp,
              purpose: "ResetPassword",
            }),
          });

          if (!res.ok) {
            const error = await res.json();
            setErr(error.message || "Invalid token.");
            return;
          }

          setOtpVerified(true);
        } catch {
          setErr("Verification failed. Try again.");
        } finally {
          setLoading(false);
        }
      };
      verifyToken();
    }
  }, [otp, email]);

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
        setErr(error.message || "Reset failed");
        return;
      }

      router.push("/login");
    } catch {
      setErr("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const error = await res.json();
        setErr(error.message || "Request failed");
        return;
      }

      setShowOtp(true);
    } catch {
      setErr("Something went wrong. Please try again.");
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
                Make stories
                <br />
                Change life
              </p>
            </div>
          </div>
        </div>

        {/* Forgot Password Form */}
        <div className="w-1/2 h-screen bg-slate-disable flex justify-center items-center text-white">
          <div className="flex justify-center items-center flex-col gap-10">
            <form onSubmit={otpVerified ? handleResetPassword : handleForm}>
              <Card className="w-[550px] p-5 shadow-2xl bg-[#1A293F] border-none text-white">
                <CardHeader>
                  <CardTitle>
                    {otpVerified ? "Reset password" : "Forgot password"}
                  </CardTitle>
                  <CardDescription>
                    {otpVerified
                      ? "Set your new password below."
                      : "Please enter your email to receive a reset code."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {!showOtp && !otpVerified && (
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  )}

                  {showOtp && !otpVerified && (
                    <div className="grid gap-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  )}

                  {otpVerified && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="newPassword">New Password</Label>
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
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {err && (
                    <p className="text-red-500 text-sm text-center">{err}</p>
                  )}
                </CardContent>

                <CardFooter className="flex-col gap-2">
                  <Button
                    className="w-full bg-[#395B8C]"
                    type="submit"
                    disabled={loading}
                  >
                    {loading && <Loader2Icon className="animate-spin mr-2" />}
                    {otpVerified ? "Reset Password" : "Request Email"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
