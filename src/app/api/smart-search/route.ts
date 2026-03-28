import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: `The user is searching for a medication but may have misspelled it or described what it does instead of its name. Their input: "${query}"

Return a JSON object with:
- "correction": the most likely correct medication name (generic name preferred), or null if the input is already correct
- "suggestions": an array of 3-5 medication names that match what they're looking for
- "isDescription": true if the user described a condition/use rather than a drug name

Examples:
- "ibprofen" → {"correction":"Ibuprofen","suggestions":["Ibuprofen","Advil","Motrin"],"isDescription":false}
- "blood pressure pill" → {"correction":null,"suggestions":["Lisinopril","Amlodipine","Losartan","Metoprolol","Hydrochlorothiazide"],"isDescription":true}
- "the purple inhaler" → {"correction":null,"suggestions":["Advair Diskus","Breo Ellipta","Seretide"],"isDescription":true}
- "metforman" → {"correction":"Metformin","suggestions":["Metformin","Glucophage"],"isDescription":false}

Return ONLY valid JSON, no markdown.`,
        },
      ],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return NextResponse.json(JSON.parse(jsonMatch[0]));
        } catch { /* fall through */ }
      }
      return NextResponse.json({ correction: null, suggestions: [], isDescription: false });
    }
  } catch (e) {
    console.error("Smart search error:", e);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
