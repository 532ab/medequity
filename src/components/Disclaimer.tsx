"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Disclaimer() {
  const { t } = useLanguage();

  return (
    <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl p-5 flex gap-3">
      <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div className="text-sm text-amber-800/80 dark:text-amber-300/80">
        <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">{t("disclaimer.title")}</p>
        <p className="leading-relaxed">
          {t("disclaimer.body")}
        </p>
      </div>
    </div>
  );
}
