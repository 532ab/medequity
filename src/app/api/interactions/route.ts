import { NextRequest, NextResponse } from "next/server";
import { checkInteractions } from "@/lib/openFda";

export async function POST(req: NextRequest) {
  try {
    const { drugs } = await req.json();
    if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
      return NextResponse.json({ error: "At least two medications are required" }, { status: 400 });
    }

    if (drugs.length > 5) {
      return NextResponse.json({ error: "Maximum 5 medications at a time" }, { status: 400 });
    }

    const interactions = await checkInteractions(
      drugs.map((d: string) => d.trim()).filter(Boolean)
    );

    return NextResponse.json({
      interactions,
      checked: drugs,
      disclaimer: "This interaction check is based on FDA label data and may not be comprehensive. Always consult a pharmacist or healthcare provider.",
    });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
