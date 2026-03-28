"use client";

import { useLanguage } from "@/lib/LanguageContext";

interface DoctorEscalationProps {
  level: "high" | "moderate";
  flaggedSymptoms: string[];
}

export default function DoctorEscalation({ level, flaggedSymptoms }: DoctorEscalationProps) {
  const { locale } = useLanguage();

  if (level === "high") {
    return (
      <div className="border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/40 rounded-2xl p-5 animate-slide-up">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800 dark:text-red-300">
              {locale === "es" ? "Busca atención médica" : "Seek Medical Attention"}
            </h3>
            <p className="text-sm text-red-700/80 dark:text-red-400/80 mt-1 max-w-md mx-auto">
              {locale === "es"
                ? `Tus síntomas (${flaggedSymptoms.join(", ")}) pueden requerir atención médica inmediata.`
                : `Your symptoms (${flaggedSymptoms.join(", ")}) may require immediate medical attention.`}
            </p>
          </div>

          <a
            href="tel:911"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-md transition-all active:scale-95 text-base"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {locale === "es" ? "Llamar al 911" : "Call 911"}
          </a>

          <div className="flex flex-wrap justify-center gap-3 text-xs text-red-700/60 dark:text-red-400/60 pt-1">
            <span>{locale === "es" ? "Poison Control: 1-800-222-1222" : "Poison Control: 1-800-222-1222"}</span>
            <span>{locale === "es" ? "Crisis: 988" : "Crisis Lifeline: 988"}</span>
          </div>
        </div>
      </div>
    );
  }

  // Moderate level
  return (
    <div className="border border-amber-200 dark:border-amber-800/50 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl p-4 sm:p-5 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
          <svg className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300">
            {locale === "es" ? "Considera consultar a un médico" : "Consider Seeing a Doctor"}
          </h3>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 leading-relaxed">
            {locale === "es"
              ? `Tus síntomas (${flaggedSymptoms.join(", ")}) podrían necesitar evaluación profesional, especialmente si persisten o empeoran.`
              : `Your symptoms (${flaggedSymptoms.join(", ")}) may need professional evaluation, especially if they persist or worsen.`}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <a
              href="tel:911"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {locale === "es" ? "Emergencia: 911" : "Emergency: 911"}
            </a>
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs text-amber-700/60 dark:text-amber-400/60 bg-amber-50 dark:bg-amber-900/20">
              Poison Control: 1-800-222-1222
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
