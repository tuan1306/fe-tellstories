"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  WalletTransaction,
  WalletTransactionResponse,
} from "@/app/types/wallet";

export default function WalletTransactionPage() {
  const [data, setData] = useState<WalletTransaction[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [userQuery, setUserQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>(
    {}
  );

  const fetchData = async (
    currentPage = page,
    currentPageSize = pageSize,
    from?: string,
    to?: string,
    userQuery?: string
  ) => {
    try {
      setLoading(true);

      // spread
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: currentPageSize.toString(),
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
        ...(userQuery ? { userQuery } : {}),
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

      const json: WalletTransactionResponse = await res.json();
      setData(json.items);
      setTotalPages(json.totalPages);
    } catch (error) {
      console.error(error);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Current userQuery:", userQuery);
    fetchData(page, pageSize, dateRange.from, dateRange.to, userQuery);
  }, [page, pageSize, userQuery, dateRange]);

  return (
    <div className="p-4">
      <div className="w-full mb-4">
        <h1 className="text-2xl font-semibold">Danh sách giao dịch ví</h1>
        <h2 className="text-md text-muted-foreground">
          Các giao dịch ví gần đây nhất, những giao dịch liên quan tới điểm.
        </h2>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        totalPages={totalPages}
        onSearch={(query) => {
          setUserQuery(query);
          setPage(1);
        }}
        onDateRangeApply={(from, to) => {
          setDateRange({ from, to });
          setPage(1);
        }}
        onPageChange={(newPage, newSize) => {
          setPage(newPage);
          setPageSize(newSize);
        }}
      />
    </div>
  );
}
