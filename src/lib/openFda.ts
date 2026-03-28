const BASE_URL = "https://api.fda.gov/drug";

export interface DrugLabel {
  name: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  productType: "OTC" | "Prescription" | "Unknown";
  route: string;
  purpose: string;
  usage: string;
  warnings: string[];
  dosage: string;
  genericAvailable: boolean;
}

export interface AdverseEvent {
  term: string;
  count: number;
  percentage: number;
}

export interface ReportsByYear {
  year: string;
  count: number;
}

export interface OutcomeData {
  outcome: string;
  count: number;
}

export interface SexData {
  sex: string;
  count: number;
}

export interface AgeData {
  group: string;
  count: number;
}

export interface RecallAlert {
  description: string;
  reason: string;
  classification: string;
  status: string;
  date: string;
}

export async function getRecalls(drugName: string): Promise<RecallAlert[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/enforcement.json?search=(openfda.generic_name:"${encodeURIComponent(drugName)}"+openfda.brand_name:"${encodeURIComponent(drugName)}")+AND+status:"Ongoing"&limit=5`
    );
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || []).map((r: Record<string, string>) => ({
      description: (r.product_description || "").slice(0, 200),
      reason: r.reason_for_recall || "No reason provided",
      classification: r.classification || "Unknown",
      status: r.status || "Unknown",
      date: r.recall_initiation_date || "",
    }));
  } catch {
    return [];
  }
}

export async function getDrugLabel(drugName: string): Promise<DrugLabel | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/label.json?search=openfda.generic_name:"${encodeURIComponent(drugName)}"+openfda.brand_name:"${encodeURIComponent(drugName)}"&limit=1`
    );
    if (!res.ok) return null;

    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return null;

    const productType = result.openfda?.product_type?.[0] || "";
    const typeLabel: "OTC" | "Prescription" | "Unknown" =
      productType.includes("OTC") ? "OTC" :
      productType.includes("PRESCRIPTION") ? "Prescription" : "Unknown";

    return {
      name: drugName,
      brandName: result.openfda?.brand_name?.[0] || drugName,
      genericName: result.openfda?.generic_name?.[0] || drugName,
      manufacturer: result.openfda?.manufacturer_name?.[0] || "Unknown manufacturer",
      productType: typeLabel,
      route: (result.openfda?.route?.[0] || "").toLowerCase(),
      purpose: cleanText(result.purpose?.[0] || result.indications_and_usage?.[0] || "Information not available"),
      usage: cleanText(result.indications_and_usage?.[0] || "Information not available"),
      warnings: extractWarnings(result),
      dosage: cleanText(result.dosage_and_administration?.[0] || "Follow your doctor's instructions"),
      genericAvailable: (result.openfda?.generic_name?.length || 0) > 0,
    };
  } catch {
    return null;
  }
}

export async function getAdverseEvents(drugName: string): Promise<AdverseEvent[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/event.json?search=patient.drug.openfda.generic_name:"${encodeURIComponent(drugName)}"&count=patient.reaction.reactionmeddrapt.exact`
    );
    if (!res.ok) return [];

    const data = await res.json();
    const results = data.results || [];
    const totalReports = results.reduce((sum: number, r: { count: number }) => sum + r.count, 0);
    const top10 = results.slice(0, 10);

    return top10.map((r: { term: string; count: number }) => ({
      term: r.term.toLowerCase(),
      count: r.count,
      percentage: Math.round((r.count / totalReports) * 100 * 10) / 10,
    }));
  } catch {
    return [];
  }
}

export async function getReportsByYear(drugName: string): Promise<ReportsByYear[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/event.json?search=patient.drug.openfda.generic_name:"${encodeURIComponent(drugName)}"&count=receivedate`
    );
    if (!res.ok) return [];

    const data = await res.json();
    const results: { time: string; count: number }[] = data.results || [];

    const byYear: Record<string, number> = {};
    for (const r of results) {
      const year = r.time.slice(0, 4);
      byYear[year] = (byYear[year] || 0) + r.count;
    }

    return Object.entries(byYear)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year.localeCompare(b.year))
      .slice(-10);
  } catch {
    return [];
  }
}

