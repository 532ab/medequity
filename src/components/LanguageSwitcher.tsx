"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const toggle = () => {
    setLocale(locale === "en" ? "es" : "en");
  };

  return (
    <button
      onClick={toggle}
      aria-label={locale === "en" ? "Cambiar a español" : "Switch to English"}
      className="flex items-center justify-center rounded-xl px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-muted dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text hover:bg-sand/60 dark:hover:bg-dark-border transition-colors active:scale-95 whitespace-nowrap"
    >
      <span className="sm:hidden">{locale === "en" ? "ES" : "EN"}</span>
      <span className="hidden sm:inline">{locale === "en" ? "Español" : "English"}</span>
    </button>
  );
}
