"use client";

import { DrugLabel } from "@/lib/openFda";
import { useLanguage } from "@/lib/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";

const sections = [
  { key: "purpose", titleKey: "drugInfo.whatItDoes" as TranslationKey, plainKey: "drugInfo.whatItDoes.plain" as TranslationKey, icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "usage", titleKey: "drugInfo.howToUse" as TranslationKey, plainKey: "drugInfo.howToUse.plain" as TranslationKey, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { key: "dosage", titleKey: "drugInfo.dosage" as TranslationKey, plainKey: "drugInfo.dosage.plain" as TranslationKey, icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
] as const;

function truncateAtBoundary(text: string, maxLen: number): string {
  const clean = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;

  // Try to cut at a sentence boundary
  const trimmed = clean.slice(0, maxLen);
  const lastSentence = Math.max(
    trimmed.lastIndexOf(". "),
    trimmed.lastIndexOf(".) "),
    trimmed.lastIndexOf("? "),
    trimmed.lastIndexOf("! "),
  );
  if (lastSentence > maxLen * 0.4) return trimmed.slice(0, lastSentence + 1);

  // Fall back to last comma or space
  const lastComma = trimmed.lastIndexOf(", ");
  if (lastComma > maxLen * 0.6) return trimmed.slice(0, lastComma + 1) + "...";

  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace > maxLen * 0.7) return trimmed.slice(0, lastSpace) + "...";

  return trimmed + "...";
}

function simplify(text: string): string {
  return truncateAtBoundary(text, 350);
}

function simplifyWarning(text: string): string {
  return truncateAtBoundary(text, 280);
}

export default function DrugInfo({ label }: { label: DrugLabel }) {
  const { t } = useLanguage();

  return (
    <div className="card space-y-5 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-heading">
            {label.brandName}
            {label.genericName !== label.brandName && (
              <span className="text-base font-normal text-sub ml-2">({label.genericName})</span>
            )}
          </h3>
        </div>
        {label.genericAvailable && (
          <span className="badge bg-coral/10 text-coral dark:bg-coral/20">
            {t("drugInfo.genericAvailable")}
          </span>
        )}
      </div>

      <div className="grid gap-4">
        {sections.map(({ key, titleKey, plainKey, icon }) => (
          <div key={key} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-icon flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-heading mb-0.5">{t(titleKey)}</h4>
              <p className="text-xs text-sub mb-1">{t(plainKey)}</p>
              <p className="text-sm text-body leading-relaxed">{simplify(label[key])}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Warnings */}
      <div className="border-t border-themed pt-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-lilly-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h4 className="text-sm font-semibold text-lilly-red">{t("drugInfo.keyWarnings")}</h4>
        </div>
        <ul className="space-y-2">
          {label.warnings.map((w, i) => (
            <li key={i} className="text-sm text-body leading-relaxed pl-4 border-l-2 border-lilly-red/20">
              {simplifyWarning(w)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
