"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReviewStoryDialog from "./ReviewStoryDialog";
import { toast } from "sonner";

interface PendingActionButtonsProps {
  pendingId: string;
  userId: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function PendingActionButtons({
  pendingId,
  userId,
  onApprove,
  onReject,
}: PendingActionButtonsProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const handlePointAdding = async (points: number) => {
    const res = await fetch(`/api/wallet/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: points,
      }),
    });

    if (!res.ok) {
      console.error("Failed to add points:", await res.text());
    }
  };

  const approveStory = async (notes: string) => {
    return fetch("/api/stories/pending", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: pendingId,
        action: "approve",
        reviewNotes: notes || "Approved by admin",
      }),
    });
  };

  const rejectStory = async (notes: string) => {
    return fetch("/api/stories/pending", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: pendingId,
        action: "reject",
        reviewNotes: notes || "Rejected by admin",
      }),
    });
  };

  const handleConfirm = async (notes: string, points?: number) => {
    try {
      if (actionType === "approve") {
        await approveStory(notes);
        if (points) await handlePointAdding(points);
        onApprove?.();
        toast.success("Đã phê duyệt truyện!");
      } else {
        await rejectStory(notes);
        onReject?.();
        toast.error("Đã từ chối truyện!");
      }

      router.push("/owner/stories?from=pending");
    } catch (err) {
      console.error(err);
      toast.error(
        actionType === "approve" ? "Phê duyệt thất bại!" : "Từ chối thất bại!"
      );
    } finally {
      setDialogOpen(false);
    }
  };

  return (
    <>
      <div className="mt-2 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 text-green-600 hover:text-green-500"
          onClick={() => {
            setActionType("approve");
            setDialogOpen(true);
          }}
        >
          Phê duyệt
        </Button>
        <Button
          variant="outline"
          className="flex-1 text-red-600 hover:text-red-500"
          onClick={() => {
            setActionType("reject");
            setDialogOpen(true);
          }}
        >
          Từ chối
        </Button>
      </div>

      <ReviewStoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={actionType === "approve" ? "Phê duyệt truyện" : "Từ chối truyện"}
        confirmDesc={
          actionType === "approve"
            ? "Nhập ghi chú phê duyệt (không bắt buộc)."
            : "Nhập lý do từ chối truyện."
        }
        confirmLabel="Xác nhận"
        confirmColor={actionType === "approve" ? "green" : "red"}
        onConfirm={handleConfirm}
      />
    </>
  );
}
