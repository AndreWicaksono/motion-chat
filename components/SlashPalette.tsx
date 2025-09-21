"use client";

import { Dispatch, useEffect, useRef } from "react";

interface Props {
  open: boolean;
  selectedIndex: number;
  setSelectedIndex: Dispatch<React.SetStateAction<number>>;
  onPickAction: (cmd: string) => void;
  onClose: () => void;
  commands: readonly { cmd: string; desc: string }[];
}

export default function SlashPalette({
  open,
  selectedIndex,
  setSelectedIndex,
  onPickAction,
  onClose,
  commands,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % commands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + commands.length) % commands.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        onPickAction(commands[selectedIndex].cmd);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedIndex, onPickAction, onClose]);

  useEffect(() => {
    listRef.current?.children[selectedIndex]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [selectedIndex]);

  return (
    <div
      className={`absolute bottom-full mb-2 left-0 right-0 bg-bg-card/90 backdrop-blur border border-white/10 rounded-lg p-2 transition-all duration-200 ease-out
        ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
    >
      <div ref={listRef} className="max-h-60 overflow-y-auto">
        {commands.map((c, idx) => (
          <button
            key={c.cmd}
            onClick={() => onPickAction(c.cmd)}
            className={`w-full text-left px-3 py-2 rounded flex justify-between transition
              ${idx === selectedIndex ? "bg-brand-500/20" : "hover:bg-white/10"}`}
          >
            <span className="text-brand-500 font-semibold">{c.cmd}</span>
            <span className="text-gray-400 text-sm">{c.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
