"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import DrugInfo from "@/components/DrugInfo";
import SideEffectsChart from "@/components/SideEffectsChart";
import ReportsOverTimeChart from "@/components/ReportsOverTimeChart";
import OutcomesChart from "@/components/OutcomesChart";
import DemographicsChart from "@/components/DemographicsChart";
import RiskBadge from "@/components/RiskBadge";
import Disclaimer from "@/components/Disclaimer";
import ResultsSkeleton from "@/components/ResultsSkeleton";
import MedicationChat from "@/components/MedicationChat";
import RecallBanner from "@/components/RecallBanner";
import DoctorEscalation from "@/components/DoctorEscalation";
import { DrugLabel, AdverseEvent, ReportsByYear, OutcomeData, SexData, AgeData, RecallAlert } from "@/lib/openFda";
import { useLanguage } from "@/lib/LanguageContext";

interface RiskResult {
  level: "low" | "moderate" | "high";
  emoji: string;
  message: string;
  recommendation: string;
  flaggedSymptoms: string[];
}

function ResultsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const medication = searchParams.get("medication") || "";
  const symptomsParam = searchParams.get("symptoms") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [label, setLabel] = useState<DrugLabel | null>(null);
  const [adverseEvents, setAdverseEvents] = useState<AdverseEvent[]>([]);
  const [reportsByYear, setReportsByYear] = useState<ReportsByYear[]>([]);
  const [outcomes, setOutcomes] = useState<OutcomeData[]>([]);
  const [reportsBySex, setReportsBySex] = useState<SexData[]>([]);
  const [reportsByAge, setReportsByAge] = useState<AgeData[]>([]);
  const [recalls, setRecalls] = useState<RecallAlert[]>([]);
  const [risk, setRisk] = useState<RiskResult | null>(null);

  useEffect(() => {
    if (!medication) return;

    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const medRes = await fetch("/api/analyze-medication", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ medication }),
        });
        const medData = await medRes.json();

        if (!medRes.ok) {
          setError(medData.error);
          setLoading(false);
          return;
        }

        setLabel(medData.label);
        setAdverseEvents(medData.adverseEvents);
        setReportsByYear(medData.reportsByYear);
        setOutcomes(medData.outcomes);
        setReportsBySex(medData.reportsBySex);
        setReportsByAge(medData.reportsByAge);
        setRecalls(medData.recalls || []);

        if (symptomsParam) {
          const symptoms = symptomsParam.split(",").map((s) => s.trim()).filter(Boolean);
          if (symptoms.length > 0) {
            const riskRes = await fetch("/api/risk-assessment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ symptoms }),
            });
            const riskData = await riskRes.json();
            if (riskRes.ok) setRisk(riskData);
          }
        }
      } catch {
        setError(t("results.error.fetchFailed"));
      }
      setLoading(false);
    }

    fetchData();
  }, [medication, symptomsParam, t]);

  if (!medication) {
    return (
      <div className="text-center py-16">
        <p className="text-sub text-lg">{t("results.noMedication")}</p>
        <Link href="/" className="text-coral hover:text-lilly-red font-medium mt-3 inline-block transition-colors">
          {t("results.goBackAndSearch")}
        </Link>
      </div>
    );
  }

  if (loading) {
    return <ResultsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30">
          <svg className="w-6 h-6 text-lilly-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-lilly-red font-medium">{error}</p>
        <Link href="/" className="text-coral hover:text-lilly-red font-medium inline-block transition-colors">
          {t("results.error.tryAnother")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 stagger-children">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-heading">
          {t("results.for")}{" "}
          <span className="bg-gradient-to-r from-lilly-red to-coral bg-clip-text text-transparent capitalize">
            {medication}
          </span>
        </h1>
        <Link
          href="/"
          className="text-sm text-sub hover:text-heading font-medium flex items-center gap-1.5 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">{t("results.newSearch")}</span>
          <span className="sm:hidden">{t("results.back")}</span>
        </Link>
      </div>

      {/* Recall Alert — most critical, shown first */}
      <RecallBanner recalls={recalls} />

      {/* Risk assessment + doctor escalation */}
      {risk && (
        <>
          {(risk.level === "high" || risk.level === "moderate") && (
            <DoctorEscalation level={risk.level} flaggedSymptoms={risk.flaggedSymptoms} />
          )}
          <RiskBadge
            level={risk.level}
            emoji={risk.emoji}
            message={risk.message}
            recommendation={risk.recommendation}
            flaggedSymptoms={risk.flaggedSymptoms}
          />
        </>
      )}

      {label && <DrugInfo label={label} />}

      {/* AI Chat */}
      {label && (
        <MedicationChat
          drugName={label.brandName}
          drugInfo={`Purpose: ${label.purpose}\nUsage: ${label.usage}\nDosage: ${label.dosage}\nWarnings: ${label.warnings.join(" | ")}`}
        />
      )}

      <SideEffectsChart events={adverseEvents} />
      <ReportsOverTimeChart data={reportsByYear} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <OutcomesChart data={outcomes} />
        <DemographicsChart sexData={reportsBySex} ageData={reportsByAge} />
      </div>

      <Disclaimer />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={<ResultsSkeleton />}
    >
      <ResultsContent />
    </Suspense>
  );
}
