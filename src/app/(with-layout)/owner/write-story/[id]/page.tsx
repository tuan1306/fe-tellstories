"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StoryEditDetails } from "@/app/types/story";
import { Button } from "@/components/ui/button";
import PanelEditor from "@/components/misc/slideswiper/page";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  Loader2,
  NotebookText,
  Plus,
  Trash2,
} from "lucide-react";
import { StoryMetadataCard } from "@/components/StoryMetadataCard";
import { StoryMetadataDetails } from "@/components/StoryMetadataDetails";
import { StoryCoverImageDialog } from "@/components/StoryCoverImageDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { saveSonner } from "@/components/SaveSonner";
import UnsavedChangesDialog from "@/components/UnsavedChangesDialog";

export default function WriteStoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState<StoryEditDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [panelContents, setPanelContents] = useState<string[]>([]);
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Draft, because when the user changed their mind to use the picture + panel mode.
  const [showDraftOnly, setShowDraftOnly] = useState(false);
  const [draftContent, setDraftContent] = useState("");
  // This is for the only purpose of tracking the draft.
  const [savedDraft, setSavedDraft] = useState("");

  // Mode changing
  const [visualMode, setVisualMode] = useState(false);

  // Tracking the saving state
  const originalContents = story?.panels.map((p) => p.content || "") || [];
  const unsavedChanges =
    JSON.stringify(originalContents) !== JSON.stringify(panelContents) ||
    savedDraft !== draftContent;

  useEffect(() => {
    if (story?.id) {
      const stored = localStorage.getItem(`draft-content-${story.id}`) || "";
      setSavedDraft(stored);
    }
  }, [story?.id]);

  // Delete the panel
  useEffect(() => {
    if (!confirmingDelete) return;

    const timeout = setTimeout(() => {
      setConfirmingDelete(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [confirmingDelete]);

  // Load the drafted content & the state
  useEffect(() => {
    if (story?.id) {
      const savedDraft = localStorage.getItem(`draft-content-${story.id}`);
      if (savedDraft) {
        setDraftContent(savedDraft);
      }

      const savedVisualMode = localStorage.getItem(`visual-mode-${story.id}`);
      if (savedVisualMode === "true") {
        setVisualMode(true);
        setShowDraftOnly(true);
      }
    }
  }, [story?.id]);

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

    setSaving(true); // start loading spinner
    saveSonner("loading");

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

    try {
      const res = await fetch("/api/stories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        saveSonner("success");
        fetchStoryById(story.id);
      } else {
        const error = await res.json();
        saveSonner("error", error.message);
      }
    } catch (err) {
      saveSonner(
        "error",
        err instanceof Error ? err.message : "Không rõ nguyên nhân"
      );
    } finally {
      setSaving(false); // stop loading spinner
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-12 h-12 text-muted-foreground" />
      </div>
    );

  if (!story)
    return (
      <div className="flex justify-center items-center min-h-screen text-muted-foreground">
        Story not found.
      </div>
    );

  return (
    <UnsavedChangesDialog hasUnsavedChanges={unsavedChanges}>
      <div className="mt-4 h-[90vh] flex flex-col xl:flex-row gap-8">
        {/* LEFT */}
        <div className="w-full xl:w-1/3 flex flex-col overflow-hidden h-full">
          <div className="bg-primary-foreground p-4 rounded-lg flex flex-col h-full overflow-hidden">
            <StoryMetadataCard
              story={story}
              onMetadataUpdate={() => fetchStoryById(id as string)}
              visualMode={visualMode}
              showDraftOnly={showDraftOnly}
              draftContent={draftContent}
              currentPanelIndex={currentPanelIndex}
              // setCurrentPanelIndex={setCurrentPanelIndex}
              setDraftContent={setDraftContent}
              onBack={() => setShowDraftOnly(false)}
              onEnterDraft={() => setShowDraftOnly(true)}
            />

            {/* Disable if drafting appears */}
            <ScrollArea className="flex-1 min-h-0 pr-2">
              <div className="space-y-3">
                <StoryCoverImageDialog
                  story={story}
                  onUpdate={(updated) => setStory(updated)}
                />
                <StoryMetadataDetails story={story} />
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-primary-foreground p-4 rounded-lg flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 pr-2">
              <ScrollArea className="flex-1 pr-2">
                {/* Each index represent each url differentiate from panels. */}
                <PanelEditor
                  panels={story.panels}
                  panelContents={panelContents}
                  setPanelContents={setPanelContents}
                  currentPanelIndex={currentPanelIndex}
                  visualMode={visualMode}
                  onImageChange={(index, url) => {
                    const updatedPanels = [...story.panels];
                    updatedPanels[index].imageUrl = url;
                    setStory({ ...story, panels: updatedPanels });
                  }}
                />
              </ScrollArea>
            </ScrollArea>

            {/* Navigation */}
            {story.panels.length > 1 || visualMode ? (
              <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                  {/* Delete */}
                  <Button
                    variant={confirmingDelete ? "destructive" : "outline"}
                    className={`h-10 cursor-pointer px-2 text-sm transition-all duration-300 overflow-hidden text-red-400 hover:text-red-400 ${
                      confirmingDelete
                        ? "w-[120px] text-white hover:text-white"
                        : "w-20"
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
                      "Xác nhận?"
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 text-red-400 mr-1" />
                        Xóa
                      </>
                    )}
                  </Button>

                  {/* Add */}
                  <Button
                    variant="outline"
                    className="w-30 h-10 cursor-pointer flex justify-center items-center text-green-400 hover:text-green-400"
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
                    Thêm trang
                  </Button>

                  {/* Revert to classic mode */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 cursor-pointer items-center align-middle text-amber-300 hover:text-amber-300"
                      >
                        <NotebookText />
                        Trở về chế độ truyện chữ
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-amber-300 font-semibold text-xl">
                          Xác nhận chuyển đổi
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Chuyển sang chế độ truyện chữ sẽ{" "}
                          <strong>gộp toàn bộ nội dung</strong> thành một trang
                          duy nhất. Bạn có chắc chắn muốn tiếp tục không?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-amber-300 hover:bg-amber-400 cursor-pointer"
                          onClick={() => {
                            // Remove visual mode and draft flags from local storage
                            localStorage.removeItem(`visual-mode-${story.id}`);
                            localStorage.removeItem(
                              `draft-content-${story.id}`
                            );

                            setVisualMode(false);
                            setShowDraftOnly(false);

                            // Merge all panel contents into one string
                            const mergedContent = story.panels
                              .map((panel) => panel.content?.trim() || "")
                              .filter(Boolean)
                              .join("\n\n");

                            const updatedFirstPanel = {
                              ...story.panels[0],
                              content: mergedContent,
                            };

                            setStory({
                              ...story,
                              panels: [updatedFirstPanel],
                            });

                            setPanelContents([mergedContent]);
                            setCurrentPanelIndex(0);
                          }}
                        >
                          Tiếp tục
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center w-full py-2 px-4 border rounded-md">
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
                    Trang {currentPanelIndex + 1} trên {story.panels.length}
                  </div>

                  <Button
                    variant="outline"
                    className="w-10 h-10 cursor-pointer"
                    onClick={() =>
                      setCurrentPanelIndex((prev) =>
                        Math.min(prev + 1, story.panels.length - 1)
                      )
                    }
                    disabled={currentPanelIndex === story.panels.length - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-10 cursor-pointer items-center align-middle text-amber-300 hover:text-amber-300"
                  >
                    <Images />
                    Chuyển sang chế độ truyện tranh
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-amber-300 font-semibold text-xl">
                      Xác nhận chuyển đổi
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Chuyển sang chế độ truyện tranh sẽ{" "}
                      <strong>tách nội dung thành nhiều trang</strong>. Bạn có
                      chắc chắn muốn tiếp tục không?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-amber-300 hover:bg-amber-400 cursor-pointery"
                      onClick={() => {
                        if (!story) return;

                        // Concat every panel into 1 drafted page
                        const combinedText =
                          story.panels?.map((p) => p.content).join("\n\n") ||
                          "";
                        setDraftContent(combinedText);
                        localStorage.setItem(
                          `draft-content-${story.id}`,
                          combinedText
                        );

                        // Stay in visual mode upon reload
                        localStorage.setItem(`visual-mode-${story.id}`, "true");

                        // Change the mode
                        setVisualMode(true);
                        setShowDraftOnly(true);

                        // Add an empty panel for visual mode
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
                        setCurrentPanelIndex(0);
                      }}
                    >
                      Tiếp tục
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <div className="pt-2 border-t mt-2">
            <Button
              className="w-full py-4 cursor-pointer"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu truyện"
              )}
            </Button>
          </div>
        </div>
      </div>
    </UnsavedChangesDialog>
  );
}
