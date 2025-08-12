"use client";

import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { PanelSwiperProps } from "@/app/types/panel";
import { Loader2, MicOff, Mic, ImagePlus } from "lucide-react";
import PanelContextMenu from "@/components/PanelContextMenu";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { ImagePanelDialog } from "@/components/ImagePanelDialog";
import { PanelImage } from "@/components/PanelImage";

interface PanelEditorProps extends PanelSwiperProps {
  currentPanelIndex: number;
  setPanelContents: React.Dispatch<React.SetStateAction<string[]>>;
  visualMode: boolean;
  onImageChange?: (index: number, imageUrl: string) => void;
}

export default function PanelEditor({
  panels,
  panelContents,
  setPanelContents,
  currentPanelIndex,
  visualMode,
  onImageChange,
}: PanelEditorProps) {
  const panel = panels[currentPanelIndex];
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isImproving, setIsImproving] = useState(false);

  // ImageDialog for edit
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  // This will support for every browser if I install polyfill, but rn idk how.

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // console.log("Transcript:", transcript);
  // console.log("Listening:", listening);

  // const wasListeningRef = useRef(false);

  const lastTranscriptRef = useRef("");

  // Only append the latest transcript
  useEffect(() => {
    if (listening) {
      const newPart = transcript.slice(lastTranscriptRef.current.length);
      if (newPart) {
        setPanelContents((prev) => {
          const updated = [...prev];
          updated[currentPanelIndex] =
            (prev[currentPanelIndex] ?? "") + newPart;
          return updated;
        });
        lastTranscriptRef.current = transcript;
      }
    }
  }, [transcript, listening, currentPanelIndex, setPanelContents]);

  // If the panel is 1 => remove on visual mode.
  // Only run once on mount or when visualMode first turns true
  useEffect(() => {
    if (visualMode && currentPanelIndex === 0) {
      const firstPanelEmpty = !panelContents[0]?.trim();
      if (firstPanelEmpty) {
        setPanelContents((prev) => {
          const updated = [...prev];
          updated[0] = "";
          return updated;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImproveWithAI = async () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd) || value;

    if (!selectedText.trim()) return;

    setIsImproving(true);

    try {
      const requestBody = { inputText: selectedText };
      const res = await fetch("/api/stories/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      const improvedText = data.data ?? selectedText;

      const updatedContent =
        value.substring(0, selectionStart) +
        improvedText +
        value.substring(selectionEnd);

      setPanelContents((prev) => {
        const updated = [...prev];
        updated[currentPanelIndex] = updatedContent;
        return updated;
      });

      //Restore cursor
      setTimeout(() => {
        const pos = selectionStart + improvedText.length;
        textarea.setSelectionRange(pos, pos);
        textarea.focus();
      }, 0);
    } catch (error) {
      console.error("[Improve API] Error:", error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleCustomAdjustment = async (instruction: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd) || value;

    if (!selectedText.trim()) return;

    setIsImproving(true);

    try {
      const res = await fetch("/api/stories/ai/improve/custom-adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText: selectedText,
          customInstruction: instruction,
        }),
      });

      const data = await res.json();
      const improvedText = data.data ?? selectedText;

      const updatedContent =
        value.substring(0, selectionStart) +
        improvedText +
        value.substring(selectionEnd);

      setPanelContents((prev) => {
        const updated = [...prev];
        updated[currentPanelIndex] = updatedContent;
        return updated;
      });

      setTimeout(() => {
        const pos = selectionStart + improvedText.length;
        textarea.setSelectionRange(pos, pos);
        textarea.focus();
      }, 0);
    } catch (err) {
      console.error("[Custom Adjust API] Error:", err);
    } finally {
      setIsImproving(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setPanelContents((prev) => {
      const updated = [...prev];
      updated[currentPanelIndex] = newValue;
      return updated;
    });
  };

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files?.[0]) return;
  //   const file = e.target.files[0];

  //   // In production, you'd upload to server or storage and get URL
  //   const imageUrl = URL.createObjectURL(file);

  //   if (onImageChange) {
  //     onImageChange(currentPanelIndex, imageUrl);
  //   }
  // };

  // Inserting the post recording
  const insertTranscript = () => {
    if (!transcript.trim()) return;

    // Get the current selected area of the textarea
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;

    // Based on the selected area, we replace that word based on the transcript
    // By concat the first + transcript + end
    const updatedValue =
      value.substring(0, selectionStart) +
      transcript +
      value.substring(selectionEnd);

    // Same thing did here.
    setPanelContents((prev) => {
      const updated = [...prev];
      updated[currentPanelIndex] = updatedValue;
      return updated;
    });

    setTimeout(() => {
      const cursorPos = selectionStart + transcript.length;
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);

    resetTranscript();
  };

  const handleToggleRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Trình duyệt không hỗ trợ nhận diện giọng nói.");
      return;
    }

    // I'll add more language when needed.
    if (listening) {
      SpeechRecognition.stopListening();
      insertTranscript();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: false,
        language: "vi-VN",
      });
    }
  };

  const textarea = textareaRef.current;
  const fullText = panelContents[currentPanelIndex] ?? "";
  const selectedText =
    textarea && textarea.selectionStart !== textarea.selectionEnd
      ? fullText.substring(textarea.selectionStart, textarea.selectionEnd)
      : "";

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto shadow-sm overflow-y-auto">
      {visualMode && (
        <div className="space-y-2">
          <div className="w-full mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                Trang soạn thảo truyện tranh
              </h1>
              <h1 className="text-sm text-muted-foreground">
                Truyện bạn sáng tác sẽ nằm ở đây
              </h1>
            </div>

            <button
              type="button"
              onClick={handleToggleRecording}
              className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-colors ${
                listening
                  ? "bg-red-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {listening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span className="text-sm not-italic">Đang ghi âm</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span className="text-sm">Ghi âm</span>
                </>
              )}
            </button>
          </div>

          {/* Image Display */}
          {isImageDialogOpen && (
            <ImagePanelDialog
              panels={panels}
              panelIndex={currentPanelIndex}
              onImageSelect={(url) => {
                onImageChange?.(currentPanelIndex, url);
              }}
              open={isImageDialogOpen}
              onOpenChange={setIsImageDialogOpen}
            />
          )}

          {/* Show either the image or the empty state */}
          {panel.imageUrl ? (
            <PanelImage
              src={panel.imageUrl}
              alt={`Panel ${currentPanelIndex + 1}`}
              onEditClick={() => setIsImageDialogOpen(true)}
            />
          ) : (
            <div
              className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer transition"
              onClick={() => setIsImageDialogOpen(true)}
            >
              <ImagePlus className="w-8 h-8 mb-2 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">
                Thêm ảnh
              </span>
            </div>
          )}
        </div>
      )}

      {!visualMode && (
        <div className="flex w-full mb-4 items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Trang soạn thảo truyện</h1>
            <h1 className="text-sm text-muted-foreground">
              Truyện bạn sáng tác sẽ nằm ở đây
            </h1>
          </div>

          <button
            type="button"
            onClick={handleToggleRecording}
            className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-colors ${
              listening
                ? "bg-red-500 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {listening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span className="text-sm not-italic">Đang ghi âm</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span className="text-sm">Ghi âm</span>
              </>
            )}
          </button>
        </div>
      )}

      <PanelContextMenu
        selectedText={selectedText}
        onImprove={handleImproveWithAI}
        onCustomAdjust={handleCustomAdjustment}
        disabled={isImproving}
      >
        <div
          className={`relative w-full ${visualMode ? "h-[30vh]" : "h-[60vh]"}`}
        >
          {isImproving && (
            <div className="absolute inset-0 z-20 bg-muted/80 backdrop-blur-sm rounded-md flex items-center justify-center">
              <Loader2 className="animate-spin h-10 w-10 text-muted-foreground" />
            </div>
          )}
          <Textarea
            ref={textareaRef}
            value={panelContents[currentPanelIndex] ?? ""}
            onChange={handleTextChange}
            placeholder="Nhập nội dung truyện của trang này"
            className="w-full h-full rounded-md resize-none text-base"
            disabled={isImproving}
          />
        </div>
      </PanelContextMenu>
    </div>
  );
}
