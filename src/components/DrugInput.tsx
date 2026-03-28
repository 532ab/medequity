"use client";

import { useState, useEffect, useRef } from "react";

import BarcodeScanner from "@/components/BarcodeScanner";
import VoiceInput from "@/components/VoiceInput";

interface DrugInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
  required?: boolean;
  showScanner?: boolean;
}

interface SmartSuggestion {
  name: string;
  source: "fda" | "ai";
  label?: string;
}

// Common drugs for instant results before API responds
const COMMON_DRUGS = [
  "Ibuprofen", "Acetaminophen", "Aspirin", "Metformin", "Lisinopril", "Atorvastatin",
  "Amoxicillin", "Omeprazole", "Sertraline", "Amlodipine", "Metoprolol", "Losartan",
  "Gabapentin", "Levothyroxine", "Fluoxetine", "Escitalopram", "Prednisone", "Albuterol",
  "Hydrochlorothiazide", "Tramadol", "Naproxen", "Loratadine", "Cetirizine", "Warfarin",
  "Clopidogrel", "Pantoprazole", "Duloxetine", "Venlafaxine", "Bupropion", "Trazodone",
  "Ciprofloxacin", "Azithromycin", "Doxycycline", "Meloxicam", "Cyclobenzaprine",
  "Furosemide", "Spironolactone", "Rosuvastatin", "Simvastatin", "Montelukast",
  "Famotidine", "Ranitidine", "Diphenhydramine", "Hydroxyzine", "Buspirone",
  "Clonazepam", "Diazepam", "Alprazolam", "Lorazepam", "Zolpidem",
  "Advil", "Tylenol", "Motrin", "Aleve", "Benadryl", "Zyrtec", "Claritin",
  "Lipitor", "Zoloft", "Nexium", "Prilosec", "Synthroid", "Glucophage",
];

function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.startsWith(q)) return true;
  if (t.includes(q)) return true;
  // Simple typo tolerance — allow 1 char difference for queries > 3 chars
  if (q.length > 3) {
    for (let i = 0; i < q.length; i++) {
      const without = q.slice(0, i) + q.slice(i + 1);
      if (t.startsWith(without) || t.includes(without)) return true;
    }
  }
  return false;
}

