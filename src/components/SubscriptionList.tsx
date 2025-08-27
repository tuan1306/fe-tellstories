"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SubscriptionPackage } from "@/app/types/subscription";
import { CheckCircle, XCircle } from "lucide-react";
import { SubscriptionDetails } from "./SubscriptionDetails";

interface Props {
  subscriptionPackages: SubscriptionPackage[];
  onEdit: (pkg: SubscriptionPackage) => void;
}

export const SubscriptionList = ({ subscriptionPackages, onEdit }: Props) => {
  const activePackages = subscriptionPackages.filter((pkg) => pkg.isActive);
  const inactivePackages = subscriptionPackages.filter((pkg) => !pkg.isActive);

  if (subscriptionPackages.length === 0) {
    return (
      <p className="text-muted-foreground text-sm mt-4 text-center">
        Hiện tại không có gói nào, hãy thêm gói mới.
      </p>
    );
  }

  return (
    <div className="space-y-6 my-4">
      {/* Active Packages */}
      <div>
        <h3 className="text-lg font-bold text-green-500 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Các gói đang hoạt động
        </h3>
        {activePackages.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {activePackages.map((pkg, i) => (
              <AccordionItem key={pkg.id} value={`active-${pkg.id}-${i}`}>
                <AccordionTrigger className="cursor-pointer">
                  {pkg.name}
                </AccordionTrigger>
                <AccordionContent>
                  <SubscriptionDetails pkg={pkg} onEdit={onEdit} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">
            Không có gói nào đang hoạt động.
          </p>
        )}
      </div>

      {/* Inactive Packages */}
      <div>
        <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          Các gói không hoạt động
        </h3>
        {inactivePackages.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {inactivePackages.map((pkg, i) => (
              <AccordionItem key={pkg.id} value={`inactive-${pkg.id}-${i}`}>
                <AccordionTrigger className="cursor-pointer">
                  {pkg.name}
                </AccordionTrigger>
                <AccordionContent>
                  <SubscriptionDetails pkg={pkg} onEdit={onEdit} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">
            Không có gói nào không hoạt động.
          </p>
        )}
      </div>
    </div>
  );
};
