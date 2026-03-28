"use client";

import { useLanguage } from "@/lib/LanguageContext";

interface RiskBadgeProps {
  level: "low" | "moderate" | "high";
  emoji: string;
  message: string;
  recommendation: string;
  flaggedSymptoms: string[];
}

const styles = {
  low: {
    card: "bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
    text: "text-emerald-800 dark:text-emerald-300",
    symptom: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
  },
  moderate: {
    card: "bg-amber-50/80 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
    text: "text-amber-800 dark:text-amber-300",
    symptom: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
  },
  high: {
    card: "bg-red-50/80 border-red-200 dark:bg-red-950/30 dark:border-red-800/50",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
    text: "text-red-800 dark:text-red-300",
    symptom: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
  },
};

const riskKeys = {
  low: "risk.low" as const,
  moderate: "risk.moderate" as const,
  high: "risk.high" as const,
};

export default function RiskBadge({ level, emoji, message, recommendation, flaggedSymptoms }: RiskBadgeProps) {
  const { t } = useLanguage();
  const s = styles[level];

  return (
    <div className={`border rounded-2xl p-6 ${s.card} ${s.text} animate-slide-up`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{emoji}</span>
        <span className={`badge text-sm uppercase tracking-wide ${s.badge}`}>
          {t(riskKeys[level])}
        </span>
      </div>
      <p className="font-semibold text-base mb-2">{message}</p>
      <p className="text-sm opacity-80 mb-4 leading-relaxed">{recommendation}</p>
      {flaggedSymptoms.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">{t("risk.flaggedSymptoms")}</p>
          <div className="flex flex-wrap gap-2">
            {flaggedSymptoms.map((s2) => (
              <span key={s2} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${s.symptom}`}>
                {s2}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
