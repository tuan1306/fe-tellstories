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

function toLocalDateString(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

export default function IssueMangement() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [flaggedComments, setFlaggedComments] = useState<FlaggedComment[]>([]);
  //   const [statusFilter, setStatusFilter] = useState<StatusFilter>("Pending");
  const [typeFilter, setTypeFilter] = useState<string>("Comment");
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

        const transformed: FlaggedComment[] = json.data.items.map(
          (item: IssueReportItem) => {
            const normalizedStatus =
              !item.status || item.status.toLowerCase() === "null"
                ? "Pending"
                : item.status;

            const targetType = item.targetType?.toLowerCase();

            if (targetType === "comment") {
              const comment = item.targetObj as TargetComment;

              return {
                id: comment.id,
                // Reported commentor
                userId: comment.user.id,
                // Reporter
                reporterId: item.user.id,
                reporterName: item.user?.displayName || "Unknown Reporter",
                issueId: item.id,
                content: comment.content,
                flaggedReason: item.issueType,
                createdAt: comment.createdDate,
                displayName: comment.user.displayName,
                avatarUrl: comment.user.avatarUrl,
                status: normalizedStatus as StatusFilter,
                replies: [],
                type: "comment",
              };
            }

            if (targetType === "bug") {
              return {
                id: item.id,
                // Bug reporter
                userId: item.user.id,
                reporterId: item.user.id,
                reporterName: item.user.displayName,
                issueId: item.id,
                content: item.description ?? "",
                flaggedReason: item.issueType,
                createdAt: item.createdDate,
                displayName: item.user.displayName,
                avatarUrl: item.user.avatarUrl,
                status: normalizedStatus as StatusFilter,
                replies: [],
                type: "bug",
              };
            }

            return {
              id: item.id,
              userId: item.user.id,
              reporterId: item.user.id,
              reporterName: item.user.displayName,
              issueId: item.id,
              content: item.description ?? "",
              flaggedReason: item.issueType,
              createdAt: item.createdDate,
              displayName: item.user.displayName,
              avatarUrl: item.user.avatarUrl,
              status: normalizedStatus as StatusFilter,
              replies: [],
              type: "other",
            };
          }
        );

        setFlaggedComments(transformed);
      } catch (err) {
        console.error("Failed to fetch flagged comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlaggedComments();
  }, []);

  // Check the date if exist
  const pendingForType = flaggedComments.filter(
    (c) => c.status === "Pending" && c.type === typeFilter
  );

  console.log("Pending issues for type:", typeFilter, pendingForType);

  const validDates = new Set(
    flaggedComments
      .filter(
        (c) =>
          c.status?.toLowerCase() === "pending" &&
          c.type?.toLowerCase() === typeFilter.toLowerCase()
      )
      .map((comment) => toLocalDateString(new Date(comment.createdAt)))
  );

  //   console.log("Valid dates for", typeFilter, ":", Array.from(validDates));

  useEffect(() => {
    const filteredByStatus = flaggedComments
      .filter(
        (c) =>
          c.status.toLowerCase?.() === "pending" &&
          c.type.toLowerCase() === typeFilter.toLowerCase()
      )
      .map((c) => new Date(c.createdAt))
      .sort((a, b) => b.getTime() - a.getTime());

    setSelectedDate(filteredByStatus[0] ?? undefined);
  }, [flaggedComments, typeFilter]);

  const filtered = flaggedComments
    .filter(
      (c) =>
        c.status === "Pending" &&
        c.type.toLowerCase() === typeFilter.toLowerCase()
    )
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

  const typeCounts = ["Comment", "Bug", "Other"].map((type) => ({
    type,
    count: flaggedComments.filter(
      (c) =>
        c.status === "Pending" && c.type.toLowerCase() === type.toLowerCase()
    ).length,
  }));

  return (
    <div className="flex gap-6 mt-4 h-[90vh]">
      {/* LEFT */}
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
            // defaultMonth={selectedDate}
            onSelect={(date) => {
              setLoading(true);
              setSelectedDate(date);
              setTimeout(() => setLoading(false), 300);
            }}
            className="w-full rounded-md border text-foreground"
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
          {typeCounts.map(({ type, count }) => (
            <div
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`flex justify-between items-center p-2 text-sm rounded-md cursor-pointer transition-colors ${
                typeFilter === type ? "bg-muted" : "hover:bg-muted/60"
              }`}
            >
              <span>Pending {type}</span>
              <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-md">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-3/4 bg-card rounded-lg p-5 h-full">
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <Loader2 className="h-14 w-14 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-muted-foreground text-sm">
              No flagged {typeFilter.toLowerCase()}s found.
            </p>
          </div>
        ) : (
          <CommentIssueList loading={loading} issues={filtered} />
        )}
      </div>
    </div>
  );
}
