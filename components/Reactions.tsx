"use client";

const EMOJIS = ["👍", "❤️", "😂", "🤯", "🔥"] as const;

interface Props {
  onReactAction: (emoji: string) => void; // ➜ ends with “Action”
}

export default function Reactions({ onReactAction }: Props) {
  return (
    <div className="flex gap-2 mt-2">
      {EMOJIS.map((e) => (
        <button
          key={e}
          onClick={() => onReactAction(e)}
          className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition text-xs"
          title={`React ${e}`}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
