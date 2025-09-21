"use client";

import { useEffect } from "react";

export default function Particles() {
  useEffect(() => {
    const container = document.getElementById("particles");
    if (!container) return;

    // build once
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      p.style.animationDuration = `${8 + Math.random() * 4}s`;
      frag.appendChild(p);
    }
    container.appendChild(frag);

    // clean-up on unmount
    return () => container.replaceChildren();
  }, []);

  return (
    <div id="particles" className="fixed inset-0 pointer-events-none z-10" />
  );
}
