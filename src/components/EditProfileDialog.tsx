"use client";

import { useEffect, ReactNode, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";
import { parseISO, format, addYears } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { profileSchema } from "@/utils/validators/schemas";

interface EditProfileProps {
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    phoneNumber?: string;
    userType: string;
    status?: string;
    dob?: string;
  } | null;
  children?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({
  user,
  children,
  open,
  onOpenChange,
}: EditProfileProps) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
      avatarUrl: user?.avatarUrl || "/fallback.jpg",
      phoneNumber: user?.phoneNumber || "",
      dob: user?.dob || "",
      status: user?.status || "",
    },
  });

  // Loading
  const [loading, setLoading] = useState(false);

  // is the information dirty
  const { isDirty } = form.formState;

  const dobValue: string | undefined = form.watch("dob");
  const dobDate: Date | undefined = dobValue ? parseISO(dobValue) : undefined;
  const maxDate = addYears(new Date(), -18);

  // Reset form when closes
  useEffect(() => {
    if (user) {
      form.reset({
        displayName: user.displayName || "",
        email: user.email || "",
        avatarUrl: user.avatarUrl || "/fallback.jpg",
        phoneNumber: user.phoneNumber || "",
        dob: user.dob || "",
        status: user.status || "",
      });
    }
  }, [user, form, open]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setLoading(true);
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        toast.error("Cập nhật thông tin thất bại");
        return;
      }

      toast.success("Cập nhật thông tin thành công");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin</DialogTitle>
          <DialogDescription>
            Thay đổi thông tin cơ bản của tài khoản.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center my-4">
          <div className="w-24 h-24 relative cursor-pointer group">
            <Avatar className="w-full h-full">
              <AvatarImage
                src={form.getValues("avatarUrl")}
                alt={form.getValues("displayName")}
              />
              <AvatarFallback className="text-lg">
                {form.getValues("displayName")
                  ? form.getValues("displayName").charAt(0).toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-gray-500 bg-opacity-20 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
              <span className="text-white text-sm">Thay đổi</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar-upload"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                try {
                  const formData = new FormData();
                  formData.append("file", file);

                  const res = await fetch("/api/cdn/upload", {
                    method: "POST",
                    body: formData,
                  });

                  if (!res.ok) {
                    const data = await res.json();
                    toast.error(data.message || "Đăng tải thất bại");
                    return;
                  }

                  const data = await res.json();
                  form.setValue("avatarUrl", data.url);
                  toast.success("Ảnh đại diện đã được cập nhật!");
                } catch (err) {
                  console.error(err);
                  toast.error("Đã xảy ra lỗi khi đăng tải ảnh.");
                }
              }}
            />

            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 cursor-pointer"
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên hiển thị</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tên hiển thị" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="Email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Số điện thoại" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full flex justify-between"
                      >
                        {dobDate
                          ? format(dobDate, "dd/MM/yyyy", { locale: vi })
                          : "Chọn ngày sinh"}
                        <CalendarIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dobDate}
                        onSelect={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        locale={vi}
                        disabled={(date) => date > maxDate}
                        captionLayout="dropdown"
                        defaultMonth={dobDate || maxDate}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading || !isDirty}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
