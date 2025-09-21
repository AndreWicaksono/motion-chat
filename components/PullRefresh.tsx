"use client";

import { FC, ReactNode, RefObject, useEffect } from "react";

const PullRefresh: FC<{
  children: ReactNode;
  refScroll: RefObject<HTMLElement | null>;
}> = ({ children, refScroll }) => {
  useEffect(() => {
    const el = refScroll.current;
    if (!el) return;

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => (startY = e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - startY;
      if (el.scrollTop <= 0 && dy > 0) {
        const stretch = Math.min(dy * 0.2, 80);
        el.style.transform = `translateY(${stretch}px)`;
        el.style.transition = "none";
      }
    };
    const onTouchEnd = () => {
      el.style.transform = "";
      el.style.transition = "transform 0.3s";
    };

    /* passive: true ➜ won’t block scroll */
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [refScroll]);

  return children;
};

export default PullRefresh;
