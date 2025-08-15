"use client";

import { StoryDetails } from "@/app/types/story";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, Music, PenLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function StoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState<StoryDetails | null>(null);
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);

  // Audio
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const [bgmVolume, setBgmVolume] = useState(0.2);

  // BGM audio volume control
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = bgmVolume;
    }
  }, [bgmVolume]);

  // // Stop the autoplay
  // useEffect(() => {
  //   if (ttsAudioRef.current) {
  //     ttsAudioRef.current.play().catch((err) => {
  //       console.warn("Autoplay blocked:", err);
  //     });
  //   }
  // }, [currentPanelIndex]);

  const handlePlay = async () => {
    if (!story) return;

    try {
      if (bgMusicRef.current && bgMusicRef.current.paused) {
        bgMusicRef.current.volume = 0.2;
        await bgMusicRef.current.play();
      }
    } catch (err) {
      console.error("Error playing BGM:", err);
    }
  };

  const handlePause = () => {
    if (bgMusicRef.current && !bgMusicRef.current.paused) {
      bgMusicRef.current.pause();
    }
  };

  const handleStop = (shouldPlay?: boolean) => {
    if (bgMusicRef.current && !bgMusicRef.current.paused) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
      if (shouldPlay) {
        bgMusicRef.current.play();
      }
    }
  };

  const handleEnded = () => {
    if (!story) return;

    if (currentPanelIndex < story.panels.length - 1) {
      setCurrentPanelIndex((prev) => prev + 1);
      handleStop(true);
    }
  };

  // useEffect(() => {
  //   if (ttsAudioRef.current) {
  //     ttsAudioRef.current.pause(); // Ensure not playing
  //     ttsAudioRef.current.load();
  //     const timer = setTimeout(() => {
  //       ttsAudioRef.current?.play().catch((err) => {
  //         console.warn("Autoplay blocked:", err);
  //       });
  //     }, 300);
  //     return () => clearTimeout(timer);
  //   }
  // }, [currentPanelIndex]);

  async function fetchStoryById(id: string): Promise<StoryDetails | null> {
    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to fetch story:", err.message);
        return null;
      }

      const json = await res.json();

      console.log(json);

      return json.data.data as StoryDetails;
    } catch (error) {
      console.error("Error fetching story:", error);
      return null;
    }
  }

  useEffect(() => {
    if (typeof id === "string") {
      fetchStoryById(id).then(setStory);
    }
  }, [id]);

  if (!story) return <div>Loading...</div>;

  return (
    <div className="mt-4 h-[90vh] flex flex-col xl:flex-row gap-8">
      {/* Left */}
      <div className="w-full xl:w-1/3 flex flex-col overflow-hidden h-full">
        <div className="bg-primary-foreground p-4 rounded-lg flex flex-col h-full overflow-hidden">
          <div className="mb-4">
            <div className="w-full">
              <h1 className="text-xl font-semibold">Thông tin cơ bản</h1>
              <h1 className="text-sm text-muted-foreground">
                Bao gồm tiêu đề, tác giả, mô tả của truyện
              </h1>
            </div>
            <div className="pb-2 border-b mt-4">
              <Link href={`/owner/write-story/${story.id}`}>
                <Button className="w-full py-4 hover:bg-primary/90 transition cursor-pointer">
                  <PenLine />
                  Chỉnh sửa truyện
                </Button>
              </Link>
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0 pr-2">
            <div className="space-y-3">
              <div className="relative w-64 h-96 mx-auto overflow-hidden rounded-xl shadow-2xl">
                {story.coverImageUrl?.startsWith("http") ? (
                  <Image
                    src={story.coverImageUrl}
                    alt={story.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">ID:</span>
                <span>{story.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Tựa đề:</span>
                <span>{story.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Tác giả:</span>
                <span>{story.author || "N/A"}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold whitespace-nowrap">Miêu tả:</span>
                <span className="flex-1 whitespace-pre-line">
                  {story.description || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Độ tuổi:</span>
                <Badge>{story.ageRange}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Mức độ đọc:</span>
                <Badge>{story.readingLevel}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Ngôn ngữ:</span>
                <Badge>{story.language}</Badge>
              </div>
              {story.tags?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">Tags:</span>
                  {story.tags.map((tag, id) => (
                    <Badge key={id} className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Right */}
      <div className="w-full xl:w-2/3 flex flex-col space-y-4 overflow-hidden">
        <div className="flex flex-col bg-primary-foreground p-4 rounded-lg max-h-[90vh] h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 min-h-0 max-h-full pr-2">
            {/* Image stays fixed */}
            {story.panels[currentPanelIndex].imageUrl && (
              <div className="w-full h-64 relative rounded-md overflow-hidden shadow-md">
                <Image
                  src={story.panels[currentPanelIndex].imageUrl}
                  alt={`Panel ${currentPanelIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Only the text scrolls */}
            {/* [calc(100%-2rem)] - Tall as parents subtract 2rem (root em - 16px by default) */}
            <ScrollArea
              className={`mt-2 ${
                story.panels[currentPanelIndex].imageUrl
                  ? "h-60"
                  : "h-[calc(100%-2rem)]"
              }`}
            >
              <p className="text-base text-muted-foreground text-center max-w-prose mx-auto whitespace-pre-line">
                {story.panels[currentPanelIndex].content}
              </p>
            </ScrollArea>
          </div>

          {/* Pagination Controls */}
          {story.panels.length > 1 && (
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
          )}

          {/* Background Music */}
          <audio
            ref={bgMusicRef}
            src={story.backgroundMusicUrl}
            loop
            className="hidden"
          />

          {/* TTS */}
          <audio
            ref={ttsAudioRef}
            controls
            className="hidden"
            src={story.panels[currentPanelIndex]?.audioUrl}
          />

          {/* Audio Player */}
          <div className="mt-2">
            <div className="w-full">
              {/* Currently fixated, because if multiple audioURL on multiple pannels, then the audio player will auto-replay alot */}
              {/* Needed to put every audioURL for every panel, then concat them together. */}
              <AudioPlayer
                src={story.panels[currentPanelIndex]?.audioUrl || ""}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                showJumpControls={false}
                autoPlay
                layout="stacked-reverse"
                customAdditionalControls={[
                  <div
                    key="bgm-volume-control"
                    className="flex items-center -mr-18"
                    style={{ width: 100 }}
                  >
                    <Music className="h-8 w-8 mr-2 text-[#4d72a2]" />
                    <Slider
                      value={[bgmVolume * 100]}
                      max={100}
                      onValueChange={(value) => setBgmVolume(value[0] / 100)}
                      step={1}
                      className="h-5 [&_[role=slider]]:h-2 [&_[role=slider]]:w-2"
                    />
                  </div>,
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
