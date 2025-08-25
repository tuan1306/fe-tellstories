"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Bug, Maximize2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ResolveItem } from "./ApproveProblemAlertDialog";
import { BugIssue } from "@/app/types/issue-report";

export function ViewBugSheet({
  children,
  bug,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  bug: BugIssue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (open && bug) {
      setLoading(true);
      setTimeout(() => setLoading(false), 300);
    }
  }, [open, bug]);

  if (!bug) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="sm:w-[480px] w-full flex flex-col">
        <ScrollArea className="h-full mr-2 flex-1">
          <div className="p-5">
            <SheetHeader className="p-0 flex justify-between items-start">
              <div>
                <SheetTitle className="text-2xl flex items-center gap-2">
                  <Bug className="w-6 h-6 text-orange-500" />
                  Lỗi trong hệ thống
                </SheetTitle>
                <SheetDescription>
                  Trang thông tin chi tiết về lỗi báo báo bởi người dùng. Sử
                  dụng trang này để kiểm tra và xử lý sự cố với team.
                </SheetDescription>
              </div>
            </SheetHeader>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src={bug.user.avatarUrl ?? "/fallback.jpg"}
                  alt={bug.user.displayName}
                  width={40}
                  height={40}
                  className="rounded-full border"
                />
                <div>
                  <p>
                    <strong>Báo cáo bởi:</strong>{" "}
                    <Link
                      href={`/owner/usermanagement/users/${bug.user.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {bug.user.displayName}
                    </Link>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(bug.createdDate).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {bug.attachment && (
              <div className="mt-4">
                <strong>Attachment:</strong>
                <div className="mt-2 relative w-full h-64">
                  <Image
                    src={bug.attachment}
                    alt="Bug attachment"
                    fill
                    className="object-contain rounded border"
                  />

                  <button
                    onClick={() => setExpanded(true)}
                    className="absolute top-6 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Fullscreen */}
            {expanded && (
              <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="https://images.pexels.com/photos/33545207/pexels-photo-33545207.jpeg"
                    alt="Bug attachment fullscreen"
                    fill
                    className="object-contain"
                  />
                  <button
                    onClick={() => setExpanded(false)}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-50"
                    aria-label="Close image viewer"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4">
              <strong>Attachment:</strong>
              <div className="mt-2 relative w-full h-64">
                <Image
                  src="https://images.pexels.com/photos/33545207/pexels-photo-33545207.jpeg"
                  alt="Bug attachment"
                  fill
                  className="object-contain rounded"
                />

                <button
                  onClick={() => setExpanded(true)}
                  className="absolute top-6 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {bug.description && (
              <div className="mt-4">
                <strong>Nội dung:</strong>
                <p className="whitespace-pre-wrap mt-2">{bug.description}</p>
              </div>
            )}

            <div className="mt-4">
              <ResolveItem
                itemId={bug.id}
                userId={bug.user.id}
                onSuccess={() => onOpenChange(false)}
                className="w-full"
              />
            </div>

            {loading && (
              <div className="flex justify-center mt-6">
                <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
