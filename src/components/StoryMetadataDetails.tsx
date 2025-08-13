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
        <span className="font-bold">Tựa đề:</span>
        <span>{story.title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold">Tác giả:</span>
        <span>{story.author || "N/A"}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-bold whitespace-nowrap">Miêu tả:</span>
        <span className="flex-1 whitespace-pre-line">
          {story.description || "N/A"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold">Độ tuổi:</span>
        <Badge>{story.ageRange}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold">Mức độ đọc:</span>
        <Badge>{story.readingLevel}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold">Ngôn ngữ:</span>
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
