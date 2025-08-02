"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RecentSubscriber } from "@/app/types/subscription";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

export function RecentSubscribersList({
  recentSubscribers,
}: {
  recentSubscribers: RecentSubscriber[];
}) {
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
                <div>
                  <p className="font-medium text-white">
                    {recentSub.user.displayName}
                  </p>
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
                    onClick={() =>
                      console.log("See more clicked for", recentSub.user.id)
                    }
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
    </div>
  );
}
