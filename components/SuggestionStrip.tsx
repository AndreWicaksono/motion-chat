"use client";

import { useEffect, useState } from "react";

import { useGame } from "@/stores/useGame";

const POOL = [
  ["💭 Philosophy", "Let's talk philosophy"],
  ["🎩 Show trick", "Show me a trick"],
  ["🚀 Future talk", "What does the future hold?"],
  ["🎮 Challenge me", "Challenge me!"],
  ["✨ Something amazing", "Tell me something amazing"],
  ["💪 Motivate", "Motivate me"],
  ["🤔 Deep question", "Ask me a deep question"],
  ["🎯 Fun fact", "Share a fun fact"],
] as const;

export default function SuggestionStrip() {
  const [items, setItems] = useState<(typeof POOL)[number][]>([]);
  const addMessage = useGame((s) => s.addMessage);

  const pick = () => {
    const picked: (typeof POOL)[number][] = [];
    while (picked.length < 4) {
      const c = POOL[Math.floor(Math.random() * POOL.length)];
      if (!picked.some((p) => p[0] === c[0])) picked.push(c);
    }
    return picked;
  };

  useEffect(() => {
    setItems(pick());
    const id = setInterval(() => setItems(pick()), 15_000);
    return () => clearInterval(id);
  }, []);

  const send = (text: string) => addMessage({ text, from: "user" });

  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
      {items.map(([display, text]) => (
        <button
          key={text}
          onClick={() => send(text)}
          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm whitespace-nowrap transition"
        >
          {display}
        </button>
      ))}
    </div>
  );
}
