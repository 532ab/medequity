"use client";

import GuidedIntro from "@/components/GuidedIntro";
import Disclaimer from "@/components/Disclaimer";
import { useLanguage } from "@/lib/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3 sm:space-y-4 pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 badge bg-lilly-red/10 text-lilly-red dark:bg-lilly-red/20 mb-1 sm:mb-2">
          <span className="w-1.5 h-1.5 bg-lilly-red rounded-full animate-pulse" />
          {t("home.badge")}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading leading-tight">
          {t("home.hero.title.line1")}<br />
          <span className="bg-gradient-to-r from-lilly-red to-coral bg-clip-text text-transparent">
            {t("home.hero.title.line2")}
          </span>
        </h1>
        <p className="text-sub max-w-lg mx-auto text-base sm:text-lg leading-relaxed px-2">
          {t("home.hero.subtitle")}
        </p>
      </div>

      {/* Guided Search Card */}
      <div className="card max-w-2xl lg:max-w-4xl mx-auto">
        <GuidedIntro />
      </div>

      {/* Trust indicators */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-sub">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {t("home.trust.noData")}
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          {t("home.trust.realFda")}
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {t("home.trust.safetyFirst")}
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
