"use client";

import { useEffect, useState } from "react";

const SIZES = [
  { id: "normal", label: "A", scale: "100%" },
  { id: "large", label: "A", scale: "115%" },
  { id: "xlarge", label: "A", scale: "130%" },
] as const;

export default function TextSizeToggle() {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("textSize");
    if (stored) {
      const idx = SIZES.findIndex((s) => s.id === stored);
      if (idx >= 0) {
        setSizeIndex(idx);
        document.documentElement.style.fontSize = SIZES[idx].scale;
      }
    }
  }, []);

  const cycle = () => {
    const next = (sizeIndex + 1) % SIZES.length;
    setSizeIndex(next);
    document.documentElement.style.fontSize = SIZES[next].scale;
    localStorage.setItem("textSize", SIZES[next].id);
  };

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={cycle}
      aria-label={`Text size: ${SIZES[sizeIndex].id}`}
      className="w-8 h-8 flex items-center justify-center rounded-xl text-muted dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text hover:bg-sand/60 dark:hover:bg-dark-border transition-colors active:scale-95"
    >
      <span className={`font-bold leading-none ${
        sizeIndex === 0 ? "text-xs" : sizeIndex === 1 ? "text-sm" : "text-base"
      }`}>
        A
      </span>
      <span className="text-[8px] font-bold text-coral ml-px leading-none">
        {sizeIndex === 0 ? "" : sizeIndex === 1 ? "+" : "++"}
      </span>
    </button>
  );
}
