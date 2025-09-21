"use client";

import { useEffect, useRef, useState } from "react";
import { useSound } from "@/hooks/useSound";

export default function AchievementToast() {
  const [show, setShow] = useState(false);
  const [icon, setIcon] = useState("🏆");
  const [text, setText] = useState("");
  const { playSoundFromAudioFile } = useSound();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const onAchieve = (e: CustomEvent<{ icon: string; text: string }>) => {
      setIcon(e.detail.icon);
      setText(e.detail.text);
      setShow(true);
      playSoundFromAudioFile("/audio/effects/toast.mp3");

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setShow(false), 4000);
    };

    window.addEventListener("achievement", onAchieve as EventListener);
    return () => {
      window.removeEventListener("achievement", onAchieve as EventListener);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`fixed top-24 right-4 bg-gradient-to-br from-bg-card to-purple/20 border border-brand-500 rounded-lg p-4 flex items-center gap-4 shadow-2xl transition-transform duration-500
        ${show ? "translate-x-0" : "translate-x-[120%]"}`}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="text-xs text-brand-400 font-semibold">
          ACHIEVEMENT UNLOCKED
        </h3>
        <p className="text-white font-bold">{text}</p>
      </div>
    </div>
  );
}
