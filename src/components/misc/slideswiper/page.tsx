"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { PanelSwiperProps } from "@/app/types/panel";
import { Loader2 } from "lucide-react";
import PanelContextMenu from "@/components/PanelContextMenu";

interface PanelEditorProps extends PanelSwiperProps {
  currentPanelIndex: number;
  setPanelContents: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function PanelEditor({
  panels,
  panelContents,
  setPanelContents,
  currentPanelIndex,
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

      // Restore cursor
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
      const res = await fetch("/api/stories/ai/custom-adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText: selectedText,
          instruction,
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

  const textarea = textareaRef.current;
  const fullText = panelContents[currentPanelIndex] ?? "";

  // Checking non-null, actually selected from head to toe and uhh extract.
  const selectedText =
    textarea && textarea.selectionStart !== textarea.selectionEnd
      ? fullText.substring(textarea.selectionStart, textarea.selectionEnd)
      : "";

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto p-4 rounded-xl shadow-sm">
      {panel.imageUrl && (
        <div className="w-full h-60 relative rounded-md overflow-hidden shadow-md">
          <Image
            src={panel.imageUrl}
            alt={`Panel ${currentPanelIndex + 1}`}
            fill
            className="object-cover"
          />
        </div>
      )}

      <PanelContextMenu
        selectedText={selectedText}
        onImprove={handleImproveWithAI}
        onCustomAdjust={handleCustomAdjustment}
        disabled={isImproving}
      >
        <div className="relative w-full h-[60vh]">
          {isImproving && (
            <div className="absolute inset-0 z-20 bg-muted/80 backdrop-blur-sm rounded-md flex items-center justify-center">
              <Loader2 className="animate-spin h-10 w-10 text-muted-foreground" />
            </div>
          )}
          <Textarea
            ref={textareaRef}
            value={panelContents[currentPanelIndex] ?? ""}
            onChange={handleTextChange}
            placeholder="Enter panel content..."
            className="w-full h-full rounded-md resize-none text-base"
            disabled={isImproving}
          />
        </div>
      </PanelContextMenu>
    </div>
  );
}
