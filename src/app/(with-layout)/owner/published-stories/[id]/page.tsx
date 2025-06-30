"use client";

import { StoryDetails } from "@/app/types/story";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState<StoryDetails | null>(null);

  async function fetchStoryById(id: string): Promise<StoryDetails | null> {
    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to fetch story:", err.message);
        return null;
      }

      const json = await res.json();

      console.log(json);

      return json.data.data as StoryDetails;
    } catch (error) {
      console.error("Error fetching story:", error);
      return null;
    }
  }

  useEffect(() => {
    if (typeof id === "string") {
      fetchStoryById(id).then(setStory);
    }
  }, [id]);

  if (!story) return <div>Loading...</div>;

  return (
    <div className="mt-4 h-[90vh] flex flex-col xl:flex-row gap-8">
      {/* Left */}
      <div className="w-full xl:w-1/3 flex flex-col space-y-6 overflow-hidden">
        <div className="bg-primary-foreground p-4 rounded-lg flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="w-full">
              <h1 className="text-xl font-semibold">Story Overview</h1>
              <h1 className="text-sm font-medium text-muted-foreground">
                Key details and metadata about this story
              </h1>
            </div>
          </div>

          <ScrollArea className="h-[calc(90vh-120px)] pr-2">
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
              <div className="flex items-center gap-2">
                <span className="font-bold">Desc:</span>
                <span>{story.description?.slice(0, 10)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Age range:</span>
                <Badge>{story.ageRange}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Reading level:</span>
                <Badge>{story.readingLevel}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Joined on {story.createdDate?.slice(0, 10)}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Updated on {story.updatedAt?.slice(0, 10)}
              </p>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Right */}
      <div className="w-full xl:w-2/3 flex flex-col space-y-4 overflow-hidden">
        <div className="bg-primary-foreground p-4 rounded-lg flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 space-y-6 pr-2">
            <div className="space-y-3">
              {story.panels.map((panel, i) => (
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
                  {!panel.imageUrl && panel.content && (
                    <div className="flex items-center justify-center text-center">
                      <p className="text-base text-muted-foreground text-center max-w-prose">
                        {panel.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="pt-4 border-t mt-4">
            <div className="w-full h-14 bg-gray-200 rounded-md flex items-center justify-center text-muted-foreground">
              Audio Player Here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
