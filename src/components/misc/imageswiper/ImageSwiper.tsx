"use client";

import React from "react";
import "./swiper.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

const images = [
  "/Wallpaper/Wallpaper1.jpeg",
  "/Wallpaper/Wallpaper2.jpg",
  "/Wallpaper/Wallpaper3.jpg",
];

const swiperParams: SwiperOptions = {
  slidesPerView: 1,
  speed: 600,
  preventClicks: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: { clickable: true },
  modules: [Pagination, Autoplay],
};

export default function ImageSwiper() {
  return (
    <Swiper
      {...swiperParams}
      className="w-full h-full rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {images.map((src, i) => (
        <SwiperSlide key={i}>
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={`Slide ${i + 1}`}
              sizes="auto"
              fill
              className="object-cover"
              priority
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
