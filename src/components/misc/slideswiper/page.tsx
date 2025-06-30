"use client";

import React from "react";
import "./swiper.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import "swiper/css";
import "swiper/css/pagination";

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
      <SwiperSlide>
        <div className="relative w-full h-full">Hello World 1</div>
        <div className="relative w-full h-full">Hello World 2</div>
        <div className="relative w-full h-full">Hello World 3</div>
        <div className="relative w-full h-full">Hello World 4</div>
      </SwiperSlide>
    </Swiper>
  );
}
