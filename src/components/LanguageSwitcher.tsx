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
      className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold text-muted dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text hover:bg-sand/60 dark:hover:bg-dark-border transition-colors"
    >
      {locale === "en" ? "ES" : "EN"}
    </button>
  );
}
