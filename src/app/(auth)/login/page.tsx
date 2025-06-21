import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-label";
import { SwatchBook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-l from-[#102134] from-[60%] to-[#2F629A] to-[100%]">
      <div className="absolute top-0 right-0 z-0">
        <div className="absolute top-[-110px] right-[-110px] w-[280px] h-[280px] rounded-full bg-[#1A293F] rotate-45 shadow-2xl/40" />
        <div className="absolute top-[-130px] right-[-130px] w-[280px] h-[280px] rounded-full bg-[#293E5C] rotate-45 shadow-xl/20" />
        <div className="absolute top-[-150px] right-[-150px] w-[280px] h-[280px] rounded-full bg-[#475F81] rotate-45 shadow-md/10" />
      </div>

      <div className="h-screen flex bg-gradient-to-l from-[#102134] from-[60%] to-[#2F629A] to-[100%]">
        <div className="w-1/2 h-screen bg-slate-disable flex justify-center items-center">
          <div className="w-[90%] h-[95%] bg-slate-200 flex rounded-[18px] relative overflow-hidden shadow-[-10px_12px_13px_rgba(0,0,0,0.3)]">
            <Image
              src="https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg"
              alt="Placeholder"
              fill={true}
              className="object-cover"
            />

            <div className="absolute top-6 left-6 text-white flex gap-2">
              <SwatchBook className="drop-shadow-lg/80" />
              <p className="text-xl font-bold text-shadow-lg/80">
                StoryTeller Inc
              </p>
            </div>
            <div className="absolute bottom-5 left-0 right-0 text-white flex justify-center items-center">
              <p className="text-3xl text-shadow-lg/80 text-center tracking-wide">
                Make stories
                <br />
                Change life
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-screen bg-slate-disable flex justify-center items-center flex-col gap-10">
          <h1 className="text-5xl font-semibold text-white text-shadow-[7px_6px_5px_rgba(0,0,0,0.6)] tracking-wider">
            Log In
          </h1>
          {/* I can use Zod but I'm not sure whether using it on login is good @@ */}
          <form className="flex flex-col gap-5">
            <div>
              <Label
                htmlFor="email"
                className="text-white text-[16px] font-normal ml-3"
              >
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder=""
                className="bg-[#060D14] border-none w-100 h-15 shadow-xl/35 text-white hover:cursor-pointer"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-white text-[16px] font-normal ml-3"
              >
                Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder=""
                className="bg-[#060D14] border-none w-100 h-15 shadow-xl/35"
              ></Input>
            </div>
          </form>
          <div className="flex justify-between items-center w-[70%] px-20 -mt-6 text-white text-sm">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberme"
                className="h-4 w-4 bg-gray-700 data-[state=checked]:bg-white data-[state=checked]:text-black"
              />
              <Label htmlFor="rememberme" className="text-sm">
                Remember me?
              </Label>
            </div>

            <Link
              href={"/recoverpassword"}
              className="hover:underline cursor-pointer underline-offset-3"
            >
              Forgot password?
            </Link>
          </div>
          <Button className="w-55 h-18 bg-[#395B8C] shadow-[1px_8px_7px_rgba(0,0,0,0.5)]">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
