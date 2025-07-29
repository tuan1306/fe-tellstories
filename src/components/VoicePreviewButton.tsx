"use client";

import { useEffect, useRef, useState } from "react";
import { PlayCircle, PauseCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type VoicePreviewButtonProps = {
  selectedVoice: string | undefined;
};

const voicePreviews: Record<string, string> = {
  "hcm-diemmy":
    "http://storytellercdn.runasp.net/uploads/eca52b9c-42af-4544-8850-15a2405d2305.mp3",
  "hn-phuongtrang":
    "http://storytellercdn.runasp.net/uploads/cc0844df-3590-4b41-a0b0-791e4c1ebaae.mp3",
  "hcm-minhquan":
    "http://storytellercdn.runasp.net/uploads/6add7e9f-f8d4-49bb-8c6a-1bb863cd8d6a.mp3",
  "hn-thanhtung":
    "http://storytellercdn.runasp.net/uploads/c5bfc532-1199-435c-986a-3f86397f2e8f.mp3",
};

export function VoicePreviewButton({ selectedVoice }: VoicePreviewButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVoice, setCurrentVoice] = useState<string | undefined>(
    undefined
  );

  const handleClick = () => {
    if (!selectedVoice) return;
    const url = voicePreviews[selectedVoice];
    if (!url) return;

    // Pause, else resume
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current || currentVoice !== selectedVoice) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(url);
        setCurrentVoice(selectedVoice);
        audioRef.current.onended = () => setIsPlaying(false);
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    // On voice change, stop current audio
    if (currentVoice && selectedVoice !== currentVoice) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [currentVoice, selectedVoice]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!selectedVoice}
      className={cn(
        "p-2 rounded cursor-pointer transition-colors",
        "hover:bg-muted",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      {isPlaying ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
    </button>
  );
}
