"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SubscriptionInfo } from "@/app/types/billing-history";

interface SubscriptionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  detail?: SubscriptionInfo;
}

export default function SubscriptionDetailDialog({
  open,
  onOpenChange,
  loading,
  detail,
}: SubscriptionDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="pt-6 overflow-hidden">
        <DialogHeader>
          <DialogTitle>Thông tin gói đăng ký</DialogTitle>
        </DialogHeader>

        <div className="absolute top-0 right-0 z-0">
          <div className="absolute -top-[140px] -right-[140px] w-[280px] h-[280px] rounded-full bg-[#1A293F] rotate-45 shadow-2xl/40" />
          <div className="absolute -top-[160px] -right-[160px] w-[280px] h-[280px] rounded-full bg-[#293E5C] rotate-45 shadow-xl/20" />
          <div className="absolute -top-[180px] -right-[180px] w-[280px] h-[280px] rounded-full bg-[#475F81] rotate-45 shadow-md/10" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : detail ? (
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <strong className="text-slate-300">ID gói:</strong>
              {detail.id}
            </div>

            <div className="flex items-center gap-2">
              <strong className="text-slate-300">Tên gói:</strong>
              <Badge className="bg-amber-300 text-slate-800">
                {detail.name}
              </Badge>
            </div>

            <p>
              <strong className="text-slate-300">Giá thành: </strong>
              {detail.price.toLocaleString()} VND
            </p>

            <p>
              <strong className="text-slate-300">Điểm thưởng: </strong>
              {detail.rewardPoints}
            </p>

            <p>
              <strong className="text-slate-300">Thời hạn gói: </strong>
              {detail.durationDays} ngày
            </p>

            <p>
              <strong className="text-slate-300">Trạng thái: </strong>
              {detail.isActive ? "Đang hoạt động" : "Không hoạt động"}
            </p>

            <p>
              <strong className="text-slate-300">Phương thức mua: </strong>
              {detail.purchaseMethod === "MoneyOnly" ? "Tiền" : "Điểm"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
