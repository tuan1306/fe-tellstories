"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";

interface PanelImageProps {
  src: string;
  alt: string;
}

export function PanelImage({ src, alt }: PanelImageProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div className="w-full h-40 relative rounded-md overflow-hidden shadow-md group">
        <Image src={src} alt={alt} fill className="object-cover" />
        <button
          onClick={() => setExpanded(true)}
          className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setExpanded(false)}
        >
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-50"
            aria-label="Close image viewer"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative w-4/5 max-w-4xl h-4/5 rounded-md overflow-hidden shadow-lg
                       transform scale-95 opacity-0 animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
