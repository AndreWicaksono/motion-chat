"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/stores/useGame";
import { useSound } from "@/hooks/useSound";

export default function Combo() {
  const combo = useGame((s) => s.combo);
  const [show, setShow] = useState(false);
  const { playSoundFromAudioFile } = useSound();
  const lastComboRef = useRef(combo);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (combo >= 3 && combo !== lastComboRef.current) {
      playSoundFromAudioFile("/audio/effects/transition-fast-swoosh.mp3");
      lastComboRef.current = combo;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setShow(true);
      timeoutRef.current = window.setTimeout(() => setShow(false), 1000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combo]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      aria-hidden="true"
    >
      <div
        className="text-5xl md:text-8xl font-black"
        style={{
          background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "comboPopup 0.5s ease forwards",
        }}
      >
        COMBO!
      </div>
    </div>
  );
}
