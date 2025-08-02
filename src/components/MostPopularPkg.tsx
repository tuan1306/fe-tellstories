"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface MostPopularPkgProp {
  subscriptionName: string;
  numberOfSubscriber: number;
  percentage: number;
}

export const MostPopularPkg = ({
  subscriptionName,
  numberOfSubscriber,
  percentage,
}: MostPopularPkgProp) => {
  return (
    <Card className="text-[16px] gap-4 my-4">
      <CardHeader>
        <CardTitle className="flex gap-2 text-[16px]">
          <Sparkles className="text-amber-400" />
          Most Popular Tier
        </CardTitle>
        <CardDescription>Based on active subscriptions</CardDescription>
      </CardHeader>
      <CardContent className="text-xl">
        <p className="font-semibold text-primary">
          {subscriptionName || "None"}
        </p>
        <p className="text-muted-foreground text-sm">
          {numberOfSubscriber} users ({percentage.toFixed(2)}%)
        </p>
      </CardContent>
    </Card>
  );
};
