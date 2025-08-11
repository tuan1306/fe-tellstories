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
        <CardTitle className="flex items-center gap-2 text-[16px]">
          <Sparkles className="text-amber-400" />
          Gói phổ biến nhất
        </CardTitle>
        <CardDescription>Dựa vào các gói đang hoạt động</CardDescription>
      </CardHeader>
      <CardContent className="text-base">
        <p className="font-semibold text-primary">
          {subscriptionName || "Không có"}
        </p>
        <p className="text-muted-foreground text-sm">
          {numberOfSubscriber} người dùng ({percentage.toFixed(2)}%)
        </p>
      </CardContent>
    </Card>
  );
};
