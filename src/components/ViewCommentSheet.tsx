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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CommentDetail, CommentSummary } from "@/app/types/comment";

function CommentThread({ comment }: { comment: CommentDetail }) {
  return (
    <div className="mt-4 pl-3 border-l-2 border-muted space-y-4">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={comment.user.avatarUrl} />
          <AvatarFallback>
            {comment.user.displayName?.[0] ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <Link
            href={`/owner/usermanagement/users/${comment.id}`}
            className="font-medium text-primary hover:underline"
          >
            {comment.user.displayName}
          </Link>
          <div className="text-sm text-muted-foreground">
            {new Date(comment.createdDate).toLocaleString()}
          </div>
          <p className="mt-1">{comment.content}</p>
        </div>
      </div>

      {/* Replies recursion */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-4 border-l border-muted space-y-4">
          {comment.replies.map((reply) => (
            <CommentThread key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ViewCommentSheet({
  children,
  comment,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  comment: CommentSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [detailedComment, setDetailedComment] = useState<CommentDetail | null>(
    null
  );

  useEffect(() => {
    if (open && comment) {
      setLoading(true);
      fetch(`/api/comments/thread/${comment.id}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setDetailedComment(json.data);
          } else {
            setDetailedComment(null);
            console.error("Failed to load comment thread");
          }
        })
        .catch((e) => {
          setDetailedComment(null);
          console.error("Error fetching comment thread", e);
        })
        .finally(() => setLoading(false));
    } else {
      setDetailedComment(null);
    }
  }, [open, comment]);

  if (!comment) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="sm:w-[480px] w-full">
        <ScrollArea className="h-full mr-2">
          <div className="p-5">
            <SheetHeader className="p-0">
              <SheetTitle className="text-2xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comment Details
              </SheetTitle>
              <SheetDescription>
                This comment was flagged for{" "}
                <strong className="text-red-500">
                  {comment.flaggedReason}
                </strong>{" "}
              </SheetDescription>
            </SheetHeader>

            {loading ? (
              <div className="flex justify-center mt-6">
                <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
              </div>
            ) : detailedComment ? (
              <div className="mt-6 space-y-6">
                <CommentThread comment={detailedComment} />
              </div>
            ) : (
              <p className="mt-6 text-muted-foreground">
                No detailed comment found.
              </p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
