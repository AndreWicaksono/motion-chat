// stores/useGame.ts
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

export type Msg = { text: string; from: "user" | "ai" | "system" };
export type PowerUps = { speed: boolean; xp: boolean; mystery: boolean };

export interface GameState {
  achievements: string[];
  addXP: (amount: number) => void;
  unlockAchievement: (id: string, icon: string, text: string) => void;
  level: number;
  xp: number;
  xpNeeded: number;
  streak: number;
  totalMessages: number;
  combo: number;
  lastMessageTime: number;
  powerUps: PowerUps;
  powerUpsUsed: number;
  mood: string;
  addMessage: (m: Msg) => void;
  messages: Msg[];
  activatePowerUp: (id: "speed" | "xp" | "mystery") => void;
  isTyping: boolean;
  setTyping: (v: boolean) => void;
}

// widen the initial values so every field is `boolean`, not `false`
const initialPowerUps: PowerUps = { speed: false, xp: false, mystery: false };

const store: StateCreator<GameState> = (set) => ({
  addXP: (amount) =>
    set((s) => {
      let xp = s.xp + amount;
      let lvl = s.level;
      let needed = s.xpNeeded;
      while (xp >= needed) {
        xp -= needed;
        lvl += 1;
        needed = Math.floor(needed * 1.5);
      }
      return { xp, level: lvl, xpNeeded: needed };
    }),
  level: 1,
  xp: 0,
  xpNeeded: 100,
  streak: 0,
  totalMessages: 0,
  combo: 0,
  lastMessageTime: Date.now(),
  powerUps: initialPowerUps,
  powerUpsUsed: 0, // ➜ start at zero
  achievements: [],
  mood: "😊",
  addMessage: (msg) =>
    set((state) => {
      /* ----- streak ----- */
      const today = new Date().toDateString();
      const lastDay = new Date(state.lastMessageTime).toDateString();
      const newStreak = today !== lastDay ? state.streak + 1 : state.streak;

      /* ----- XP ----- */
      let xpGain = 10 + Math.floor(Math.random() * 6); // 10-15
      if (state.powerUps.xp) xpGain *= 2;
      if (state.combo > 2) xpGain *= 1.5;

      let newXp = state.xp + xpGain;
      let newLevel = state.level;
      let newXpNeeded = state.xpNeeded;

      /* ----- level-up ----- */
      while (newXp >= newXpNeeded) {
        newXp -= newXpNeeded;
        newLevel += 1;
        newXpNeeded = Math.floor(newXpNeeded * 1.5);
      }

      /* ===== ACHIEVEMENTS ===== */
      const unlock = state.unlockAchievement;
      const total = state.totalMessages + 1;
      const hour = new Date().getHours();

      if (total === 1) unlock("first", "🎯", "First Contact!");
      if (total === 10) unlock("chatty", "💬", "Getting Chatty!");
      if (total === 25)
        unlock("conversationalist", "🗣️", "True Conversationalist!");
      if (total === 50) unlock("dedicated", "🌟", "Dedicated Chatter!");
      if (total === 100) unlock("century", "💯", "Century Club!");
      if (newLevel === 5) unlock("lvl5", "⭐", "Rising Star!");
      if (newLevel === 10) unlock("lvl10", "🚀", "Chat Rocket!");
      // time-based
      if (hour >= 22 || hour <= 5) unlock("night_owl", "🦉", "Night Owl!");
      if (hour >= 5 && hour <= 8) unlock("early_bird", "🐦", "Early Bird!");

      return {
        messages: [...state.messages, msg],
        lastMessageTime: Date.now(),
        streak: newStreak,
        xp: newXp,
        level: newLevel,
        xpNeeded: newXpNeeded,
        totalMessages: total,
        combo: msg.from === "user" ? state.combo + 1 : state.combo,
      };
    }),
  messages: [],
  activatePowerUp: (id) =>
    set((s) => {
      if (s.powerUps[id]) return s;
      // increment usage counter (vanilla tracks this)
      const nextPowerUps = { ...s.powerUps, [id]: true };
      const nextUsage = s.powerUpsUsed + 1;

      setTimeout(() => {
        useGame.setState((st) => ({
          powerUps: { ...st.powerUps, [id]: false },
        }));
      }, 30_000);

      // trigger achievement check
      if (nextUsage === 5) {
        useGame.getState().unlockAchievement("power_user", "💎", "Power User!");
      }

      return { powerUps: nextPowerUps, powerUpsUsed: nextUsage };
    }),
  isTyping: false,
  setTyping: (v) => set({ isTyping: v }),
  unlockAchievement: (id, icon, text) =>
    set((s) => {
      if (s.achievements.includes(id)) return s;
      const next = { achievements: [...s.achievements, id] };
      // side-effect: show toast
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("achievement", { detail: { icon, text } }),
        );
      }
      return next;
    }),
});

export const useGame = create<GameState>()(
  persist(store, { name: "motion-chat" }),
);
