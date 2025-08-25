"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ViewCommentSheet } from "@/components/ViewCommentSheet";
import Link from "next/link";
import { useState } from "react";
import { FlaggedComment } from "@/app/types/comment";

interface CommentIssueListProps {
  loading: boolean;
  issues: FlaggedComment[];
}

export default function CommentIssueList({
  loading,
  issues,
}: CommentIssueListProps) {
  const [selectedIssue, setSelectedIssue] = useState<FlaggedComment | null>(
    null
  );
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader2 className="h-14 w-14 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-muted-foreground text-sm">
          No flagged comments found.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full pr-4">
      <div className="space-y-4">
        {issues.map((issue, index) => (
          <div
            key={`${issue.id}-${index}`}
            className="rounded-lg p-4 shadow-sm bg-background border"
          >
            <div className="flex justify-between items-start">
              <div className="w-full">
                {/* Avatar + Username */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={issue.avatarUrl}
                      alt={issue.displayName}
                    />
                    <AvatarFallback>
                      {issue.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/owner/usermanagement/users/${issue.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      <h2 className="font-semibold text-sm">
                        {issue.displayName}
                      </h2>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {new Date(issue.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-2">
                  <p className="mt-1 text-sm">{issue.content}</p>
                </div>
              </div>

              {/* Reason */}
              <Badge
                variant="default"
                className="bg-red-500 text-white whitespace-nowrap"
              >
                {issue.flaggedReason}
              </Badge>
            </div>

            {/* Action */}
            <div className="flex gap-2 mt-4">
              <ViewCommentSheet
                open={open && selectedIssue?.id === issue.id}
                onOpenChange={setOpen}
                comment={{
                  id: issue.id,
                  issueId: issue.issueId,
                  content: issue.content,
                  createdDate: issue.createdAt,
                  displayName: issue.displayName,
                  flaggedReason: issue.flaggedReason,
                  reporterId: issue.reporterId,
                  reporterName: issue.reporterName,
                }}
                issueId={issue.issueId}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedIssue(issue);
                    setOpen(true);
                  }}
                >
                  View Detailed Comment
                </Button>
              </ViewCommentSheet>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
