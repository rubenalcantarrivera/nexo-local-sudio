"use client";

import { useState } from "react";
import type { ChatAgentLead } from "@/data/chatAgentTypes";
import { getChatAgentConfig } from "@/data/chatAgentConfigs";
import { trackChatEvent } from "@/lib/analytics/chatEvents";
import { ChatPanel, type UiChatMessage } from "./ChatPanel";

type Props = {
  businessSlug: string;
  mode?: "demo" | "embedded";
  initialOpen?: boolean;
};

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function ChatWidget({ businessSlug, mode = "demo", initialOpen = false }: Props) {
  const config = getChatAgentConfig(businessSlug);
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UiChatMessage[]>(() => [
    {
      id: makeId(),
      role: "assistant",
      content: config ? `Hola, soy el asistente de ${config.businessName}. Puedo ayudarte con servicios, horarios, ubicación y el siguiente paso por WhatsApp.` : "Hola, puedo ayudarte con información del negocio."
    }
  ]);
  const [suggestedReplies, setSuggestedReplies] = useState(config?.suggestedReplies.slice(0, 4) ?? []);
  const [lead, setLead] = useState<Partial<ChatAgentLead>>({});
  const [handoffUrl, setHandoffUrl] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!config) return null;
  const activeConfig = config;

  async function sendMessage(raw: string) {
    const content = raw.trim();
    if (!content || isLoading) return;

    setInput("");
    setError(null);
    setHandoffUrl(null);
    const userMessage: UiChatMessage = { id: makeId(), role: "user", content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);
    trackChatEvent("message_sent", { businessSlug });

    try {
      const response = await fetch("/api/chat-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessSlug,
          messages: nextMessages.map((message) => ({ role: message.role, content: message.content })),
          visitor: lead
        })
      });

      if (!response.ok) throw new Error("Chat request failed");
      const data = await response.json();
      const assistantMessage: UiChatMessage = { id: makeId(), role: "assistant", content: data.reply };
      setMessages((current) => [...current, assistantMessage]);
      setSuggestedReplies(Array.isArray(data.suggestedReplies) ? data.suggestedReplies : activeConfig.suggestedReplies.slice(0, 4));
      setLead(data.lead ?? lead);
      setMockMode(Boolean(data.mockMode));
      if (data.handoff?.shouldShow && data.handoff?.whatsappUrl) setHandoffUrl(data.handoff.whatsappUrl);
      trackChatEvent("ai_reply_received", { businessSlug, stage: data.stage });
    } catch {
      setError("Ahora no puedo responder en automático, pero puedes escribir por WhatsApp.");
      setHandoffUrl(`https://wa.me/${activeConfig.phone}`);
      trackChatEvent("fallback_triggered", { businessSlug });
    } finally {
      setIsLoading(false);
    }
  }

  const panel = (
    <ChatPanel
      businessSlug={businessSlug}
      businessName={activeConfig.businessName}
      messages={messages}
      input={input}
      setInput={setInput}
      suggestedReplies={suggestedReplies}
      isLoading={isLoading}
      error={error}
      handoffUrl={handoffUrl}
      lead={lead}
      setLead={setLead}
      mockMode={mockMode}
      onSend={sendMessage}
      onClose={mode === "embedded" ? undefined : () => setIsOpen(false)}
    />
  );

  if (mode === "embedded") return panel;

  return (
    <>
      {isOpen ? <div className="fixed inset-x-2 bottom-2 z-50 mx-auto w-[calc(100vw-1rem)] max-w-[430px] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:mx-0 sm:w-[calc(100vw-2.5rem)]">{panel}</div> : null}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            trackChatEvent("chat_opened", { businessSlug });
          }}
          className="focus-ring fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full bg-[#0B1220] px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-1 sm:bottom-5 sm:right-5 sm:px-5 sm:py-4"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-accent text-xs text-[#0B1220]">{activeConfig.visual.avatarLabel}</span>
          Preguntar al asistente
        </button>
      ) : null}
    </>
  );
}
