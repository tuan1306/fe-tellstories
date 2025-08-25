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

  const handleNotifyUser = async (title: string, message: string) => {
    try {
      const res = await fetch("/api/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title,
          message,
          type: "publication-request",
          sender: "Admin",
          targetType: "User",
        }),
      });

      if (!res.ok) {
        console.error("Failed to send notification:", await res.text());
        toast.error("Gửi thông báo thất bại");
        return;
      }

      const data = await res.json();
      toast.success("Đã gửi thông báo đến người dùng!");
      return data;
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

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

  const handleApprove = async (notes: string) => {
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

  const handleReject = async (notes: string) => {
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
        await handleApprove(notes);
        if (points) await handlePointAdding(points);

        const title = "Truyện của bạn đã được phê duyệt! 🎉";
        const message = notes
          ? `Ghi chú từ quản trị viên: ${notes}.\nBạn nhận được ${
              points || 0
            } điểm!`
          : `Truyện của bạn đã vượt qua kiểm duyệt và bạn nhận được ${
              points || 0
            } điểm!`;

        await handleNotifyUser(title, message);

        onApprove?.();
        toast.success("Đã phê duyệt truyện!");
      } else {
        await handleReject(notes);

        const title = "Truyện của bạn đã bị từ chối ❌";
        const message = notes
          ? `Lý do từ chối: ${notes}`
          : "Truyện của bạn không đáp ứng yêu cầu kiểm duyệt.";

        await handleNotifyUser(title, message);

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
