"use client";

import { Textarea } from "@/components/ui/textarea";

interface DraftWritingTextareaProps {
  draftContent: string;
  onChange: (value: string) => void;
}

export function DraftWritingTextarea({
  draftContent,
  onChange,
}: DraftWritingTextareaProps) {
  return (
    <div className="flex flex-col h-full">
      <label className="text-sm font-medium mb-2 block">Bài viết nháp</label>
      <Textarea
        className="h-[67vh] w-full resize-none"
        value={draftContent}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
