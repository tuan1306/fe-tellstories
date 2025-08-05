"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (instruction: string) => void;
  selectedText: string;
}

export default function CustomAdjustmentDialog({
  open,
  onClose,
  onSubmit,
  selectedText,
}: Props) {
  const [instruction, setInstruction] = useState("");

  const handleSubmit = () => {
    onSubmit(instruction);
    setInstruction("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          Provide instructions for adjusting the selected text.
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Selected: <em>{selectedText}</em>
        </p>
        <Textarea
          placeholder="e.g., Make it sound more adventurous..."
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!instruction.trim()}>
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
