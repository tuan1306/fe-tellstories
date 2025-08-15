"use client";

import { toast } from "sonner";

export function saveSonner(
  status: "loading" | "success" | "error",
  message?: string
) {
  if (status === "loading") {
    toast.loading("Đang lưu truyện...", {
      id: "save-story",
    });
  }
  if (status === "success") {
    toast.success("Lưu thành công", {
      id: "save-story",
      description: message || "Câu chuyện của bạn đã được lưu.",
      duration: 2000,
    });
  }
  if (status === "error") {
    toast.error("Lỗi lưu truyện", {
      id: "save-story",
      description: message || "Vui lòng thử lại.",
    });
  }
}
