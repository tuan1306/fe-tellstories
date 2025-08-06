"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StoryEditDetails } from "@/app/types/story";
import { Button } from "@/components/ui/button";
import PanelEditor from "@/components/misc/slideswiper/page";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { StoryMetadataCard } from "@/components/StoryMetadataCard";
import { StoryMetadataDetails } from "@/components/StoryMetadataDetails";
import { StoryCoverImageDialog } from "@/components/StoryCoverImageDialog";

export default function WriteStoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState<StoryEditDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [panelContents, setPanelContents] = useState<string[]>([]);
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Draft, because when the user changed their mind to use the picture + panel mode.
  const [showDraftOnly, setShowDraftOnly] = useState(false);
  const [draftContent, setDraftContent] = useState("");

  useEffect(() => {
    if (!confirmingDelete) return;

    const timeout = setTimeout(() => {
      setConfirmingDelete(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [confirmingDelete]);

  const fetchStoryById = async (storyId: string) => {
    try {
      const res = await fetch(`/api/stories/${storyId}`);
      const json = await res.json();

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

  // Each panelContents is updated correlated to their mapped panel.
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
          <StoryMetadataCard
            story={story}
            onMetadataUpdate={() => fetchStoryById(id as string)}
            showDraftOnly={showDraftOnly}
            draftContent={draftContent}
            setDraftContent={setDraftContent}
            onBack={() => setShowDraftOnly(false)}
            onEnterDraft={() => setShowDraftOnly(true)}
          />

          {/* Disable if drafting appears */}
          {!showDraftOnly && (
            <ScrollArea className="flex-1 min-h-0 pr-2">
              <div className="space-y-3">
                <StoryCoverImageDialog
                  story={story}
                  onUpdate={(updated) => setStory(updated)}
                />
                <StoryMetadataDetails story={story} />
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-primary-foreground p-4 rounded-lg flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 pr-2">
            <ScrollArea className="flex-1 pr-2">
              <PanelEditor
                panels={story.panels}
                panelContents={panelContents}
                setPanelContents={setPanelContents}
                currentPanelIndex={currentPanelIndex}
              />
            </ScrollArea>
          </ScrollArea>

          {/* Navigation */}
          <Button
            variant={confirmingDelete ? "destructive" : "outline"}
            className={`h-10 cursor-pointer px-2 text-sm transition-all duration-300 overflow-hidden ${
              confirmingDelete ? "w-[90px]" : "w-10"
            }`}
            onClick={() => {
              if (story.panels.length <= 1) return;
              if (confirmingDelete) {
                const updatedPanels = story.panels.filter(
                  (_, i) => i !== currentPanelIndex
                );
                const updatedContents = panelContents.filter(
                  (_, i) => i !== currentPanelIndex
                );
                setStory({ ...story, panels: updatedPanels });
                setPanelContents(updatedContents);
                setCurrentPanelIndex((prev) => Math.max(prev - 1, 0));
                setConfirmingDelete(false);
              } else {
                setConfirmingDelete(true);
              }
            }}
            disabled={story.panels.length <= 1}
          >
            {confirmingDelete ? (
              "Confirm?"
            ) : (
              <Trash2 className="w-4 h-4 mx-auto text-red-400" />
            )}
          </Button>

          {story.panels.length > 1 ? (
            <div className="flex justify-between items-center w-full py-2 px-4 border rounded-md mt-4">
              <Button
                variant="outline"
                className="w-10 h-10 cursor-pointer"
                onClick={() =>
                  setCurrentPanelIndex((prev) => Math.max(prev - 1, 0))
                }
                disabled={currentPanelIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="font-semibold text-sm">
                Panel {currentPanelIndex + 1} of {story.panels.length}
              </div>

              {currentPanelIndex === story.panels.length - 1 ? (
                <Button
                  variant="outline"
                  className="w-10 h-10 cursor-pointer"
                  onClick={() => {
                    const newPanelNumber = story.panels.length + 1;
                    const newPanel = {
                      content: "",
                      imageUrl: "",
                      audioUrl: "",
                      isEndPanel: false,
                      languageCode: story.language,
                      panelNumber: newPanelNumber,
                    };

                    setStory({
                      ...story,
                      panels: [...story.panels, newPanel],
                    });

                    setPanelContents([...panelContents, ""]);
                    setCurrentPanelIndex(newPanelNumber - 1);
                  }}
                >
                  <Plus className="w-4 h-4 text-green-400" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-10 h-10 cursor-pointer"
                  onClick={() =>
                    setCurrentPanelIndex((prev) =>
                      Math.min(prev + 1, story.panels.length - 1)
                    )
                  }
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                if (!story) return;

                // Concat every panels into 1 drafted page.
                const combinedText =
                  story.panels?.map((p) => p.content).join("\n\n") || "";
                setDraftContent(combinedText);
                setShowDraftOnly(true);

                // Still the pagination for "picture mode" only
                const newPanelNumber = story.panels.length + 1;
                const newPanel = {
                  content: "",
                  imageUrl: "",
                  audioUrl: "",
                  isEndPanel: false,
                  languageCode: story.language,
                  panelNumber: newPanelNumber,
                };

                setStory({
                  ...story,
                  panels: [...story.panels, newPanel],
                });

                setPanelContents([...panelContents, ""]);
                setCurrentPanelIndex(newPanelNumber - 1);
              }}
            >
              <Plus /> Đổi thành truyện tranh
            </Button>
          )}
        </div>

        <div className="pt-2 border-t mt-2">
          <Button
            className="w-full py-4 hover:bg-primary/90 transition"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
