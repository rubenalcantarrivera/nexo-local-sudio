"use client";

import type { FormEvent } from "react";
import type { ChatAgentLead } from "@/data/chatAgentTypes";

type Props = {
  businessSlug: string;
  lead: Partial<ChatAgentLead>;
  onChange: (lead: Partial<ChatAgentLead>) => void;
  onCaptured?: () => void;
};

export function LeadCaptureCard({ businessSlug, lead, onChange, onCaptured }: Props) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await fetch("/api/chat-agent/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessSlug,
        name: lead.name,
        phone: lead.phone,
        serviceInterest: lead.serviceInterest,
        transcriptSummary: lead.summary,
        createdAt: new Date().toISOString()
      })
    }).catch(() => null);
    onCaptured?.();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm">
      <p className="font-display text-lg font-semibold text-brand-primary">Datos para seguimiento</p>
      <div className="mt-3 grid gap-3">
        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-muted">
          Nombre
          <input value={lead.name ?? ""} onChange={(event) => onChange({ ...lead, name: event.target.value })} className="rounded-xl border border-brand-border px-3 py-2 text-sm font-medium normal-case tracking-normal text-brand-primary outline-none focus:border-brand-accent" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-muted">
          WhatsApp
          <input value={lead.phone ?? ""} onChange={(event) => onChange({ ...lead, phone: event.target.value })} className="rounded-xl border border-brand-border px-3 py-2 text-sm font-medium normal-case tracking-normal text-brand-primary outline-none focus:border-brand-accent" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-muted">
          Servicio
          <input value={lead.serviceInterest ?? ""} onChange={(event) => onChange({ ...lead, serviceInterest: event.target.value })} className="rounded-xl border border-brand-border px-3 py-2 text-sm font-medium normal-case tracking-normal text-brand-primary outline-none focus:border-brand-accent" />
        </label>
      </div>
      <button type="submit" className="focus-ring mt-4 rounded-full bg-[#0B1220] px-4 py-2 text-xs font-bold text-white">
        Guardar datos
      </button>
    </form>
  );
}
