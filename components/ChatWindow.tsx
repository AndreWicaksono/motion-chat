"use client";

import { useEffect, useRef, useState } from "react";

import { useGame } from "@/stores/useGame";

import AchieveNotif from "./AchieveNotif";
import Combo from "./Combo";
import Composer from "./Composer";
import EmojiRain from "./EmojiRain";
import Message from "./Message";
import Particles from "./Particles";
import PowerUpDock from "./PowerUpDock";
import PullRefresh from "./PullRefresh";
import StatsBar from "./StatsBar";
import TypingIndicator from "./TypingIndicator";

const aiReplies = [
  "That’s fascinating! Every message creates ripples in the digital cosmos ✨",
  "I’m detecting high levels of awesome—keep that energy flowing 🚀",
  "Plot twist: this chat is secretly training you to be a master communicator 🎭",
];

export default function ChatWindow() {
  const [showWelcome, setShowWelcome] = useState(false);

  const messages = useGame((s) => s.messages);
  const addMessage = useGame((s) => s.addMessage);
  const isTyping = useGame((s) => s.isTyping);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });

  useEffect(() => {
    const onFocus = () => setTimeout(scrollToBottom, 300); // wait for keyboard

    window.addEventListener("focusin", onFocus); // input focused

    return () => window.removeEventListener("focusin", onFocus);
  }, []);

  /* auto-reply when last message is from user */
  useEffect(() => {
    const last = messages.at(-1);
    if (!last || last.from === "ai") return;

    const timer = setTimeout(() => {
      useGame.getState().setTyping(true);
      setTimeout(() => {
        useGame.getState().setTyping(false);
        const reply = aiReplies[messages.length % aiReplies.length];
        addMessage({ text: reply, from: "ai" });
      }, 800);
    }, 300);

    return () => clearTimeout(timer);
  }, [messages, addMessage]);

  useEffect(() => {
    if (messages.length === 0) {
      const t = setTimeout(() => setShowWelcome(true), 1000); // 1 s ≈ vanilla 2 s perceived
      return () => clearTimeout(t);
    }

    scrollToBottom();
  }, [messages]);

  return (
    <div className="relative mx-auto w-full max-md:w-full md:w-[800px] h-full flex flex-col">
      <StatsBar />

      <PullRefresh refScroll={scrollRef}>
        <section
          ref={scrollRef}
          id="chat-area"
          className="flex-1 overflow-y-auto px-4 py-3"
        >
          {/* full-width container (same when empty) */}
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-3 h-[480px]">
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                {showWelcome && (
                  <p className="text-center text-sm text-gray-400 animate-fade-in">
                    Welcome to MotionChat! 🚀 I&apos;m your AI companion, and
                    I&apos;m here to make our conversations absolutely
                    incredible. What&apos;s on your brilliant mind today?
                  </p>
                )}
              </div>
            )}

            {messages.map((msg, i) => {
              const prev = messages[i - 1];
              const isSameSender = prev && prev.from === msg.from;
              return (
                <div key={i} className={isSameSender ? "mt-2" : ""}>
                  <Message msg={msg} />
                </div>
              );
            })}
            <TypingIndicator show={isTyping} />
          </div>
        </section>
      </PullRefresh>

      <Composer />
      <PowerUpDock />
      <AchieveNotif />
      <Combo />
      <Particles />
      <EmojiRain />
    </div>
  );
}
