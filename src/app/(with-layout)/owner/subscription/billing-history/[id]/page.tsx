import { Suspense } from "react";
import { BillingResponse } from "@/app/types/billing-history";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { UserBillingMetrics } from "@/components/ui/UserBillingMetrics";
import { Info } from "lucide-react";
import { cookies } from "next/headers";

const getData = async (id: string): Promise<BillingResponse> => {
  const cookie = await cookies();
  const cookieToken = cookie.toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/subscription/billing-history/${id}`,
    {
      cache: "no-cache",
      headers: { Cookie: cookieToken },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch billing history");

  return await res.json();
};

export default async function BillingHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const data = await getData((await params).id);
  const metricsData = data.data;
  const billingData = data.data.billingHistory;

  return (
    <div className="grid grid-cols-1">
      {/* Page Header */}
      <div className="w-full mt-4">
        <h1 className="text-2xl font-semibold">
          Lịch sử thanh toán của người dùng
        </h1>
        <p className="text-sm text-muted-foreground">
          Đây là nơi chứa thông tin lịch sử thanh toán của người dùng
        </p>

        {/* User basic info */}
        <div className="max-w-full w-full mt-4">
          <h2 className="text-lg flex gap-2 items-center font-semibold">
            <Info className="w-5 h-5" /> Thông tin cơ bản của người dùng
          </h2>
        </div>
        <UserBillingMetrics data={metricsData} />
      </div>

      {/* Billing History Table */}
      <div className="w-full mt-6">
        <Suspense fallback={<div>Loading user table...</div>}>
          <DataTable columns={columns} data={billingData} />
        </Suspense>
      </div>
    </div>
  );
}