const OUTCOME_LABELS: Record<string, string> = {
  "1": "Recovered",
  "2": "Recovering",
  "3": "Not Recovered",
  "4": "Resolved with Effects",
  "5": "Fatal",
  "6": "Unknown",
};

export async function getOutcomes(drugName: string): Promise<OutcomeData[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/event.json?search=patient.drug.openfda.generic_name:"${encodeURIComponent(drugName)}"&count=patient.reaction.reactionoutcome`
    );
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || []).map((r: { term: string; count: number }) => ({
      outcome: OUTCOME_LABELS[r.term] || `Code ${r.term}`,
      count: r.count,
    }));
  } catch {
    return [];
  }
}

const SEX_LABELS: Record<string, string> = { "1": "Male", "2": "Female", "0": "Unknown" };

export async function getReportsBySex(drugName: string): Promise<SexData[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/event.json?search=patient.drug.openfda.generic_name:"${encodeURIComponent(drugName)}"&count=patient.patientsex`
    );
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || []).map((r: { term: number; count: number }) => ({
      sex: SEX_LABELS[String(r.term)] || "Unknown",
      count: r.count,
    }));
  } catch {
    return [];
  }
}

export async function getReportsByAge(drugName: string): Promise<AgeData[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/event.json?search=patient.drug.openfda.generic_name:"${encodeURIComponent(drugName)}"&count=patient.patientonsetagegroup`
    );
    if (!res.ok) return [];

    const AGE_LABELS: Record<string, string> = {
      "1": "Neonate",
      "2": "Infant",
      "3": "Child",
      "4": "Adolescent",
      "5": "Adult",
      "6": "Elderly",
    };

    const data = await res.json();
    return (data.results || []).map((r: { term: number; count: number }) => ({
      group: AGE_LABELS[String(r.term)] || `Group ${r.term}`,
      count: r.count,
    }));
  } catch {
    return [];
  }
}

export interface InteractionResult {
  drug1: string;
  drug2: string;
  description: string;
  severity: "high" | "moderate" | "low";
  summary: string;
  risks: string[];
  advice: string[];
}

const RISK_KEYWORDS: [RegExp, string][] = [
  [/increas\w+ (?:risk of )?bleed/i, "Increased risk of bleeding"],
  [/increas\w+ blood pressure/i, "May raise blood pressure"],
  [/decreas\w+ blood pressure|hypotension/i, "May cause low blood pressure"],
  [/kidney|renal/i, "Possible kidney problems"],
  [/liver|hepat/i, "Possible liver effects"],
  [/serotonin syndrome/i, "Risk of serotonin syndrome"],
  [/increas\w+ (?:risk of )?seizure/i, "Increased seizure risk"],
  [/heart|cardiac|arrhythm|qt prolong/i, "Possible heart-related effects"],
  [/hypoglyc[ae]mi/i, "Risk of low blood sugar"],
  [/hyperkal[ae]mi/i, "Risk of high potassium levels"],
  [/increas\w+ (?:the )?(?:level|concentration|effect|exposure)/i, "May increase the effect of one or both drugs"],
  [/decreas\w+ (?:the )?(?:level|concentration|effect|efficacy)/i, "May reduce the effectiveness of one or both drugs"],
  [/stomach|gastro|ulcer|gi bleed/i, "Increased risk of stomach or GI problems"],
  [/drowsiness|sedation|cns depress/i, "Increased drowsiness or sedation"],
  [/increas\w+ (?:risk of )?(?:toxic|toxicity)/i, "Increased risk of toxicity"],
];

function extractRisks(text: string): string[] {
  const risks: string[] = [];
  for (const [pattern, label] of RISK_KEYWORDS) {
    if (pattern.test(text) && !risks.includes(label)) {
      risks.push(label);
    }
  }
  return risks.slice(0, 5);
}

function buildAdvice(severity: "high" | "moderate" | "low", text: string): string[] {
  const advice: string[] = [];
  const lower = text.toLowerCase();

  if (severity === "high") {
    advice.push("Talk to your doctor before taking these together");
    if (lower.includes("bleed")) advice.push("Watch for unusual bruising or bleeding");
    if (lower.includes("kidney") || lower.includes("renal")) advice.push("Your doctor may want to check your kidney function");
    if (lower.includes("serotonin")) advice.push("Seek immediate help if you feel agitated, confused, or have a rapid heartbeat");
    advice.push("Do not stop or change medications without medical guidance");
  } else if (severity === "moderate") {
    advice.push("Let your doctor know you take both of these");
    if (lower.includes("monitor")) advice.push("Your doctor may want to monitor you more closely");
    if (lower.includes("adjust") || lower.includes("dose")) advice.push("Your dose may need to be adjusted");
    advice.push("Report any new or unusual symptoms to your doctor");
  } else {
    advice.push("Generally considered safe, but tell your doctor about all your medications");
    advice.push("Watch for any unusual changes and report them");
  }

  return advice.slice(0, 4);
}

function buildSummary(drug1: string, drug2: string, severity: "high" | "moderate" | "low", risks: string[]): string {
  const riskPhrase = risks.length > 0
    ? risks.slice(0, 2).map((r) => r.toLowerCase()).join(" and ")
    : "potential side effects";

  if (severity === "high") {
    return `Taking ${drug1} with ${drug2} may be risky. The main concern is ${riskPhrase}. Talk to your doctor before combining these.`;
  } else if (severity === "moderate") {
    return `Combining ${drug1} and ${drug2} may cause ${riskPhrase}. Your doctor may need to adjust your treatment.`;
  }
  return `${drug1} and ${drug2} have a minor interaction noted. Usually safe together, but your doctor should know you take both.`;
}

// Known high-risk interaction pairs and their specific details
const KNOWN_INTERACTIONS: Record<string, { severity: "high" | "moderate"; risks: string[]; advice: string[] }> = {};

function knownKey(a: string, b: string): string {
  return [a.toLowerCase(), b.toLowerCase()].sort().join("+");
}

// NSAIDs + Anticoagulants
for (const nsaid of ["ibuprofen", "aspirin", "naproxen", "celecoxib", "meloxicam"]) {
  for (const ac of ["warfarin", "warfarin sodium", "heparin", "clopidogrel", "enoxaparin"]) {
    KNOWN_INTERACTIONS[knownKey(nsaid, ac)] = {
      severity: "high",
      risks: ["Increased risk of bleeding", "Risk of stomach or GI bleeding", "Bruising more easily"],
      advice: ["Talk to your doctor before taking these together", "Watch for unusual bruising, blood in stool, or prolonged bleeding", "Your doctor may suggest an alternative pain reliever"],
    };
  }
}

// SSRIs + NSAIDs (bleeding risk)
for (const ssri of ["sertraline", "fluoxetine", "escitalopram", "citalopram", "paroxetine", "venlafaxine", "duloxetine"]) {
  for (const nsaid of ["ibuprofen", "aspirin", "naproxen", "celecoxib", "meloxicam"]) {
    KNOWN_INTERACTIONS[knownKey(ssri, nsaid)] = {
      severity: "moderate",
      risks: ["Increased risk of bleeding", "Higher chance of stomach bleeding"],
      advice: ["Let your doctor know you take both", "Watch for signs of bleeding like unusual bruising", "Taking with food may help reduce stomach irritation"],
    };
  }
}

// SSRIs + Anticoagulants
for (const ssri of ["sertraline", "fluoxetine", "escitalopram", "citalopram", "paroxetine"]) {
  for (const ac of ["warfarin", "warfarin sodium", "clopidogrel"]) {
    KNOWN_INTERACTIONS[knownKey(ssri, ac)] = {
      severity: "high",
      risks: ["Significantly increased bleeding risk", "May alter blood-thinning effect"],
      advice: ["Your doctor should monitor your INR/blood clotting more frequently", "Report any unusual bruising or bleeding immediately", "Do not stop either medication without consulting your doctor"],
    };
  }
}

// SSRIs + SSRIs / Serotonergic drugs
for (const a of ["sertraline", "fluoxetine", "escitalopram", "citalopram", "paroxetine"]) {
  for (const b of ["tramadol", "fentanyl", "lithium", "triptans", "sumatriptan"]) {
    KNOWN_INTERACTIONS[knownKey(a, b)] = {
      severity: "high",
      risks: ["Risk of serotonin syndrome", "Possible seizures", "Dangerous overstimulation of serotonin"],
      advice: ["Seek immediate help if you feel agitated, confused, or have rapid heartbeat", "Watch for muscle twitching, fever, or heavy sweating", "Your doctor needs to know about both medications"],
    };
  }
}

// ACE inhibitors + Potassium-sparing
for (const ace of ["lisinopril", "enalapril", "ramipril", "losartan", "valsartan"]) {
  for (const k of ["spironolactone", "potassium", "potassium chloride"]) {
    KNOWN_INTERACTIONS[knownKey(ace, k)] = {
      severity: "high",
      risks: ["Risk of dangerously high potassium levels", "Possible heart rhythm problems"],
      advice: ["Your doctor should regularly check your potassium levels", "Report muscle weakness, irregular heartbeat, or tingling", "Do not take potassium supplements without medical advice"],
    };
  }
}

// Metformin interactions
for (const drug of ["alcohol", "contrast dye", "furosemide", "cimetidine"]) {
  KNOWN_INTERACTIONS[knownKey("metformin", drug)] = {
    severity: "moderate",
    risks: ["Risk of lactic acidosis", "May affect blood sugar control"],
    advice: ["Tell your doctor about all medications you take", "Monitor your blood sugar more frequently", "Report any unusual muscle pain, weakness, or difficulty breathing"],
  };
}

// Statin interactions
for (const statin of ["atorvastatin", "simvastatin", "rosuvastatin"]) {
  for (const drug of ["erythromycin", "clarithromycin", "ketoconazole", "itraconazole", "cyclosporine"]) {
    KNOWN_INTERACTIONS[knownKey(statin, drug)] = {
      severity: "high",
      risks: ["Increased risk of muscle damage (rhabdomyolysis)", "Possible kidney damage"],
      advice: ["Report any unexplained muscle pain, tenderness, or weakness", "Your doctor may need to adjust your statin dose", "Blood tests may be needed to check for muscle breakdown"],
    };
  }
}

function extractRelevantText(fullText: string, drug1: string, drug2: string): string {
  const clean = fullText.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const sentences = clean.split(/(?<=[.!?])\s+/);
  const d1 = drug1.toLowerCase();
  const d2 = drug2.toLowerCase();

  // Find sentences mentioning either drug
  const relevant = sentences.filter((s) => {
    const lower = s.toLowerCase();
    return lower.includes(d1) || lower.includes(d2);
  });

  if (relevant.length > 0) {
    return relevant.slice(0, 4).join(" ").slice(0, 500);
  }
  // Fallback: first 3 meaningful sentences
  return sentences.filter((s) => s.length > 20).slice(0, 3).join(" ").slice(0, 500);
}

export async function checkInteractions(drugs: string[]): Promise<InteractionResult[]> {
  if (drugs.length < 2) return [];

  const interactions: InteractionResult[] = [];

  for (let i = 0; i < drugs.length; i++) {
    for (let j = i + 1; j < drugs.length; j++) {
      const drug1 = drugs[i];
      const drug2 = drugs[j];

      // Check known interactions first
      const key = knownKey(drug1, drug2);
      const known = KNOWN_INTERACTIONS[key];

      try {
        const res = await fetch(
          `${BASE_URL}/label.json?search=drug_interactions:"${encodeURIComponent(drug1)}"+AND+drug_interactions:"${encodeURIComponent(drug2)}"&limit=1`
        );

        let fdaText = "";
        if (res.ok) {
          const data = await res.json();
          const result = data.results?.[0];
          if (result?.drug_interactions?.[0]) {
            fdaText = extractRelevantText(result.drug_interactions[0], drug1, drug2);
          }
        }

        if (!fdaText && !known) continue;

        if (known) {
          const summary = buildSummary(drug1, drug2, known.severity, known.risks);
          interactions.push({
            drug1, drug2,
            description: fdaText || "FDA label data available but no specific text extracted.",
            severity: known.severity,
            summary,
            risks: known.risks,
            advice: known.advice,
          });
        } else {
          // FDA text found but no known pair — analyze the text
          const lower = fdaText.toLowerCase();

          let severity: "high" | "moderate" | "low" = "low";
          const highWords = ["contraindicated", "do not", "fatal", "serious", "avoid", "not recommended", "prohibited", "dangerous", "life-threatening", "death"];
          const modWords = ["caution", "monitor", "adjust", "increase", "decrease", "may affect", "should be", "carefully", "risk", "interaction", "potentiate", "inhibit", "induce"];

          if (highWords.some((w) => lower.includes(w))) severity = "high";
          else if (modWords.some((w) => lower.includes(w))) severity = "moderate";

          const risks = extractRisks(fdaText);
          const advice = buildAdvice(severity, fdaText);
          const summary = buildSummary(drug1, drug2, severity, risks);

          interactions.push({ drug1, drug2, description: fdaText, severity, summary, risks, advice });
        }
      } catch {
        if (known) {
          const summary = buildSummary(drug1, drug2, known.severity, known.risks);
          interactions.push({
            drug1, drug2,
            description: "Unable to fetch FDA label data.",
            severity: known.severity,
            summary,
            risks: known.risks,
            advice: known.advice,
          });
        }
      }
    }
  }

  return interactions;
}

function cleanText(text: string): string {
  const clean = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= 800) return clean;
  // Cut at last sentence boundary before 800 chars
  const trimmed = clean.slice(0, 800);
  const lastPeriod = Math.max(trimmed.lastIndexOf(". "), trimmed.lastIndexOf(".) "));
  if (lastPeriod > 200) return trimmed.slice(0, lastPeriod + 1);
  return trimmed + "...";
}

export function simplifyText(text: string): string {
  const clean = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= 400) return clean;

  const trimmed = clean.slice(0, 400);
  const lastSentence = Math.max(
    trimmed.lastIndexOf(". "),
    trimmed.lastIndexOf(".) "),
    trimmed.lastIndexOf("? "),
  );
  if (lastSentence > 150) return trimmed.slice(0, lastSentence + 1);

  const lastComma = trimmed.lastIndexOf(", ");
  if (lastComma > 200) return trimmed.slice(0, lastComma + 1) + "...";

  const lastSpace = trimmed.lastIndexOf(" ");
  return trimmed.slice(0, lastSpace) + "...";
}

function extractWarnings(result: Record<string, string[]>): string[] {
  const warnings: string[] = [];
  const fields = ["warnings", "warnings_and_cautions", "do_not_use", "stop_use"];
  for (const field of fields) {
    if (result[field]?.[0]) {
      warnings.push(cleanText(result[field][0]));
    }
  }
  return warnings.length > 0 ? warnings : ["No specific warnings found. Consult your healthcare provider."];
}
