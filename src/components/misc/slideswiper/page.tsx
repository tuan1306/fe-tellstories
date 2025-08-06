"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { PanelSwiperProps } from "@/app/types/panel";
import { Loader2, ImagePlus } from "lucide-react";
import PanelContextMenu from "@/components/PanelContextMenu";

interface PanelEditorProps extends PanelSwiperProps {
  currentPanelIndex: number;
  setPanelContents: React.Dispatch<React.SetStateAction<string[]>>;
  visualMode: boolean; // <-- NEW prop to track visual panel mode
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    // In production, you'd upload to server or storage and get URL
    const imageUrl = URL.createObjectURL(file);

    if (onImageChange) {
      onImageChange(currentPanelIndex, imageUrl);
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
          <div className="w-full mb-4">
            <h1 className="text-xl font-semibold">
              Trang soạn thảo truyện tranh
            </h1>
            <h1 className="text-sm text-muted-foreground">
              Truyện bạn sáng tác sẽ nằm ở đây
            </h1>
          </div>
          {panel.imageUrl ? (
            <div className="w-full h-40 relative rounded-md overflow-hidden shadow-md">
              <Image
                src={panel.imageUrl}
                alt={`Panel ${currentPanelIndex + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-40 flex items-center justify-center border-2 border-dashed rounded-md">
              <label className="flex flex-col items-center cursor-pointer">
                <ImagePlus className="w-8 h-8 mb-2 text-muted-foreground" />
                <span className="text-sm font-semibold text-muted-foreground">
                  Thêm ảnh
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}
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
