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
    <div className="flex gap-4">
      {/* From Date */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {from ? format(from, "yyyy-MM-dd") : "From Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Calendar mode="single" selected={from} onSelect={setFrom} />
        </PopoverContent>
      </Popover>

      {/* To Date */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {to ? format(to, "yyyy-MM-dd") : "To Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Calendar mode="single" selected={to} onSelect={setTo} />
        </PopoverContent>
      </Popover>

      <Button onClick={handleApply}>Apply</Button>
    </div>
  );
}
