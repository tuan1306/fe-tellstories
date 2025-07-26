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
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";
import React from "react";
import Link from "next/link";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorAvatarUrl?: string;
  replies?: Comment[];
  storyTitle: string;
  flaggedReason?: string;
};

function parseMentions(content: string) {
  // Capture the @username with () as capturing group
  const parts = content.split(/(@\w+)/g);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const username = part.slice(1);
      return (
        <Link
          key={index}
          href={`/admin/users/${username}`}
          className="text-primary font-medium bg-slate-600 rounded-2xl px-2 py-[0.5px] hover:bg-slate-700 cursor-pointer transition-colors"
        >
          {part}
        </Link>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function CommentThread({ comment }: { comment: Comment }) {
  return (
    <div className="mt-4 pl-3 border-l-2 border-muted space-y-4">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={comment.authorAvatarUrl} />
          <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <Link
            href={`/admin/users/${comment.id}`}
            className="font-medium text-primary hover:underline"
          >
            {comment.authorName}
          </Link>
          <div className="text-sm text-muted-foreground">
            {new Date(comment.createdAt).toLocaleString()}
          </div>
          <p className="mt-1">{parseMentions(comment.content)}</p>
        </div>
      </div>

      {/* Replies recursion */}
      {comment.replies?.length && (
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
  comment: Comment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
                <strong>{comment.flaggedReason}</strong> on{" "}
                <strong>{comment.storyTitle}</strong>
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.authorAvatarUrl} />
                  <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    href={`/admin/users/${comment.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {comment.authorName}
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                  <p className="mt-1">{parseMentions(comment.content)}</p>
                </div>
              </div>

              <Separator />

              {comment.replies?.length ? (
                <div className="space-y-4">
                  <div className="font-medium">Replies</div>
                  {comment.replies.map((reply) => (
                    <CommentThread key={reply.id} comment={reply} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No replies yet.</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
