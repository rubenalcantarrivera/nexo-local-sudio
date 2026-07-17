import { ButtonLink } from "@/components/ButtonLink";

type Props = {
  primaryHref: string;
};

export function ChatAgentProductHero({ primaryHref }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-brand-border bg-paper">
      <div className="pointer-events-none absolute inset-0 bg-line-grid opacity-25" aria-hidden="true" />
      <div className="container-page relative grid gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-20">
        <div>
          <p className="eyebrow">Nexo Chat Agent</p>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,5vw,4.8rem)] font-semibold leading-[0.98] text-brand-primary">
            Un asistente inteligente para convertir visitas en conversaciones por WhatsApp.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
            Responde preguntas frecuentes, explica servicios y guía al cliente hacia una cita, reserva o cotización sin que tengas que responder lo mismo todo el día.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/chat-agent/demos">Ver demo del asistente</ButtonLink>
            <ButtonLink href={primaryHref} variant="secondary">Cotizar asistente IA</ButtonLink>
          </div>
        </div>
        <div className="rounded-[2.2rem] border border-brand-border bg-white p-4 shadow-soft">
          <div className="rounded-[1.6rem] bg-[#0B1220] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-softAccent">Recepción digital</p>
            <div className="mt-6 space-y-3">
              {["¿Tienen citas?", "¿Cuánto cuesta?", "¿Dónde están?", "¿Puedo reservar?"].map((question) => (
                <div key={question} className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90">{question}</div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-white p-5 text-brand-primary">
              <p className="font-display text-2xl font-semibold">Claro. Te explico y te paso a WhatsApp para confirmar.</p>
              <p className="mt-3 text-sm text-brand-muted">Respuesta breve, segura y conectada a un humano.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
