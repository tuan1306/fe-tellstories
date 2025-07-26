"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ViewCommentSheet } from "@/components/ViewCommentSheet";

type StatusFilter = "Pending" | "Deleted" | "Dismissed";

type CommentReply = {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorAvatarUrl?: string;
  storyTitle: string;
};

interface FlaggedComment {
  id: string;
  content: string;
  flaggedReason: string;
  createdAt: string;
  authorName: string;
  storyTitle: string;
  status: "Pending" | "Deleted" | "Dismissed";
  replies?: CommentReply[];
}

export default function FlaggedCommentsManagement() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [flaggedComments, setFlaggedComments] = useState<FlaggedComment[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Pending");
  const [selectedComment, setSelectedComment] = useState<FlaggedComment | null>(
    null
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dummy: FlaggedComment[] = [
      {
        id: "c100",
        content: "This story is garbage. Did a toddler write this?",
        flaggedReason: "Harassment",
        createdAt: new Date("2025-07-24T10:00:00Z").toISOString(),
        authorName: "BrutalTruth123",
        storyTitle: "The Lonely Cloud",
        status: "Pending",
        replies: [
          {
            id: "r100-1",
            content: "That's really harsh. Everyone starts somewhere.",
            authorName: "KindReader22",
            createdAt: new Date("2025-07-24T10:05:00Z").toISOString(),
            storyTitle: "The Lonely Cloud",
          },
          {
            id: "r100-2",
            content: "@KindReader22 shut up white knight lol",
            authorName: "BrutalTruth123",
            createdAt: new Date("2025-07-24T10:06:00Z").toISOString(),
            storyTitle: "The Lonely Cloud",
          },
          {
            id: "r100-3",
            content: "Get lost lmfao",
            authorName: "SakuraBakushinO",
            createdAt: new Date("2025-07-24T10:10:00Z").toISOString(),
            storyTitle: "The Lonely Cloud",
          },
          {
            id: "r100-4",
            content:
              "such threat, what a joke, honestly go kys, nothing but a waste on this dead planet.",
            authorName: "BrutalTruth123",
            createdAt: new Date("2025-07-24T10:11:00Z").toISOString(),
            storyTitle: "The Lonely Cloud",
          },
          {
            id: "r100-5",
            content: "Get reported idiot",
            authorName: "JohnYakuza",
            createdAt: new Date("2025-07-24T10:20:00Z").toISOString(),
            storyTitle: "The Lonely Cloud",
          },
        ],
      },
      {
        id: "c101",
        content: "My NFT project is launching! DM for whitelist!",
        flaggedReason: "Spam",
        createdAt: new Date("2025-07-23T13:00:00Z").toISOString(),
        authorName: "CryptoKing",
        storyTitle: "Magic of the Northern Lights",
        status: "Dismissed",
        replies: [
          {
            id: "r101-1",
            content: "This isn’t the place for crypto ads.",
            authorName: "ReaderMeh",
            createdAt: new Date("2025-07-23T13:05:00Z").toISOString(),
            storyTitle: "Magic of the Northern Lights",
          },
          {
            id: "r101-2",
            content: "Reported for spam.",
            authorName: "ModSakura",
            createdAt: new Date("2025-07-23T13:10:00Z").toISOString(),
            storyTitle: "Magic of the Northern Lights",
          },
        ],
      },
      {
        id: "c102",
        content: "You suck at writing. Delete your account.",
        flaggedReason: "Toxic Behavior",
        createdAt: new Date("2025-07-22T08:00:00Z").toISOString(),
        authorName: "TrollFace77",
        storyTitle: "Captain Starfish's Final Dive",
        status: "Deleted",
        replies: [
          {
            id: "r102-1",
            content: "We don’t tolerate hate here. Banned.",
            authorName: "AdminNeko",
            createdAt: new Date("2025-07-22T08:15:00Z").toISOString(),
            storyTitle: "Captain Starfish's Final Dive",
          },
        ],
      },
      {
        id: "c103",
        content: "Why does this even exist? What a waste of server space.",
        flaggedReason: "Harassment",
        createdAt: new Date("2025-07-25T14:20:00Z").toISOString(),
        authorName: "SaltyReader99",
        storyTitle: "The Whispering Forest",
        status: "Pending",
        replies: [
          {
            id: "r103-1",
            content: "You could be nicer about it.",
            authorName: "GentleWords",
            createdAt: new Date("2025-07-25T14:25:00Z").toISOString(),
            storyTitle: "The Whispering Forest",
          },
          {
            id: "r103-2",
            content: "Just block them if you don’t like it.",
            authorName: "GhostLurker",
            createdAt: new Date("2025-07-25T14:26:00Z").toISOString(),
            storyTitle: "The Whispering Forest",
          },
        ],
      },
      {
        id: "c104",
        content: "This reads like ChatGPT on crack lmao.",
        flaggedReason: "Inappropriate Language",
        createdAt: new Date("2025-07-25T17:40:00Z").toISOString(),
        authorName: "SarcasticAI",
        storyTitle: "Galaxy Pancake Patrol",
        status: "Pending",
        replies: [
          {
            id: "r104-1",
            content: "That’s uncalled for.",
            authorName: "ModSakura",
            createdAt: new Date("2025-07-25T17:45:00Z").toISOString(),
            storyTitle: "Galaxy Pancake Patrol",
          },
        ],
      },
      {
        id: "c105",
        content: "Bruh this story is so bad I lost brain cells.",
        flaggedReason: "Harassment",
        createdAt: new Date("2025-07-25T19:10:00Z").toISOString(),
        authorName: "MeanMeme42",
        storyTitle: "Moonlight over Mango Bay",
        status: "Pending",
        replies: [
          {
            id: "r105-1",
            content: "Let’s keep it respectful.",
            authorName: "PeacefulPineapple",
            createdAt: new Date("2025-07-25T19:12:00Z").toISOString(),
            storyTitle: "Moonlight over Mango Bay",
          },
          {
            id: "r105-2",
            content: "@MeanMeme42 this isn’t a meme page bro",
            authorName: "LaughLite",
            createdAt: new Date("2025-07-25T19:13:00Z").toISOString(),
            storyTitle: "Moonlight over Mango Bay",
          },
        ],
      },
    ];

    setFlaggedComments(dummy);
  }, []);

  //   useEffect(() => {
  //     fetch("/api/comments/flagged")
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setFlaggedComments(data?.data || []);
  //       })
  //       .catch((err) => console.error("Fetch error:", err));
  //   }, []);

  const validDates = new Set(
    flaggedComments
      .filter((c) => c.status === statusFilter)
      .map((comment) => new Date(comment.createdAt).toDateString())
  );

  useEffect(() => {
    if (!flaggedComments.length) return;

    const filteredByStatus = flaggedComments
      .filter((c) => c.status === statusFilter)
      .map((c) => new Date(c.createdAt))
      .sort((a, b) => b.getTime() - a.getTime());

    if (filteredByStatus.length > 0) {
      setSelectedDate(filteredByStatus[0]);
    } else {
      setSelectedDate(undefined);
    }
  }, [flaggedComments, statusFilter]);

  const filtered = flaggedComments
    .filter((c) => c.status === statusFilter)
    .filter(
      (comment) =>
        comment.content.toLowerCase().includes(search.toLowerCase()) ||
        comment.authorName.toLowerCase().includes(search.toLowerCase()) ||
        comment.storyTitle.toLowerCase().includes(search.toLowerCase())
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
            onSelect={setSelectedDate}
            className="w-full rounded-md border text-foreground"
            disabled={(date) =>
              date > new Date() || !validDates.has(date.toDateString())
            }
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
          {["Pending", "Deleted", "Dismissed"].map((status) => {
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

      {/* RIGHT */}
      <div className="w-3/4 bg-card rounded-lg p-5 h-full">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-muted-foreground text-sm">
              No flagged comments found.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full w-full pr-4">
            <div className="space-y-4">
              {filtered.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg p-4 shadow-sm bg-background border"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      {/* Avatar + Username */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={comment.authorName} />
                          <AvatarFallback>
                            {comment.authorName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h2 className="font-semibold text-sm">
                          {comment.authorName}
                        </h2>
                      </div>

                      {/* Story + Content */}
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          On story: <strong>{comment.storyTitle}</strong>
                        </p>
                        <p className="mt-1 text-sm">{comment.content}</p>
                      </div>
                    </div>

                    {/* Reason Badge */}
                    <Badge
                      variant="default"
                      className="bg-red-500 text-white whitespace-nowrap"
                    >
                      {comment.flaggedReason}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <ViewCommentSheet
                      open={open && selectedComment?.id === comment.id}
                      onOpenChange={setOpen}
                      comment={comment}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedComment(comment);
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
        )}
      </div>
    </div>
  );
}
