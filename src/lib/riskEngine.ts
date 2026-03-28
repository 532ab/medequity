export type RiskLevel = "low" | "moderate" | "high";

export interface RiskResult {
  level: RiskLevel;
  color: string;
  emoji: string;
  message: string;
  recommendation: string;
  flaggedSymptoms: string[];
}

const HIGH_RISK = [
  "chest pain", "difficulty breathing", "shortness of breath",
  "throat swelling", "throat closing", "severe allergic reaction",
  "anaphylaxis", "hives", "swelling of face", "swelling of tongue",
  "suicidal thoughts", "seizure", "seizures", "loss of consciousness",
  "fainting", "irregular heartbeat", "heart palpitations",
  "blood in stool", "blood in urine", "coughing blood",
  "severe abdominal pain", "jaundice", "yellowing of skin",
];

const MODERATE_RISK = [
  "persistent vomiting", "vomiting", "dizziness", "unusual bleeding",
  "bruising", "severe headache", "prolonged fatigue", "fatigue",
  "blurred vision", "ringing in ears", "confusion", "fever", "rash",
  "joint pain", "muscle pain", "swelling", "weight gain", "weight loss",
  "insomnia", "mood changes", "depression", "anxiety",
];

const LOW_RISK = [
  "mild nausea", "nausea", "mild headache", "headache", "drowsiness",
  "dry mouth", "stomach discomfort", "constipation", "diarrhea",
  "gas", "bloating", "decreased appetite", "mild dizziness",
  "runny nose", "cough",
];

export function assessRisk(symptoms: string[]): RiskResult {
  const normalized = symptoms.map((s) => s.toLowerCase().trim());
  const flaggedHigh: string[] = [];
  const flaggedModerate: string[] = [];
  const flaggedLow: string[] = [];

  for (const symptom of normalized) {
    if (HIGH_RISK.some((h) => symptom.includes(h) || h.includes(symptom))) {
      flaggedHigh.push(symptom);
    } else if (MODERATE_RISK.some((m) => symptom.includes(m) || m.includes(symptom))) {
      flaggedModerate.push(symptom);
    } else if (LOW_RISK.some((l) => symptom.includes(l) || l.includes(symptom))) {
      flaggedLow.push(symptom);
    } else {
      flaggedModerate.push(symptom);
    }
  }

  if (flaggedHigh.length > 0) {
    return {
      level: "high", color: "red", emoji: "🔴",
      message: "High concern — some of your symptoms may require immediate attention.",
      recommendation: "Seek medical attention as soon as possible. If you are experiencing a medical emergency, call 911.",
      flaggedSymptoms: flaggedHigh,
    };
  }

  if (flaggedModerate.length > 0) {
    return {
      level: "moderate", color: "yellow", emoji: "🟡",
      message: "Moderate concern — some symptoms may need professional evaluation.",
      recommendation: "Consider speaking to a healthcare provider about your symptoms, especially if they persist or worsen.",
      flaggedSymptoms: flaggedModerate,
    };
  }

  return {
    level: "low", color: "green", emoji: "🟢",
    message: "Low concern — your symptoms appear to be common and typically manageable.",
    recommendation: "Monitor your symptoms. If they persist for more than a few days or worsen, consult a healthcare provider.",
    flaggedSymptoms: flaggedLow,
  };
}
