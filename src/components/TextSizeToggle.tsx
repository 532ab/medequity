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
      className="w-8 h-8 flex items-center justify-center rounded-xl text-muted dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text hover:bg-sand/60 dark:hover:bg-dark-border transition-colors active:scale-95 relative"
    >
      <svg className={`transition-all duration-200 ${
        sizeIndex === 0 ? "w-4 h-4" : sizeIndex === 1 ? "w-[18px] h-[18px]" : "w-5 h-5"
      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 012-2h6m4 0h4a2 2 0 012 2v2M7 21h10M12 3v18" />
      </svg>
      {sizeIndex > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-coral text-white text-[7px] font-bold rounded-full flex items-center justify-center">
          {sizeIndex}
        </span>
      )}
    </button>
  );
}
