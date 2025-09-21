import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Msg = {
  id: string;
  text: string;
  from: "user" | "ai";
  ts: number;
};

type State = {
  messages: Msg[];
  streak: number; // +1 per calendar day with ≥1 msg
  level: number; // +1 every 10 messages
  addMessage: (m: Omit<Msg, "id" | "ts">) => void;
};

export const useChat = create<State>()(
  devtools(
    persist(
      (set, get) => ({
        messages: [],
        streak: 1,
        level: 1,
        addMessage(payload) {
          const msgs = get().messages;
          const newMsg: Msg = {
            ...payload,
            id: crypto.randomUUID(),
            ts: Date.now(),
          };
          set({ messages: [...msgs, newMsg] });

          // simple level-up rule
          const total = msgs.filter((m) => m.from === "user").length + 1;
          if (total % 10 === 0) set({ level: get().level + 1 });
        },
      }),
      { name: "chat-store" },
    ),
  ),
);
