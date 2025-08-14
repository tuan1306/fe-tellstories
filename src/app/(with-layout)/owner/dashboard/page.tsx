"use client";

import { ChartAreaInteractive } from "@/components/AppLineChart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  Library,
  Loader2,
  TrendingDown,
  TrendingUp,
  User,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    newAccounts: 0,
    newAccountFluct: 0,
    activeAccounts: 0,
    publishedStories: 0,
    publishedStoriesFluct: 0,
    storyViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        const d = data?.data;
        setStats({
          newAccounts: d?.newAccount ?? 0,
          newAccountFluct: d?.newAccountFluct ?? 0,
          activeAccounts: d?.activeAccount ?? 0,
          publishedStories: d?.publishedStories ?? 0,
          publishedStoriesFluct: d?.publishedStoriesFluct ?? 0,
          storyViews: d?.storiesViews ?? 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const fluctBadge = (value: number) => {
    const isUp = value >= 0;
    const Icon = isUp ? TrendingUp : TrendingDown;
    const color = isUp ? "text-green-400" : "text-red-400";
    return (
      <Badge variant="outline" className={color}>
        <Icon />
        {value >= 0 ? "+" : ""}
        {value}%
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="animate-spin w-12 h-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="text-4xl col-span-4 font-semibold mt-4 ml-3">
        Chào mừng trở lại, Admin.
      </div>
      <Card className="text-4xl col-span-1 text-[16px] gap-4">
        <CardHeader>
          <CardTitle className="flex gap-2 text-[16px]">
            <UserPlus />
            Tài khoản mới
          </CardTitle>
          <CardDescription>
            Số tài khoản được tạo trong tuần này
          </CardDescription>
          <CardAction>{fluctBadge(stats.newAccountFluct)}</CardAction>
        </CardHeader>
        <CardContent className="text-4xl">
          <p>{stats.newAccounts.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card className="text-4xl col-span-1 text-[16px] gap-4">
        <CardHeader>
          <CardTitle className="flex gap-2 text-[16px]">
            <User />
            Tài khoản hoạt động
          </CardTitle>
          <CardDescription>
            Tổng số tài khoản hiện tại đang hoạt động
          </CardDescription>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground">
              —
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="text-4xl">
          <p>{stats.activeAccounts.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card className="text-4xl col-span-1 text-[16px] gap-4">
        <CardHeader>
          <CardTitle className="flex gap-2 text-[16px]">
            <Library />
            Truyện đã đăng tải
          </CardTitle>
          <CardDescription>Số truyện đăng tải trong tuần này</CardDescription>
          <CardAction>
            {fluctBadge(stats.publishedStoriesFluct ?? 0)}
          </CardAction>
        </CardHeader>
        <CardContent className="text-4xl">
          <p>{stats.publishedStories.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card className="text-4xl col-span-1 text-[16px] gap-4">
        <CardHeader>
          <CardTitle className="flex gap-2 text-[16px]">
            <Eye />
            Lượt xem truyện
          </CardTitle>
          <CardDescription>
            Tổng số lượt xem của tất cả các truyện
          </CardDescription>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground">
              —
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="text-4xl">
          <p>{stats.storyViews.toLocaleString()}</p>
        </CardContent>
      </Card>
      <div className="rounded-2xl lg:col-span-4">
        <ChartAreaInteractive />
      </div>
    </div>
  );
}
