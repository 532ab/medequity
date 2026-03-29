import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { question, drugName, drugInfo, conversationHistory } = await req.json();

    if (!question || !drugName) {
      return NextResponse.json({ error: "Question and drug name are required" }, { status: 400 });
    }

    const systemPrompt = `You are a helpful medication information assistant for MedEquity, a health literacy tool.

RULES:
- Never diagnose or prescribe
- If emergency symptoms (chest pain, can't breathe, severe allergic reaction), say call 911 immediately
- Use plain language, no medical jargon
- Keep it SHORT: 2-4 sentences max for simple questions, 5-6 sentences max for complex ones
- DO NOT use markdown formatting — no headers (##), no bold (**), no bullet points (-), no horizontal rules (---)
- Write in plain flowing sentences like you're texting a friend
- Be warm but direct
- End with one short line suggesting they check with their doctor

FDA data for ${drugName}:
${drugInfo || "Limited information available."}`;

    const messages: Anthropic.MessageParam[] = [
      ...(conversationHistory || []),
      { role: "user" as const, content: question },
    ];

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: systemPrompt,
      messages,
    });

    const answer = message.content[0].type === "text" ? message.content[0].text : "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ answer });
  } catch (e) {
    console.error("AI chat error:", e);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