export default function DrugInput({ value, onChange, placeholder, prefix, required, showScanner = false }: DrugInputProps) {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [aiSearching, setAiSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const aiDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!value.trim() || value.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    clearTimeout(debounceRef.current);
    clearTimeout(aiDebounceRef.current);

    // Instant local matches — shows immediately, no API call
    const localMatches = COMMON_DRUGS
      .filter((d) => fuzzyMatch(value, d))
      .slice(0, 5)
      .map((name): SmartSuggestion => ({ name, source: "fda" }));

    if (localMatches.length > 0) {
      setSuggestions(localMatches);
      setShowSuggestions(true);
      setHighlightIndex(-1);
    }

    // FDA API search — runs after short delay, adds more results
    if (value.length >= 2) {
      debounceRef.current = setTimeout(async () => {
        try {
          const query = encodeURIComponent(value);
          // Use wildcard search for partial matching
          const res = await fetch(
            `https://api.fda.gov/drug/label.json?search=(openfda.brand_name:${query}*+openfda.generic_name:${query}*)&limit=8`
          );
          if (res.ok) {
            const data = await res.json();
            const fdaNames: SmartSuggestion[] = [];
            const seen = new Set(localMatches.map((m) => m.name.toLowerCase()));

            for (const result of data.results || []) {
              const brandName = result.openfda?.brand_name?.[0];
              const genericName = result.openfda?.generic_name?.[0];
              if (brandName && !seen.has(brandName.toLowerCase())) {
                seen.add(brandName.toLowerCase());
                fdaNames.push({ name: brandName, source: "fda" });
              }
              if (genericName && !seen.has(genericName.toLowerCase())) {
                seen.add(genericName.toLowerCase());
                fdaNames.push({ name: genericName, source: "fda" });
              }
            }

            if (fdaNames.length > 0) {
              setSuggestions((prev) => {
                const existing = new Set(prev.map((p) => p.name.toLowerCase()));
                const merged = [...prev];
                for (const f of fdaNames) {
                  if (!existing.has(f.name.toLowerCase())) {
                    existing.add(f.name.toLowerCase());
                    merged.push(f);
                  }
                }
                return merged.slice(0, 8);
              });
              setShowSuggestions(true);
            }
          }

          // If still few results, try AI
          if (localMatches.length < 2) {
            triggerAiSearch(value);
          }
        } catch {
          if (localMatches.length === 0) {
            triggerAiSearch(value);
          }
        }
      }, 150);
    }

    // If no local matches and short query, try AI sooner
    if (localMatches.length === 0 && value.length >= 3) {
      triggerAiSearch(value);
    }

    return () => {
      clearTimeout(debounceRef.current);
      clearTimeout(aiDebounceRef.current);
    };
  }, [value]);

  const triggerAiSearch = (query: string) => {
    clearTimeout(aiDebounceRef.current);
    aiDebounceRef.current = setTimeout(async () => {
      setAiSearching(true);
      try {
        const res = await fetch("/api/smart-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        if (!res.ok) return;
        const data = await res.json();

        const aiSuggestions: SmartSuggestion[] = [];

        if (data.correction) {
          aiSuggestions.push({
            name: data.correction,
            source: "ai",
            label: data.isDescription ? undefined : "Did you mean?",
          });
        }

        if (data.suggestions) {
          for (const s of data.suggestions) {
            if (s !== data.correction) {
              aiSuggestions.push({
                name: s,
                source: "ai",
                label: data.isDescription ? "Suggested" : undefined,
              });
            }
          }
        }

        setSuggestions((prev) => {
          const existing = new Set(prev.map((p) => p.name.toLowerCase()));
          const merged = [...prev];
          for (const ai of aiSuggestions) {
            if (!existing.has(ai.name.toLowerCase())) {
              existing.add(ai.name.toLowerCase());
              merged.push(ai);
            }
          }
          return merged.slice(0, 8);
        });
        setShowSuggestions(true);
      } catch { /* ignore */ }
      setAiSearching(false);
    }, 100);
  };

  const selectSuggestion = (name: string) => {
    onChange(name);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[highlightIndex].name);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-sub w-5">{prefix}</span>
          )}
          <svg className={`absolute ${prefix ? "left-9" : "left-3.5"} top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-dark-muted`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            className={`input-field ${prefix ? "pl-[3.5rem]" : "pl-10"}`}
            required={required}
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-controls="drug-suggestions"
            aria-autocomplete="list"
            aria-activedescendant={highlightIndex >= 0 ? `suggestion-${highlightIndex}` : undefined}
            aria-label={placeholder || "Search for a medication"}
          />
        </div>
        <VoiceInput onResult={(text) => { onChange(text); }} />
        {showScanner && (
          <BarcodeScanner onScan={(name) => { onChange(name); }} />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div id="drug-suggestions" role="listbox" className="absolute z-20 w-full mt-1 bg-[#f7f9f6] dark:bg-dark-card border border-sand dark:border-dark-border rounded-2xl shadow-lg overflow-hidden animate-fade-in" style={{ maxWidth: "calc(100% - 2rem)" }}>
          {suggestions.map((item, i) => (
            <button
              key={`${item.name}-${i}`}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={i === highlightIndex}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectSuggestion(item.name)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                i === highlightIndex
                  ? "bg-coral/10 text-coral"
                  : "text-heading hover:bg-cream dark:hover:bg-dark-border"
              }`}
            >
              <span className="font-medium">{item.name}</span>
              {item.source === "ai" && item.label && (
                <span className="text-[10px] font-medium text-coral bg-coral/10 dark:bg-coral/20 px-2 py-0.5 rounded-full">
                  {item.label}
                </span>
              )}
              {item.source === "ai" && !item.label && (
                <span className="text-[10px] text-sub">AI</span>
              )}
            </button>
          ))}
          {aiSearching && (
            <div className="px-4 py-2.5 flex items-center gap-2 text-xs text-sub border-t border-sand/60 dark:border-dark-border">
              <span className="w-3 h-3 border-2 border-coral/30 border-t-coral rounded-full animate-spin" />
              Searching with AI...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
