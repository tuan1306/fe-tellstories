"use client";
import { useEffect, useState } from "react";

export default function HelloWorld() {
  const fullText = "Goodbye World";
  const moreText = "見るやめろ、このお節介焼き、ぶっ殺すぞおめえヾ(`ヘ´)ﾉﾞ";
  const [text, setText] = useState("");
  const [more, setMore] = useState("");
  const [isEnd, setIsEnd] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        // slice & cat each word
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
        setIsEnd(true);
      }
    }, 50);

    return () => clearInterval(typing);
  }, []);

  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const typing = setInterval(() => {
        if (i < moreText.length) {
          setMore(moreText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typing);
        }
      }, 100);
    }, 2000);

    return () => clearInterval(delay);
  }, [isEnd]);

  useEffect(() => {
    const blink = setInterval(() => {
      // constantly flip value left & right
      setShowCursor((prev) => !prev);
    }, 400);

    return () => clearInterval(blink);
  }, []);

  return (
    <div>
      <h1 className="text-[105px] text-slate-700 font-medium text-shadow-[0_7px_8px_rgba(0,0,0,0.3)]">
        {text}
        <span className={`${showCursor ? "inline" : "invisible"}`}>_</span>
      </h1>
      <h1 className="text-[17px]">{more}</h1>
    </div>
  );
}
