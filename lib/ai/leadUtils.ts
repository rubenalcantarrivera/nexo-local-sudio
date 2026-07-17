import type { ChatAgentLead, ChatMessageInput } from "@/data/chatAgentTypes";

export function extractLeadFromConversation(messages: ChatMessageInput[]): ChatAgentLead {
  const joined = messages.map((message) => message.content).join("\n");
  const phoneMatch = joined.match(/(?:\+?52)?[\s.-]*(\d{2,3})[\s.-]*(\d{3,4})[\s.-]*(\d{4})/);
  const nameMatch = joined.match(/(?:me llamo|soy|mi nombre es)\s+([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{1,40})/);
  const interestMatch = joined.match(/(?:quiero|busco|me interesa|necesito)\s+([^.\n]{3,80})/i);

  return {
    name: nameMatch?.[1]?.trim() ?? null,
    phone: phoneMatch ? [phoneMatch[1], phoneMatch[2], phoneMatch[3]].join("") : null,
    serviceInterest: interestMatch?.[1]?.trim() ?? null,
    summary: createLeadSummary(messages)
  };
}

export function mergeLead(base: Partial<ChatAgentLead> | undefined, detected: ChatAgentLead): ChatAgentLead {
  return {
    name: base?.name || detected.name || null,
    phone: base?.phone || detected.phone || null,
    serviceInterest: base?.serviceInterest || detected.serviceInterest || null,
    summary: base?.summary || detected.summary || null
  };
}

export function createLeadSummary(messages: ChatMessageInput[], lead?: Partial<ChatAgentLead>) {
  const lastUser = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
  const parts = [
    lead?.serviceInterest ? `Interés: ${lead.serviceInterest}` : null,
    lastUser ? `Último mensaje: ${lastUser.slice(0, 180)}` : null
  ].filter(Boolean);
  return parts.join(". ") || "Conversación iniciada desde el asistente web.";
}

export function validateLead(lead: Partial<ChatAgentLead> & { businessSlug?: string }) {
  const hasBusiness = Boolean(lead.businessSlug);
  const hasContact = Boolean(lead.phone || lead.name);
  const isPhoneSafe = !lead.phone || /^[+\d\s().-]{8,18}$/.test(lead.phone);
  return { ok: hasBusiness && hasContact && isPhoneSafe, hasBusiness, hasContact, isPhoneSafe };
}
