"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface ReadAloudProps {
  text: string;
}

export default function ReadAloud({ text }: ReadAloudProps) {
  const { locale } = useLanguage();
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const toggle = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === "es" ? "es-US" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  if (!supported || !text) return null;

  return (
    <button
      onClick={toggle}
      aria-label={speaking ? (locale === "es" ? "Detener lectura" : "Stop reading") : (locale === "es" ? "Leer en voz alta" : "Read aloud")}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all active:scale-95 border ${
        speaking
          ? "bg-coral/10 text-coral border-coral/30 dark:bg-coral/20"
          : "text-sub border-sand dark:border-dark-border hover:text-coral hover:border-coral/30 hover:bg-coral/5"
      }`}
    >
      {speaking ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      )}
      {speaking
        ? (locale === "es" ? "Detener" : "Stop")
        : (locale === "es" ? "Escuchar" : "Listen")}
    </button>
  );
}
