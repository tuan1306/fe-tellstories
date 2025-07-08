"use client";

import { StoryDetails } from "@/app/types/story";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
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
              <Link href={`/owner/write-story/${story.id}`}>
                <Button className="w-full py-4 hover:bg-primary/90 transition cursor-pointer">
                  Edit Story
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
              {story.tags?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">Tags:</span>
                  {story.tags.map((tag, id) => (
                    <Badge key={id} className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Right */}
      <div className="w-full xl:w-2/3 flex flex-col space-y-4 overflow-hidden">
        <div className="bg-primary-foreground p-4 rounded-lg flex flex-col h-[90vh]">
          <ScrollArea className="flex-1 pr-2 h-[405px]">
            <div className="space-y-6">
              {story.panels.map((panel, i) => (
                <div key={i} className="space-y-2">
                  {panel.imageUrl ? (
                    <div className="w-full h-60 relative rounded-md overflow-hidden shadow-md">
                      <Image
                        src={panel.imageUrl}
                        alt={`Panel ${panel.panelNumber}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-center">
                      <p className="text-base text-muted-foreground text-center max-w-prose whitespace-pre-line">
                        {panel.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Fixed Audio Player */}
          <div className="pt-4 border-t mt-4 shrink-0">
            <div className="w-full h-14 bg-gray-200 rounded-md flex items-center justify-center text-muted-foreground">
              Audio Player Here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
