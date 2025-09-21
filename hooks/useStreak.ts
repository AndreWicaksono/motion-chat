import { useEffect } from "react";

import { useChat } from "@/stores/chat";

export default function useStreak() {
  const last = useChat((s) => s.messages.at(-1)?.ts || 0);
  const streak = useChat((s) => s.streak);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const lastDay = new Date(last).toLocaleDateString();

    if (today !== lastDay && last > 0) {
      useChat.setState({ streak: streak + 1 });
    }
  }, [last, streak]);
}
