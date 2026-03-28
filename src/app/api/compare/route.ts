import { NextRequest, NextResponse } from "next/server";
import { getDrugLabel, getAdverseEvents } from "@/lib/openFda";

export async function POST(req: NextRequest) {
  try {
    const { drug1, drug2 } = await req.json();

    if (!drug1 || typeof drug1 !== "string" || !drug2 || typeof drug2 !== "string") {
      return NextResponse.json(
        { error: "Two medication names are required for comparison." },
        { status: 400 }
      );
    }

    const name1 = drug1.trim();
    const name2 = drug2.trim();

    const [label1, label2, events1, events2] = await Promise.all([
      getDrugLabel(name1),
      getDrugLabel(name2),
      getAdverseEvents(name1),
      getAdverseEvents(name2),
    ]);

    if (!label1 && !label2) {
      return NextResponse.json(
        { error: `Could not find information for "${name1}" or "${name2}". Please check the spelling and try again.` },
        { status: 404 }
      );
    }

    if (!label1) {
      return NextResponse.json(
        { error: `Could not find information for "${name1}". Please check the spelling and try again.` },
        { status: 404 }
      );
    }

    if (!label2) {
      return NextResponse.json(
        { error: `Could not find information for "${name2}". Please check the spelling and try again.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      drug1: { label: label1, adverseEvents: events1 },
      drug2: { label: label2, adverseEvents: events2 },
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
