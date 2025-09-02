// import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";
import Clock from "../misc/clock/clock";

const Navbar = () => {
  return (
    <nav className="sticky top-0 h-12 px-5 flex items-center justify-between text-white border-b border-gray-700 bg-[#1A293F] z-50">
      {/* Left */}
      <SidebarTrigger className="hover:text-[#896F3D] hover:bg-[#102134] p-4 transition-all duration-200 cursor-pointer" />
      {/* Right */}
      <div className="flex items-center justify-between sticky top-0 gap-6 font-semibold">
        {/* <Link href="/"></Link>
        <div className="h-5 w-px bg-gray-500" /> */}
        <Clock />
      </div>
    </nav>
  );
};

export default Navbar;
