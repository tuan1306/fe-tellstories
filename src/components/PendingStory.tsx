import { PendingStoryRequest } from "@/app/types/story";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReviewStoryDialog from "./ReviewStoryDialog";

export function PendingStory({ items }: { items: PendingStoryRequest[] }) {
  // Approval
  const [openApproveId, setOpenApproveId] = useState<string | null>(null);
  const [openDenyId, setOpenDenyId] = useState<string | null>(null);

  const handlePointAdding = async (userId: string, points: number) => {
    await fetch(`/api/wallet/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        amount: points,
      }),
    });
    setOpenApproveId(null);
  };

  const handleApprove = async (itemId: string, notes: string) => {
    await fetch("/api/stories/pending", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: itemId,
        action: "approve",
        reviewNotes: notes || "Approved by admin",
      }),
    });
    setOpenApproveId(null);
  };

  const handleDeny = async (itemId: string, notes: string) => {
    await fetch("/api/stories/pending", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: itemId,
        action: "reject",
        reviewNotes: notes || "Rejected by admin",
      }),
    });
    setOpenDenyId(null);
  };

  const router = useRouter();

  return (
    <div className="space-y-4 w-full">
      {items.map((item) => {
        const story = item.story;
        return (
          <div
            key={item.id}
            className="p-4 rounded-md border bg-muted/20 relative space-y-2"
          >
            <div className="flex items-start gap-4">
              <div className="relative w-30 h-44 rounded-md overflow-hidden shrink-0">
                {story.coverImageUrl ? (
                  <Image
                    src={story.coverImageUrl}
                    alt={story.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-muted w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    Không bìa
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center flex-1 space-y-1">
                <p className="text-xl font-bold text-yellow-300">
                  {story.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {story.author?.trim() ? story.author : "Unknown author"}
                </p>
                <p className="text-base">{story.description}</p>
              </div>
            </div>
            {/* Action Dropdown */}
            <div className="absolute top-2 right-2">
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
                  <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push(`/owner/stories/${story.id}`)}
                  >
                    Xem chi tiết câu truyện
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpenApproveId(item.id);
                    }}
                  >
                    Phê duyệt
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpenDenyId(item.id);
                    }}
                  >
                    Từ chối
                  </DropdownMenuItem>

                  <ReviewStoryDialog
                    open={openApproveId === item.id}
                    onOpenChange={() => setOpenApproveId(null)}
                    title="Ghi chú phê duyệt truyện"
                    confirmLabel="Phê duyệt"
                    confirmDesc="Nhập ghi chú phê duyệt (không bắt buộc)."
                    confirmColor="green"
                    onConfirm={async (notes: string, points?: number) => {
                      await handleApprove(item.id, notes);

                      if (points) {
                        await handlePointAdding(
                          item.story.createdBy.id,
                          points
                        );
                      }
                    }}
                  />

                  <ReviewStoryDialog
                    open={openDenyId === item.id}
                    onOpenChange={() => setOpenDenyId(null)}
                    title="Lý do từ chối truyện"
                    confirmLabel="Từ chối"
                    confirmDesc="Nhập lý do từ chối truyện."
                    confirmColor="red"
                    onConfirm={(notes: string) => handleDeny(item.id, notes)}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
}
