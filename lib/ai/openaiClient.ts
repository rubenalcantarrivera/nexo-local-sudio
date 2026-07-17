import OpenAI from "openai";
import type { ChatAgentConfig, ChatAgentLead, ChatAgentReply, ChatMessageInput } from "@/data/chatAgentTypes";
import { detectIntent, shouldShowHandoff } from "./intent";
import { extractLeadFromConversation, mergeLead } from "./leadUtils";
import { buildAgentSystemPrompt } from "./promptBuilder";

const model = process.env.OPENAI_MODEL || "gpt-5-mini";
const apiKey = process.env.OPENAI_API_KEY;
const client = apiKey ? new OpenAI({ apiKey }) : null;

function safeJsonParse(text: string): ChatAgentReply | null {
  try {
    return JSON.parse(text) as ChatAgentReply;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as ChatAgentReply;
    } catch {
      return null;
    }
  }
}

function clampSuggestedReplies(replies: string[], fallback: string[]) {
  const clean = replies.filter(Boolean).slice(0, 4);
  return clean.length ? clean : fallback.slice(0, 4);
}

function repliesForIntent(intent: ReturnType<typeof detectIntent>, config: ChatAgentConfig) {
  if (intent === "ask_price") return ["Confirmar por WhatsApp", "Quiero una valoración", "Ver servicios"];
  if (intent === "ask_location") return ["Abrir WhatsApp", "Ver horarios", "Quiero agendar"];
  if (intent === "ask_hours") return ["Quiero agendar", "Ver ubicación", "Preguntar por WhatsApp"];
  if (intent === "emergency") return ["Contactar ahora", "Hablar con humano"];
  if (intent === "book_appointment") return ["Continuar por WhatsApp", "Dejar mis datos"];
  return clampSuggestedReplies(config.suggestedReplies, ["Agendar", "Ver ubicación", "Preguntar por WhatsApp"]);
}

function addNextStep(reply: string, question: string) {
  return `${reply}\n\n${question}`;
}

function findFaqAnswer(config: ChatAgentConfig, input: string) {
  const text = input.toLowerCase();
  return config.faqs.find((faq) => {
    const words = faq.question.toLowerCase().split(/\W+/).filter((word) => word.length > 3);
    return words.some((word) => text.includes(word));
  });
}

function findService(config: ChatAgentConfig, input: string) {
  const text = input.toLowerCase();
  return config.services.find((service) => {
    const words = [service.title, ...service.commonQuestions].join(" ").toLowerCase().split(/\W+/).filter((word) => word.length > 3);
    return words.some((word) => text.includes(word));
  });
}

