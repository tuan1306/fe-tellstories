"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscriptionSchema } from "@/utils/validators/schemas";
import { SubscriptionPackage } from "@/app/types/subscription";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Props {
  selectedPackage: SubscriptionPackage | null;
  subscriptionPackages: SubscriptionPackage[];
  fetchSubscriptions: () => void;
  onClose: () => void;
  onChange?: (updatedFields: Partial<SubscriptionPackage>) => void;
}

export const SubscriptionForm = ({
  selectedPackage,
  subscriptionPackages,
  fetchSubscriptions,
  onClose,
  onChange,
}: Props) => {
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const form = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: selectedPackage
      ? {
          name: selectedPackage.name,
          price: selectedPackage.price ?? 0,
          type: selectedPackage.type ?? "default",
          durationDays: selectedPackage.durationDays ?? 1,
          pointsCost: selectedPackage.pointsCost ?? 0,
          rewardPoints: selectedPackage.rewardPoints ?? 0,
          purchaseMethod: selectedPackage.purchaseMethod ?? "MoneyOnly",
          isActive: selectedPackage.isActive ?? false,
          isDefault: selectedPackage.isDefault ?? false,
        }
      : {
          name: "",
          price: 0,
          type: "default",
          durationDays: 1,
          pointsCost: 0,
          rewardPoints: 0,
          purchaseMethod: "MoneyOnly",
          isActive: false,
          isDefault: false,
        },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldChange = (field: keyof SubscriptionPackage, value: any) => {
    onChange?.({ [field]: value });
  };

  const onSubmit = async (values: z.infer<typeof subscriptionSchema>) => {
    try {
      setIsSubmitting(true);
      setFormError("");

      const activeCount = subscriptionPackages.filter((p) => p.isActive).length;
      const isActivating =
        values.isActive && (!selectedPackage || !selectedPackage.isActive);

      if (isActivating && activeCount >= 10) {
        setFormError(
          `Bạn đang có ${activeCount} gói đang hoạt động, cân nhắc trước khi kích hoạt thêm.`
        );
        setIsSubmitting(false);
      }

      const isEditing = !!(selectedPackage && selectedPackage.id);
      const method = isEditing ? "PUT" : "POST";
      const url = "/api/subscription";
      const payload = isEditing
        ? { ...values, id: selectedPackage?.id }
        : values;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save subscription");

      if (isEditing) {
        toast.success("Gói đăng ký đã được cập nhật!");
      } else {
        toast.success("Gói đăng ký mới đã được tạo!");
      }

      fetchSubscriptions();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi lưu gói đăng ký.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPackage) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/subscription/${selectedPackage.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete subscription");

      toast.success("Gói đăng ký đã bị xóa!");

      fetchSubscriptions();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi xóa gói đăng ký.");
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  // Live update
  const { watch } = form;

  useEffect(() => {
    const subscription = watch((values) => {
      onChange?.(values as Partial<SubscriptionPackage>);

      // Show warning immediately if activating and limit exceeded
      if (values.isActive) {
        const activeCount = subscriptionPackages.filter(
          (p) => p.isActive && p.id !== selectedPackage?.id
        ).length;

        if (activeCount >= 5) {
          setFormError(`Chú ý! Bạn đang có ${activeCount} gói đang hoạt động.`);
        } else {
          setFormError("");
        }
      } else {
        setFormError("");
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, subscriptionPackages, selectedPackage, onChange]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const numericField = (field: any, key: keyof SubscriptionPackage) => ({
    ...field,
    type: "number",
    value: field.value ?? 0,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number.isNaN(e.target.valueAsNumber)
        ? 0
        : e.target.valueAsNumber;
      field.onChange(val);
      handleFieldChange(key, val);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 text-sm p-3"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên gói</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập tên gói" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Purchase Method */}
        <FormField
          control={form.control}
          name="purchaseMethod"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Phương thức</FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  handleFieldChange("purchaseMethod", val);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn phương thức thanh toán..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MoneyOnly">Tiền</SelectItem>
                  <SelectItem value="PointsOnly">Điểm</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price & Points */}
        {form.watch("purchaseMethod") === "MoneyOnly" && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá tiền</FormLabel>
                <FormControl>
                  <Input {...numericField(field, "price")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("purchaseMethod") === "PointsOnly" && (
          <FormField
            control={form.control}
            name="pointsCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Điểm</FormLabel>
                <FormControl>
                  <Input {...numericField(field, "pointsCost")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Duration */}
        <FormField
          control={form.control}
          name="durationDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số ngày</FormLabel>
              <FormControl>
                <Input {...numericField(field, "durationDays")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reward Points */}
        <FormField
          control={form.control}
          name="rewardPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Điểm thưởng</FormLabel>
              <FormControl>
                <Input {...numericField(field, "rewardPoints")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active */}
        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(val) => {
                      field.onChange(val);
                      handleFieldChange("isActive", val);
                    }}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Hoạt động</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* Error */}
        {formError && (
          <div className="flex items-center text-red-500 font-semibold text-sm gap-2">
            <AlertTriangle size={16} />
            {formError}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          {selectedPackage && (
            <Button
              type="button"
              disabled={isDeleting}
              variant={confirmDelete ? "destructive" : "secondary"}
              onClick={handleDelete}
              className={cn(
                "min-w-[100px]",
                confirmDelete && "bg-red-600 text-white"
              )}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> Đang xóa...
                </>
              ) : (
                <>{confirmDelete ? "Xác nhận" : "Xóa"}</>
              )}
            </Button>
          )}

          <div className="flex gap-2">
            <Button type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "min-w-[90px] text-white",
                "bg-yellow-500 hover:bg-yellow-600"
              )}
            >
              {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
              {selectedPackage ? "Lưu" : "Tạo"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
