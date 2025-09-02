import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalPages: number;
  onPageChange: (page: number, pageSize: number) => void;
}

export function DataTablePagination<TData>({
  table,
  totalPages,
  onPageChange,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  const goToPage = (newPageIndex: number) => {
    if (newPageIndex < 0 || newPageIndex >= totalPages) return;
    table.setPageIndex(newPageIndex);
    onPageChange(newPageIndex + 1, pageSize);
  };

  // const changePageSize = (newSize: number) => {
  //   table.setPageSize(newSize);
  //   goToPage(0);
  // };

  return (
    <div className="flex items-center justify-between px-2 mt-4">
      <div className="flex-1" />

      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* Page size selector */}
        {/* <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Số cá thể mỗi trang</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => changePageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px] cursor-pointer">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}

        {/* Page info */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Trang {pageIndex + 1} trên {totalPages}
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => goToPage(0)}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">Trang đầu</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => goToPage(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">Trang trước</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => goToPage(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            <span className="sr-only">Trang sau</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => goToPage(totalPages - 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            <span className="sr-only">Trang cuối</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
