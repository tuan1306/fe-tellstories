"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  UserPlus,
  BadgeDollarSign,
  Users,
  UserMinus,
  Minus,
  Eye,
} from "lucide-react";
import { Button } from "./ui/button";

type DashboardData = {
  subscriptionRevenue: number;
  subscriptionRevenueFluct: number | null;
  subscriber: number;
  subscriberFluct: number | null;
  newSubscriber: number;
  newSubscriberFluct: number | null;
  quitSubscriber: number;
  quitSubscriberFluct: number | null;
};

export function SubscriptionMetrics({ data }: { data: DashboardData }) {
  const fluctBadge = (value: number | null) => {
    if (value === null || value === undefined) {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Minus className="w-4 h-4 mr-1" />
          N/A
        </Badge>
      );
    }

    const isUp = value >= 0;
    const Icon = isUp ? TrendingUp : TrendingDown;
    const color = isUp ? "text-green-400" : "text-red-400";

    return (
      <Badge variant="outline" className={color}>
        <Icon className="w-4 h-4 mr-1" />
        {value >= 0 ? "+" : ""}
        {value}%
      </Badge>
    );
  };

  return (
    <div className="bg-card p-4 rounded-lg h-fit">
      <Card className="text-4xl text-[16px] gap-4 mb-4">
        <CardHeader>
          <CardTitle className="flex gap-2 text-[16px]">
            <BadgeDollarSign className="text-lime-500" />
            Tổng số tiền
          </CardTitle>
          <CardDescription>
            Tổng số tiền tích lũy trong tháng này{" "}
          </CardDescription>
          <CardAction>{fluctBadge(data.subscriptionRevenueFluct)}</CardAction>
        </CardHeader>
        <CardContent className="text-4xl font-semibold">
          <p>{data.subscriptionRevenue.toLocaleString()} VND</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="text-4xl text-[16px] gap-4">
          <CardHeader>
            <CardTitle className="flex items-center  gap-2 text-[16px]">
              <Users className="text-pink-500" />
              Tổng số người đăng ký
            </CardTitle>
            <CardDescription>
              Người dùng mua gói trong tháng này
            </CardDescription>
            <CardAction>{fluctBadge(data.subscriberFluct)}</CardAction>
          </CardHeader>
          <CardContent className="text-4xl">
            <div className="flex items-center justify-between">
              <p>{data.subscriber.toLocaleString()}</p>
              <a href="subscription/subscriber-list?type=subscribers">
                <Button
                  variant={"outline"}
                  className="flex items-center gap-2 hover:bg-accent text-primary"
                >
                  <Eye className="w-4 h-4" />
                  Xem thêm
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="text-4xl text-[16px] gap-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[16px]">
              <UserPlus className="text-emerald-400" />
              Người đăng ký mới
            </CardTitle>
            <CardDescription>
              Người dùng mới đăng ký trong tháng này
            </CardDescription>
            <CardAction>{fluctBadge(data.newSubscriberFluct)}</CardAction>
          </CardHeader>
          <CardContent className="text-4xl">
            <div className="flex items-center justify-between">
              <p>{data.newSubscriber.toLocaleString()}</p>
              <a href="subscription/subscriber-list?type=new">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-accent text-primary"
                >
                  <Eye className="w-4 h-4" />
                  Xem thêm
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="text-4xl text-[16px] gap-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[16px]">
              <UserMinus className="text-rose-500" />
              Người ngừng đăng ký
            </CardTitle>
            <CardDescription>
              Người dùng ngừng đăng gói trong tháng này
            </CardDescription>
            <CardAction>{fluctBadge(data.quitSubscriberFluct)}</CardAction>
          </CardHeader>
          <CardContent className="text-4xl">
            <div className="flex items-center justify-between">
              <p>{data.quitSubscriber.toLocaleString()}</p>
              <a href="subscription/subscriber-list?type=quit">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-accent text-primary"
                >
                  <Eye className="w-4 h-4" />
                  Xem thêm
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
