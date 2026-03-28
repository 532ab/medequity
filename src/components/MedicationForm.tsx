"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, POPULAR_DRUGS } from "@/lib/drugCategories";
import DrugInput from "@/components/DrugInput";

export default function MedicationForm() {
  const router = useRouter();
  const [medication, setMedication] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medication.trim()) return;
    setLoading(true);

    const params = new URLSearchParams({ medication: medication.trim() });
    if (symptoms.trim()) params.set("symptoms", symptoms.trim());
    if (category !== "all") params.set("category", category);
    router.push(`/results?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-body mb-2">Category</label>
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

      {/* Quick picks */}
      <div>
        <label className="block text-sm font-medium text-body mb-2">Popular in this category</label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_DRUGS[category].map((drug) => (
            <button
              key={drug}
              type="button"
              onClick={() => setMedication(drug)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 border ${
                medication === drug
                  ? "border-coral bg-coral/10 text-coral font-medium"
                  : "border-sand dark:border-dark-border bg-[#f7f9f6] dark:bg-dark-bg text-charcoal/60 dark:text-dark-muted hover:border-coral/40 hover:text-coral"
              }`}
            >
              {drug}
            </button>
          ))}
        </div>
      </div>

      {/* Medication Input with Autocomplete */}
      <div>
        <label className="block text-sm font-medium text-body mb-1.5">
          Medication Name
        </label>
        <DrugInput
          value={medication}
          onChange={setMedication}
          placeholder="Search for a medication..."
          required
        />
      </div>

      {/* Symptoms */}
      <div>
        <label htmlFor="symptoms" className="block text-sm font-medium text-body mb-1.5">
          Current Symptoms <span className="text-sub font-normal">(optional)</span>
        </label>
        <input
          id="symptoms"
          type="text"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., nausea, headache, dizziness"
          className="input-field"
        />
        <p className="text-xs text-sub mt-1.5">Separate multiple symptoms with commas</p>
      </div>

      <button type="submit" disabled={loading || !medication.trim()} className="btn-primary w-full">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing...
          </span>
        ) : (
          "Analyze Medication"
        )}
      </button>
    </form>
  );
}
