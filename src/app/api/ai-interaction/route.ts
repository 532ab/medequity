import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { drug1, drug2, fdaText, severity } = await req.json();

    if (!drug1 || !drug2) {
      return NextResponse.json({ error: "Two drug names are required" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are a medication safety assistant. Explain in 2-3 simple sentences why ${drug1} and ${drug2} interact. Use plain language a non-medical person would understand. Explain what happens in the body and what the patient should watch for.

Severity level: ${severity}
FDA data: ${fdaText || "No specific FDA text available."}

Be specific to these two drugs. Do not use medical jargon. Return only the explanation, no JSON or formatting.`,
        },
      ],
    });

    const explanation = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ explanation });
  } catch (e) {
    console.error("AI interaction error:", e);
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 });
  }
}
