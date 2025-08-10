"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BadgeDollarSign, User2 } from "lucide-react";
import { BillingResponse } from "@/app/types/billing-history";

export function UserBillingMetrics({ data }: BillingResponse) {
  return (
    <div className="bg-card p-4 rounded-lg h-fit mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subscription Info */}
        <Card className="text-[16px] gap-4">
          <CardHeader>
            <CardTitle className="flex gap-2 text-[16px] items-center">
              <BadgeDollarSign className="text-yellow-500" />
              Gói đang sử dụng
            </CardTitle>
            <CardDescription>
              Gói hiện tại đang sử dụng của người dùng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Tên gói:{" "}
              </span>
              <span className="text-sm font-normal">
                {data.subscriptionName}
              </span>
            </p>
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Giá gói:
              </span>
              <span className="text-sm font-normal">
                {" "}
                {data.subscriptionPrice.toLocaleString("vi-VN")} VND
              </span>
            </p>
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Số ngày của gói:
              </span>
              <span className="text-sm font-normal">
                {" "}
                {data.subscriptionDurationDays} ngày
              </span>
            </p>
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Ngày kết thúc:
              </span>
              <span className="text-sm font-normal">
                {" "}
                {new Date(data.subscriptionEndDate).toLocaleDateString("vi-VN")}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card className="text-[16px] gap-4">
          <CardHeader>
            <CardTitle className="flex gap-2 text-[16px] items-center">
              <User2 className="text-blue-800" />
              Thông tin người sử dụng gói
            </CardTitle>
            <CardDescription>
              Thông tin cơ bản của người sử dụng gói
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Tên người dùng:
              </span>
              <span className="text-sm font-normal"> {data.userName}</span>
            </p>
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Email:
              </span>
              <span className="text-sm font-normal"> {data.email}</span>
            </p>
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Số ngày sử dụng còn lại:
              </span>
              <span className="text-sm font-normal">
                {" "}
                {data.remainSubscriptionDays} ngày
              </span>
            </p>
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Tổng số tiền sử dụng:
              </span>
              <span className="text-sm font-normal">
                {" "}
                {data.totalMoneySpent.toLocaleString("vi-VN")} VND
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
