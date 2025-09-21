"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/stores/useGame";

const EMOJIS = ["🎉", "🌟", "💫", "✨", "🎊", "🚀"];
const RAIN_EMOJI_COUNT = 30;
const THROTTLE_MS = 5_000; // don’t re-rain within 5 s

export default function EmojiRain() {
  const streak = useGame((s) => s.streak);
  const lastRan = useRef(0); // timestamp

  useEffect(() => {
    if (streak < 7) return;
    const now = Date.now();
    if (now - lastRan.current < THROTTLE_MS) return;
    lastRan.current = now;

    /* ---- create & animate once ---- */
    for (let i = 0; i < RAIN_EMOJI_COUNT; i++) {
      setTimeout(() => {
        const el = document.createElement("div");
        el.innerText = EMOJIS[i % EMOJIS.length];
        el.className = "fixed text-3xl pointer-events-none z-50";
        el.style.left = `${Math.random() * 100}vw`;
        el.style.top = "-50px";
        document.body.appendChild(el);

        let y = -50;
        let raf = 0;
        const fall = () => {
          y += 3;
          el.style.transform = `translateY(${y}px)`;
          if (y < window.innerHeight) {
            raf = requestAnimationFrame(fall);
          } else {
            cancelAnimationFrame(raf); // ← now it’s used
            el.remove();
          }
        };
        raf = requestAnimationFrame(fall);
      }, i * 80);
    }
  }, [streak]);

  return null;
}
