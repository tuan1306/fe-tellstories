"use client";

import { ActivityLog } from "@/app/types/activitylog";
import { UserDetails } from "@/app/types/user";
import CardList from "@/components/CardList";
import { EditUserSheet } from "@/components/EditUserSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet } from "@/components/ui/sheet";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [activity, setActivity] = useState<ActivityLog[]>([]);

  async function fetchUserById(id: string): Promise<UserDetails | null> {
    try {
      const res = await fetch(`/api/users/${id}`);

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to fetch user:", err.message);
        return null;
      }

      const json = await res.json();
      return json.data as UserDetails;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  async function fetchUserActivity(userId: string) {
    try {
      const res = await fetch(`/api/activitylog/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch activity");
      const json: { data: ActivityLog[] } = await res.json();
      const logs = json.data.filter((log) => log.user.id === userId);
      setActivity(logs);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (typeof id === "string") {
      fetchUserById(id).then(setUser);
      fetchUserActivity(id);
    }
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="mt-4 flex flex-col xl:flex-row gap-8">
      {/* LEFT */}
      <div className="w-full xl:w-1/3 space-y-6">
        {/* Info */}
        <div className="bg-primary-foreground p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="w-1/2">
              <h1 className="text-xl font-semibold">User Information</h1>
              <h1 className="text-sm font-semibold text-muted-foreground">
                User personal details
              </h1>
            </div>
            <Sheet>
              <EditUserSheet
                user={user}
                onSuccess={() => fetchUserById(id as string).then(setUser)}
              >
                <Button>Edit User</Button>
              </EditUserSheet>
            </Sheet>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">ID:</span>
              <span>{user.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Email:</span>
              <span>{user.email}</span>
              <HoverCard>
                <HoverCardTrigger>
                  <BadgeCheck
                    size={24}
                    className="rounded-full bg-green-500/30 border border-green-500/50 p-1"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Verified User</h1>
                  <p className="text-sm text-muted-foreground">
                    This user has verified their email account.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Phone:</span>
              <span>{user.phoneNumber || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">DOB:</span>
              <span>{user.dob?.slice(0, 10)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Role:</span>
              <Badge>{user.userType}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Status:</span>
              <Badge>{user.status}</Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Joined on {user.createdDate?.slice(0, 10)}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Updated on {user.updatedDate?.slice(0, 10)}
          </p>
        </div>
        {/* Card list */}
        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList title="Recent Published" />
        </div>
        <div className="bg-primary-foreground p-4 mb-5 rounded-lg">
          <CardList title="Recent Followers" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-2/3 space-y-6">
        <div className="bg-primary-foreground p-4 rounded-lg space-y-2">
          <div className="flex items-start gap-4">
            <Avatar className="size-50 rounded-xl">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt="User Avatar" />
              ) : (
                <AvatarFallback>
                  {user.displayName?.slice(0, 2).toUpperCase() || "NA"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-4xl mb-3 font-semibold">
                {user.displayName}
              </h1>
              <p className="text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse porttitor justo neque, non semper odio lobortis sed.
                Ut sed porta arcu, ac vestibulum nisl. Vestibulum dapibus
                finibus turpis, vel accumsan justo feugiat sed. Donec risus
                mauris, malesuada in est nec, maximus semper ipsum. Vivamus eu
                placerat justo. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Curabitur ornare sapien blandit nisl pharetra,
                vel venenatis tortor condimentum. Vestibulum non accumsan magna.
                Fusce dignissim ornare ipsum, eget tincidunt eros tristique in.
              </p>
            </div>
          </div>
        </div>
        {/* Funny User activity */}
        {/* <div className="bg-primary-foreground p-4 rounded-lg">
          <h1 className="text-xl font-semibold">User Activity</h1>
          <h1 className="text-sm font-semibold text-muted-foreground">
            This section records the user recent activity on the platform
          </h1>
          <div className="bg-card mt-4 p-5 rounded-lg space-y-2">
            <div className="flex items-center ">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="pl-3 truncate max-w-full">
                15-06-2025 - JermaNguyen (comment): Yeah dude the story was
                alright, I would give it around 10/11 rating
              </span>
            </div>
            <div className="flex items-center ">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="pl-3 truncate max-w-full">
                15-06-2025 - JermaNguyen (rating): Something walked Among Us
                (story) - 3/5
              </span>
            </div>
            <div className="flex items-center ">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="pl-3 truncate max-w-full">
                15-06-2025 - JermaNguyen (publish): The Impostor Syndrome
                (story) - Submitted for evaluation
              </span>
            </div>
            <div className="flex items-center ">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="pl-3 truncate max-w-full">
                15-06-2025 - JermaNguyen (publish): The Impostor Syndrome
                (story) - Has been accepted for publication
              </span>
            </div>
            <div className="flex items-center ">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="pl-3 truncate max-w-full">
                15-06-2025 - JermaNguyen (system): User logged out
              </span>
            </div>
          </div>
        </div> */}

        <div className="bg-primary-foreground p-4 rounded-lg">
          <h1 className="text-xl font-semibold">User Activity</h1>
          <h1 className="text-sm font-semibold text-muted-foreground">
            This section records the user recent activity on the platform
          </h1>
          <div className="bg-card mt-4 p-5 rounded-lg">
            <ScrollArea className="h-[210px] space-y-2 pr-4">
              {activity.map((log) => (
                <div key={log.id} className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      log.action === "Comment" || log.action === "Rating"
                        ? "bg-yellow-500"
                        : log.action === "Publish"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="pl-3 truncate max-w-full">
                    {log.details}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>

        {/* Funny User publishes */}
        <div className="bg-primary-foreground p-4 rounded-lg">
          <h1 className="text-xl font-semibold">User Publishes</h1>
          <h1 className="text-sm font-semibold text-muted-foreground">
            This section records the user publishes on the platform
          </h1>

          <div className="mt-4">
            <div className="bg-card mt-4 p-5 rounded-lg">
              <ScrollArea className="w-full h-[405px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4">
                  <div className="space-y-2">
                    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl">
                      <Image
                        src="/Cover/Cover2.jpg"
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h1 className="text-sm font-semibold text-muted-foreground">
                      JermaNguyen
                    </h1>
                    <h1 className="text-xl font-semibold">
                      Beyond the Ocean Floor
                    </h1>
                  </div>

                  <div className="space-y-2">
                    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl">
                      <Image
                        src="/Cover/Cover3.jpg"
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h1 className="text-sm font-semibold text-muted-foreground">
                      JermaNguyen
                    </h1>
                    <h1 className="text-xl font-semibold">The Secret Garden</h1>
                  </div>

                  <div className="space-y-2">
                    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl">
                      <Image
                        src="/Cover/Cover4.jpg"
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h1 className="text-sm font-semibold text-muted-foreground">
                      JermaNguyen
                    </h1>
                    <h1 className="text-xl font-semibold">
                      Hungry For Her Wolves
                    </h1>
                  </div>

                  <div className="space-y-2">
                    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl">
                      <Image
                        src="/Cover/Cover5.jpg"
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h1 className="text-sm font-semibold text-muted-foreground">
                      JermaNguyen
                    </h1>
                    <h1 className="text-xl font-semibold">Greenthumb poppy</h1>
                  </div>

                  <div className="space-y-2">
                    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl">
                      <Image
                        src="/Cover/Cover6.jpg"
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h1 className="text-sm font-semibold text-muted-foreground">
                      JermaNguyen
                    </h1>
                    <h1 className="text-xl font-semibold">
                      The story of a little frog
                    </h1>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
