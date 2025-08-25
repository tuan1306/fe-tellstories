"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ResolveItem({
  itemId,
  userId,
  onSuccess,
  className,
}: {
  itemId: string;
  userId: string;
  onSuccess: (id: string) => void;
  className?: string;
}) {
  const [resolving, setResolving] = useState(false);

  const notifyUser = async (userId: string, title: string, message: string) => {
    try {
      const res = await fetch("/api/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title,
          message,
          type: "issue-resolved",
          sender: "Admin",
          targetType: "User",
        }),
      });

      if (!res.ok) {
        console.error("Failed to send notification:", await res.text());
        toast.error("Gửi thông báo thất bại");
      } else {
        toast.success("Đã gửi thông báo tới người dùng");
      }
    } catch (err) {
      console.error("Notification error:", err);
      toast.error("Gửi thông báo thất bại");
    }
  };

  const handleResolve = async () => {
    setResolving(true);
    try {
      const res = await fetch(`/api/issue-reports/resolve/${itemId}`, {
        method: "PUT",
      });

      if (!res.ok) {
        console.error("Xác nhận xử lý thất bại");
        return;
      }

      // Notify the user after resolving
      await notifyUser(
        userId,
        "Vấn đề đã được giải quyết",
        "Bình luận của bạn báo cáo đã được xử lý."
      );

      onSuccess(itemId);
    } catch (error) {
      console.error("Lỗi khi xác nhận xử lý", error);
    } finally {
      setResolving(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className={`font-semibold cursor-pointer ${className ?? ""}`}
          disabled={resolving}
        >
          {resolving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle2 className="text-emerald-600 w-4 h-4 mr-2" />
          )}
          Xác nhận đã xử lý
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xử lý</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ đánh dấu mục là đã được{" "}
            <b className="text-emerald-500">giải quyết</b> và thông báo lại cho
            người đã báo cáo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
            onClick={handleResolve}
            disabled={resolving}
          >
            {resolving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
