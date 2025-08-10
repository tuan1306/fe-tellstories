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
  // DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<SubscriptionDetail>[] = [
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
    accessorKey: "user",
    header: "Tên người dùng",
    cell: ({ row }) => <div>{row.getValue("user")}</div>,
  },
  {
    accessorKey: "plan",
    header: "Gói đăng ký",
    cell: ({ row }) => (
      <Badge className="bg-yellow-400 text-black">{row.getValue("plan")}</Badge>
    ),
  },
  {
    accessorKey: "price",
    header: "Giá thành",
    cell: ({ row }) => (
      <div>{Number(row.getValue("price")).toLocaleString("vi-VN")} VND</div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Gia hạn của gói",
    cell: ({ row }) => <div>{row.getValue("duration")} ngày</div>,
  },
  {
    accessorKey: "subscribedOn",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="gap-2 cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ngày đăng ký
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("subscribedOn"));
      return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("vi-VN");
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "expiriesOn",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="gap-2 cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ngày hết hạn
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("expiriesOn"));
      return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("vi-VN");
    },
  },
  {
    accessorKey: "originalEndDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="gap-2 cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ngày kết thúc gốc
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("originalEndDate"));
      return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("vi-VN");
    },
  },
  {
    accessorKey: "dayRemaining",
    header: "Số ngày còn lại sử dụng",
    cell: ({ row }) => <div>{row.getValue("dayRemaining")} ngày</div>,
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
              {/* <DropdownMenuSeparator /> */}

              {/* Needed some how to add Dialog here. */}

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
