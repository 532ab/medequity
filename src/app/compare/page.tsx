"use client";

import { useState } from "react";
import Link from "next/link";
import DrugInput from "@/components/DrugInput";
import Disclaimer from "@/components/Disclaimer";
import { DrugLabel, AdverseEvent } from "@/lib/openFda";
import { useLanguage } from "@/lib/LanguageContext";

interface CompareResult {
  drug1: { label: DrugLabel; adverseEvents: AdverseEvent[] };
  drug2: { label: DrugLabel; adverseEvents: AdverseEvent[] };
}

interface MergedSideEffect {
  term: string;
  pctA: number;
  pctB: number;
  combined: number;
}

function mergeSideEffects(
  eventsA: AdverseEvent[],
  eventsB: AdverseEvent[]
): MergedSideEffect[] {
  const map = new Map<string, { pctA: number; pctB: number }>();

  for (const e of eventsA) {
    map.set(e.term, { pctA: e.percentage, pctB: 0 });
  }
  for (const e of eventsB) {
    const existing = map.get(e.term);
    if (existing) {
      existing.pctB = e.percentage;
    } else {
      map.set(e.term, { pctA: 0, pctB: e.percentage });
    }
  }

  return Array.from(map.entries())
    .map(([term, { pctA, pctB }]) => ({
      term,
      pctA,
      pctB,
      combined: pctA + pctB,
    }))
    .sort((a, b) => b.combined - a.combined);
}

function SkeletonCard() {
  return (
    <div className="card space-y-4" aria-hidden="true">
      <div className="skeleton h-6 w-1/3" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
      <div className="skeleton h-4 w-2/3" />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6" aria-label="Loading comparison results">
      <div className="card">
        <div className="flex items-center justify-center gap-4">
          <div className="skeleton h-8 w-32" />
          <div className="skeleton h-6 w-8" />
          <div className="skeleton h-8 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonCard />
    </div>
  );
}

