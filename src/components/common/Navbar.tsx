import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";

const Navbar = () => {
  return (
    <nav className="p-4 flex items-center justify-between text-white">
      {/* Left */}
      <SidebarTrigger className="transition-transform ease-in duration-200" />{" "}
      {/* Right */}
      <div className="flex items-center gap-4">
        <Link href="/">Dashboard link</Link>
      </div>
    </nav>
  );
};

export default Navbar;
