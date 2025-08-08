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

export function UserBillingMetrics() {
  return (
    <div className="bg-card p-4 rounded-lg h-fit mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Tên gói:
              </span>
              <span className="text-sm font-normal"> 3 tháng</span>
            </p>
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Giá gói:
              </span>
              <span className="text-sm font-normal"> 1,200,000 VND</span>
            </p>
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Số ngày của gói:
              </span>
              <span className="text-sm font-normal"> 90 ngày</span>
            </p>
            {/* <p>
              <span className="text-xs font-medium text-muted-foreground">
                Start Date:{" "}
              </span>
              <span className="text-xs font-normal">2025-07-01</span>
            </p> */}
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Ngày kết thúc
              </span>
              <span className="text-sm font-normal"> 31-07-2025</span>
            </p>
          </CardContent>
        </Card>

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
              <span className="text-sm font-normal"> Tuấn1306</span>
            </p>
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Email:
              </span>
              <span className="text-sm font-normal"> Tuấn1306@fpt.edu.vn</span>
            </p>
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Số ngày sử dụng còn lại:
              </span>
              <span className="text-sm font-normal"> 97 ngày</span>
            </p>
            <p>
              <span className="text-sm font-medium text-muted-foreground">
                Tổng số tiền sử dụng:
              </span>
              <span className="text-sm font-normal"> 160,000 VND</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
