"use client";

import ChatWindow from "@/components/ChatWindow";

import useViewportHeight from "@/hooks/useViewportHeight";

export default function Home() {
  const vh = useViewportHeight();

  return (
    <main
      className="h-screen bg-bg-dark text-white flex flex-col"
      style={{ height: vh ? `${vh}px` : "100vh" }}
    >
      <div className="fixed inset-0 bg-shift opacity-10 -z-10" />
      <ChatWindow />
    </main>
  );
}
