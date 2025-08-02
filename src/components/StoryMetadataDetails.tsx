"use client";

import { Badge } from "@/components/ui/badge";
import { StoryEditDetails } from "@/app/types/story";

interface StoryMetadataDetailsProps {
  story: StoryEditDetails;
}

export function StoryMetadataDetails({ story }: StoryMetadataDetailsProps) {
  return (
    <div className="space-y-3">
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
      {story.tags && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold">Tags:</span>
          {Array.isArray(story.tags)
            ? story.tags.map((tag, id) => (
                <Badge key={id} className="text-xs">
                  {tag.name}
                </Badge>
              ))
            : story.tags.tagNames?.map((tag, id) => (
                <Badge key={id} className="text-xs">
                  {tag}
                </Badge>
              ))}
        </div>
      )}
    </div>
  );
}
