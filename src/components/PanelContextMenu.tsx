"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useState } from "react";
import CustomAdjustmentDialog from "./CustomAdjustmentDialog";
import { PencilLine, Sparkles } from "lucide-react";

interface PanelContextMenuProps {
  selectedText: string;
  onImprove: () => void;
  onCustomAdjust: (instructions: string) => void;
  disabled: boolean;
  children: React.ReactNode;
}

export default function PanelContextMenu({
  selectedText,
  onImprove,
  onCustomAdjust,
  disabled,
  children,
}: PanelContextMenuProps) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="mt-3">
          <ContextMenuItem onClick={onImprove} disabled={disabled}>
            <Sparkles className="text-amber-400" /> Improve with AI assist
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => setOpenDialog(true)}
            disabled={disabled}
          >
            <PencilLine className="text-cyan-400" /> Custom adjustment
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <CustomAdjustmentDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={onCustomAdjust}
        selectedText={selectedText}
      />
    </>
  );
}
