"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Buyer = {
  name: string;
  plan: string;
  date: string;
};

export function RecentSubscribersList({ buyers }: { buyers: Buyer[] }) {
  return (
    <div className="bg-card p-4 rounded-lg h-full">
      <h3 className="text-lg font-semibold">Recent Subscribers</h3>
      <p className="text-sm text-muted-foreground mb-4">
        A list of users who recently started a subscription.
      </p>

      <ScrollArea className="h-40 pr-6">
        <ul className="text-sm text-muted-foreground space-y-2">
          {buyers.map((buyer, i) => (
            <li
              key={i}
              className="flex items-center justify-between px-4 py-2 rounded-md shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTENEYf8j4k89kg7aVflbvyPX9yOBhnXXT2w&s" />
                  <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                    {buyer.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-white">{buyer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {buyer.plan} Plan
                  </p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {buyer.date}
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
