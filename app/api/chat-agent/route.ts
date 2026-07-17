import { NextResponse } from "next/server";
import type { ChatAgentLead, ChatMessageInput } from "@/data/chatAgentTypes";
import { getChatAgentConfig } from "@/data/chatAgentConfigs";
import { createAgentWhatsAppUrl } from "@/lib/ai/chatAgentWhatsApp";
import { generateAgentReply } from "@/lib/ai/openaiClient";

type RequestBody = {
  businessSlug?: string;
  messages?: ChatMessageInput[];
  visitor?: Partial<ChatAgentLead>;
};

const safeMessage = (message: unknown): ChatMessageInput | null => {
  if (!message || typeof message !== "object") return null;
  const candidate = message as { role?: unknown; content?: unknown };
  if (candidate.role !== "user" && candidate.role !== "assistant") return null;
  if (typeof candidate.content !== "string" || !candidate.content.trim()) return null;
  return { role: candidate.role, content: candidate.content.trim().slice(0, 1200) };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const businessSlug = typeof body.businessSlug === "string" ? body.businessSlug : "";
    const businessConfig = getChatAgentConfig(businessSlug);

    if (!businessConfig) {
      return NextResponse.json({ error: "Business config not found" }, { status: 404 });
    }

    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .map(safeMessage)
      .filter((message): message is ChatMessageInput => Boolean(message))
      .slice(-16);

    if (!messages.length) {
      return NextResponse.json({ error: "At least one message is required" }, { status: 400 });
    }

    const reply = await generateAgentReply({
      businessConfig,
      messages,
      visitor: body.visitor
    });

    const whatsappUrl = createAgentWhatsAppUrl({
      phone: businessConfig.phone,
      businessName: businessConfig.businessName,
      lead: reply.lead,
      transcriptSummary: reply.lead.summary,
      baseMessage: businessConfig.whatsappMessageBase
    });

    return NextResponse.json({
      reply: reply.reply,
      stage: reply.stage,
      lead: reply.lead,
      suggestedReplies: reply.suggestedReplies,
      handoff: {
        shouldShow: reply.handoff.shouldShow,
        whatsappUrl
      },
      mockMode: reply.mockMode ?? false
    });
  } catch (error) {
    console.error("chat-agent route error", error);
    return NextResponse.json(
      {
        reply: "Ahora no puedo responder en automático, pero puedes escribir por WhatsApp y el equipo te confirma.",
        stage: "fallback",
        lead: { name: null, phone: null, serviceInterest: null, summary: null },
        suggestedReplies: ["Escribir por WhatsApp", "Ver servicios", "Preguntar horario"],
        handoff: { shouldShow: true, whatsappUrl: "https://wa.me/525545609027" },
        mockMode: true
      },
      { status: 200 }
    );
  }
}
