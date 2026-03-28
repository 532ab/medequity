"use client";

import { AdverseEvent } from "@/lib/openFda";
import { useLanguage } from "@/lib/LanguageContext";

export default function SideEffectsChart({ events }: { events: AdverseEvent[] }) {
  const { t } = useLanguage();

  if (events.length === 0) {
    return (
      <div className="card animate-slide-up">
        <h3 className="text-lg font-bold text-heading mb-2">{t("chart.sideEffects")}</h3>
        <p className="text-sm text-sub">{t("noData.sideEffects")}</p>
      </div>
    );
  }

  const maxPct = Math.max(...events.map((e) => e.percentage));

  return (
    <div className="card animate-slide-up">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-heading">{t("chart.sideEffects")}</h3>
        <p className="text-xs text-sub mt-0.5">{t("chart.sideEffects.subtitle")}</p>
      </div>
      <div className="space-y-3">
        {events.map((event, i) => (
          <div key={event.term} className="group" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-heading/80 capitalize font-medium">{event.term}</span>
              <span className="text-sub text-xs tabular-nums">{event.percentage}%</span>
            </div>
            <div className="w-full bg-sand/60 dark:bg-dark-border rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-coral to-lilly-red"
                style={{
                  width: `${(event.percentage / maxPct) * 100}%`,
                  transitionDelay: `${i * 60}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-sub mt-5 pt-4 border-t border-themed">
        {t("chart.sideEffects.note")}
      </p>
    </div>
  );
}
