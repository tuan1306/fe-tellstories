"use client";

import Lottie from "react-lottie-player";

export default function WritingAnimation() {
  return (
    <Lottie
      loop
      play
      renderer="svg"
      path="/animation/Writing.json"
      style={{ width: 150, height: 150 }}
    />
  );
}
