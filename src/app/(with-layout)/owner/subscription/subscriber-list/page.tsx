import * as React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { SubscriptionDetail } from "@/app/types/subscription";
import { cookies } from "next/headers";

// Remind my dumbass to return an array.
const getData = async (): Promise<SubscriptionDetail[]> => {
  const cookie = await cookies();
  const cookieToken = cookie.toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/subscription/subscriber-list`,
    {
      cache: "no-cache",
      headers: {
        Cookie: cookieToken,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch subscriber");

  const json = await res.json();
  const fullData: SubscriptionDetail[] = json.data;

  return fullData;
};

export default async function SubscriptionListPage() {
  const data = await getData();

  return (
    <div className="p-4">
      <div className="w-full">
        <h1 className="text-2xl font-semibold">
          Danh sách người đăng ký dịch vụ
        </h1>
        <h1 className="text-md text-muted-foreground">
          Thông tin chi tiết về người dùng, gói dịch vụ, ngày đăng ký, và thời
          gian hết hạn.
        </h1>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
