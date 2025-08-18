"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description =
  "Biểu đồ diện tích tương tác hiển thị số tài khoản mới và truyện đã đăng tải";

type DashboardStat = {
  date: string;
  newAccount: number;
  publishedStories: number;
};

type DashboardResponse = {
  date: string;
  newAccount: number;
  activeAccount: number;
  publishedStories: number;
  storiesViews: number | null;
};

const chartConfig = {
  newAccount: {
    label: "Tài khoản mới",
    color: "var(--chart-1)",
  },
  publishedStories: {
    label: "Truyện đã đăng tải",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("7d");
  const [dashboardData, setDashboardData] = React.useState<DashboardStat[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const period = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    fetch(`/api/dashboard?statisticPeriod=${period}&page=1&pageSize=999`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const stats: DashboardResponse[] = data?.data?.statistics?.items ?? [];
        const transformed: DashboardStat[] = stats.map((item) => ({
          date: item.date.split("T")[0],
          newAccount: item.newAccount,
          publishedStories: item.publishedStories,
        }));

        // console.log("Transformed stats:", transformed);

        setDashboardData(transformed);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard:", err);
        setIsLoading(false);
      });
  }, [timeRange]);

  const filledData = React.useMemo(() => {
    if (dashboardData.length === 0) {
      console.log("No dashboard data yet");
      return [];
    }

    const referenceDate = new Date();
    const days = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
    const start = new Date(referenceDate);
    start.setDate(start.getDate() - days);

    const datesArray: DashboardStat[] = [];
    for (
      let d = new Date(start);
      d <= referenceDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dayStr = d.toISOString().split("T")[0];
      const existing = dashboardData.find((item) => item.date === dayStr);
      datesArray.push({
        date: dayStr,
        newAccount: existing ? existing.newAccount : 0,
        publishedStories: existing ? existing.publishedStories : 0,
      });
    }

    return datesArray;
  }, [dashboardData, timeRange]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>
            Biểu đồ diện tích - Tài khoản mới & Truyện đăng tải
          </CardTitle>
          <CardDescription>
            Hiển thị số tài khoản mới và số truyện đã đăng tải theo khoảng thời
            gian đã chọn.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Chọn khoảng thời gian"
          >
            <SelectValue placeholder="3 tháng gần nhất" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d" className="rounded-lg">
              Tuần trước
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Tháng trước
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              3 tháng trước
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!isLoading && filledData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filledData}>
              <defs>
                <linearGradient id="fillNewAccount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-newAccount)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-newAccount)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillPublishedStories"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-publishedStories)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-publishedStories)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  return `${day}/${month}`;
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("vi-VN", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="newAccount"
                type="natural"
                fill="url(#fillNewAccount)"
                stroke="var(--color-newAccount)"
                stackId="a"
                isAnimationActive={true}
                animationDuration={500}
                animateNewValues={true}
              />
              <Area
                dataKey="publishedStories"
                type="natural"
                fill="url(#fillPublishedStories)"
                stroke="var(--color-publishedStories)"
                stackId="a"
                isAnimationActive={true}
                animationDuration={500}
                animateNewValues={true}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-500">
            {isLoading ? "Đang tải dữ liệu..." : "Không có dữ liệu để hiển thị"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
