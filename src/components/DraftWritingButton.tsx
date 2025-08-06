"use client";

import { Button } from "@/components/ui/button";
import { StoryEditDetails } from "@/app/types/story";

interface DraftWritingButtonProps {
  story: StoryEditDetails;
  showDraft: boolean;
  onActivateDraft: (draftContent: string) => void;
  onDeactivateDraft: () => void;
}

export function DraftWritingButton({
  story,
  showDraft,
  onActivateDraft,
  onDeactivateDraft,
}: DraftWritingButtonProps) {
  const handleClick = () => {
    if (showDraft) {
      onDeactivateDraft();
    } else {
      const combinedText =
        story.panels?.map((p) => p.content).join("\n\n") || "";
      onActivateDraft(combinedText);
    }
  };

  return (
    <Button
      className="w-full py-4 hover:bg-primary/90 transition cursor-pointer mt-3"
      onClick={handleClick}
    >
      {showDraft ? "Back to Story Details" : "Draft Writings"}
    </Button>
  );
}
