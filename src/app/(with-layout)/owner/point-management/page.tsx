import * as React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { cookies } from "next/headers";
import {
  WalletTransaction,
  WalletTransactionResponse,
} from "@/app/types/wallet";

const getData = async (): Promise<WalletTransaction[]> => {
  const cookie = await cookies();
  const cookieToken = cookie.toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/wallet/transaction?page=1&pageSize=10`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieToken,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch wallet transactions");
  }

  const json = (await res.json()) as WalletTransactionResponse;
  return json.items;
};

export default async function WalletTransactionPage() {
  const data = await getData();

  return (
    <div className="p-4">
      <div className="w-full">
        <h1 className="text-2xl font-semibold">Danh sách giao dịch ví</h1>
        <h2 className="text-md text-muted-foreground">
          Hiển thị 10 giao dịch ví gần đây nhất, bao gồm người dùng, số dư và
          loại giao dịch.
        </h2>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
