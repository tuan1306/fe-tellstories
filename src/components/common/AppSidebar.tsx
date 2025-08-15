"use client";
import {
  AlertTriangle,
  BookOpen,
  ChevronUp,
  CircleDollarSign,
  LayoutDashboard,
  // LucideMessageSquareText,
  PenBoxIcon,
  // Receipt,
  Scroll,
  Settings,
  Sparkles,
  SwatchBook,
  User2,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

// Voodoo magic idk
// So for all of the classes that's associated
const cn = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const items = [
  {
    title: "Dashboard",
    url: "/owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý người dùng",
    url: "/owner/usermanagement",
    icon: Users,
  },
  {
    title: "Quản lý điểm",
    url: "/owner/sparks",
    icon: Sparkles,
  },
  {
    title: "Quản lý gói",
    url: "/owner/subscription",
    icon: CircleDollarSign,
  },
  // {
  //   title: "Billing History",
  //   url: "/owner/billing",
  //   icon: Receipt,
  // },
  {
    title: "Quản lý báo cáo",
    url: "/owner/issue-management",
    icon: AlertTriangle,
  },
  {
    title: "Viết truyện",
    url: "/owner/write-story",
    icon: PenBoxIcon,
  },
  {
    title: "Quản lý truyện",
    url: "/owner/stories",
    icon: BookOpen,
  },
  {
    title: "Nhân sự",
    url: "/owner/staff-log",
    icon: Scroll,
  },
];

const AppSidebar = () => {
  // Highlight the tab that is active.
  const pathname = usePathname();

  return (
    <Sidebar
      className="text-white font-semibold border-r border-gray-700 transition-all ease-in-out duration-300"
      collapsible="icon"
    >
      <SidebarHeader className="h-12 bg-[#1A293F] border-b border-gray-700 transition-all duration-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-[#102134] hover:text-[#896F3D] transition-all duration-200"
            >
              <Link href="/">
                <SwatchBook />
                <span>TellStories</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-[#0D1A2C] transition-all duration-200">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#9c9c9c]">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "hover:bg-[#102134] hover:text-[#896F3D] transition-all duration-200",
                      pathname === item.url && "bg-[#102134] text-[#896F3D]"
                    )}
                  >
                    <a href={item.url}>
                      <item.icon className="transition-all duration-200" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#1A293F] border-t border-gray-700 transition-all duration-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="group cursor-pointer hover:bg-[#102134] hover:text-[#896F3D] flex items-center justify-between w-full transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/Avatar2.png"
                      alt="User avatar"
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                    <span>Super Admin</span>
                  </div>
                  <ChevronUp className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                sideOffset={20}
                align="start"
                className="w-[var(--radix-popper-anchor-width)] text-white px-2 py-2 rounded-md text-[15px] space-y-1 transition-all duration-300"
              >
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#102134] hover:text-[#896F3D] transition-all duration-200">
                  <User2 className="w-4 h-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#102134] hover:text-[#896F3D] transition-all duration-200">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
