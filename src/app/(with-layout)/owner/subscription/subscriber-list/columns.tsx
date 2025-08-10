"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SubscriptionDetail } from "@/app/types/subscription";
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

export const columns: ColumnDef<SubscriptionDetail>[] = [
  {
    id: "rowNumber",
    header: () => (
      <div className="flex justify-center text-lg font-semibold w-12">#</div>
    ),
    cell: ({ row, table }) => {
      const sortedRows = table.getSortedRowModel().rows;
      const rowNumber = sortedRows.findIndex((r) => r.id === row.id) + 1;
      return (
        <div className="flex justify-center items-center text-lg font-medium w-12">
          {rowNumber}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "user",
    header: "Tên người dùng",
    cell: ({ row }) => <div>{row.getValue("user")}</div>,
  },
  {
    accessorKey: "plan",
    header: () => <div className="flex justify-center">Gói đăng ký</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <Badge className="bg-yellow-400 text-black">
          {row.getValue("plan")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="flex justify-center">Giá thành</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {Number(row.getValue("price")).toLocaleString("vi-VN")} VND
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: () => <div className="flex justify-center">Gia hạn của gói</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">{row.getValue("duration")} ngày</div>
    ),
  },
  {
    accessorKey: "subscribedOn",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày đăng ký
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("subscribedOn"));
      return (
        <div className="flex justify-center">
          {isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("vi-VN")}
        </div>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "expiriesOn",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày hết hạn
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("expiriesOn"));
      return (
        <div className="flex justify-center">
          {isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("vi-VN")}
        </div>
      );
    },
  },
  {
    accessorKey: "originalEndDate",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày kết thúc gốc
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("originalEndDate"));
      return (
        <div className="flex justify-center">
          {isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("vi-VN")}
        </div>
      );
    },
  },
  {
    accessorKey: "dayRemaining",
    header: () => (
      <div className="flex justify-center">Số ngày còn lại sử dụng</div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.getValue("dayRemaining")} ngày
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subscription = row.original;
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/owner/usermanagement/users/${subscription.userId}`
                  )
                }
              >
                Xem thông tin người dùng
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/owner/subscription/billing-history/${subscription.userId}`
                  )
                }
              >
                Xem lịch sử thanh toán
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
