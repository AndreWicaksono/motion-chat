"use client";

import { motion } from "framer-motion";

export default function TypingIndicator({ show }: { show: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 10 }}
      className="flex items-center gap-2 py-2"
    >
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple to-pink grid place-items-center text-white text-xs">
        🤖
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
}
