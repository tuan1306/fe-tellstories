"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReviewStoryDialog from "./ReviewStoryDialog";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface PendingActionButtonsProps {
  pendingId: string;
  userId: string;
  storyTitle: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function PendingActionButtons({
  pendingId,
  userId,
  storyTitle,
  onApprove,
  onReject,
}: PendingActionButtonsProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  // Identification
  const { role } = useAuth();

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
        return;
      }

      const data = await res.json();
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
        reason: "Publication success",
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

        const title = `Truyện "${storyTitle}" đã được phê duyệt! 🎉`;
        const message =
          notes && notes.trim() !== ""
            ? `Ghi chú từ quản trị viên: ${notes}.\nTruyện "${storyTitle}" đã vượt qua kiểm duyệt${
                points ? ` và bạn nhận được ${points} điểm!` : "!"
              }`
            : `Truyện "${storyTitle}" đã vượt qua kiểm duyệt${
                points ? ` và bạn nhận được ${points} điểm!` : "!"
              }`;

        await handleNotifyUser(title, message);

        onApprove?.();
        toast.success("Đã phê duyệt truyện!");
      } else {
        await handleReject(notes);

        const title = `Truyện "${storyTitle}" đã bị từ chối ❌`;
        const message =
          notes && notes.trim() !== ""
            ? `Lý do từ chối: ${notes}.\nTruyện "${storyTitle}" không đáp ứng yêu cầu kiểm duyệt.`
            : `Truyện "${storyTitle}" không đáp ứng yêu cầu kiểm duyệt.`;

        await handleNotifyUser(title, message);

        onReject?.();
        toast.error("Đã từ chối truyện!");
      }

      if (role === "Admin") {
        router.push("/owner/stories?from=pending");
      } else if (role === "Moderator") {
        router.push("/moderator/stories?from=pending");
      } else {
        router.push("/");
      }
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
