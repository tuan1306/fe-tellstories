"use client";

import { ColumnDef } from "@tanstack/react-table";

export type User = {
  id: string;
  displayName: string;
  email: string;
  userType: string | null;
  status: "Active" | "Pending" | "Inactive";
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "displayName",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "userType",
    header: "Role",
    cell: ({ row }) => row.original.userType ?? "Undefined",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
