"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BillingHistoryItem } from "@/app/types/billing-history";

export const columns = (
  openDialog: (bill: BillingHistoryItem) => void
): ColumnDef<BillingHistoryItem>[] => [
  {
    id: "rowNumber",
    header: () => <div className="flex justify-center">#</div>,
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
    accessorKey: "billingId",
    header: "ID",
    cell: ({ row }) => (
      <span
        className="inline-block max-w-[150px] truncate"
        title={row.getValue("billingId") as string}
      >
        {row.getValue("billingId")}
      </span>
    ),
  },
  {
    accessorKey: "paidAt",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày thanh toán
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const paidAt = row.getValue("paidAt") as string | null;
      if (!paidAt)
        return <div className="flex justify-center">Chưa thanh toán</div>;

      const date = new Date(paidAt);
      const formattedDate = date.toLocaleDateString("vi-VN");
      const formattedTime = date.toLocaleTimeString("vi-VN", { hour12: false });
      return (
        <div className="flex justify-center">
          {`${formattedDate} ${formattedTime}`}
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = rowA.getValue(columnId)
        ? new Date(rowA.getValue(columnId) as string).getTime()
        : 0;
      const dateB = rowB.getValue(columnId)
        ? new Date(rowB.getValue(columnId) as string).getTime()
        : 0;
      return dateB - dateA;
    },
  },
  {
    accessorFn: (row) => row.paymentMethod,
    id: "paymentMethod",
    header: () => (
      <div className="flex justify-center">Phương thức thanh toán</div>
    ),
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      return <div className="flex justify-center">{method}</div>;
    },
  },
  {
    accessorFn: (row) => row.status,
    id: "status",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Trạng thái
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusColor: Record<string, string> = {
        Success: "bg-green-500 text-white",
        Pending: "bg-yellow-500 text-white",
        Failed: "bg-red-500 text-white",
      };

      const statusLabel: Record<string, string> = {
        Success: "Thành công",
        Pending: "Đang chờ",
        Failed: "Thất bại",
      };

      return (
        <div className="flex justify-center items-center">
          <Badge className={statusColor[status] || "bg-gray-500 text-white"}>
            {statusLabel[status] || "Không xác định"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subscription.name,
    id: "plan",
    header: () => <div className="flex justify-center">Gói</div>,
    cell: ({ row }) => {
      const plan = row.getValue("plan") as string;
      return (
        <div className="flex justify-center items-center">
          <Badge className="bg-yellow-500 text-white">{plan}</Badge>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.total,
    id: "price",
    header: () => <div className="flex justify-center">Giá thành</div>,
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return (
        <div className="flex justify-center">{price.toLocaleString()}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const bill = row.original;
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="action-dropdown">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(bill.billingId)}
              >
                Copy ID thanh toán
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  openDialog(bill);
                }}
              >
                Xem chi tiết gói
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
