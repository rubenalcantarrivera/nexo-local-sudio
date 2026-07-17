import type { ChatAgentLead } from "@/data/chatAgentTypes";

function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export function createAgentWhatsAppUrl({
  phone,
  businessName,
  lead,
  transcriptSummary,
  baseMessage
}: {
  phone: string;
  businessName: string;
  lead: Partial<ChatAgentLead>;
  transcriptSummary?: string | null;
  baseMessage: string;
}) {
  const normalizedPhone = normalizePhone(phone);
  const service = lead.serviceInterest || "sus servicios";
  const lines = [
    baseMessage || `Hola, quiero información de ${businessName}.`,
    "",
    `Servicio de interés: ${service}.`,
    lead.name ? `Mi nombre es ${lead.name}.` : null,
    lead.phone ? `Mi teléfono es ${lead.phone}.` : null,
    `Resumen: ${lead.summary || transcriptSummary || "Conversación desde el asistente web."}`
  ].filter(Boolean);

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
}
