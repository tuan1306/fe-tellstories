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
import { SubscriptionList } from "./SubscriptionList";

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

  const handleCreate = () => {
    setSelectedPackage(null);
    setShowForm(true);
  };

  const handleEdit = (pkg: SubscriptionPackage) => {
    setSelectedPackage(pkg);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedPackage(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-4 w-full">
          <ClipboardList /> Quản lý gói đăng ký
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[700px] max-w-full max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {showForm
              ? selectedPackage
                ? "Chỉnh sửa gói đăng ký"
                : "Đăng ký gói mới"
              : "Hệ thống quản lý gói"}
          </DialogTitle>
          <DialogDescription>
            {showForm
              ? selectedPackage
                ? "Vui lòng chỉnh sửa thông tin gói đăng ký."
                : "Vui lòng điền đầy đủ thông tin để tạo gói đăng ký mới."
              : "Xem hoặc quản lý các gói đăng ký hiện có bên dưới."}
          </DialogDescription>
          {!showForm && (
            <Button className="w-full mt-4" onClick={handleCreate}>
              <Plus /> Tạo gói mới
            </Button>
          )}
        </DialogHeader>

        <ScrollArea className="h-[40vh] pr-4">
          {showForm ? (
            <SubscriptionForm
              selectedPackage={selectedPackage}
              onClose={handleClose}
              fetchSubscriptions={fetchSubscriptions}
              subscriptionPackages={subscriptionPackages}
            />
          ) : (
            <SubscriptionList
              subscriptionPackages={subscriptionPackages}
              onEdit={handleEdit}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