function ComparisonChart({
  effects,
  nameA,
  nameB,
}: {
  effects: MergedSideEffect[];
  nameA: string;
  nameB: string;
}) {
  const { t } = useLanguage();
  const maxPct = Math.max(...effects.map((e) => Math.max(e.pctA, e.pctB)), 1);

  return (
    <div className="card" aria-label="Side effects comparison chart">
      <h3 className="text-heading font-semibold text-lg mb-1">
        {t("compare.sideEffectsComparison")}
      </h3>
      <p className="text-sub text-sm mb-4">
        {t("compare.sideEffectsComparison.subtitle")}
      </p>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-5" aria-label="Chart legend">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3.5 h-3.5 rounded-sm"
            style={{ backgroundColor: "#e87461" }}
            aria-hidden="true"
          />
          <span className="text-sm text-body">{nameA}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3.5 h-3.5 rounded-sm"
            style={{ backgroundColor: "#6a9bcc" }}
            aria-hidden="true"
          />
          <span className="text-sm text-body">{nameB}</span>
        </div>
      </div>

      <div className="space-y-3.5" role="list" aria-label="Side effects list">
        {effects.map((effect) => (
          <div key={effect.term} role="listitem">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-heading font-medium capitalize">
                {effect.term}
              </span>
              <span className="text-xs text-sub tabular-nums">
                {effect.pctA}% / {effect.pctB}%
              </span>
            </div>
            {/* Drug A bar */}
            <div
              className="w-full h-3 rounded-full bg-[#e5ebe2] dark:bg-dark-border mb-1 overflow-hidden"
              role="progressbar"
              aria-label={`${nameA}: ${effect.pctA}% for ${effect.term}`}
              aria-valuenow={effect.pctA}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(effect.pctA / maxPct) * 100}%`,
                  backgroundColor: "#e87461",
                }}
              />
            </div>
            {/* Drug B bar */}
            <div
              className="w-full h-3 rounded-full bg-[#e5ebe2] dark:bg-dark-border overflow-hidden"
              role="progressbar"
              aria-label={`${nameB}: ${effect.pctB}% for ${effect.term}`}
              aria-valuenow={effect.pctB}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(effect.pctB / maxPct) * 100}%`,
                  backgroundColor: "#6a9bcc",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {effects.length === 0 && (
        <p className="text-sub text-sm text-center py-6">
          {t("compare.noAdverseData")}
        </p>
      )}
    </div>
  );
}

export default function ComparePage() {
  const { t } = useLanguage();
  const [drug1, setDrug1] = useState("");
  const [drug2, setDrug2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);

  async function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    if (!drug1.trim() || !drug2.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drug1: drug1.trim(), drug2: drug2.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setResult(data);
    } catch {
      setError(t("compare.failedToFetch"));
    }
    setLoading(false);
  }

  const mergedEffects = result
    ? mergeSideEffects(
        result.drug1.adverseEvents,
        result.drug2.adverseEvents
      )
    : [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero section */}
      <div className="text-center space-y-3">
        <Link
          href="/"
          className="text-sm text-sub hover:text-heading font-medium inline-flex items-center gap-1.5 transition-colors mb-2"
          aria-label="Back to home"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("results.back")}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-heading">
          <span className="bg-gradient-to-r from-lilly-red to-coral bg-clip-text text-transparent">
            {t("compare.title")}
          </span>
        </h1>
        <p className="text-sub text-sm sm:text-base max-w-xl mx-auto">
          {t("compare.subtitle")}
        </p>
      </div>

      {/* Search form */}
      <form
        onSubmit={handleCompare}
        className="card space-y-4"
        aria-label="Medication comparison form"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="drug1-input"
              className="block text-sm font-medium text-heading mb-1.5"
            >
              {t("compare.firstMedication")}
            </label>
            <DrugInput
              value={drug1}
              onChange={setDrug1}
              placeholder="e.g. Ibuprofen"
              prefix="A"
              required
            />
          </div>
          <div>
            <label
              htmlFor="drug2-input"
              className="block text-sm font-medium text-heading mb-1.5"
            >
              {t("compare.secondMedication")}
            </label>
            <DrugInput
              value={drug2}
              onChange={setDrug2}
              placeholder="e.g. Acetaminophen"
              prefix="B"
              required
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={loading || !drug1.trim() || !drug2.trim()}
            aria-label="Compare medications"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("compare.comparing")}
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                {t("btn.compare")}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div
          className="text-center py-8 space-y-3"
          role="alert"
          aria-live="polite"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30">
            <svg
              className="w-6 h-6 text-lilly-red"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="text-lilly-red font-medium">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && <LoadingSkeleton />}

      {/* Results */}
      {result && !loading && (
        <div
          className="space-y-5 sm:space-y-6 stagger-children"
          aria-label="Comparison results"
        >
          {/* Header: Drug A vs Drug B */}
          <div className="card text-center" aria-label="Medication names">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
              <div className="text-center">
                <h2 className="text-lg sm:text-xl font-bold text-heading capitalize">
                  {result.drug1.label.brandName}
                </h2>
                <p className="text-sub text-sm capitalize">
                  {result.drug1.label.genericName}
                </p>
                <div className="mt-1.5 flex items-center justify-center gap-2">
                  <span className="badge bg-coral/10 text-coral">Drug A</span>
                  {result.drug1.label.genericAvailable && (
                    <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {t("compare.genericAvailable")}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-2xl font-bold text-sub hidden sm:block">
                {t("compare.vs")}
              </span>
              <span className="text-lg font-bold text-sub sm:hidden">{t("compare.vs")}</span>

              <div className="text-center">
                <h2 className="text-lg sm:text-xl font-bold text-heading capitalize">
                  {result.drug2.label.brandName}
                </h2>
                <p className="text-sub text-sm capitalize">
                  {result.drug2.label.genericName}
                </p>
                <div className="mt-1.5 flex items-center justify-center gap-2">
                  <span className="badge bg-[#6a9bcc]/10 text-[#6a9bcc]">
                    Drug B
                  </span>
                  {result.drug2.label.genericAvailable && (
                    <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {t("compare.genericAvailable")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div aria-label="Purpose comparison">
            <h3 className="text-heading font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-icon">
                <svg
                  className="w-4 h-4 text-heading"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              {t("compare.purpose")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <p className="text-xs font-semibold text-coral mb-2 uppercase tracking-wide">
                  {result.drug1.label.brandName}
                </p>
                <p className="text-body text-sm leading-relaxed">
                  {result.drug1.label.purpose}
                </p>
              </div>
              <div className="card">
                <p className="text-xs font-semibold text-[#6a9bcc] mb-2 uppercase tracking-wide">
                  {result.drug2.label.brandName}
                </p>
                <p className="text-body text-sm leading-relaxed">
                  {result.drug2.label.purpose}
                </p>
              </div>
            </div>
          </div>

          {/* Dosage */}
          <div aria-label="Dosage comparison">
            <h3 className="text-heading font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-icon">
                <svg
                  className="w-4 h-4 text-heading"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </span>
              {t("drugInfo.dosage")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <p className="text-xs font-semibold text-coral mb-2 uppercase tracking-wide">
                  {result.drug1.label.brandName}
                </p>
                <p className="text-body text-sm leading-relaxed">
                  {result.drug1.label.dosage}
                </p>
              </div>
              <div className="card">
                <p className="text-xs font-semibold text-[#6a9bcc] mb-2 uppercase tracking-wide">
                  {result.drug2.label.brandName}
                </p>
                <p className="text-body text-sm leading-relaxed">
                  {result.drug2.label.dosage}
                </p>
              </div>
            </div>
          </div>

          {/* Warnings */}
          <div aria-label="Warnings comparison">
            <h3 className="text-heading font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-icon">
                <svg
                  className="w-4 h-4 text-heading"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </span>
              {t("compare.warnings")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <p className="text-xs font-semibold text-coral mb-2 uppercase tracking-wide">
                  {result.drug1.label.brandName}
                </p>
                <ul className="space-y-2" aria-label={`Warnings for ${result.drug1.label.brandName}`}>
                  {result.drug1.label.warnings.map((w, i) => (
                    <li
                      key={i}
                      className="text-body text-sm leading-relaxed flex gap-2"
                    >
                      <span className="text-amber-500 mt-0.5 shrink-0">
                        *
                      </span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <p className="text-xs font-semibold text-[#6a9bcc] mb-2 uppercase tracking-wide">
                  {result.drug2.label.brandName}
                </p>
                <ul className="space-y-2" aria-label={`Warnings for ${result.drug2.label.brandName}`}>
                  {result.drug2.label.warnings.map((w, i) => (
                    <li
                      key={i}
                      className="text-body text-sm leading-relaxed flex gap-2"
                    >
                      <span className="text-amber-500 mt-0.5 shrink-0">
                        *
                      </span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Side Effects Comparison Chart */}
          <ComparisonChart
            effects={mergedEffects}
            nameA={result.drug1.label.brandName}
            nameB={result.drug2.label.brandName}
          />

          {/* Disclaimer */}
          <Disclaimer />
        </div>
      )}
    </div>
  );
}
