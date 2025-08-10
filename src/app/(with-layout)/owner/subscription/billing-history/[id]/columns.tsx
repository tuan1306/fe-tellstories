"use client";

import { BillingHistory } from "@/app/types/billing-history";
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

export const columns: ColumnDef<BillingHistory>[] = [
  {
    id: "rowNumber",
    header: () => <div className="flex justify-center">#</div>,
    cell: ({ row, table }) => {
      const sortedRows = table.getSortedRowModel().rows;
      const rowNumber = sortedRows.findIndex((r) => r.id === row.id) + 1;
      return <div className="flex justify-center">{rowNumber}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span
        className="inline-block max-w-[150px] truncate"
        title={row.getValue("id") as string}
      >
        {row.getValue("id")}
      </span>
    ),
  },

  {
    accessorKey: "paidAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="gap-2"
      >
        Ngày thanh toán
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("paidAt") as string);
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Phương thức thanh toán",
    cell: ({ row }) => row.getValue("paymentMethod"),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="gap-2"
      >
        Trạng thái
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColor: Record<string, string> = {
        Success: "bg-green-500 text-white",
        Pending: "bg-yellow-500 text-white",
        Failed: "bg-red-500 text-white",
      };
      return (
        <Badge className={statusColor[status] || "bg-gray-500 text-white"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "plan",
    header: "Gói",
    cell: ({ row }) => {
      const plan = row.getValue("plan") as string;
      return <Badge className="bg-amber-300">{plan}</Badge>;
    },
  },
  {
    accessorKey: "price",
    header: "Giá thành",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return `${price.toLocaleString()} VND`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const bill = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(bill.id)}
            >
              Copy Transaction ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                alert(`Viewing subscription ${bill.subscriptionId}`)
              }
            >
              View Subscription
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
