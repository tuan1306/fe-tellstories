"use client";

import { useState, ReactNode, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { vi } from "date-fns/locale";
import { parseISO, format, addYears } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";

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
  const [form, setForm] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "/fallback.jpg",
    phoneNumber: user?.phoneNumber || "",
    dob: user?.dob || "",
    status: user?.status || "",
  });

  const [dob, setDob] = useState<Date | undefined>(
    form.dob ? parseISO(form.dob) : undefined
  );
  const maxDate = addYears(new Date(), -18);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      displayName: user?.displayName || "",
      email: user?.email || "",
      avatarUrl: user?.avatarUrl || "/fallback.jpg",
      phoneNumber: user?.phoneNumber || "",
      dob: user?.dob || "",
      status: user?.status || "",
    });
  }, [user]);

  useEffect(() => {
    if (form.dob) setDob(parseISO(form.dob));
  }, [form.dob]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
              <AvatarImage src={form.avatarUrl} alt={form.displayName} />
              <AvatarFallback className="text-lg">
                {form.displayName
                  ? form.displayName.charAt(0).toUpperCase()
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setForm((prev) => ({ ...prev, avatarUrl: url }));
                }
              }}
            />

            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            value={form.displayName}
            onChange={(e) => handleChange("displayName", e.target.value)}
            placeholder="Tên hiển thị"
          />
          <Input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
          />
          <Input
            value={form.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="Số điện thoại"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
              >
                {dob
                  ? format(dob, "dd/MM/yyyy", { locale: vi })
                  : "Chọn ngày sinh"}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dob}
                onSelect={(date) => {
                  if (!date) return;
                  setDob(date);
                  setForm({ ...form, dob: format(date, "yyyy-MM-dd") });
                }}
                locale={vi}
                disabled={(date) => date > maxDate}
                captionLayout="dropdown"
                defaultMonth={dob || maxDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
