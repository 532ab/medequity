import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { question, drugName, drugInfo, conversationHistory } = await req.json();

    if (!question || !drugName) {
      return NextResponse.json({ error: "Question and drug name are required" }, { status: 400 });
    }

    const systemPrompt = `You are a helpful medication information assistant for MedEquity, a health literacy tool. You help patients understand their medications in simple, plain language.

IMPORTANT RULES:
- Never diagnose conditions or prescribe treatments
- Always recommend consulting a doctor or pharmacist for specific medical decisions
- If someone describes emergency symptoms (chest pain, difficulty breathing, severe allergic reaction), tell them to call 911 immediately
- Use short, simple sentences. Avoid medical jargon.
- Be warm and reassuring but honest about limitations
- If you're unsure about something, say so rather than guessing
- Keep answers concise — 2-4 sentences for simple questions, up to a short paragraph for complex ones

You have the following FDA data about ${drugName}:
${drugInfo || "Limited information available."}

The user is asking about this medication. Answer their question based on the FDA data above and general medical knowledge. Always end with a reminder to consult their healthcare provider for personalized advice.`;

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
