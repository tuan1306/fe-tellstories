"use client";

import { ColumnDef } from "@tanstack/react-table";
import { WalletTransaction } from "@/app/types/wallet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<WalletTransaction>[] = [
  {
    id: "rowNumber",
    header: () => <div className="flex justify-center items-center">#</div>,
    cell: ({ row, table }) => {
      const sortedRows = table.getSortedRowModel().rows;
      const rowNumber = sortedRows.findIndex((r) => r.id === row.id) + 1;
      return (
        <div className="flex justify-center items-center">{rowNumber}</div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: "user",
    header: "Người dùng",
    cell: ({ row }) => {
      return <div>{row.original.wallet.user.displayName}</div>;
    },
  },

  {
    accessorKey: "type",
    header: ({ column }) => (
      <div className="flex justify-center items-center">
        <Button
          variant="ghost"
          className="gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Loại giao dịch
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const type = row.getValue<"Credit" | "Debit">("type");
      return (
        <div className="flex justify-center items-center">
          <Badge
            className={
              type === "Credit"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }
          >
            {type === "Credit" ? "Cộng điểm" : "Trừ điểm"}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "amount",
    header: () => <div className="flex justify-center">Số điểm</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {Number(row.getValue("amount")).toLocaleString("vi-VN")} điểm
      </div>
    ),
  },

  {
    accessorKey: "balanceBefore",
    header: () => (
      <div className="flex justify-center items-center">Số dư trước</div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {Number(row.getValue("balanceBefore")).toLocaleString("vi-VN")} điểm
      </div>
    ),
  },

  {
    accessorKey: "balanceAfter",
    header: () => (
      <div className="flex justify-center items-center">Số dư sau</div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {Number(row.getValue("balanceAfter")).toLocaleString("vi-VN")} điểm
      </div>
    ),
  },

  {
    accessorKey: "description",
    header: () => (
      <div className="flex justify-center items-center">Hành động</div>
    ),
    cell: ({ row }) => {
      const value = row.getValue("description") as string | undefined;

      const descriptionMap: Record<string, string> = {
        "Daily Login": "Đăng nhập hàng ngày",
        "Subscription Bonus": "Gói tặng kèm điểm",
        "Redeem Subscription": "Quy đổi gói đăng ký",
      };

      const displayText = value ? descriptionMap[value] ?? value : "-";

      return (
        <div className="flex justify-center items-center">{displayText}</div>
      );
    },
  },

  // {
  //   accessorKey: "referenceId",
  //   header: "Mã tham chiếu",
  //   cell: ({ row }) => <div>{row.getValue("referenceId") ?? "Không có"}</div>,
  // },
  {
    accessorKey: "performedByUser",
    header: () => (
      <div className="flex justify-center items-center">Thao tác bởi</div>
    ),
    cell: ({ row }) =>
      row.original.performedByUser ? (
        <div className="flex justify-center items-center">
          {row.original.performedByUser.displayName}
        </div>
      ) : (
        <div className="flex justify-center items-center">Hệ thống</div>
      ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const tx = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="action-dropdown">
              <DropdownMenuLabel>Hoạt động</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/owner/usermanagement/users/${tx.wallet.userId}`)
                }
              >
                Xem thông tin người dùng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
