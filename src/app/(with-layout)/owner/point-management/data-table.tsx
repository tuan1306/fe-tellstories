"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DateRangeFilter from "@/components/DateRangeFilter";
import { DataTablePagination } from "@/components/TablePagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  totalPages: number;
  onDateRangeApply?: (from?: string, to?: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
  onSearch?: (query: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  totalPages,
  onDateRangeApply,
  onPageChange,
  onSearch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Pagination
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: { pageIndex, pageSize },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true, // important
    pageCount: totalPages,
  });

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPageIndex(newPage - 1);
    setPageSize(newPageSize);
    onPageChange(newPage, newPageSize);
  };

  return (
    <div>
      {/* Filters and search */}
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Tìm kiếm giao dịch..."
          onChange={(e) => {
            if (onSearch) onSearch(e.target.value);
            setPageIndex(0);
          }}
          className="max-w-sm"
        />

        {/* If used then reset the pagination index */}
        <DateRangeFilter
          onApply={(from, to) => {
            if (onDateRangeApply) onDateRangeApply(from, to);
            setPageIndex(0);
          }}
        />

        <div className="ml-auto flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild />
            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={10}
              className="p-3 space-y-1 shadow-xl"
            >
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    className="capitalize cursor-pointer"
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border-y border-r last:border-r-0"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-y border-r last:border-r-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent pointer-events-none">
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  Không có thông tin
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        table={table}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
