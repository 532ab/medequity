"use client";

import { useState } from "react";
import Disclaimer from "@/components/Disclaimer";
import DrugInput from "@/components/DrugInput";
import RiskBadge from "@/components/RiskBadge";
import { simplifyText } from "@/lib/openFda";
import { CATEGORIES, POPULAR_DRUGS } from "@/lib/drugCategories";
import { useLanguage } from "@/lib/LanguageContext";

interface Interaction {
  drug1: string;
  drug2: string;
  description: string;
  severity: "high" | "moderate" | "low";
  summary: string;
  risks: string[];
  advice: string[];
}

type SeverityKey = "high" | "moderate" | "low";

export default function InteractionsPage() {
  const { t, locale } = useLanguage();

  const severityStyles = {
    high: {
      border: "border-red-200 dark:border-red-800/50",
      bg: "bg-red-50/80 dark:bg-red-950/30",
      badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
      label: t("severity.high.label"),
      summary: t("severity.high.summary"),
    },
    moderate: {
      border: "border-amber-200 dark:border-amber-800/50",
      bg: "bg-amber-50/80 dark:bg-amber-950/30",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
      label: t("severity.moderate.label"),
      summary: t("severity.moderate.summary"),
    },
    low: {
      border: "border-emerald-200 dark:border-emerald-800/50",
      bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
      label: t("severity.low.label"),
      summary: t("severity.low.summary"),
    },
  };

  const SEVERITY_FILTERS: { id: SeverityKey | "all"; labelKey: string }[] = [
    { id: "all", labelKey: t("interactions.filterAll") },
    { id: "high", labelKey: t("severity.high.label") },
    { id: "moderate", labelKey: t("severity.moderate.label") },
    { id: "low", labelKey: t("severity.low.label") },
  ];

  const [drugs, setDrugs] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [interactions, setInteractions] = useState<Interaction[] | null>(null);
  const [checkedDrugs, setCheckedDrugs] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<SeverityKey | "all">("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});
  const [aiLoading, setAiLoading] = useState<Record<number, boolean>>({});
  const [category, setCategory] = useState("all");
  const [symptoms, setSymptoms] = useState("");
  const [risk, setRisk] = useState<{ level: string; emoji: string; message: string; recommendation: string; flaggedSymptoms: string[] } | null>(null);

  const updateDrug = (index: number, value: string) => {
    const next = [...drugs];
    next[index] = value;
    setDrugs(next);
  };

  const addDrug = () => {
    if (drugs.length < 5) setDrugs([...drugs, ""]);
  };

  const removeDrug = (index: number) => {
    if (drugs.length > 2) setDrugs(drugs.filter((_, i) => i !== index));
  };

  const addQuickPick = (name: string) => {
    const emptyIndex = drugs.findIndex((d) => !d.trim());
    if (emptyIndex >= 0) {
      updateDrug(emptyIndex, name);
    } else if (drugs.length < 5) {
      setDrugs([...drugs, name]);
    }
  };

  const isAlreadyAdded = (name: string) =>
    drugs.some((d) => d.trim().toLowerCase() === name.toLowerCase());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = drugs.map((d) => d.trim()).filter(Boolean);
    if (valid.length < 2) return;

    setLoading(true);
    setError("");
    setInteractions(null);
    setFilter("all");
    setExpandedIndex(null);

    try {
      const res = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugs: valid }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setInteractions(data.interactions);
        setCheckedDrugs(data.checked);
      }

      // Check symptoms if provided
      const symptomList = symptoms.split(",").map((s) => s.trim()).filter(Boolean);
      if (symptomList.length > 0) {
        try {
          const riskRes = await fetch("/api/risk-assessment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms: symptomList }),
          });
          const riskData = await riskRes.json();
          if (riskRes.ok) setRisk(riskData);
        } catch { /* ignore */ }
      } else {
        setRisk(null);
      }
    } catch {
      setError(t("interactions.failedToCheck"));
    }
    setLoading(false);
  };

  const fetchAiExplanation = async (index: number, drug1: string, drug2: string, fdaText: string, severity: string) => {
    if (aiExplanations[index] || aiLoading[index]) return;
    setAiLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const res = await fetch("/api/ai-interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drug1, drug2, fdaText, severity }),
      });
      const data = await res.json();
      if (data.explanation) {
        setAiExplanations((prev) => ({ ...prev, [index]: data.explanation }));
      }
    } catch { /* ignore */ }
    setAiLoading((prev) => ({ ...prev, [index]: false }));
  };

  const validCount = drugs.filter((d) => d.trim()).length;
  const filtered = interactions?.filter((ix) => filter === "all" || ix.severity === filter) || [];

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="text-center space-y-3 sm:space-y-4 pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 badge bg-lilly-red/10 text-lilly-red dark:bg-lilly-red/20 mb-1 sm:mb-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t("interactions.badge")}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-heading leading-tight">
          {t("interactions.title.line1")}<br />
          <span className="bg-gradient-to-r from-lilly-red to-coral bg-clip-text text-transparent">
            {t("interactions.title.line2")}
          </span>
        </h1>
        <p className="text-sub max-w-lg mx-auto text-base sm:text-lg leading-relaxed px-2">
          {t("interactions.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-2xl lg:max-w-4xl mx-auto space-y-5">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-body mb-2">{t("form.category")}</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  category === cat.id
                    ? "bg-gradient-to-r from-lilly-red to-coral text-white shadow-sm"
                    : "bg-sand/60 dark:bg-dark-border text-charcoal/60 dark:text-dark-muted hover:bg-sand dark:hover:bg-dark-border/80 hover:text-charcoal dark:hover:text-dark-text"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Picks */}
        <div>
          <label className="block text-sm font-medium text-body mb-2">{t("form.quickAdd")}</label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_DRUGS[category].map((drug) => {
              const added = isAlreadyAdded(drug);
              return (
                <button
                  key={drug}
                  type="button"
                  onClick={() => !added && addQuickPick(drug)}
                  disabled={added}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 border ${
                    added
                      ? "border-coral bg-coral/10 text-coral font-medium cursor-default"
                      : "border-sand dark:border-dark-border bg-[#f7f9f6] dark:bg-dark-bg text-charcoal/60 dark:text-dark-muted hover:border-coral/40 hover:text-coral"
                  }`}
                >
                  {added ? (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {drug}
                    </span>
                  ) : (
                    drug
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drug Inputs */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-body">{t("form.medicationsToCheck")}</label>
          {drugs.map((drug, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1">
                <DrugInput
                  value={drug}
                  onChange={(v) => updateDrug(i, v)}
                  placeholder={i === 0 ? "e.g., Ibuprofen" : i === 1 ? "e.g., Warfarin" : "Add another medication"}
                  prefix={`${i + 1}.`}
                />
              </div>
              {drugs.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeDrug(i)}
                  className="w-10 h-[46px] flex items-center justify-center rounded-xl border border-sand dark:border-dark-border text-sub hover:text-lilly-red hover:border-lilly-red/40 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          {drugs.length < 5 && (
            <button
              type="button"
              onClick={addDrug}
              className="text-sm text-coral hover:text-lilly-red font-medium flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {t("form.addMedication")} ({drugs.length}/5)
            </button>
          )}
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-body mb-1.5">
            {t("form.currentSymptoms")} <span className="text-sub font-normal">{t("form.optional")}</span>
          </label>
          <input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder={t("form.symptomsPlaceholder")}
            className="input-field"
          />
          <p className="text-xs text-sub mt-1.5">{t("form.symptomsNote")}</p>
        </div>

        <button
          type="submit"
          disabled={loading || validCount < 2}
          className="btn-primary w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t("btn.checking")}
            </span>
          ) : (
            t("btn.checkInteractions")
          )}
        </button>
      </form>

      {error && (
        <div className="max-w-2xl lg:max-w-4xl mx-auto text-center py-8">
          <p className="text-lilly-red font-medium">{error}</p>
        </div>
      )}

      {risk && (
        <div className="max-w-2xl lg:max-w-4xl mx-auto">
          <RiskBadge
            level={risk.level as "low" | "moderate" | "high"}
            emoji={risk.emoji}
            message={risk.message}
            recommendation={risk.recommendation}
            flaggedSymptoms={risk.flaggedSymptoms}
          />
        </div>
      )}

      {interactions !== null && (
        <div className="max-w-2xl lg:max-w-4xl mx-auto space-y-4 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-bold text-heading">
              {interactions.length} {interactions.length !== 1 ? t("interactions.foundPlural") : t("interactions.found")} {t("interactions.found.suffix")}
            </h2>

            {interactions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {SEVERITY_FILTERS.map((opt) => {
                  const count = opt.id === "all"
                    ? interactions.length
                    : interactions.filter((ix) => ix.severity === opt.id).length;
                  if (opt.id !== "all" && count === 0) return null;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setFilter(opt.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        filter === opt.id
                          ? "bg-gradient-to-r from-lilly-red to-coral text-white shadow-sm"
                          : "bg-sand/60 dark:bg-dark-border text-charcoal/60 dark:text-dark-muted hover:bg-sand dark:hover:bg-dark-border/80"
                      }`}
                    >
                      {opt.labelKey} ({count})
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {interactions.length === 0 ? (
            <div className="card text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-3">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-heading font-medium mb-1">{t("interactions.noKnown")}</p>
              <p className="text-sub text-sm max-w-sm mx-auto">
                {t("interactions.noKnown.detail")}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="card text-center py-6">
              <p className="text-sub text-sm">{t("interactions.noMatchFilter")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((ix, i) => {
                const style = severityStyles[ix.severity];
                const isExpanded = expandedIndex === i;
                return (
                  <div key={i} className={`border rounded-xl sm:rounded-2xl p-4 sm:p-5 ${style.border} ${style.bg}`}>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`badge text-xs uppercase tracking-wide ${style.badge}`}>
                        {style.label}
                      </span>
                      <span className="text-sm font-semibold text-heading">
                        {ix.drug1} + {ix.drug2}
                      </span>
                    </div>

                    <p className="text-sm text-body leading-relaxed mb-3">{ix.summary}</p>

                    {/* AI Explanation */}
                    {!aiExplanations[i] && !aiLoading[i] && (
                      <button
                        onClick={() => fetchAiExplanation(i, ix.drug1, ix.drug2, ix.description, ix.severity)}
                        className="text-xs font-medium text-coral hover:text-lilly-red transition-colors flex items-center gap-1.5 mb-3"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        {locale === "es" ? "Explicar con IA" : "Explain with AI"}
                      </button>
                    )}
                    {aiLoading[i] && (
                      <div className="flex items-center gap-2 text-xs text-sub mb-3">
                        <span className="w-3 h-3 border-2 border-coral/30 border-t-coral rounded-full animate-spin" />
                        {locale === "es" ? "Generando explicación..." : "Generating explanation..."}
                      </div>
                    )}
                    {aiExplanations[i] && (
                      <div className="bg-[#f7f9f6] dark:bg-dark-bg border border-sand/60 dark:border-dark-border rounded-xl p-3 mb-3 animate-fade-in">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <svg className="w-3 h-3 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-[10px] font-semibold text-coral uppercase tracking-wide">
                            {locale === "es" ? "Explicación IA" : "AI Explanation"}
                          </span>
                        </div>
                        <p className="text-sm text-body leading-relaxed">{aiExplanations[i]}</p>
                      </div>
                    )}

                    {/* Risks */}
                    {ix.risks.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-sub mb-1.5">{t("interactions.potentialRisks")}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ix.risks.map((risk) => (
                            <span key={risk} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${style.badge}`}>
                              {risk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Advice */}
                    <div className="mb-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-sub mb-1.5">{t("interactions.whatToDo")}</p>
                      <ul className="space-y-1">
                        {ix.advice.map((tip) => (
                          <li key={tip} className="text-sm text-body flex items-start gap-2">
                            <svg className="w-3.5 h-3.5 text-coral flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* FDA details toggle */}
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : i)}
                      className="text-xs font-medium text-coral hover:text-lilly-red transition-colors flex items-center gap-1"
                    >
                      {isExpanded ? t("interactions.hideFdaSource") : t("interactions.showFdaSource")}
                      <svg className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <p className="text-xs text-sub leading-relaxed mt-2 pt-2 border-t border-themed">
                        {simplifyText(ix.description)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
