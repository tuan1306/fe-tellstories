"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RecentSubscriber } from "@/app/types/subscription";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";

export function RecentSubscribersList({
  recentSubscribers,
}: {
  recentSubscribers: RecentSubscriber[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSub, setSelectedSub] = useState<RecentSubscriber | null>(null);

  const handleViewDetails = (subscriber: RecentSubscriber) => {
    setSelectedSub(subscriber);
    setOpenDialog(true);
  };

  return (
    <div className="bg-card p-4 rounded-lg h-full">
      <h3 className="text-lg font-semibold">Recent Subscribers</h3>
      <p className="text-sm text-muted-foreground mb-4">
        A list of users who recently started a subscription.
      </p>

      <ScrollArea className="h-40 pr-6">
        <ul className="text-sm text-muted-foreground space-y-2">
          {recentSubscribers.map((recentSub, i) => (
            <li
              key={i}
              className="flex items-center justify-between px-4 py-2 rounded-md shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Link
                  href={`usermanagement/users/${recentSub.user.id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={recentSub.user.avatarUrl} />
                    <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                      {recentSub.user.displayName
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    href={`usermanagement/users/${recentSub.user.id}`}
                    className="flex items-center gap-3 hover:opacity-80 transition"
                  >
                    <p className="font-medium text-white">
                      {recentSub.user.displayName}
                    </p>
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {recentSub.subscriptionName} Plan
                  </p>
                </div>
              </div>

              {/* Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 cursor-pointer"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleViewDetails(recentSub)}
                    className="cursor-pointer"
                  >
                    View subscription details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      </ScrollArea>

      {/* details */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="pt-6 overflow-hidden">
          {/* funny circles */}
          <div className="absolute top-0 right-0 z-0">
            <div className="absolute -top-[140px] -right-[140px] w-[280px] h-[280px] rounded-full bg-[#1A293F] rotate-45 shadow-2xl/40" />
            <div className="absolute -top-[160px] -right-[160px] w-[280px] h-[280px] rounded-full bg-[#293E5C] rotate-45 shadow-xl/20" />
            <div className="absolute -top-[180px] -right-[180px] w-[280px] h-[280px] rounded-full bg-[#475F81] rotate-45 shadow-md/10" />
          </div>

          <DialogHeader className="z-10">
            <DialogTitle>Subscription Details</DialogTitle>
          </DialogHeader>

          {selectedSub && (
            <div className="z-10 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <strong className="text-slate-300">User:</strong>
                <Link
                  href={`usermanagement/users/${selectedSub.user.id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition"
                >
                  {selectedSub.user.displayName}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <strong className="text-slate-300">Plan:</strong>
                <Badge className="bg-amber-300 text-slate-800">
                  {selectedSub.subscriptionName}
                </Badge>
              </div>

              <p>
                <strong className="text-slate-300">Price: </strong>30,000 VND
              </p>

              <p>
                <strong className="text-slate-300">Duration: </strong>30 days
              </p>

              <p>
                <strong className="text-slate-300">Subscribed on: </strong> July
                30, 2025
              </p>

              <p>
                <strong className="text-slate-300">Original Expiry: </strong>
                August 29, 2025
              </p>

              <p>
                <strong className="text-slate-300">Expires on: </strong> October
                29, 2025
              </p>

              <p>
                <strong className="text-slate-300">Days Remaining: </strong> 27
                days
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
