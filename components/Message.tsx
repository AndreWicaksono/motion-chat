"use client";

import { clsx } from "clsx";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { useGame } from "@/stores/useGame";
import { Msg } from "@/stores/useGame";
import Reactions from "./Reactions";

interface Props {
  msg: Msg;
}

export default function Message({ msg }: Props) {
  const { playSoundFromAudioFile } = useSound();
  const isUser = msg.from === "user";
  const avatar = isUser ? "👤" : "🤖";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx("flex gap-2", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-br from-purple to-pink grid place-items-center text-sm"
          style={{
            boxShadow: "0 0 0 0 rgba(168, 85, 247, 0.6)", // ➜ brighter start
            animation: "halo 2s infinite",
          }}
        >
          🤖
        </div>
      )}

      <div
        className={clsx(
          "px-4 py-2 rounded-2xl max-w-[75%] break-words",
          isUser
            ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white"
            : "bg-bg-card/90 backdrop-blur",
        )}
      >
        {msg.text}
        {!isUser && (
          <Reactions
            onReactAction={(emoji) => {
              playSoundFromAudioFile("/audio/effects/emoji-reactions.mp3");
              useGame.getState().addXP(5);
              const replies: Record<string, string> = {
                "👍": "Glad you liked that! 😊",
                "❤️": "Aww, you're making me happy! 💖",
                "😂": "Haha, I love making you laugh! 😄",
                "🤯": "Mind = blown! I love surprising you! 🚀",
                "🔥": "We're on fire today! 🔥",
              };
              const text = replies[emoji] ?? "Thanks for the reaction! ✨";
              useGame.getState().addMessage({ text, from: "ai" });

              /* ---- leak-free confetti ---- */
              for (let i = 0; i < 12; i++) {
                setTimeout(() => {
                  const p = document.createElement("div");
                  p.innerText = emoji;
                  p.className = "fixed pointer-events-none z-50 text-2xl";
                  p.style.left = `${Math.random() * 100}vw`;
                  p.style.top = "-50px";
                  document.body.appendChild(p);

                  let y = -50;
                  /* inside the confetti loop */
                  let raf: number;
                  const fall = () => {
                    y += 3;
                    p.style.transform = `translateY(${y}px)`;
                    if (y < window.innerHeight) {
                      raf = requestAnimationFrame(fall);
                    } else {
                      cancelAnimationFrame(raf); // ← use it
                      p.remove();
                    }
                  };
                  raf = requestAnimationFrame(fall);
                }, i * 80);
              }
            }}
          />
        )}
      </div>

      {isUser && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 grid place-items-center text-sm">
          {avatar}
        </div>
      )}
    </motion.div>
  );
}
