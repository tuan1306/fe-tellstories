import { PendingStoryRequest } from "@/app/types/story";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "./ui/textarea";

export function PendingStory({ items }: { items: PendingStoryRequest[] }) {
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");

  const router = useRouter();

  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => {
        const story = item.story;
        return (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="px-2 no-underline hover:cursor-pointer rounded-md transition">
              <div className="flex items-center gap-4 w-full text-left">
                <div className="relative w-14 h-20 rounded-md overflow-hidden shrink-0">
                  {story.coverImageUrl ? (
                    <Image
                      src={story.coverImageUrl}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-muted w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-sm font-medium">{story.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {story.author}
                  </p>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="relative space-y-2 pt-2">
              <p className="text-sm">{story.description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Age range:</span>
                  <Badge>{story.ageRange}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Reading level:</span>
                  <Badge>{story.readingLevel}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Language:</span>
                  <Badge>{story.language}</Badge>
                </div>
                {story.tags?.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold">Tags:</span>
                    {story.tags.map((tag, i) => (
                      <Badge key={i} className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Note: {item.requestNotes}
              </p>

              {/* Action dropdown */}
              <div className="absolute bottom-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 cursor-pointer"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push(`/owner/stories/${story.id}`)}
                    >
                      View Story Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={async () => {
                        const res = await fetch("/api/stories/pending", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: item.id,
                            action: "approve",
                            reviewNotes: "Approved by admin",
                          }),
                        });
                        const data = await res.json();
                        console.log(data);
                        if (res.ok) alert("Approved successfully");
                        else alert("Error: " + data.message);
                      }}
                    >
                      Approve
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={(e) => {
                        e.preventDefault();
                        setOpenDialogId(item.id);
                        setRejectionNote("");
                      }}
                    >
                      Deny
                    </DropdownMenuItem>

                    {/* Opens when deny */}
                    <Dialog
                      open={openDialogId === item.id}
                      onOpenChange={() => setOpenDialogId(null)}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Story</DialogTitle>
                        </DialogHeader>
                        <Textarea
                          value={rejectionNote}
                          onChange={(e) => setRejectionNote(e.target.value)}
                          placeholder="Reason for rejection..."
                        />
                        <DialogFooter>
                          <Button
                            className="cursor-pointer font-semibold bg-red-700 text-white hover:bg-red-900"
                            onClick={async () => {
                              const res = await fetch("/api/stories/pending", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  id: item.id,
                                  action: "reject",
                                  reviewNotes:
                                    rejectionNote || "Rejected by admin",
                                }),
                              });
                              const data = await res.json();
                              if (res.ok) {
                                alert("Story rejected.");
                                setOpenDialogId(null);
                              } else {
                                alert("Error: " + data.message);
                              }
                            }}
                          >
                            Confirm Rejection
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
