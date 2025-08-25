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
import {
  // CheckCircle,
  Loader2,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CommentDetail, CommentSummary } from "@/app/types/comment";
import { DeleteComment } from "./DeleteCommentAlertDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { StoryDetails } from "@/app/types/story";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

function CommentThread({
  comment,
  onDelete,
}: {
  comment: CommentDetail;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="mt-4 pl-3 border-l-2 border-muted space-y-4">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={comment.user.avatarUrl} />
          <AvatarFallback>
            {comment.user.displayName?.[0] ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <Link
              href={`/owner/usermanagement/users/${comment.user.id}`}
              className="font-medium text-primary hover:underline"
            >
              {comment.user.displayName}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-muted cursor-pointer">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <DeleteComment
                    commentId={comment.id}
                    onSuccess={(id) => onDelete(id)}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
            <CommentThread key={reply.id} comment={reply} onDelete={onDelete} />
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
  issueId: string;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  // const [resolving, setResolving] = useState(false);
  const [detailedComment, setDetailedComment] = useState<CommentDetail | null>(
    null
  );

  // Get the damn story
  const [story, setStory] = useState<StoryDetails | null>(null);
  // const { role } = useAuth();

  useEffect(() => {
    if (open && comment) {
      setLoading(true);

      fetch(`/api/comments/thread/${comment.id}`)
        .then((res) => res.json())
        .then(async (json) => {
          if (json.success && json.data) {
            setDetailedComment(json.data);

            if (json.data.storyId) {
              try {
                const storyRes = await fetch(
                  `/api/stories/${json.data.storyId}`
                );

                const storyJson = await storyRes.json();

                // I love it when the error is data.data, good lord fuck me in the ass.
                if (storyRes.ok && storyJson.data) {
                  setStory(storyJson.data.data as StoryDetails);
                } else {
                  setStory(null);
                }
              } catch (err) {
                console.error("Error fetching story info", err);
                setStory(null);
              }
            }
          } else {
            setDetailedComment(null);
            console.error("Failed to load comment thread");
          }
        })
        .catch((e) => {
          setDetailedComment(null);
          console.error("Error fetching comment thread", e);
          setDetailedComment(null);
        })
        .finally(() => setLoading(false));
    } else {
      setDetailedComment(null);
      setStory(null);
    }
  }, [open, comment]);

  const handleDeleteComment = (id: string) => {
    const markCommentDeleted = (comment: CommentDetail): CommentDetail => {
      if (comment.id === id) {
        return {
          ...comment,
          content: "[Deleted]",
        };
      }

      // Recursion for reps
      return {
        ...comment,
        replies: (comment.replies ?? []).map((reply) =>
          markCommentDeleted(reply)
        ),
      };
    };

    setDetailedComment((prev) => (prev ? markCommentDeleted(prev) : null));
  };

  // const handleResolve = async () => {
  //   if (!comment) return;
  //   setResolving(true);
  //   try {
  //     const res = await fetch(`/api/issue-reports/${comment.issueId}`, {
  //       method: "PUT",
  //     });

  //     if (!res.ok) {
  //       console.error("Failed to resolve comment");
  //       return;
  //     }

  //     onOpenChange(false);
  //   } catch (error) {
  //     console.error("Error resolving comment", error);
  //   } finally {
  //     setResolving(false);
  //   }
  // };

  if (!comment) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="sm:w-[480px] w-full flex flex-col">
        <ScrollArea className="h-full mr-2 flex-1">
          <div className="p-5">
            <SheetHeader className="p-0 flex justify-between items-start">
              <div>
                <SheetTitle className="text-2xl flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comment Details
                </SheetTitle>
                <SheetDescription>
                  This comment was flagged for{" "}
                  <strong className="text-red-500">
                    {comment.flaggedReason}
                  </strong>
                </SheetDescription>
              </div>
            </SheetHeader>
            {story && (
              <div className="mt-4 p-4 border rounded-lg shadow-sm bg-card">
                <div className="flex items-start gap-3">
                  <div className="relative w-14 h-20">
                    <Image
                      src={story.coverImageUrl || "/Goated fucking cat.png"}
                      alt={
                        story.coverImageUrl
                          ? `Cover image for ${story.title}`
                          : `Placeholder cover image for ${story.title}`
                      }
                      fill
                      className="object-cover rounded"
                      sizes="128px"
                    />
                  </div>
                  <div>
                    <Link href={`stories/${story.id}`}>
                      <h3 className="font-semibold text-lg truncate w-48">
                        {story.title || "Testing"}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">
                      by {story.author ?? "Không tên"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center mt-6">
                <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
              </div>
            ) : detailedComment ? (
              <div className="mt-6 space-y-6">
                <CommentThread
                  comment={detailedComment}
                  onDelete={handleDeleteComment}
                />
                {/* <button
                  onClick={handleResolve}
                  disabled={resolving}
                  className="w-[150px] ml-5 inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {resolving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <CheckCircle className="w-4 h-4" />
                  Resolve
                </button> */}
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
