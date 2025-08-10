"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  IssueReportItem,
  IssueReportResponse,
  TargetComment,
} from "@/app/types/issue-report";
import { Loader2 } from "lucide-react";
import { FlaggedComment, StatusFilter } from "@/app/types/comment";
import CommentIssueList from "@/components/IssueList";

// YYYY-MM-DD
// padStart means that every month/date must have 2 digit and fill in another 0 at start if not.
function toLocalDateString(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

export default function FlaggedCommentsManagement() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [flaggedComments, setFlaggedComments] = useState<FlaggedComment[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFlaggedComments = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/issue-reports");
        const json: IssueReportResponse = await res.json();

        if (!json.success) {
          console.error("API error:", json.message);
          return;
        }

        const transformed = json.data.items
          .filter(
            (item: IssueReportItem) =>
              item.targetType === "Comment" && item.targetObj
          )
          .map((item: IssueReportItem): FlaggedComment => {
            const comment = item.targetObj as TargetComment;
            return {
              id: comment.id,
              issueId: item.id,
              content: comment.content,
              flaggedReason: item.issueType,
              createdAt: comment.createdDate,
              displayName: comment.user.displayName,
              avatarUrl: comment.user.avatarUrl,
              status: (item.status ?? "Pending") as StatusFilter,
              replies: [],
            };
          });

        setFlaggedComments(transformed);
      } catch (err) {
        console.error("Failed to fetch flagged comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlaggedComments();
  }, []);

  const validDates = new Set(
    flaggedComments
      .filter((c) => c.status === statusFilter)
      .map((comment) => toLocalDateString(new Date(comment.createdAt)))
  );

  useEffect(() => {
    if (!flaggedComments.length) return;

    const filteredByStatus = flaggedComments
      .filter((c) => c.status === statusFilter)
      .map((c) => new Date(c.createdAt))
      .sort((a, b) => b.getTime() - a.getTime());

    setSelectedDate(filteredByStatus[0] ?? undefined);
  }, [flaggedComments, statusFilter]);

  const filtered = flaggedComments
    .filter((c) => c.status === statusFilter)
    .filter(
      (comment) =>
        comment.content.toLowerCase().includes(search.toLowerCase()) ||
        comment.displayName.toLowerCase().includes(search.toLowerCase())
    )
    .filter((comment) => {
      if (!selectedDate) return true;
      const commentDate = new Date(comment.createdAt);
      return (
        commentDate.getFullYear() === selectedDate.getFullYear() &&
        commentDate.getMonth() === selectedDate.getMonth() &&
        commentDate.getDate() === selectedDate.getDate()
      );
    });

  return (
    <div className="flex gap-6 mt-4 h-[90vh]">
      {/* LEFT PANEL */}
      <div className="w-1/4 bg-card rounded-lg p-4 space-y-4 overflow-auto">
        <Input
          type="text"
          placeholder="Search content, author, or story"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="border-t pt-4 w-full">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setLoading(true);
              setSelectedDate(date);
              setTimeout(() => setLoading(false), 300);
            }}
            className="w-full rounded-md border text-foreground"
            // Disable date if date = future dates or not validDates.
            disabled={(date) => {
              const today = new Date();
              const localDate = toLocalDateString(date);
              const localToday = toLocalDateString(today);
              return localDate > localToday || !validDates.has(localDate);
            }}
          />

          <Button
            variant="outline"
            className="w-full text-xs text-muted-foreground mt-4"
            onClick={() => setSelectedDate(undefined)}
          >
            Clear date filter
          </Button>
        </div>

        <div className="space-y-2 pt-4 border-t">
          {["Pending"].map((status) => {
            const count = flaggedComments.filter(
              (c) => c.status === status
            ).length;

            return (
              <div
                key={status}
                onClick={() => setStatusFilter(status as StatusFilter)}
                className={`flex justify-between items-center p-2 text-sm rounded-md cursor-pointer transition-colors ${
                  statusFilter === status ? "bg-muted" : "hover:bg-muted/60"
                }`}
              >
                <span>{status} Comments</span>
                <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-md">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-3/4 bg-card rounded-lg p-5 h-full">
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <Loader2 className="h-14 w-14 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-muted-foreground text-sm">
              No flagged comments found.
            </p>
          </div>
        ) : (
          <CommentIssueList loading={loading} issues={filtered} />
        )}
      </div>
    </div>
  );
}
