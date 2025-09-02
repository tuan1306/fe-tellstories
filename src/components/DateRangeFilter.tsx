"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function DateRangeFilter({
  onApply,
}: {
  onApply: (from: string, to: string) => void;
}) {
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();

  const handleApply = () => {
    if (from && to) {
      onApply(format(from, "yyyy-MM-dd"), format(to, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="flex gap-4 items-center">
      {/* From Date */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="text-center">
            {from ? format(from, "yyyy-MM-dd", { locale: vi }) : "Từ ngày"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 flex justify-center">
          <Calendar
            mode="single"
            selected={from}
            onSelect={setFrom}
            locale={vi}
          />
        </PopoverContent>
      </Popover>
      {/* To Date */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="text-center">
            {to ? format(to, "yyyy-MM-dd", { locale: vi }) : "Đến ngày"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 flex justify-center">
          <Calendar mode="single" selected={to} onSelect={setTo} locale={vi} />
        </PopoverContent>
      </Popover>
      <Button onClick={handleApply} className="self-center">
        Tìm kiếm theo ngày
      </Button>
    </div>
  );
}
