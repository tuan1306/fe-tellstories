"use client";
import {
  AlertTriangle,
  BookOpen,
  ChevronUp,
  CircleDollarSign,
  Cog,
  LayoutDashboard,
  // LucideMessageSquareText,
  PenBoxIcon,
  // Receipt,
  // Scroll,
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
import { useAuth } from "../../context/AuthContext";

// Voodoo magic idk
// So for all of the classes that's associated
const cn = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const ownerItems = [
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
    title: "Quản lý gói",
    url: "/owner/subscription",
    icon: CircleDollarSign,
  },
  {
    title: "Quản lý báo cáo",
    url: "/owner/issue-management",
    icon: AlertTriangle,
  },
  {
    title: "Quản lý truyện",
    url: "/owner/stories",
    icon: BookOpen,
  },
  {
    title: "Viết truyện",
    url: "/owner/write-story",
    icon: PenBoxIcon,
  },
  {
    title: "Danh sách giao dịch điểm",
    url: "/owner/point-management",
    icon: Sparkles,
  },
  {
    title: "Quản lý hệ thống",
    url: "/owner/system-config",
    icon: Cog,
  },
];

const moderatorItems = [
  {
    title: "Quản lý truyện",
    url: "/moderator/stories",
    icon: BookOpen,
  },
  {
    title: "Viết truyện",
    url: "/moderator/write-story",
    icon: PenBoxIcon,
  },
  {
    title: "Báo cáo",
    url: "/moderator/issue-management",
    icon: AlertTriangle,
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const { role, user } = useAuth();

  const items = role === "Admin" ? ownerItems : moderatorItems;

  return (
    <Sidebar
      className="text-white font-semibold border-r border-gray-700 transition-all ease-in-out duration-300"
      collapsible="icon"
    >
      {/* Header */}
      <SidebarHeader className="h-12 bg-[#1A293F] border-b border-gray-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <SwatchBook />
                <span>TellStories</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="bg-[#0D1A2C]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#9c9c9c]">
            Các tác vụ
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "hover:bg-[#102134] hover:text-[#896F3D]",
                      pathname === item.url && "bg-[#102134] text-[#896F3D]"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
                      src={user?.avatarUrl || "/fallback.jpg"}
                      alt="User avatar"
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                    <span>{user?.displayName}</span>
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
