"use client";

import clsx from "clsx";

import { useGame } from "@/stores/useGame";

const POWER_UPS = [
  {
    id: "speed",
    icon: "⚡",
    reply: "⚡ Speed Boost activated! AI responses will be lightning fast!",
  },
  {
    id: "xp",
    icon: "💎",
    reply: "💎 Double XP activated! You'll earn 2× experience for 30 seconds!",
  },
  { id: "mystery", icon: "🎁", reply: "" },
] as const;

export default function PowerUpDock() {
  const { powerUps, activatePowerUp, addMessage } = useGame();

  const onClick = (id: (typeof POWER_UPS)[number]["id"], reply: string) => {
    if (powerUps[id]) return;
    activatePowerUp(id);
    const mysteryReplies = [
      "🎁 Mystery reward: +50 XP bonus!",
      "🎁 Mystery reward: Instant level progress!",
      "🎁 Mystery reward: All power-ups refreshed!",
      "🎁 Mystery reward: Streak bonus applied!",
    ];
    const text =
      id === "mystery"
        ? mysteryReplies[Math.floor(Math.random() * mysteryReplies.length)]
        : reply;
    addMessage({ text, from: "ai" });
  };

  return (
    <aside className="fixed right-4 bottom-24 z-40 flex flex-col gap-3">
      {POWER_UPS.map((p) => (
        <button
          key={p.id}
          onClick={() => onClick(p.id, p.reply)}
          disabled={powerUps[p.id]}
          title={
            p.id === "speed"
              ? "Speed Boost"
              : p.id === "xp"
                ? "Double XP"
                : "Mystery Box"
          }
          className={clsx(
            "w-12 h-12 rounded-full grid place-items-center text-xl shadow-lg transition-all",
            "bg-[rgba(26,26,46,0.9)] backdrop-blur border-2", // vanilla glass
            powerUps[p.id]
              ? "border-[#6366f1] scale-110 animate-pulse pointer-events-none opacity-50"
              : "border-[rgba(99,102,241,0.5)] hover:border-[#a855f7] hover:scale-110 hover:shadow-[0_5px_20px_rgba(168,85,247,0.4)]",
          )}
        >
          {p.icon}
        </button>
      ))}
    </aside>
  );
}
