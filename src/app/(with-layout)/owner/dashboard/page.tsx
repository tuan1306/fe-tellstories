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
      });
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="text-4xl col-span-4 font-semibold mt-4 ml-3">
        Welcome back, John.
      </div>
      <Card className="text-4xl col-span-1 text-[16px] gap-4">
        <CardHeader>
          <CardTitle className="flex gap-2 text-[16px]">
            <UserPlus />
            New Account
          </CardTitle>
          <CardDescription>Accounts created this week</CardDescription>
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
            Active Account
          </CardTitle>
          <CardDescription>Accounts currently active</CardDescription>
          <CardAction>
            {/* No fluct value given in API for active accounts */}
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
            Published Stories
          </CardTitle>
          <CardDescription>Published stories this week</CardDescription>
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
            Stories views
          </CardTitle>
          <CardDescription>Total story views</CardDescription>
          <CardAction>
            {/* No fluct provided */}
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
