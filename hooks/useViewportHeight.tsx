import { useEffect, useState } from "react";

/* tiny polyfill type so we stay 100 % TS */
declare global {
  interface Navigator {
    virtualKeyboard?: VirtualKeyboard;
  }
  interface VirtualKeyboard extends EventTarget {
    boundingRect: DOMRect;
    overlaysContent: boolean;
    addEventListener: (type: "geometrychange", listener: () => void) => void;
    removeEventListener: (type: "geometrychange", listener: () => void) => void;
  }
}

export default function useViewportHeight() {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const vk = navigator.virtualKeyboard;

    /* modern path – Firefox Focus, Chromium */
    if (vk) {
      vk.overlaysContent = true;

      const read = () => {
        const rect = vk.boundingRect;
        const avail = window.visualViewport?.height || window.innerHeight;
        setHeight(Math.max(0, avail - rect.height));
      };

      vk.addEventListener("geometrychange", read);
      window.visualViewport?.addEventListener("resize", read);
      read(); // initial
      return () => {
        vk.removeEventListener("geometrychange", read);
        window.visualViewport?.removeEventListener("resize", read);
      };
    }

    /* legacy path */
    const set = () =>
      setHeight(window.visualViewport?.height || window.innerHeight);
    set();
    window.visualViewport?.addEventListener("resize", set);
    return () => window.visualViewport?.removeEventListener("resize", set);
  }, []);

  return height;
}
