"use client";

import { useEffect, useState } from "react";

import Confetti from "react-confetti";

import { useChat } from "@/stores/chat";

export default function StreakBadge() {
  const streak = useChat((s) => s.streak);
  const [boom, setBoom] = useState(false);

  useEffect(() => {
    setBoom(true);
    const t = setTimeout(() => setBoom(false), 1500);
    return () => clearTimeout(t);
  }, [streak]);

  return (
    <>
      {boom && (
        <Confetti
          width={300}
          height={200}
          recycle={false}
          numberOfPieces={60}
        />
      )}
      <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
        <span className="text-sm font-semibold">🔥 {streak}</span>
      </div>
    </>
  );
}
