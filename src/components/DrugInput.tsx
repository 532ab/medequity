"use client";

import { useState, useEffect, useRef } from "react";

interface DrugInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
  required?: boolean;
}

export default function DrugInput({ value, onChange, placeholder, prefix, required }: DrugInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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
    if (!value.trim() || value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(value)}"&limit=6`
        );
        if (!res.ok) {
          setSuggestions([]);
          return;
        }
        const data = await res.json();
        const names: string[] = [];
        const seen = new Set<string>();
        for (const result of data.results || []) {
          const name = result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0];
          if (name && !seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase());
            names.push(name);
          }
        }
        setSuggestions(names);
        setShowSuggestions(names.length > 0);
        setHighlightIndex(-1);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [value]);

  const selectSuggestion = (name: string) => {
    onChange(name);
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
      selectSuggestion(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-sub w-5">{prefix}</span>
        )}
        <svg className={`absolute ${prefix ? "left-9" : "left-3.5"} top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-dark-muted`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

      {showSuggestions && suggestions.length > 0 && (
        <div id="drug-suggestions" role="listbox" className="absolute z-20 w-full mt-1 bg-[#f7f9f6] dark:bg-dark-card border border-sand dark:border-dark-border rounded-xl shadow-lg overflow-hidden animate-fade-in">
          {suggestions.map((name, i) => (
            <button
              key={name}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={i === highlightIndex}
              type="button"
              onClick={() => selectSuggestion(name)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                i === highlightIndex
                  ? "bg-coral/10 text-coral"
                  : "text-heading hover:bg-cream dark:hover:bg-dark-border"
              }`}
            >
              <span className="font-medium">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
