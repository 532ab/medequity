import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { drugName, purpose, usage, dosage, warnings } = await req.json();

    if (!drugName) {
      return NextResponse.json({ error: "Drug name is required" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a health literacy assistant. Translate the following FDA drug information for "${drugName}" into simple, plain language that a non-medical person can understand. Use short sentences. Avoid jargon. Write like you're explaining to a family member.

Return a JSON object with these fields:
- "purpose": one or two simple sentences about what this drug does and why someone would take it
- "usage": clear, simple instructions on how to take it
- "dosage": the key dosage info in plain terms
- "warnings": an array of 2-4 short, clear warnings — the most important things to watch for

Here is the FDA label data:
Purpose: ${purpose || "Not available"}
Usage: ${usage || "Not available"}
Dosage: ${dosage || "Not available"}
Warnings: ${warnings?.join(" | ") || "Not available"}

Return ONLY valid JSON, no markdown.`,
        },
      ],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    // Strip markdown code fences if present
    const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json({ summary: parsed });
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({ summary: parsed });
        } catch { /* fall through */ }
      }
      return NextResponse.json({
        summary: {
          purpose: raw.slice(0, 300),
          usage: "",
          dosage: "",
          warnings: [],
        },
      });
    }
  } catch (e) {
    console.error("AI summary error:", e);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
