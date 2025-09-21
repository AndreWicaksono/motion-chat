"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

import { useSound } from "@/hooks/useSound";
import { useGame } from "@/stores/useGame";

import SlashPalette from "./SlashPalette";
import SuggestionStrip from "./SuggestionStrip";

const COMMANDS = [
  { cmd: "/challenge", desc: "Start a creative challenge" },
  { cmd: "/fact", desc: "Share a fun fact" },
  { cmd: "/inspire", desc: "Get an inspirational message" },
  { cmd: "/joke", desc: "Tell a tech joke" },
] as const;

export default function Composer() {
  const [text, setText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSlash, setShowSlash] = useState(false);

  const addMessage = useGame((s) => s.addMessage);
  const { playSound } = useSound();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;

    setText(v);
    setShowSlash(v === "/" || (v.startsWith("/") && !v.includes(" ")));
  };

  const onPick = (cmd: string) => {
    setText(cmd);
    setShowSlash(false);
  };

  const send = () => {
    const raw = text.trim();
    if (!raw) return;

    // if palette is open, treat Enter as "pick + send"
    if (showSlash && raw === "/") {
      const cmd = COMMANDS[selectedIndex].cmd; // ➜ full command

      setText(cmd); // fill input
      setShowSlash(false); // close palette
      setTimeout(() => addMessage({ text: cmd, from: "user" }), 0); // send after state flush

      return;
    }

    // normal send
    addMessage({ text: raw, from: "user" });
    playSound();
    setText("");
  };

  return (
    <div className="px-4 py-3 bg-bg-card/80 backdrop-blur border-t border-white/10">
      <SlashPalette
        commands={COMMANDS}
        onClose={() => setShowSlash(false)}
        onPickAction={onPick}
        open={showSlash}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      <SuggestionStrip />

      <div className="flex gap-2">
        <input
          autoCapitalize="sentences" // ← Mobile (iOS/Android): keyboard automatically shifts to uppercase for the first character of every sentence (by combining it with CSS first-letter:uppercase for visual fallback).
          className="flex-1 rounded-full px-4 py-2 bg-white/5 border border-white/10 focus:outline-none focus:border-brand-500 first-letter:uppercase"
          enterKeyHint="send" // “Send” instead of “Go”
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              (e.target as HTMLInputElement).blur(); // Close mobile virtual keyboard

              send();
            }
          }}
          placeholder="Type something magical…"
          value={text}
        />

        <motion.button
          className="pl-1 pb-1 w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-purple grid place-items-center text-white shadow-lg"
          onClick={send}
          whileTap={{ scale: 0.9, rotate: -15 }}
        >
          <PaperAirplaneIcon height={24} width={24} className="-rotate-45" />
        </motion.button>
      </div>
    </div>
  );
}
