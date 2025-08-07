"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StoryEditDetails } from "@/app/types/story";
import { EditStorySheet } from "@/components/EditStorySheet";
import { DraftWritingTextarea } from "./DraftWritingTextarea";
import { ArrowLeft } from "lucide-react";
import { ManageAudioSheet } from "./ManageAudioSheet";

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
          <h1 className="text-xl font-semibold">Trang viết nháp</h1>
          <h1 className="text-sm text-muted-foreground">
            Bản viết nháp tạm thời của truyện viết trước
          </h1>
        </div>

        <Button
          className="w-full py-4 cursor-pointer mb-4 flex items-center justify-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại thông tin truyện
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
        <h1 className="text-xl font-semibold">Thông tin truyện</h1>
        <h1 className="text-sm text-muted-foreground">
          Các thông tin chính liên quan đến truyện này
        </h1>
      </div>

      <div className="pb-2 border-b mt-4">
        <EditStorySheet story={story} onSuccess={onMetadataUpdate}>
          <Button className="w-full py-4 cursor-pointer">
            Chỉnh sửa thông tin
          </Button>
        </EditStorySheet>

        <ManageAudioSheet story={story}>
          <Button className="w-full py-4 mt-3 cursor-pointer">
            Quản lý âm thanh
          </Button>
        </ManageAudioSheet>

        <Link href={`/owner/stories/${story.id}`}>
          <Button className="w-full py-4 cursor-pointer mt-3">
            Xem truyện
          </Button>
        </Link>

        {visualMode && (
          <Button
            className="w-full py-4 hover:bg-primary/90 transition cursor-pointer mt-3"
            onClick={onEnterDraft}
          >
            Quay lại trang viết nháp
          </Button>
        )}
      </div>
    </div>
  );
}
