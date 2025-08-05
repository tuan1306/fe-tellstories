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
} from "lucide-react";

type DashboardData = {
  subscriptionRevenue: number;
  subscriptionRevenueFluct: number | null;
  subscriber: number;
  subscriberFluct: number | null;
  newSubscriber: number;
  newSubscriberFluct: number | null;
  quittedSubscriber: number;
  quittedSubscriberFluct: number | null;
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
            Total amount
          </CardTitle>
          <CardDescription>
            Total amount of money accumulated this month
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
            <CardTitle className="flex gap-2 text-[16px]">
              <Users className="text-pink-500" />
              Total Subscriber
            </CardTitle>
            <CardDescription>
              User bought subscription this month
            </CardDescription>
            <CardAction>{fluctBadge(data.subscriberFluct)}</CardAction>
          </CardHeader>
          <CardContent className="text-4xl">
            <p>{data.subscriber.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="text-4xl text-[16px] gap-4">
          <CardHeader>
            <CardTitle className="flex gap-2 text-[16px]">
              <UserPlus className="text-emerald-400" />
              New Subscriber
            </CardTitle>
            <CardDescription>
              Newly joined subscribers this month
            </CardDescription>
            <CardAction>{fluctBadge(data.newSubscriberFluct)}</CardAction>
          </CardHeader>
          <CardContent className="text-4xl">
            <p>{data.newSubscriber.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="text-4xl text-[16px] gap-4">
          <CardHeader>
            <CardTitle className="flex gap-2 text-[16px]">
              <UserMinus className="text-rose-500" />
              Lost Subscription
            </CardTitle>
            <CardDescription>
              Users who stopped subscribing this month
            </CardDescription>
            <CardAction>{fluctBadge(data.quittedSubscriberFluct)}</CardAction>
          </CardHeader>
          <CardContent className="text-4xl">
            <p>{data.quittedSubscriber.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
