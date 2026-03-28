"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DrugInput from "@/components/DrugInput";
import { useLanguage } from "@/lib/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";

const GOALS = [
  { id: "understand", labelKey: "guided.goal.understand" as TranslationKey, icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", descKey: "guided.goal.understand.desc" as TranslationKey },
  { id: "side-effects", labelKey: "guided.goal.sideEffects" as TranslationKey, icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", descKey: "guided.goal.sideEffects.desc" as TranslationKey },
  { id: "symptoms", labelKey: "guided.goal.symptoms" as TranslationKey, icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", descKey: "guided.goal.symptoms.desc" as TranslationKey },
  { id: "interactions", labelKey: "guided.goal.interactions" as TranslationKey, icon: "M13 10V3L4 14h7v7l9-11h-7z", descKey: "guided.goal.interactions.desc" as TranslationKey },
];

const COMMON_SYMPTOM_KEYS: TranslationKey[] = [
  "symptom.nausea", "symptom.headache", "symptom.dizziness", "symptom.fatigue", "symptom.rash",
  "symptom.stomachPain", "symptom.insomnia", "symptom.dryMouth", "symptom.drowsiness", "symptom.anxiety",
  "symptom.jointPain", "symptom.blurredVision", "symptom.chestPain", "symptom.shortnessOfBreath",
];

export default function GuidedIntro() {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState<"goal" | "details">("goal");
  const [goal, setGoal] = useState("");
  const [medication, setMedication] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [loading, setLoading] = useState(false);

  const commonSymptoms = COMMON_SYMPTOM_KEYS.map((key) => t(key));

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const addCustomSymptom = () => {
    const trimmed = customSymptom.trim();
    if (trimmed && !selectedSymptoms.includes(trimmed)) {
      setSelectedSymptoms([...selectedSymptoms, trimmed]);
      setCustomSymptom("");
    }
  };

  const handleSubmit = () => {
    if (goal === "interactions") {
      router.push("/interactions");
      return;
    }
    if (!medication.trim()) return;
    setLoading(true);

    const params = new URLSearchParams({ medication: medication.trim() });
    if (selectedSymptoms.length > 0) {
      params.set("symptoms", selectedSymptoms.join(", "));
    }
    router.push(`/results?${params.toString()}`);
  };

  if (step === "goal") {
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-body">{t("guided.prompt")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setGoal(g.id);
                if (g.id === "interactions") {
                  router.push("/interactions");
                } else {
                  setStep("details");
                }
              }}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-sand dark:border-dark-border text-left hover:border-coral/40 hover:bg-coral/5 dark:hover:bg-coral/10 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-icon flex items-center justify-center flex-shrink-0 group-hover:bg-coral/10 transition-colors">
                <svg className="w-4 h-4 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={g.icon} />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-heading">{t(g.labelKey)}</p>
                <p className="text-xs text-sub mt-0.5">{t(g.descKey)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back button */}
      <button
        onClick={() => { setStep("goal"); setGoal(""); }}
        className="text-xs font-medium text-sub hover:text-heading flex items-center gap-1 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t("guided.changeGoal")}
      </button>

      {/* Medication input */}
      <div>
        <label className="block text-sm font-medium text-body mb-1.5">
          {t("guided.whichMedication")}
        </label>
        <DrugInput
          value={medication}
          onChange={setMedication}
          placeholder={t("guided.typeAMedication")}
          required
        />
      </div>

      {/* Symptom picker — shown for side-effects and symptoms goals */}
      {(goal === "symptoms" || goal === "side-effects") && (
        <div>
          <label className="block text-sm font-medium text-body mb-2">
            {goal === "symptoms" ? t("guided.whatSymptoms") : t("guided.anySymptoms")}
          </label>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {commonSymptoms.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSymptom(s)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                  selectedSymptoms.includes(s)
                    ? "border-coral bg-coral/10 text-coral dark:bg-coral/20"
                    : "border-sand dark:border-dark-border text-sub hover:border-coral/40 hover:text-coral"
                }`}
              >
                {selectedSymptoms.includes(s) && (
                  <span className="mr-1">&#10003;</span>
                )}
                {s}
              </button>
            ))}
          </div>

          {/* Custom symptom input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSymptom(); } }}
              placeholder={t("guided.addAnotherSymptom")}
              className="input-field text-sm flex-1"
            />
            <button
              type="button"
              onClick={addCustomSymptom}
              disabled={!customSymptom.trim()}
              className="px-3 py-2 rounded-xl border border-sand dark:border-dark-border text-coral hover:bg-coral/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Selected symptoms */}
          {selectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {selectedSymptoms.filter((s) => !commonSymptoms.includes(s)).map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium border border-coral bg-coral/10 text-coral flex items-center gap-1">
                  {s}
                  <button onClick={() => toggleSymptom(s)} className="hover:text-lilly-red">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !medication.trim()}
        className="btn-primary w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t("btn.analyzing")}
          </span>
        ) : (
          goal === "symptoms" ? t("btn.checkMySymptoms") :
          goal === "side-effects" ? t("btn.viewSideEffects") :
          t("btn.analyze")
        )}
      </button>
    </div>
  );
}
