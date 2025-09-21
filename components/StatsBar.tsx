"use client";

import { useGame } from "@/stores/useGame";

export default function StatsBar() {
  const { level, xp, xpNeeded, streak, mood } = useGame();
  const xpProgress = (xp / xpNeeded) * 100;

  return (
    <header className="px-4 py-3 bg-bg-card/90 backdrop-blur border-b border-white/10 flex items-center justify-between">
      {/* left stats */}
      <div className="flex items-center gap-3 text-sm">
        <span className="px-2 py-1 rounded-full bg-orange-400/20 text-orange-300 hover:bg-orange-400/30 hover:scale-105 transition">
          🔥 {streak}
        </span>

        <span className="px-2 py-1 rounded-full bg-green-400/20 text-green-300 hover:bg-green-400/30 hover:scale-105 transition">
          ⭐ {level}
        </span>

        {/* XP bar with label */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 hover:bg-brand-500/20 hover:scale-105 transition">
          <span className="text-brand-400 text-xs font-semibold">XP</span>
          <div className="relative h-2 bg-white/10 rounded-full w-24 overflow-hidden">
            <div
              style={{ width: `${xpProgress}%` }}
              className="h-full bg-gradient-to-r from-brand-500 to-purple rounded-full shadow-[0_0_10px_var(--color-brand-500)]"
            />
          </div>
        </div>
      </div>

      {/* mood */}
      <div className="flex items-center gap-2 text-lg">
        <span>{mood}</span>
        <span className="text-xs text-gray-400">Vibe</span>
      </div>
    </header>
  );
}
