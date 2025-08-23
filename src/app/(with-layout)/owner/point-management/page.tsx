"use client";

import * as React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  WalletTransaction,
  WalletTransactionResponse,
} from "@/app/types/wallet";

export default function WalletTransactionPage() {
  const [data, setData] = React.useState<WalletTransaction[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchData = async (
    from?: string,
    to?: string,
    page = 1,
    pageSize = 10
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
      });

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_URL
        }/api/wallet/transaction?${params.toString()}`,
        {
          cache: "no-store",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch wallet transactions");

      const json = (await res.json()) as WalletTransactionResponse;
      setData(json.items);
      return json;
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <div className="w-full">
        <h1 className="text-2xl font-semibold">Danh sách giao dịch ví</h1>
        <h2 className="text-md text-muted-foreground">
          Hiển thị 10 giao dịch ví gần đây nhất, bao gồm người dùng, số dư và
          loại giao dịch.
        </h2>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onDateRangeApply={(from, to) => fetchData(from, to)}
        onPageChange={(page, pageSize) =>
          fetchData(undefined, undefined, page, pageSize)
        }
      />
    </div>
  );
}
