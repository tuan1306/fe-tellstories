"use client";

import { Suspense } from "react";
import { BillingHistory } from "@/app/types/billing-history";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";
import { UserBillingMetrics } from "@/components/ui/UserBillingMetrics";
import { Info } from "lucide-react";

// Dummy data
const billingHistory: BillingHistory[] = [
  {
    id: "9b2dacfa-fc14-495f-5a20-08ddd5d78a43",
    paidAt: "2025-08-08T00:28:25.2234497",
    paymentMethod: "Chuyển khoản",
    status: "Success",
    subscriptionId: "844d2d0f-8af3-42c4-2b0b-08ddb5e7755b",
    plan: "3 Tháng",
    price: 70000,
  },
  {
    id: "2a3b4c5d-1234-5678-9012-abcdefabcdef",
    paidAt: "2025-07-15T14:10:00",
    paymentMethod: "Điểm",
    status: "Success",
    subscriptionId: "abcd1234-ef56-gh78-ijkl-90mnopqrstuv",
    plan: "1 Tháng",
    price: 20000,
  },
  {
    id: "2a3b4c5d-1234-5678-9012-abcdefabcdef",
    paidAt: "2025-07-15T14:10:00",
    paymentMethod: "Điểm",
    status: "Failed",
    subscriptionId: "abcd1234-ef56-gh78-ijkl-90mnopqrstuv",
    plan: "3 Tháng",
    price: 70000,
  },
];

export default function BillingHistoryPage() {
  return (
    <div className="grid grid-cols-1">
      <div className="w-full mt-4">
        <h1 className="text-2xl font-semibold">
          Lịch sử thanh toán của người dùng
        </h1>
        <h1 className="text-sm text-muted-foreground">
          Đây là nơi chưa thông tin lịch sử thanh toán của người dùng
        </h1>
        <div className="max-w-full w-full mt-4">
          <h1 className="text-lg flex gap-2 items-center font-semibold">
            <Info className="w-5 h-5" /> Thông tin cơ bản của người dùng
          </h1>
        </div>
        <UserBillingMetrics />
      </div>

      <div className="w-full">
        <Suspense fallback={<div>Loading user table...</div>}>
          <DataTable columns={columns} data={billingHistory} />
        </Suspense>
      </div>
    </div>
  );
}
