"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DrugInput from "@/components/DrugInput";
import { useLanguage } from "@/lib/LanguageContext";

const QUICK_PICKS = ["Ibuprofen", "Metformin", "Lisinopril", "Sertraline", "Amoxicillin"];

export default function GuidedIntro() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [medication, setMedication] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [showSymptoms, setShowSymptoms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medication.trim()) return;
    setLoading(true);

    const params = new URLSearchParams({ medication: medication.trim() });
    if (symptoms.trim()) params.set("symptoms", symptoms.trim());
    router.push(`/results?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Search */}
      <div>
        <DrugInput
          value={medication}
          onChange={setMedication}
          placeholder={t("form.searchMedication")}
          required
        />
      </div>

      {/* Quick picks — only show when input is empty */}
      {!medication && (
        <div className="flex flex-wrap gap-2">
          {QUICK_PICKS.map((drug) => (
            <button
              key={drug}
              type="button"
              onClick={() => setMedication(drug)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-sand dark:border-dark-border text-sub hover:border-coral/40 hover:text-coral transition-colors active:scale-95"
            >
              {drug}
            </button>
          ))}
        </div>
      )}

      {/* Symptoms toggle */}
      {!showSymptoms ? (
        <button
          type="button"
          onClick={() => setShowSymptoms(true)}
          className="text-xs font-medium text-coral flex items-center gap-1 transition-colors hover:text-lilly-red"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {locale === "es" ? "Agregar síntomas" : "Add symptoms"}
        </button>
      ) : (
        <div className="animate-fade-in">
          <input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder={t("form.symptomsPlaceholder")}
            className="input-field text-sm"
          />
          <p className="text-[11px] text-sub mt-1">{t("form.separateSymptoms")}</p>
        </div>
      )}

      <button type="submit" disabled={loading || !medication.trim()} className="btn-primary w-full">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t("btn.analyzing")}
          </span>
        ) : (
          t("btn.analyze")
        )}
      </button>
    </form>
  );
}
