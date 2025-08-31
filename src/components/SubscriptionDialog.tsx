"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClipboardList, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubscriptionPackage } from "@/app/types/subscription";
import { SubscriptionForm } from "./SubscriptionForm";
import { SubscriptionDetails } from "./SubscriptionDetails";
import { Input } from "./ui/input";
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
  const [selectedPackage, setSelectedPackage] =
    useState<SubscriptionPackage | null>(null);
  const [editingPackage, setEditingPackage] =
    useState<SubscriptionPackage | null>(null);
  const [formPreview, setFormPreview] = useState<Partial<SubscriptionPackage>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive">(
    "active"
  );

  const handleSelect = (pkg: SubscriptionPackage) => {
    setSelectedPackage(pkg);
  };

  const handleCreate = () => {
    setEditingPackage({} as SubscriptionPackage);
    setFormPreview({});
    setSelectedPackage(null);
  };

  const handleEdit = (pkg: SubscriptionPackage) => {
    setEditingPackage(pkg);
    setFormPreview({});
    setSelectedPackage(pkg);
  };

  const handleCloseForm = () => {
    setEditingPackage(null);
    setFormPreview({});
  };

  // Filter
  const filteredPackages = subscriptionPackages.filter((pkg) => {
    const matchesSearch = pkg.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      (statusFilter === "active" && pkg.isActive) ||
      (statusFilter === "inactive" && !pkg.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <ClipboardList /> Quản lý gói đăng ký
        </Button>
      </DialogTrigger>

      <DialogContent className="!w-[90vw] !max-w-[1100px] !h-[75vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Hệ thống quản lý gói</DialogTitle>
          <DialogDescription>
            Quản lý, chỉnh sửa hoặc tạo mới các gói đăng ký.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-[2fr_1fr] gap-4 overflow-hidden min-h-0">
          {/* Left */}
          <div className="border rounded-lg p-4 flex flex-col h-full min-h-0">
            {editingPackage ? (
              <ScrollArea className="flex-1 min-h-0 pr-2">
                <SubscriptionForm
                  selectedPackage={editingPackage}
                  onClose={handleCloseForm}
                  fetchSubscriptions={fetchSubscriptions}
                  subscriptionPackages={subscriptionPackages}
                  onChange={(updatedFields) =>
                    setFormPreview((prev) => ({ ...prev, ...updatedFields }))
                  }
                  key={editingPackage.id ?? "new"}
                />
              </ScrollArea>
            ) : (
              <>
                <div className="mb-2">
                  <h3 className="font-semibold text-lg">Danh sách gói</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Danh sách tất cả các gói đăng ký hiện có trong hệ thống.
                  </p>
                  <Button
                    size="sm"
                    onClick={handleCreate}
                    className="w-full hover:cursor-pointer mb-2"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Tạo gói mới
                  </Button>

                  {/* Search + Filter */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tìm kiếm gói..."
                      className="w-[70%]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <Select
                      value={statusFilter}
                      onValueChange={(value: "active" | "inactive") =>
                        setStatusFilter(value)
                      }
                    >
                      <SelectTrigger className="w-[30%]">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Đang hoạt động</SelectItem>
                        <SelectItem value="inactive">
                          Không hoạt động
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <ScrollArea className="flex-1 min-h-0 pr-4">
                  {filteredPackages.length > 0 ? (
                    <div className="space-y-2">
                      {filteredPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => handleSelect(pkg)}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedPackage?.id === pkg.id
                              ? "border-primary bg-primary/10"
                              : "hover:bg-muted"
                          }`}
                        >
                          <h4 className="font-semibold">{pkg.name}</h4>
                          <p
                            className={`text-sm font-medium truncate ${
                              pkg.purchaseMethod === "PointsOnly"
                                ? "text-amber-300"
                                : pkg.purchaseMethod === "MoneyOnly"
                                ? "text-emerald-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {{
                              PointsOnly: "Điểm",
                              MoneyOnly: "Tiền",
                            }[pkg.purchaseMethod] ?? "Không xác định"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full mt-37">
                      <p className="text-sm text-muted-foreground text-center">
                        Không có gói .3.
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </>
            )}
          </div>

          {/* Right */}
          <div className="border rounded-lg p-4 flex flex-col h-full min-h-0">
            {selectedPackage || editingPackage ? (
              <SubscriptionDetails
                pkg={
                  {
                    ...(selectedPackage ?? {}),
                    ...formPreview,
                  } as SubscriptionPackage
                }
                onEdit={handleEdit}
                isCreating={!selectedPackage}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Chọn một gói để xem hoặc chỉnh sửa
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
