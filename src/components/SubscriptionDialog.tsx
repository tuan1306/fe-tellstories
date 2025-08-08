"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { subscriptionSchema } from "@/utils/validators/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Plus,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SubscriptionPackage } from "@/app/types/subscription";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props {
  subscriptionPackages: SubscriptionPackage[];
  fetchSubscriptions: () => void;
}

export const SubscriptionDialog = ({
  subscriptionPackages,
  fetchSubscriptions,
}: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] =
    useState<SubscriptionPackage | null>(null);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const form = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      price: 0,
      type: "string",
      durationDays: 0,
      pointsCost: 0,
      purchaseMethod: "MoneyOnly",
      isActive: false,
      isDefault: false,
    },
  });

  useEffect(() => {
    if (selectedPackage) {
      form.reset({
        name: selectedPackage.name,
        price: selectedPackage.price,
        type: selectedPackage.type,
        durationDays: selectedPackage.durationDays,
        pointsCost: selectedPackage.pointsCost ?? 0,
        purchaseMethod: selectedPackage.purchaseMethod ?? "MoneyOnly",
        isActive: selectedPackage.isActive,
        isDefault: selectedPackage.isDefault,
      });
      setShowForm(true);
    }
  }, [selectedPackage]);

  const onSubmit = async (values: z.infer<typeof subscriptionSchema>) => {
    try {
      const activeCount = subscriptionPackages.filter((p) => p.isActive).length;
      const isActivating =
        values.isActive && (!selectedPackage || !selectedPackage.isActive);

      if (isActivating && activeCount >= 5) {
        setFormError(
          `Bạn đang có ${activeCount} gói đang hoạt động, cân nhắc kĩ trước khi kích hoạt thêm.`
        );
      } else {
        setFormError("");
      }

      setIsSubmitting(true);
      const method = selectedPackage ? "PUT" : "POST";
      const url = "/api/subscription";

      const payload = selectedPackage
        ? { ...values, type: "Default", id: selectedPackage.id }
        : { ...values, type: "Default" };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save subscription package");

      setShowForm(false);
      setSelectedPackage(null);
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
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
      setIsDelete(true);
      const res = await fetch(`/api/subscription/${selectedPackage.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete subscription");

      setShowForm(false);
      setSelectedPackage(null);
      fetchSubscriptions();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setConfirmDelete(false);
      setIsDelete(false);
    }
  };

  const SubscriptionDetails = ({ pkg }: { pkg: SubscriptionPackage }) => (
    <div className="text-sm text-muted-foreground space-y-1">
      {pkg.price != null && pkg.price !== 0 && (
        <p>
          <strong>Số tiền quy đổi: </strong>
          {new Intl.NumberFormat("vi-VN").format(pkg.price)} VND
        </p>
      )}

      {pkg.pointsCost != null && pkg.pointsCost !== 0 && (
        <p>
          <strong>Số điểm quy đổi:</strong> {pkg.pointsCost} Điểm
        </p>
      )}
      <p>
        <strong>Phương thức thanh toán:</strong>{" "}
        {{
          MoneyOnly: "Tiền",
          PointsOnly: "Điểm",
          MoneyOrPoints: "Tiền & Điểm",
        }[pkg.purchaseMethod] ?? "N/A"}
      </p>

      <p>
        <strong>Thời gian hoạt động:</strong> {pkg.durationDays} days
      </p>
      <p>
        <strong>Hoạt động:</strong> {pkg.isActive ? "Có" : "Không"}
      </p>
      <Button
        variant="link"
        className="px-0 text-sm cursor-pointer text-chart-1"
        onClick={() => setSelectedPackage(pkg)}
      >
        Chỉnh sửa gói
      </Button>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-4 w-full px-4 py-2 cursor-pointer">
          Quản lý gói đăng ký
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[700px] max-w-full max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {showForm ? "Đăng ký gói mới" : "Hệ thống quản lý gói"}
          </DialogTitle>
          <DialogDescription>
            {showForm
              ? "Vui lòng điền đầy đủ thông tin để tạo gói đăng ký mới."
              : "Xem hoặc quản lý các gói đăng ký hiện có bên dưới."}
          </DialogDescription>
          {!showForm && (
            <Button
              className="w-full mt-4 cursor-pointer"
              onClick={() => {
                setSelectedPackage(null);
                form.reset({
                  name: "",
                  price: 0,
                  type: "",
                  durationDays: 0,
                  pointsCost: 0,
                  purchaseMethod: "MoneyOnly",
                  isActive: false,
                  isDefault: false,
                });
                setShowForm(true);
              }}
            >
              {/* Sorry monkey code */}
              <Plus />
              Tạo gói mới
            </Button>
          )}
        </DialogHeader>

        <ScrollArea className="h-[40vh] pr-4">
          {showForm ? (
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Method */}
                <FormField
                  control={form.control}
                  name="purchaseMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phương thức</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select purchase method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MoneyOnly">Tiền</SelectItem>
                          <SelectItem value="PointsOnly">Điểm</SelectItem>
                          <SelectItem value="MoneyOrPoints">
                            Tiền & Điểm
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Money */}
                {form.watch("purchaseMethod") &&
                  form.watch("purchaseMethod") !== "PointsOnly" && (
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số tiền quy đổi (VND)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={
                                Number.isNaN(field.value) ? "" : field.value
                              }
                              onChange={(e) => {
                                const val = e.target.valueAsNumber;
                                field.onChange(
                                  Number.isNaN(val) ? undefined : val
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                {/* Points */}
                {form.watch("purchaseMethod") &&
                  form.watch("purchaseMethod") !== "MoneyOnly" && (
                    <FormField
                      control={form.control}
                      name="pointsCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điểm quy đổi</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={
                                Number.isNaN(field.value) ? "" : field.value
                              }
                              onChange={(e) => {
                                const val = e.target.valueAsNumber;
                                field.onChange(
                                  Number.isNaN(val) ? undefined : val
                                );
                              }}
                            />
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
                      <FormLabel>Số ngày gia hạn</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={Number.isNaN(field.value) ? "" : field.value}
                          onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            field.onChange(Number.isNaN(val) ? undefined : val);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Active */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Kích hoạt
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {formError && (
                  <div className="flex items-center gap-2 text-yellow-600 bg-yellow-100 p-2 rounded">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">{formError}</p>
                  </div>
                )}

                <div className="flex justify-between items-center gap-2">
                  {selectedPackage && (
                    <Button
                      type="button"
                      disabled={isDelete}
                      variant={confirmDelete ? "destructive" : "secondary"}
                      onClick={handleDelete}
                      className={cn(
                        "transition-all duration-200 ease-in-out min-w-[100px] cursor-pointer flex items-center justify-center gap-1",
                        confirmDelete ? "bg-red-600 text-white" : ""
                      )}
                    >
                      {isDelete ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4" />
                          <span>Đang xóa...</span>
                        </>
                      ) : (
                        <>{confirmDelete ? "Xác nhận" : "Xóa"}</>
                      )}
                    </Button>
                  )}
                  <div className="ml-auto flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => {
                        setShowForm(false);
                        setSelectedPackage(null);
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      className={cn(
                        "cursor-pointer flex items-center gap-2 transition-all duration-300 ease-in-out min-w-[90px] justify-center",
                        confirmSubmit
                          ? "min-w-[110px] bg-yellow-500 text-white hover:bg-yellow-600"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      onClick={() => {
                        if (formError && !confirmSubmit) {
                          setConfirmSubmit(true);
                          setTimeout(() => setConfirmSubmit(false), 3000);
                        } else {
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    >
                      {isSubmitting && (
                        <Loader2 className="animate-spin w-4 h-4" />
                      )}
                      {confirmSubmit
                        ? "Xác nhận"
                        : selectedPackage
                        ? "Lưu"
                        : "Tạo"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          ) : subscriptionPackages.length === 0 ? (
            <p className="text-muted-foreground text-sm mt-4 text-center">
              Hiện tại đang không có gói, hãy thêm gói .3.
            </p>
          ) : (
            <div className="space-y-6 my-4">
              <div>
                <h3 className="text-lg font-bold text-green-500 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Các gói đang hoạt động
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {subscriptionPackages
                    .filter((pkg) => pkg.isActive)
                    .map((pkg, i) => (
                      <AccordionItem
                        key={pkg.id}
                        value={`active-${pkg.name}-${i}`}
                      >
                        <AccordionTrigger className="cursor-pointer">
                          {pkg.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <SubscriptionDetails pkg={pkg} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>

              <div>
                <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Các gói đăng ký không hoạt động
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {subscriptionPackages
                    .filter((pkg) => !pkg.isActive)
                    .map((pkg, i) => (
                      <AccordionItem
                        key={pkg.id}
                        value={`inactive-${pkg.name}-${i}`}
                      >
                        <AccordionTrigger className="cursor-pointer">
                          {pkg.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <SubscriptionDetails pkg={pkg} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
