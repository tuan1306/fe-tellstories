"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A donut chart with text";

const chartData = [
  { plan: "Basic", subscribers: 275, fill: "var(--chart-1)" },
  { plan: "Pro", subscribers: 200, fill: "var(--chart-2)" },
  { plan: "Premium", subscribers: 287, fill: "var(--chart-3)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Basic",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Pro",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Premium",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function SubGroupChart() {
  const totalSub = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.subscribers, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Subscribers by Plan</CardTitle>
        <CardDescription>Breakdown of active subscriptions</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="subscribers" // rename this to 'subscribers' in the data if needed
              nameKey="plan" // rename this to 'plan' in the data if needed
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalSub.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Subscribers
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Growth of 5.2% in subscriptions <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Based on currently active subscription plans
        </div>
      </CardFooter>
    </Card>
  );
}
