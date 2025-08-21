"use client";

import { useState } from "react";
import { DataTable } from "./data-table";
import {
  BillingHistoryItem,
  SubscriptionInfo,
} from "@/app/types/billing-history";
import { columns } from "./columns";
import SubscriptionDetailDialog from "@/components/SubscriptionDetailDialog";

interface Props {
  billingData: BillingHistoryItem[];
}

export function DataTableWrapper({ billingData }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<SubscriptionInfo | null>(
    null
  );

  const openDialog = (bill: BillingHistoryItem) => {
    setSelectedDetail(bill.subscription);
    setOpen(true);
  };

  return (
    <>
      <DataTable columns={columns(openDialog)} data={billingData} />

      <SubscriptionDetailDialog
        open={open}
        onOpenChange={setOpen}
        loading={false}
        detail={selectedDetail || undefined}
      />
    </>
  );
}
