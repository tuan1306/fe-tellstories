"use client";

import { ActivityLog } from "@/app/types/activitylog";
import { UserPublish } from "@/app/types/story";
import { UserDetails } from "@/app/types/user";
import { EditUserSheet } from "@/components/EditUserSheet";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet } from "@/components/ui/sheet";
import { BadgeCheck, CalendarIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import UserRecentPublishCardList from "@/components/UserRecentPublishCardList";
import UserTopHitCardList from "@/components/UserTopHitCardList";

export default function UserPage() {
  // General
  const [loading, setLoading] = useState(false);

  // User centric
  const { id } = useParams();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [stories, setStories] = useState<UserPublish[]>([]);

  // Activity
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [activityLoading, setActivityLoading] = useState(false);

  async function fetchUserById(id: string): Promise<UserDetails | null> {
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to fetch user:", err.message);
        return null;
      }
      const json = await res.json();
      return json.data as UserDetails;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  // Today user activity log load.
  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetchUserActivity(user.id, new Date()).finally(() => setLoading(false));
    }
  }, [user?.id]);

  async function fetchUserActivity(userId: string, date: Date) {
    setActivityLoading(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");

      const res = await fetch(
        `/api/activitylog/${userId}?getByDateFrom=${formattedDate}&getByDateTo=${formattedDate}&page=1&pageSize=10`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user activity");
      }

      const data = await res.json();
      setActivity(data?.data?.items || []);
    } catch (error) {
      console.error("Failed to fetch activity logs", error);
    } finally {
      setActivityLoading(false);
    }
  }

  async function fetchPublishedStories(userId: string) {
    try {
      const res = await fetch(`/api/stories/user/published/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch stories");
      const json = await res.json();
      setStories(json.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (typeof id === "string") {
      setLoading(true);
      Promise.all([
        fetchUserById(id).then(setUser),
        fetchUserActivity(id, new Date()),
        fetchPublishedStories(id),
      ]).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12 text-muted-foreground" />
      </div>
    );

  if (!user) return <div>Người dùng không tồn tại</div>;

  return (
    <div className="mt-4 flex flex-col xl:flex-row gap-8">
      {/* LEFT */}
      <div className="w-full xl:w-1/3 space-y-6">
        {/* User Info */}
        <div className="bg-primary-foreground p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="w-1/2">
              <h1 className="text-xl font-semibold">Thông tin cơ bản</h1>
              <h1 className="text-sm font-semibold text-muted-foreground">
                Thông tin của người dùng
              </h1>
            </div>
            <Sheet>
              <EditUserSheet
                user={user}
                onSuccess={() => fetchUserById(id as string).then(setUser)}
              >
                <Button className="cursor-pointer">Chỉnh sửa</Button>
              </EditUserSheet>
            </Sheet>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">ID:</span>
              <span>{user.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Email:</span>
              <span>{user.email}</span>
              <HoverCard>
                <HoverCardTrigger>
                  <BadgeCheck
                    size={24}
                    className="rounded-full bg-green-500/30 border border-green-500/50 p-1"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Người dùng đã xác thực</h1>
                  <p className="text-sm text-muted-foreground">
                    Người dùng này đã xác thực email.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Số điện thoại:</span>
              <span>{user.phoneNumber || "Không có"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Ngày sinh:</span>
              <span>{user.dob?.slice(0, 10)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Vai trò:</span>
              <Badge
                className={
                  user.userType === "Admin"
                    ? "bg-[#deac4a] text-white"
                    : user.userType === "User"
                    ? "bg-[#2F629A] text-white"
                    : "bg-[#F46A00] text-white"
                }
              >
                {user.userType === "Admin"
                  ? "Quản trị viên"
                  : user.userType === "User"
                  ? "Người dùng"
                  : "Người kiểm duyệt"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Trạng thái:</span>
              <Badge
                className={
                  user.status === "Active"
                    ? "bg-green-500 text-white"
                    : user.status === "Suspended"
                    ? "bg-yellow-500 text-white"
                    : "bg-[#e06976] text-white"
                }
              >
                {user.status === "Active"
                  ? "Hoạt động"
                  : user.status === "Suspended"
                  ? "Tạm khóa"
                  : user.status === "Banned"
                  ? "Bị cấm"
                  : "Không rõ"}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Tham gia từ {user.createdDate?.slice(0, 10)}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Cập nhật lần cuối {user.updatedDate?.slice(0, 10)}
          </p>
        </div>

        {/* List */}
        <div className="bg-primary-foreground p-4 rounded-lg">
          <UserRecentPublishCardList
            title="Truyện mới nhất"
            desc="Danh sách truyện mới nhất người dùng đã đăng"
            userId={user.id}
          />
        </div>
        <div className="bg-primary-foreground p-4 mb-5 rounded-lg">
          <UserTopHitCardList
            title="Truyện nổi bật"
            desc="Danh sách truyện được xem nhiều nhất của người dùng"
            userId={user.id}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-2/3 space-y-6">
        <div className="bg-primary-foreground p-4 rounded-lg space-y-2">
          <div className="flex items-start gap-4">
            {/* <Avatar className="size-50 rounded-xl">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt="User Avatar" />
              ) : (
                <AvatarFallback>
                  {user.displayName?.slice(0, 2).toUpperCase() || "NA"}
                </AvatarFallback>
              )}
            </Avatar> */}
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                className="size-50 rounded-xl"
                width={100}
                height={100}
                alt="Avatar"
              ></Image>
            ) : (
              <Image
                src="/fallback.jpg"
                className="size-50 rounded-xl"
                width={100}
                height={100}
                alt="Avatar"
              ></Image>
            )}

            <div className="flex flex-col">
              <h1 className="text-4xl mb-3 font-semibold">
                {user.displayName}
              </h1>
              {/* <p className="text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse porttitor justo neque, non semper odio lobortis sed.
              </p> */}
            </div>
          </div>
        </div>

        {/* User activity */}
        <div className="bg-primary-foreground p-4 rounded-lg">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Hoạt động người dùng</h1>
              <h1 className="text-sm font-semibold text-muted-foreground">
                Ghi lại các hoạt động gần đây của người dùng trên nền tảng
              </h1>
            </div>

            {/* Calendar button on far right */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                  disabled={activityLoading}
                >
                  {activityLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CalendarIcon className="h-4 w-4" />
                  )}
                  {selectedDate
                    ? selectedDate.toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "Chọn ngày"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0 w-auto" align="end" sideOffset={4}>
                <div className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    defaultMonth={new Date()}
                    disabled={(date) => date > new Date()}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        fetchUserActivity(user.id, date);
                      }
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Activity list */}
          <div className="bg-card mt-4 p-5 rounded-lg">
            <ScrollArea className="h-[170px] space-y-2 pr-4">
              {activityLoading ? (
                <div className="h-[170px] flex items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
              ) : activity.length === 0 ? (
                <div className="h-[170px] flex items-center justify-center text-muted-foreground">
                  Không có hoạt động trong ngày này.
                </div>
              ) : (
                activity.map((log) => (
                  <div key={log.id} className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        log.action === "Hệ Thống"
                          ? "bg-red-500"
                          : log.action === "Xuất Bản Truyện"
                          ? "bg-green-500"
                          : log.action === "Bình Luận"
                          ? "bg-yellow-500"
                          : log.action === "Đánh Giá"
                          ? "bg-yellow-600"
                          : log.action === "Xem Truyện"
                          ? "bg-purple-500"
                          : log.action === "Báo Cáo"
                          ? "bg-orange-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="pl-3 truncate max-w-full">
                      {log.details}
                    </span>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Funny User publishes */}
        <div className="bg-primary-foreground p-4 rounded-lg">
          <h1 className="text-xl font-semibold">Truyện người dùng</h1>
          <h1 className="text-sm font-semibold text-muted-foreground">
            Ghi lại các truyện người dùng đã đăng trên nền tảng
          </h1>
          <div className="mt-4">
            <div className="bg-card mt-4 p-5 rounded-lg">
              <ScrollArea className="w-full h-[405px]">
                {stories.length === 0 ? (
                  <div className="h-[405px] flex items-center justify-center text-muted-foreground">
                    Người dùng này chưa đăng truyện nào.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4">
                    {stories.map((story) => (
                      <Link
                        href={`/owner/stories/${story.id}`}
                        key={story.id}
                        className="space-y-2 block hover:opacity-80 transition"
                      >
                        <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-muted flex items-center justify-center">
                          {story.coverImageUrl?.startsWith("http") ? (
                            <Image
                              src={story.coverImageUrl}
                              alt={story.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-muted-foreground text-sm font-medium">
                              Không có ảnh bìa
                            </span>
                          )}
                        </div>
                        <h1 className="text-sm font-semibold text-muted-foreground">
                          {story.author}
                        </h1>
                        <h1 className="text-xl font-semibold truncate">
                          {story.title}
                        </h1>
                      </Link>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
