"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { PendingStoryRequest, StoryDetails } from "@/app/types/story";
import { AgeGroupFilter } from "@/components/AgeGroupFilter";
import { PanelCountFilter } from "@/components/PanelCountFilter";
import { LanguageFilter } from "@/components/LanguageFilter";
import { ReadingLevelFilter } from "@/components/ReadingLevelFilter";
import { TTSAudioFilter } from "@/components/TTSAudioFilter";
import ManageStoryGrid from "@/components/ManageStoryGrid";

export default function StoriesManagement() {
  const [search, setSearch] = useState("");
  const [userStories, setUserStories] = useState<StoryDetails[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "Published" | "Pending" | "Featured"
  >("Published");
  const [panelFilter, setPanelFilter] = useState<string[]>([]);
  const [pendingStories, setPendingStories] = useState<PendingStoryRequest[]>(
    []
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string[]>([]);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const toggleAudio = (option: string) => {
    setSelectedAudio((prev) =>
      prev.includes(option)
        ? prev.filter((a) => a !== option)
        : [...prev, option]
    );
  };

  const toggleAge = (age: string) => {
    setSelectedAges((prev) =>
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
    );
  };

  useEffect(() => {
    if (statusFilter === "Published" || statusFilter === "Featured") {
      let endpoint = "/api/stories/";

      if (statusFilter === "Published") endpoint = "/api/stories/published";
      else if (statusFilter === "Featured") endpoint = "/api/stories/featured";

      fetch(endpoint)
        .then((res) => res.json())
        .then((json) => {
          const stories = json?.data?.items || [];
          setUserStories(stories);
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [statusFilter]);

  useEffect(() => {
    if (statusFilter === "Pending") {
      fetch("/api/stories/pending?page=1&pageSize=10")
        .then((res) => res.json())
        .then((data) => {
          // console.log("Pending API Response", data);
          setPendingStories(data?.data.items || []);
        })
        .catch((err) => console.error("Pending fetch error:", err));
    }
  }, [statusFilter]);

  const filtered = userStories
    .filter((story) => {
      const panelCount = story.panels?.length || 0;
      if (panelFilter.includes("Single") && panelCount === 1) return true;
      if (panelFilter.includes("Multiple") && panelCount > 1) return true;
      return panelFilter.length === 0; // All
    })
    .filter((story) => {
      return (
        selectedLanguages.length === 0 ||
        selectedLanguages.includes(story.language || "")
      );
    })
    .filter(
      (story) =>
        selectedLevels.length === 0 ||
        selectedLevels.includes(story.readingLevel || "")
    )
    .filter((story) => {
      if (selectedAudio.length === 0) return true;

      const hasAudio = story.panels?.some(
        (panel) => panel.audioUrl?.trim() !== ""
      );
      return (
        (selectedAudio.includes("TTS") && hasAudio) ||
        (selectedAudio.includes("Without TTS") && !hasAudio)
      );
    })

    .filter(
      (story) =>
        story.title.toLowerCase().includes(search.toLowerCase()) ||
        (story.author || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (story) =>
        selectedAges.length === 0 || selectedAges.includes(story.ageRange || "")
    )
    .filter((story) => {
      if (statusFilter === "Published") return story.isPublished;
      if (statusFilter === "Pending") return !story.isPublished;
      if (statusFilter === "Featured") return story.isFeatured;
      return true;
    });

  return (
    <div className="flex gap-6 mt-4 h-[90vh]">
      {/* LEFT */}
      <div className="w-1/4 bg-card rounded-lg p-4 space-y-4 overflow-auto">
        <Input
          type="text"
          placeholder="Search title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ScrollArea>
          <div
            onClick={() => setStatusFilter("Published")}
            className={`p-3 rounded-md text-sm font-medium cursor-pointer transition-colors mb-2 ${
              statusFilter === "Published"
                ? "bg-muted text-white"
                : "bg-card hover:bg-muted/70"
            }`}
          >
            Published Stories
          </div>

          <div
            onClick={() => setStatusFilter("Featured")}
            className={`p-3 rounded-md text-sm font-medium cursor-pointer transition-colors mb-2 ${
              statusFilter === "Featured"
                ? "bg-muted text-white"
                : "bg-card hover:bg-muted/70"
            }`}
          >
            Featured Stories
          </div>

          <div
            onClick={() => setStatusFilter("Pending")}
            className={`p-3 rounded-md text-sm font-medium cursor-pointer transition-colors mb-2 ${
              statusFilter === "Pending"
                ? "bg-muted text-white"
                : "bg-card hover:bg-muted/70"
            }`}
          >
            Pending Approval
          </div>

          <div className="my-3 border-t border-border" />

          <AgeGroupFilter selected={selectedAges} onChange={toggleAge} />
          <PanelCountFilter
            selected={panelFilter}
            onChange={(panel) =>
              setPanelFilter((prev) =>
                prev.includes(panel)
                  ? prev.filter((p) => p !== panel)
                  : [...prev, panel]
              )
            }
          />
          <LanguageFilter
            selected={selectedLanguages}
            onChange={toggleLanguage}
          />
          <ReadingLevelFilter
            selected={selectedLevels}
            onChange={toggleLevel}
          />
          <TTSAudioFilter selected={selectedAudio} onChange={toggleAudio} />
        </ScrollArea>
      </div>

      {/* RIGHT*/}
      <div className="w-3/4 bg-card rounded-lg p-5 h-full">
        <ManageStoryGrid
          stories={userStories}
          statusFilter={statusFilter}
          pendingStories={pendingStories}
          filtered={filtered}
        />
      </div>
    </div>
  );
}
