"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RecentSubscriber, SubscriptionDetail } from "@/app/types/subscription";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return isNaN(d.getTime())
    ? "Invalid Date"
    : `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${d.getFullYear()}`;
};

export function RecentSubscribersList() {
  const [recentSubscribers, setRecentSubscribers] = useState<
    RecentSubscriber[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSub, setSelectedSub] = useState<RecentSubscriber | null>(null);
  const [subscriptionDetail, setSubscriptionDetail] =
    useState<SubscriptionDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Period filter
  const [period, setPeriod] = useState<"1" | "7" | "30">("1");

  const handleViewDetails = async (subscriber: RecentSubscriber) => {
    setSelectedSub(subscriber);
    setOpenDialog(true);
    setLoadingDetail(true);
    setSubscriptionDetail(null);

    try {
      const res = await fetch(`/api/subscription/user/${subscriber.user.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSubscriptionDetail(json.data as SubscriptionDetail);
      }
    } catch (error) {
      console.error("Failed to fetch subscription detail:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    async function fetchSubscribers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/subscription/recent-sub?period=${period}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        const json = await res.json();
        if (json.success && json.data) {
          setRecentSubscribers(json.data as RecentSubscriber[]);
        } else {
          setError("Failed to load recent subscribers.");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscribers();
  }, [period]);

  useEffect(() => {
    async function fetchSubscribers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/subscription/recent-sub");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        const json = await res.json();
        if (json.success && json.data) {
          setRecentSubscribers(json.data as RecentSubscriber[]);
        } else {
          setError("Failed to load recent subscribers.");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscribers();
  }, []);

  return (
    <div className="bg-card p-4 rounded-lg h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Người đăng ký gần đây</h3>
          <p className="text-sm text-muted-foreground">
            Danh sách những người dùng vừa đăng ký dịch vụ theo khung thời gian
            được chọn
          </p>
        </div>

        <div>
          <Select
            value={period}
            onValueChange={(val) => setPeriod(val as "1" | "7" | "30")}
          >
            <SelectTrigger className="text-sm h-8 w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Hôm nay</SelectItem>
              <SelectItem value="7">Tuần này</SelectItem>
              <SelectItem value="30">Tháng trước</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-40 pr-6">
        <ul className="text-sm text-muted-foreground space-y-2 h-full">
          {loading ? (
            <li className="mt-18 flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-2" />
            </li>
          ) : error ? (
            <li className="mt-18 flex flex-col items-center justify-center h-full text-muted-foreground">
              <AlertTriangle className="w-10 h-10 mb-2" />
              <span>{error}</span>
            </li>
          ) : recentSubscribers.length > 0 ? (
            recentSubscribers.map((recentSub, i) => (
              <li
                key={i}
                className="flex items-center justify-between px-4 py-2 rounded-md shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Link
                    href={`usermanagement/users/${recentSub.user.id}`}
                    className="flex items-center gap-3 hover:opacity-80 transition"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={recentSub.user.avatarUrl} />
                      <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                        {recentSub.user.displayName
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link
                      href={`usermanagement/users/${recentSub.user.id}`}
                      className="flex items-center gap-3 hover:opacity-80 transition"
                    >
                      <p className="font-medium text-white">
                        {recentSub.user.displayName}
                      </p>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {recentSub.subscriptionName} Plan
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 cursor-pointer"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(recentSub)}
                      className="cursor-pointer"
                    >
                      Xem thông tin gói mới mua
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))
          ) : (
            <li className="flex flex-col mt-18 items-center justify-center h-full text-muted-foreground">
              <span>Không có thông tin được người đăng ký gần đây</span>
            </li>
          )}
        </ul>
      </ScrollArea>

      {/* details */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="pt-6 overflow-hidden">
          <div className="absolute top-0 right-0 z-0">
            <div className="absolute -top-[140px] -right-[140px] w-[280px] h-[280px] rounded-full bg-[#1A293F] rotate-45 shadow-2xl/40" />
            <div className="absolute -top-[160px] -right-[160px] w-[280px] h-[280px] rounded-full bg-[#293E5C] rotate-45 shadow-xl/20" />
            <div className="absolute -top-[180px] -right-[180px] w-[280px] h-[280px] rounded-full bg-[#475F81] rotate-45 shadow-md/10" />
          </div>

          <DialogHeader className="z-10">
            <DialogTitle>Thông tin gói mới mua</DialogTitle>
          </DialogHeader>

          {loadingDetail ? (
            <div className="z-10 flex items-center justify-center h-32 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : subscriptionDetail ? (
            <div className="z-10 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <strong className="text-slate-300">Tên người dùng:</strong>
                <Link
                  href={`usermanagement/users/${selectedSub?.user.id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition"
                >
                  {selectedSub?.user.displayName}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <strong className="text-slate-300">Gói đăng ký:</strong>
                <Badge className="bg-amber-300 text-slate-800">
                  {subscriptionDetail.plan}
                </Badge>
              </div>

              <p>
                <strong className="text-slate-300">Giá thành: </strong>
                {subscriptionDetail.price.toLocaleString()} VND
              </p>

              <p>
                <strong className="text-slate-300">Gia hạn gói: </strong>
                {subscriptionDetail.duration} ngày
              </p>

              <p>
                <strong className="text-slate-300">Đăng ký vào ngày: </strong>
                {formatDate(subscriptionDetail.subscribedOn)}
              </p>

              <p>
                <strong className="text-slate-300">Hết hạn vào ngày: </strong>
                {formatDate(subscriptionDetail.expiriesOn)}
              </p>

              <p>
                <strong className="text-slate-300">Ngày hết hạn gốc: </strong>
                {formatDate(subscriptionDetail.originalEndDate)}
              </p>

              <p>
                <strong className="text-slate-300">Số ngày còn lại: </strong>
                {subscriptionDetail.dayRemaining} ngày
              </p>
            </div>
          ) : (
            <p className="z-10 text-sm text-muted-foreground">
              No data available.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
