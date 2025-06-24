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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type User = {
  id: string;
  displayName: string;
  email: string;
  userType: string | null;
  status: string | null;
};

export const columns: ColumnDef<User>[] = [
  {
    id: "rowNumber",
    header: "#",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination?.pageIndex ?? 0;
      const pageSize = table.getState().pagination?.pageSize ?? row.index + 1;
      const rowNumber = pageIndex * pageSize + row.index + 1;

      return <div className="text-muted-foreground">{rowNumber}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "displayName",
    header: "Username",
    cell: ({ row }) => {
      const value = row.getValue("displayName") as string;
      return <div className="font-medium">{value}</div>;
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
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue("userType") as string;

      const roleColor: Record<string, string> = {
        Member: "bg-[#2F629A] text-white",
      };

      return (
        <div className="flex justify-center items-center">
          <Badge className={roleColor[role] || "bg-[#F46A00] text-white"}>
            {role || "Undefined"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="gap-2"
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
  },
  {
    // TODO: Needed to add some mfkin action here.
    id: "actions",
    cell: ({ row }) => {
      // Based on the current row of the action.
      const user = row.original;

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
