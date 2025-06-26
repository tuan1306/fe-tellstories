"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import type { SortingFn } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type User = {
  id: string;
  displayName: string;
  email: string;
  userType: string | null;
  status: string | null;
};

// TanStack doc: https://tanstack.com/table/v8/docs/guide/sorting for custom funcs
// Sure you can write em at the sortingFn but then this exist, which is cleaner.
const userTypeSort: SortingFn<User> = (rowA, rowB, columnId) => {
  const order: Record<string, number> = {
    Admin: 0,
    User: 1,
    null: 2,
    undefined: 3,
  };

  const a = rowA.getValue(columnId);
  const b = rowB.getValue(columnId);

  return (order[a as string] ?? 3) - (order[b as string] ?? 3);
};

export const columns: ColumnDef<User>[] = [
  {
    id: "rowNumber",
    header: () => <div className="flex justify-center">#</div>,
    cell: ({ row, table }) => {
      // Since the row got sorted by role everytime we reload the page
      // Get the sorted rows -> return the first index of the array based on the sorted rows (0 + 1, 1 + 1,...)
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
    accessorKey: "displayName",
    header: "Username",
    cell: ({ row }) => {
      const value = row.getValue("displayName") as string;
      return <div>{value}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const value = row.getValue("email") as string;
      return <div>{value}</div>;
    },
  },
  {
    accessorKey: "userType",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const role = row.getValue("userType") as string;

      const roleColor: Record<string, string> = {
        Admin: "bg-[#deac4a] text-white",
        User: "bg-[#2F629A] text-white",
        null: "bg-[#e06976] text-white",
      };

      return (
        <div className="flex justify-center items-center">
          <Badge className={roleColor[role] || "bg-[#F46A00] text-white"}>
            {role || "Undefined"}
          </Badge>
        </div>
      );
    },
    // (rowA, rowB, columnId) => -1 | 0 | 1
    // If -1 -> rowA (admin row)
    // If 0 -> rowB (user row)
    sortingFn: userTypeSort,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="gap-2 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColor: Record<string, string> = {
        Active: "bg-green-500 text-white",
        Pending: "bg-yellow-500 text-white",
        Inactive: "bg-red-500 text-white",
      };

      return (
        <div className="flex justify-center items-center">
          <Badge className={statusColor[status] || "bg-[#F46A00] text-white"}>
            {status || "Undefined"}
          </Badge>
        </div>
      );
    },
    sortingFn: (a, b) => {
      const order: Record<string, number> = {
        Admin: 0,
        User: 1,
        null: 2,
        undefined: 3,
      };
      const aVal = a.getValue("userType");
      const bVal = b.getValue("userType");
      return (order[aVal as string] ?? 3) - (order[bVal as string] ?? 3);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // Based on the current row of the action.
      const user = row.original;

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
              <DropdownMenuItem className="cursor-pointer">
                View User Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Quick Edit User
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
