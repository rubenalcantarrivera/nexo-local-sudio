"use client";

import { useState } from "react";
import type { ChatAgentConfig } from "@/data/chatAgentTypes";
import { ChatWidget } from "./ChatWidget";

export function ChatAgentAdminPreview({ configs }: { configs: ChatAgentConfig[] }) {
  const [slug, setSlug] = useState(configs[0]?.slug ?? "");
  const config = configs.find((item) => item.slug === slug) ?? configs[0];

  if (!config) return null;

  return (
    <section className="container-page section-pad">
      <div className="mb-8 rounded-2xl border border-brand-border bg-white p-5 text-sm text-brand-muted">
        Vista demo interna. En producción se conectaría a un panel o configuración del cliente.
      </div>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-brand-border bg-white p-6 shadow-card">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">
            Configuración
            <select value={slug} onChange={(event) => setSlug(event.target.value)} className="rounded-xl border border-brand-border px-3 py-3 text-sm font-semibold normal-case tracking-normal text-brand-primary">
              {configs.map((item) => <option key={item.slug} value={item.slug}>{item.businessName}</option>)}
            </select>
          </label>
          <div className="mt-6 grid gap-6">
            <PreviewBlock title="Servicios" items={config.services.map((item) => item.title)} />
            <PreviewBlock title="FAQs" items={config.faqs.map((item) => item.question)} />
            <PreviewBlock title="Disclaimers" items={config.disclaimers} />
            <PreviewBlock title="Escalamiento" items={config.escalationRules} />
            <PreviewBlock title="Sugerencias" items={config.suggestedReplies} />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[430px]">
          <ChatWidget key={config.slug} businessSlug={config.slug} mode="embedded" initialOpen />
        </div>
      </div>
    </section>
  );
}

function PreviewBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-brand-primary">{title}</h2>
      <ul className="mt-2 space-y-2 text-sm text-brand-muted">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}
