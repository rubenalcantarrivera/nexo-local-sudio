import type { ChatAgentConfig } from "@/data/chatAgentTypes";
import { ChatWidget } from "./ChatWidget";

type Props = {
  config: ChatAgentConfig;
};

export function ChatAgentDemoFrame({ config }: Props) {
  return (
    <section className="container-page section-pad">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="rounded-[2rem] border border-brand-border bg-white p-7 shadow-card">
          <p className="eyebrow">{config.niche}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-brand-primary sm:text-5xl">{config.businessName}</h1>
          <p className="mt-4 text-lg text-brand-muted">{config.location}</p>
          <div className="mt-6 grid gap-3 rounded-2xl border border-brand-border bg-brand-softAccent/35 p-4 text-sm text-brand-primary sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-muted">Horario</p>
              <p className="mt-1 font-semibold">{config.businessInfo.hours}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-muted">Atención</p>
              <p className="mt-1 font-semibold">{config.businessInfo.appointmentRequired ? "Con cita previa" : "Sujeta a disponibilidad"}</p>
            </div>
          </div>
          <div className="mt-8 grid gap-3">
            {config.services.slice(0, 3).map((service) => (
              <div key={service.title} className="border-l-2 border-brand-accent bg-brand-softAccent/35 px-4 py-3">
                <h2 className="font-semibold text-brand-primary">{service.title}</h2>
                <p className="mt-1 text-sm text-brand-muted">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">Prueba preguntando</p>
            <div className="mt-3 grid gap-2 text-sm text-brand-primary">
              {[...config.suggestedReplies, "¿Cuánto cuesta?", "¿Qué necesito para empezar?"].slice(0, 5).map((item) => (
                <span key={item} className="border-b border-brand-border pb-2">{item}</span>
              ))}
            </div>
          </div>
          <p className="mt-8 rounded-2xl border border-brand-border bg-white px-4 py-3 text-xs leading-5 text-brand-muted">{config.disclaimers[0]}</p>
        </div>
        <div className="mx-auto w-full max-w-[430px]">
          <ChatWidget businessSlug={config.slug} mode="embedded" initialOpen />
        </div>
      </div>
    </section>
  );
}
