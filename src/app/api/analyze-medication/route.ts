import { NextRequest, NextResponse } from "next/server";
import { getDrugLabel, getAdverseEvents, getReportsByYear, getOutcomes, getReportsBySex, getReportsByAge } from "@/lib/openFda";

export async function POST(req: NextRequest) {
  try {
    const { medication } = await req.json();
    if (!medication || typeof medication !== "string") {
      return NextResponse.json({ error: "Medication name is required" }, { status: 400 });
    }

    const name = medication.trim();

    const [label, adverseEvents, reportsByYear, outcomes, reportsBySex, reportsByAge] = await Promise.all([
      getDrugLabel(name),
      getAdverseEvents(name),
      getReportsByYear(name),
      getOutcomes(name),
      getReportsBySex(name),
      getReportsByAge(name),
    ]);

    if (!label) {
      return NextResponse.json(
        { error: `Could not find information for "${medication}". Please check the spelling and try again.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      label,
      adverseEvents,
      reportsByYear,
      outcomes,
      reportsBySex,
      reportsByAge,
      disclaimer: "This information is for educational purposes only and is not medical advice. Always consult a healthcare professional.",
    });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
