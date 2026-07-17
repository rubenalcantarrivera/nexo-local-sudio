"use client";

import { useEffect, useRef, type FormEvent } from "react";
import type { ChatAgentLead } from "@/data/chatAgentTypes";
import { ChatMessage } from "./ChatMessage";
import { LeadCaptureCard } from "./LeadCaptureCard";
import { SuggestedReplies } from "./SuggestedReplies";
import { WhatsAppHandoffCard } from "./WhatsAppHandoffCard";

export type UiChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Props = {
  businessSlug: string;
  businessName: string;
  messages: UiChatMessage[];
  input: string;
  setInput: (value: string) => void;
  suggestedReplies: string[];
  isLoading: boolean;
  error: string | null;
  handoffUrl: string | null;
  lead: Partial<ChatAgentLead>;
  setLead: (lead: Partial<ChatAgentLead>) => void;
  mockMode?: boolean;
  onSend: (message: string) => void;
  onClose?: () => void;
};

export function ChatPanel({ businessSlug, businessName, messages, input, setInput, suggestedReplies, isLoading, error, handoffUrl, lead, setLead, mockMode, onSend, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading, handoffUrl, error]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSend(input);
  }

  return (
    <div className="flex h-[min(680px,calc(100dvh-1rem))] w-full max-w-[430px] flex-col overflow-hidden rounded-[1.8rem] border border-brand-border bg-[#F8F4EC] shadow-soft sm:h-[min(680px,calc(100dvh-2rem))]">
      <div className="flex items-center justify-between gap-4 border-b border-brand-border bg-white px-4 py-4 sm:px-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent">Asistente IA</p>
          <h2 className="font-display text-xl font-semibold text-brand-primary">{businessName}</h2>
          <p className="mt-1 text-xs font-medium text-brand-muted">Respuestas breves y paso a WhatsApp cuando hace falta.</p>
        </div>
        {onClose ? (
          <button type="button" onClick={onClose} className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-brand-border text-brand-primary" aria-label="Cerrar chat">
            ×
          </button>
        ) : null}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5">
        {messages.map((message) => <ChatMessage key={message.id} role={message.role} content={message.content} />)}
        {isLoading ? (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-accent" />
              Escribiendo respuesta segura...
            </div>
          </div>
        ) : null}
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div> : null}
        {handoffUrl ? <WhatsAppHandoffCard href={handoffUrl} businessSlug={businessSlug} /> : null}
        {mockMode && process.env.NODE_ENV === "development" ? <p className="text-xs font-semibold text-brand-muted">Modo demo sin API key</p> : null}
      </div>

      <div className="space-y-3 border-t border-brand-border bg-white p-3 sm:p-4">
        <SuggestedReplies replies={suggestedReplies} disabled={isLoading} onSelect={onSend} />
        {messages.length > 4 ? <LeadCaptureCard businessSlug={businessSlug} lead={lead} onChange={setLead} /> : null}
        <form onSubmit={handleSubmit} className="grid grid-cols-[1fr_auto] gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isLoading}
            placeholder="Escribe tu pregunta..."
            className="min-w-0 flex-1 rounded-full border border-brand-border bg-white px-4 py-3 text-sm text-brand-primary outline-none transition focus:border-brand-accent disabled:opacity-60"
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="focus-ring rounded-full bg-[#0B1220] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
            Enviar
          </button>
        </form>
        <p className="text-[11px] leading-5 text-brand-muted">El asistente no confirma precios, diagnósticos ni disponibilidad final. Cuando hace falta, pasa a WhatsApp.</p>
      </div>
    </div>
  );
}
