"use client";

import { useState } from "react";
import { RecallAlert } from "@/lib/openFda";
import { useLanguage } from "@/lib/LanguageContext";

export default function RecallBanner({ recalls }: { recalls: RecallAlert[] }) {
  const { locale } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  if (recalls.length === 0) return null;

  const classLabels: Record<string, { en: string; es: string }> = {
    "Class I": { en: "Most serious — may cause death or serious harm", es: "Más grave — puede causar muerte o daño serio" },
    "Class II": { en: "May cause temporary or reversible health problems", es: "Puede causar problemas de salud temporales o reversibles" },
    "Class III": { en: "Unlikely to cause harm but violates FDA rules", es: "Poco probable que cause daño pero viola normas de la FDA" },
  };

  return (
    <div className="border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/40 rounded-2xl p-4 sm:p-5 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
            {locale === "es"
              ? `${recalls.length} retiro(s) activo(s) de la FDA`
              : `${recalls.length} Active FDA Recall${recalls.length > 1 ? "s" : ""}`}
          </h3>
          <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-0.5">
            {locale === "es"
              ? "Algunas versiones de este medicamento han sido retiradas. Consulta con tu farmacéutico."
              : "Some versions of this medication have been recalled. Check with your pharmacist."}
          </p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 mt-2 flex items-center gap-1 transition-colors"
          >
            {expanded
              ? (locale === "es" ? "Ocultar detalles" : "Hide details")
              : (locale === "es" ? "Ver detalles" : "View details")}
            <svg className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 animate-fade-in">
              {recalls.map((recall, i) => (
                <div key={i} className="bg-red-100/60 dark:bg-red-900/30 rounded-xl p-3 text-xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="badge bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200 text-[10px]">
                      {recall.classification}
                    </span>
                    {recall.date && (
                      <span className="text-red-600/60 dark:text-red-400/60">
                        {recall.date.slice(0, 4)}-{recall.date.slice(4, 6)}-{recall.date.slice(6, 8)}
                      </span>
                    )}
                  </div>
                  <p className="text-red-800/80 dark:text-red-300/80 font-medium mb-1">{recall.reason}</p>
                  <p className="text-red-700/60 dark:text-red-400/60">{recall.description}</p>
                  {classLabels[recall.classification] && (
                    <p className="text-red-600/50 dark:text-red-400/50 mt-1 italic">
                      {locale === "es" ? classLabels[recall.classification].es : classLabels[recall.classification].en}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
