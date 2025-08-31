"use client";

import { SubscriptionPackage } from "@/app/types/subscription";
import { Button } from "@/components/ui/button";

interface Props {
  pkg: SubscriptionPackage;
  onEdit: (pkg: SubscriptionPackage) => void;
  isCreating?: boolean;
}

export const SubscriptionDetails = ({ pkg, onEdit, isCreating }: Props) => {
  return (
    <div className="flex flex-col h-full">
      {/* Title + Desc */}
      <div className="mb-2">
        <h3 className="font-semibold text-lg">Chi tiết gói</h3>
        <p className="text-sm text-muted-foreground">
          Thông tin chi tiết của gói đăng ký đã chọn
        </p>
      </div>

      {/* Package Details */}
      <div className="text-sm text-muted-foreground space-y-1 flex-1">
        {pkg.name ? (
          <p>
            <strong>Tên gói: </strong>
            {pkg.name}
          </p>
        ) : null}

        {pkg.price ? (
          <p>
            <strong>Số tiền quy đổi: </strong>
            {new Intl.NumberFormat("vi-VN").format(pkg.price)} VND
          </p>
        ) : null}

        {pkg.pointsCost ? (
          <p>
            <strong>Số điểm quy đổi:</strong> {pkg.pointsCost} điểm
          </p>
        ) : null}

        <p>
          <strong>Phương thức thanh toán: </strong>
          {{
            MoneyOnly: "Tiền",
            PointsOnly: "Điểm",
            MoneyOrPoints: "Tiền & Điểm",
          }[pkg.purchaseMethod] ?? "N/A"}
        </p>

        {pkg.rewardPoints ? (
          <p>
            <strong>Điểm thưởng:</strong> {pkg.rewardPoints} điểm
          </p>
        ) : null}

        <p>
          <strong>Thời gian hoạt động:</strong> {pkg.durationDays} ngày
        </p>
        <p>
          <strong>Hoạt động:</strong> {pkg.isActive ? "Có" : "Không"}
        </p>
      </div>

      {/* Edit Button */}
      {!isCreating && (
        <Button
          variant="link"
          className="px-0 text-sm text-amber-300 mt-2 self-start hover:cursor-pointer"
          onClick={() => onEdit(pkg)}
        >
          Chỉnh sửa gói
        </Button>
      )}
    </div>
  );
};
