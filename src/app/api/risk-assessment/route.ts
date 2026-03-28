import { NextRequest, NextResponse } from "next/server";
import { assessRisk } from "@/lib/riskEngine";

export async function POST(req: NextRequest) {
  try {
    const { symptoms } = await req.json();
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json({ error: "At least one symptom is required" }, { status: 400 });
    }

    const result = assessRisk(symptoms);
    return NextResponse.json({
      ...result,
      disclaimer: "This assessment is not a medical diagnosis. If you are experiencing a medical emergency, call 911 immediately.",
    });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
