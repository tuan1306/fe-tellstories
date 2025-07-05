"use client";

import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Textarea } from "@/components/ui/textarea";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { PanelSwiperProps } from "@/app/types/panel";
import { SwiperOptions } from "swiper/types";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";

const swiperParams: SwiperOptions = {
  slidesPerView: 1,
  speed: 600,
  pagination: {
    type: "fraction",
  },
  navigation: true,
  modules: [Pagination, Navigation],
};

export default function PanelSwiper({
  panels,
  panelContents,
  setPanelContents,
}: PanelSwiperProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Update Swiper layout when panels change
  useEffect(() => {
    swiperRef.current?.update();
  }, [panels]);

  return (
    <Swiper
      {...swiperParams}
      className="w-full h-full rounded-xl overflow-hidden"
    >
      {panels.map((panel, i) => (
        <SwiperSlide key={i} className="flex justify-center items-center px-2">
          <div className="w-full max-w-2xl mx-auto space-y-4">
            {panel.imageUrl && (
              <div className="w-full h-60 relative rounded-md overflow-hidden shadow-md">
                <Image
                  src={panel.imageUrl}
                  alt={`Panel ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <Textarea
              value={panelContents[i] ?? ""}
              onChange={(e) => {
                const newContents = [...panelContents];
                newContents[i] = e.target.value;
                setPanelContents(newContents);
              }}
              placeholder="Enter panel text..."
              className="w-full resize-none h-[60vh]"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
