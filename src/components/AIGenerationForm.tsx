"use client";

import { Loader2Icon } from "lucide-react";
import { VoicePreviewButton } from "./VoicePreviewButton";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

interface Props {
  title: string;
  setTitle: (val: string) => void;
  prompt: string;
  setPrompt: (val: string) => void;
  ageRange: string;
  setAgeRange: (val: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (val: string) => void;
  generateAudio: boolean;
  setGenerateAudio: (val: boolean) => void;
  selectedVoice: string;
  setSelectedVoice: (val: string) => void;
  generateImage: boolean;
  setGenerateImage: (val: boolean) => void;
  selectedStyle: string;
  setSelectedStyle: (val: string) => void;
  optimizing: boolean;
  handleOptimizedPrompt: () => void;
  handleAIGenerate: () => void;
}

export default function AIGenerationForm({
  title,
  setTitle,
  prompt,
  setPrompt,
  ageRange,
  setAgeRange,
  selectedLanguage,
  setSelectedLanguage,
  generateAudio,
  setGenerateAudio,
  selectedVoice,
  setSelectedVoice,
  generateImage,
  setGenerateImage,
  selectedStyle,
  setSelectedStyle,
  optimizing,
  handleOptimizedPrompt,
  handleAIGenerate,
}: Props) {
  return (
    <>
      <Input
        placeholder="Tựa đề của câu truyện..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        className="w-full h-40"
        placeholder="Nhập miêu tả cơ bản của câu truyện ở đây..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <Button
        variant="outline"
        size="sm"
        disabled={!prompt || optimizing}
        onClick={handleOptimizedPrompt}
      >
        {optimizing ? (
          <div className="flex items-center space-x-2">
            <span>Đang tối ưu...</span>
            <Loader2Icon className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          "Tối ưu"
        )}
      </Button>

      <Select value={ageRange} onValueChange={setAgeRange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Chọn độ tuổi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1-3">1–3</SelectItem>
          <SelectItem value="3-5">3–5</SelectItem>
          <SelectItem value="5-8">5–8</SelectItem>
          <SelectItem value="8-10">8–10</SelectItem>
          <SelectItem value="10+">10+</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Chọn ngôn ngữ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ENG">Tiếng Anh</SelectItem>
          <SelectItem value="VIE">Tiếng Việt</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="generate-audio"
            checked={generateAudio}
            onCheckedChange={(checked) => setGenerateAudio(!!checked)}
            disabled={!selectedLanguage}
          />
          <label
            htmlFor="generate-audio"
            className="text-sm font-medium leading-none"
          >
            Tạo giọng đọc TTS
          </label>
        </div>

        {generateAudio && selectedLanguage === "ENG" && (
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose English voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alloy">Nữ</SelectItem>
              {/* <SelectItem value="echo">Energetic</SelectItem> */}
              <SelectItem value="fable">Nam</SelectItem>
              {/* <SelectItem value="nova">Crispy</SelectItem>
              <SelectItem value="shimmer">Playful</SelectItem> */}
            </SelectContent>
          </Select>
        )}

        {generateAudio && selectedLanguage === "VIE" && (
          <div className="flex items-center space-x-2">
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose Vietnamese voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hcm-diemmy">Nữ - Miền Nam</SelectItem>
                <SelectItem value="hn-phuongtrang">Nữ - Miền Bắc</SelectItem>
                <SelectItem value="hcm-minhquan">Nam - Miền Nam</SelectItem>
                <SelectItem value="hn-thanhtung">Nam - Miền Bắc</SelectItem>
              </SelectContent>
            </Select>
            <VoicePreviewButton selectedVoice={selectedVoice} />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="generate-image"
            checked={generateImage}
            onCheckedChange={(checked) => setGenerateImage(!!checked)}
          />
          <label
            htmlFor="generate-image"
            className="text-sm font-medium leading-none"
          >
            Tạo ảnh bìa câu truyện
          </label>
        </div>

        {generateImage && (
          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose image model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cartoonish">Hoạt hình</SelectItem>
              <SelectItem value="realistic">Chân thực</SelectItem>
              <SelectItem value="anime">Anime</SelectItem>
              <SelectItem value="sketch">Màu chì</SelectItem>
              <SelectItem value="watercolor">Màu nước</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <Button disabled={!prompt || optimizing} onClick={handleAIGenerate}>
        {optimizing ? (
          <div className="flex items-center space-x-2">
            <span>Đang tải...</span>
            <Loader2Icon className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          "Tạo truyện bằng AI"
        )}
      </Button>
    </>
  );
}