export function generateMockAgentReply({
  businessConfig,
  messages,
  visitor
}: {
  businessConfig: ChatAgentConfig;
  messages: ChatMessageInput[];
  visitor?: Partial<ChatAgentLead>;
}): ChatAgentReply {
  const lastUser = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
  const intent = detectIntent(lastUser, businessConfig);
  const userMessageCount = messages.filter((message) => message.role === "user").length;
  const detectedLead = extractLeadFromConversation(messages);
  const lead = mergeLead(visitor, detectedLead);
  const faq = findFaqAnswer(businessConfig, lastUser);
  const service = findService(businessConfig, lastUser);

  let reply = `Puedo ayudarte con servicios, horarios, ubicación y el siguiente paso por WhatsApp.\n\n¿Qué te gustaría consultar?`;
  let stage: ChatAgentReply["stage"] = "answering";

  if (intent === "greeting") {
    reply = `Hola, soy el asistente de ${businessConfig.businessName}. Puedo orientarte sobre servicios, ubicación y citas por WhatsApp.\n\n¿Qué necesitas revisar hoy?`;
  } else if (intent === "emergency") {
    reply = `${businessConfig.businessInfo.emergencyPolicy ?? "Si es una urgencia, contacta servicios locales de emergencia o al negocio directamente."}\n\nTambién puedo abrir WhatsApp para contactar al equipo, pero no sustituyo atención de emergencia.`;
    stage = "handoff";
  } else if (intent === "ask_price") {
    reply = `El equipo puede confirmar costos según tu caso y el servicio de interés. Para evitar darte información incorrecta, lo mejor es revisarlo por WhatsApp.\n\n¿Qué servicio quieres cotizar?`;
    stage = "handoff";
  } else if (intent === "ask_hours") {
    reply = `El horario es: ${businessConfig.businessInfo.hours}.\n\nSi quieres una cita o reserva, puedo pasarte a WhatsApp para confirmar disponibilidad.`;
  } else if (intent === "ask_location") {
    reply = `La ubicación es ${businessConfig.businessInfo.address}.${businessConfig.businessInfo.parking ? `\n\nSobre estacionamiento: ${businessConfig.businessInfo.parking}.` : ""}`;
  } else if (intent === "book_appointment") {
    reply = `Claro. Para avanzar sin perder contexto, dime qué servicio te interesa y te paso a WhatsApp para confirmar horario.`;
    stage = "lead_capture";
  } else if (intent === "human_request" || intent === "ask_whatsapp" || intent === "complaint") {
    reply = `Te puedo pasar a WhatsApp para que el equipo lo revise directamente con contexto de esta conversación.`;
    stage = "handoff";
  } else if (intent === "legal_advice" || intent === "medical_advice") {
    reply = `${businessConfig.disclaimers[0]}\n\nPuedo orientarte con información general, pero lo correcto es que el equipo confirme tu caso por WhatsApp.`;
    stage = "handoff";
  } else if (faq) {
    reply = addNextStep(faq.answer, "¿Quieres que lo confirmemos por WhatsApp?");
  } else if (service) {
    reply = `${service.title}: ${service.description}${businessConfig.disclaimers[0] ? `\n\n${businessConfig.disclaimers[0]}` : ""}\n\n¿Quieres revisar disponibilidad por WhatsApp?`;
    stage = "qualifying";
  } else if (intent === "ask_services") {
    reply = `Los servicios principales son: ${businessConfig.services.map((item) => item.title).join(", ")}.\n\n¿Cuál te interesa revisar?`;
    stage = "qualifying";
  }

  const handoff = shouldShowHandoff(intent) || stage === "handoff" || stage === "lead_capture" || (userMessageCount >= 3 && stage === "qualifying");

  return {
    reply,
    stage,
    lead,
    suggestedReplies: repliesForIntent(intent, businessConfig),
    handoff: {
      shouldShow: handoff,
      reason: handoff ? "La conversación requiere confirmación humana o intención de contacto." : null
    },
    mockMode: true
  };
}

function normalizeAgentReply(reply: Partial<ChatAgentReply> | null, fallback: ChatAgentReply): ChatAgentReply {
  if (!reply?.reply) return fallback;
  return {
    reply: String(reply.reply),
    stage: ["answering", "qualifying", "lead_capture", "handoff", "fallback"].includes(String(reply.stage)) ? (reply.stage as ChatAgentReply["stage"]) : "answering",
    lead: {
      name: reply.lead?.name ?? null,
      phone: reply.lead?.phone ?? null,
      serviceInterest: reply.lead?.serviceInterest ?? null,
      summary: reply.lead?.summary ?? null
    },
    suggestedReplies: Array.isArray(reply.suggestedReplies) ? reply.suggestedReplies.slice(0, 4) : fallback.suggestedReplies,
    handoff: {
      shouldShow: Boolean(reply.handoff?.shouldShow),
      reason: reply.handoff?.reason ?? null
    },
    mockMode: false
  };
}

export async function generateAgentReply({
  businessConfig,
  messages,
  visitor
}: {
  businessConfig: ChatAgentConfig;
  messages: ChatMessageInput[];
  visitor?: Partial<ChatAgentLead>;
}): Promise<ChatAgentReply> {
  const fallback = generateMockAgentReply({ businessConfig, messages, visitor });
  if (!client) return fallback;

  try {
    const response = await client.responses.create({
      model,
      input: [
        { role: "system", content: buildAgentSystemPrompt(businessConfig) },
        ...messages.slice(-12).map((message) => ({ role: message.role, content: message.content }))
      ],
      temperature: 0.3
    } as any);

    const outputText = (response as { output_text?: string }).output_text ?? "";
    const parsed = safeJsonParse(outputText);
    return normalizeAgentReply(parsed, fallback);
  } catch (error) {
    console.error("chat-agent OpenAI error", error);
    return { ...fallback, stage: "fallback", mockMode: true };
  }
}
