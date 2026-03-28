<div align="center">

# MedEquity

**Your prescriptions, in words you understand.**

[**Live Demo →**](https://medequity.vercel.app)

</div>

---

MedEquity is a medication safety tool that translates FDA drug data into plain language. Built for patients who struggle to understand their prescriptions — particularly elderly, low-income, and non-English-speaking communities.

### Features

**AI-Powered Drug Summaries** — Claude translates dense FDA label text into simple, plain-language explanations. Purpose, dosage, usage, and warnings rewritten so anyone can understand them. Original FDA text available via toggle.

**Medication Q&A Chat** — Ask questions about any medication in natural language. "Can I take this with alcohol?" "Is this safe during pregnancy?" Powered by Claude Sonnet with FDA label data as context. Includes suggested questions and conversation history.

**Drug Interaction Checker** — Enter 2–5 medications and get specific risks, not generic disclaimers. Known interaction database covers NSAIDs + anticoagulants, SSRIs + serotonergic drugs, ACE inhibitors + potassium, statins + CYP inhibitors, and more. AI explains each interaction in plain language on demand.

**FDA Recall Alerts** — Automatically checks for active FDA recalls on any searched medication. Shows recall class, reason, date, and plain-language severity explanation.

**Medication Comparison** — Side-by-side view of two drugs with merged adverse event chart, purpose/dosage/warnings comparison, and color-coded profiles.

**Symptom Risk Assessment** — Enter current symptoms and get flagged if something needs attention. High-risk symptoms trigger a doctor escalation card with a Call 911 button, Poison Control, and Crisis Lifeline numbers.

**FDA Data Visualizations** — Reported side effects (bar chart), adverse event reports over time (area chart), patient outcomes (donut chart), and demographics by sex and age group (bar charts). All from real openFDA data.

**Bilingual** — Full English and Spanish support across all UI text, labels, and navigation. Toggle in the nav bar.

**Dark Mode** — Full dark theme with system preference detection and manual toggle. Persists across sessions.

**Progressive Web App** — Installable on iOS and Android. Offline caching, standalone mode, custom app icon.

**Accessible** — Skip navigation, ARIA autocomplete on search, screen reader labels, keyboard navigation, WCAG AA color contrast.

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
