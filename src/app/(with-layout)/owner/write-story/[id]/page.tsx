"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BadgeCheck } from "lucide-react";
import { StoryEditDetails } from "@/app/types/story";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditStorySheet } from "@/components/EditStorySheet";
import Link from "next/link";

export default function WriteStoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState<StoryEditDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [panelContents, setPanelContents] = useState<string[]>([]);

  const fetchStoryById = async (storyId: string) => {
    try {
      const res = await fetch(`/api/stories/${storyId}`);
      const json = await res.json();

      console.log("Data:", json); // Best for seeing structure
      console.log("Data:", JSON.stringify(json, null, 2)); // Pretty-print

      setStory(json.data.data);
      setPanelContents(
        (json.data.data.panels as { content: string }[]).map(
          (p) => p.content || ""
        )
      );
    } catch (err) {
      console.error("Failed to fetch story:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof id === "string") {
      fetchStoryById(id);
    }
  }, [id]);

  const handleSave = async () => {
    if (!story) return;

    const updatedPanels = story.panels.map((panel, i) => ({
      ...panel,
      content: panelContents[i] || "",
    }));

    const payload = {
      ...story,
      id: story.id,
      panels: updatedPanels,
      tags: { tagNames: [] },
    };

    console.log("Submitting payload:", payload);

    const res = await fetch("/api/stories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Saved!");
      fetchStoryById(story.id);
    } else {
      const error = await res.json();
      alert("Failed to save: " + error.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!story) return <div className="p-4">Story not found.</div>;

  return (
    <div className="mt-4 h-[90vh] flex flex-col xl:flex-row gap-8">
      {/* LEFT */}
      <div className="w-full xl:w-1/3 flex flex-col overflow-hidden h-full">
        <div className="bg-primary-foreground p-4 rounded-lg flex flex-col h-full overflow-hidden">
          <div className="mb-4">
            <div className="w-full">
              <h1 className="text-xl font-semibold">Story Details</h1>
              <h1 className="text-sm text-muted-foreground">
                Key details and metadata about this story
              </h1>
            </div>
            <div className="pb-2 border-b mt-4">
              <EditStorySheet
                story={story}
                onSuccess={() => fetchStoryById(id as string)}
              >
                <Button className="w-full py-4 hover:bg-primary/90 transition cursor-pointer">
                  Edit Metadata
                </Button>
              </EditStorySheet>
              <Link href={`/owner/published-stories/${story.id}`}>
                <Button className="w-full py-4 hover:bg-primary/90 transition cursor-pointer mt-3">
                  View Story
                </Button>
              </Link>
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0 pr-2">
            <div className="space-y-3">
              <div className="relative w-64 h-96 mx-auto overflow-hidden rounded-xl shadow-2xl">
                {story.coverImageUrl?.startsWith("http") ? (
                  <Image
                    src={story.coverImageUrl}
                    alt={story.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">ID:</span>
                <span>{story.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Title:</span>
                <span>{story.title}</span>
                <HoverCard>
                  <HoverCardTrigger>
                    <BadgeCheck
                      size={24}
                      className="rounded-full bg-green-500/30 border border-green-500/50 p-1"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Verified User</h1>
                    <p className="text-sm text-muted-foreground">
                      This user has verified their email account.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Author:</span>
                <span>{story.author || "N/A"}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold">Desc:</span>
                <span>{story.description || "N/A"}</span>
              </div>
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
              {/* <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold">Tag:</span>
                {story.tags?.map((tag, idx) => (
                  <Badge key={idx} className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </div> */}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-2/3 flex flex-col space-y-4 overflow-hidden">
        <div className="bg-primary-foreground p-4 rounded-lg flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 space-y-6 pr-2">
            <div className="space-y-3">
              {Array.isArray(story.panels) &&
                story.panels.map((panel, i) => (
                  <div key={i} className="space-y-2">
                    {panel.imageUrl && (
                      <div className="w-full h-60 relative rounded-md overflow-hidden shadow-md">
                        <Image
                          src={panel.imageUrl}
                          alt={`Panel ${panel.panelNumber}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-center justify-center text-center min-h-32 space-y-2">
                      <Textarea
                        value={panelContents[i] ?? ""}
                        onChange={(e) => {
                          const newContents = [...panelContents];
                          newContents[i] = e.target.value;
                          setPanelContents(newContents);
                        }}
                        placeholder="Enter panel text..."
                        className="panel-textarea w-full h-[75vh] resize-none"
                        data-index={i}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>

          <div className="pt-2 border-t mt-4">
            <Button
              className="w-full py-4 hover:bg-primary/90 transition"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
