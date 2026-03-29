<div align="center">

# MedEquity

**Your prescriptions, in words you understand.**

[**Live Demo →**](https://medequity.vercel.app)

</div>

---

MedEquity is a medication safety tool that translates FDA drug data into plain language. Built for patients who struggle to understand their prescriptions — particularly elderly, low-income, and non-English-speaking communities.

### Features

**AI-Powered Drug Summaries** — Claude translates dense FDA label text into simple, plain-language explanations. Purpose, dosage, usage, and warnings rewritten so anyone can understand them. Original FDA text available via toggle.

**Medication Q&A Chat** — Ask questions about any medication in natural language. "Can I take this with alcohol?" "Is this safe during pregnancy?" Powered by Claude with FDA label data as context. Includes suggested questions and conversation history.

**Smart Search** — Instant fuzzy matching as you type with typo tolerance. Can't spell your medication? AI corrects it. Don't know the name? Type what it does — "blood pressure pill" or "pain reliever" — and get suggestions. Searches both brand and generic names.

**Voice Input** — Tap the microphone and speak your medication name instead of typing. Works in English and Spanish.

**Barcode Scanner** — Scan the barcode on your prescription bottle or OTC packaging. Looks up the NDC/UPC code through the FDA database, with AI fallback if the code isn't found.

**Drug Interaction Checker** — Enter 2–5 medications and get specific risks, not generic disclaimers. Known interaction database covers NSAIDs + anticoagulants, SSRIs + serotonergic drugs, ACE inhibitors + potassium, statins + CYP inhibitors, and more. AI explains each interaction in plain language on demand.

**FDA Recall Alerts** — Automatically checks for active FDA recalls on any searched medication. Shows recall class, reason, date, and plain-language severity explanation.

**Medication Comparison** — Side-by-side view of two drugs with merged adverse event chart, purpose/dosage/warnings comparison, and color-coded profiles.

**Symptom Risk Assessment** — Enter current symptoms and get flagged if something needs attention. High-risk symptoms trigger a doctor escalation card with a Call 911 button, Poison Control, and Crisis Lifeline numbers.

**Find Nearby Pharmacies** — Uses your device location to open Google Maps with nearby pharmacies carrying your medication. Shows different guidance for OTC vs prescription drugs.

**Drug Details** — Shows manufacturer name, OTC vs prescription status, route of administration, and generic availability with pricing guidance ("ask your pharmacist for the generic").

**Read Aloud** — Listen button on drug info reads the full summary out loud. Slower rate for clarity. Switches voice based on language setting.

**Text Size Control** — Three sizes (normal, large, extra large) for users with vision difficulties. Persists across sessions.

**FDA Data Visualizations** — Reported side effects (bar chart), adverse event reports over time (area chart), patient outcomes (donut chart), and demographics by sex and age group (bar charts). All from real openFDA data.

**Bilingual** — Full English and Spanish support across all UI text, labels, and navigation.

**Dark Mode** — Full dark theme with system preference detection and manual toggle.

**Progressive Web App** — Installable on iOS and Android. Offline caching, standalone mode, custom app icon. Add to home screen for a native app feel with bottom tab bar navigation.

**Accessible** — Skip navigation, ARIA autocomplete, screen reader labels, keyboard navigation, WCAG AA color contrast, safe area support for notched devices.

### Stack

Next.js 15 · React 18 · TypeScript · Tailwind CSS · Recharts · Claude API · openFDA API

No database. No accounts. No stored data. Everything processes in real time.

### Run locally

```
npm install
npm run dev
```

Requires an `ANTHROPIC_API_KEY` in `.env.local` for AI features.

---

<div align="center">

*Health literacy is health equity.*

</div>
