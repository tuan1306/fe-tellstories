"use client";

import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { PanelSwiperProps } from "@/app/types/panel";

export default function PanelEditor({
  panels,
  panelContents,
  setPanelContents,
  currentPanelIndex,
}: PanelSwiperProps & { currentPanelIndex: number }) {
  const panel = panels[currentPanelIndex];

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
      <Textarea
        value={panelContents[currentPanelIndex] ?? ""}
        onChange={(e) => {
          const updated = [...panelContents];
          updated[currentPanelIndex] = e.target.value;
          setPanelContents(updated);
        }}
        placeholder="Enter panel text..."
        className="w-full h-[60vh] resize-none text-base"
      />
    </div>
  );
}
