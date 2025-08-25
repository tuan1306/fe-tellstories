"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Bug } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useState } from "react";
import { FlaggedComment } from "@/app/types/comment";
import { ViewBugSheet } from "./ViewBugSheet";

interface BugIssueListProps {
  loading: boolean;
  issues: FlaggedComment[];
  onResolved?: (id: string) => void;
}

export default function BugIssueList({
  loading,
  issues,
  onResolved,
}: BugIssueListProps) {
  const [selectedIssue, setSelectedIssue] = useState<FlaggedComment | null>(
    null
  );
  const [open, setOpen] = useState(false);

  // Remove issue after resolve
  const handleResolved = (id: string) => {
    onResolved?.(id);
    setOpen(false);
  };

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
          Hiện tại không có lỗi ở app.
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
                {/* Reporter Info */}
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
                      href={`/owner/usermanagement/users/${issue.reporterId}`}
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

                {/* Bug Description */}
                <div className="mt-2">
                  <p className="mt-1 text-sm">{issue.content}</p>
                </div>
              </div>

              {/* Reason */}
              <Badge
                variant="default"
                className="bg-orange-500 text-white whitespace-nowrap flex items-center gap-2 px-6 py-1 text-lg rounded-lg"
              >
                <Bug className="h-8 w-8" />
                {issue.flaggedReason}
              </Badge>
            </div>

            {/* Action */}
            <div className="flex gap-2 mt-4">
              <ViewBugSheet
                open={open && selectedIssue?.id === issue.id}
                onOpenChange={setOpen}
                bug={{
                  id: issue.id,
                  issueId: issue.issueId,
                  createdDate: issue.createdAt,
                  description: issue.content,
                  issueType: issue.flaggedReason,
                  targetType: issue.type,
                  attachment: issue.attachment ?? null,
                  status: issue.status,
                  user: {
                    id: issue.reporterId,
                    displayName: issue.displayName,
                    avatarUrl: issue.avatarUrl ?? "",
                  },
                }}
                onResolved={handleResolved}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedIssue(issue);
                    setOpen(true);
                  }}
                >
                  Xem chi tiết lỗi
                </Button>
              </ViewBugSheet>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
