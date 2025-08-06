"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StoryEditDetails } from "@/app/types/story";
import { EditStorySheet } from "@/components/EditStorySheet";
import { DraftWritingTextarea } from "./DraftWritingTextarea";
import { ArrowLeft } from "lucide-react";

interface StoryMetadataCardProps {
  story: StoryEditDetails;
  onMetadataUpdate: () => void;
  visualMode: boolean;
  showDraftOnly: boolean;
  draftContent: string;
  setDraftContent: (val: string) => void;
  onBack: () => void;
  onEnterDraft: () => void;
}

export function StoryMetadataCard({
  story,
  onMetadataUpdate,
  visualMode,
  draftContent,
  showDraftOnly,
  setDraftContent,
  onBack,
  onEnterDraft,
}: StoryMetadataCardProps) {
  // Draft writing view
  if (visualMode && showDraftOnly) {
    return (
      <div className="mb-4">
        <div className="w-full mb-4">
          <h1 className="text-xl font-semibold">Draft Writings</h1>
          <h1 className="text-sm text-muted-foreground">
            Temporary draft of previous writing
          </h1>
        </div>

        <Button
          className="w-full py-4 cursor-pointer mb-4 flex items-center justify-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Story Details
        </Button>

        <DraftWritingTextarea
          draftContent={draftContent}
          onChange={setDraftContent}
        />
      </div>
    );
  }

  // Metadata edit & View story
  return (
    <div className="mb-4">
      <div className="w-full">
        <h1 className="text-xl font-semibold">Story Details</h1>
        <h1 className="text-sm text-muted-foreground">
          Key details and metadata about this story
        </h1>
      </div>

      <div className="pb-2 border-b mt-4">
        <EditStorySheet story={story} onSuccess={onMetadataUpdate}>
          <Button className="w-full py-4 cursor-pointer">Edit Metadata</Button>
        </EditStorySheet>

        <Link href={`/owner/stories/${story.id}`}>
          <Button className="w-full py-4 cursor-pointer mt-3">
            View Story
          </Button>
        </Link>

        {visualMode && (
          <Button
            className="w-full py-4 hover:bg-primary/90 transition cursor-pointer mt-3"
            onClick={onEnterDraft}
          >
            Back to Draft Writing
          </Button>
        )}
      </div>
    </div>
  );
}
