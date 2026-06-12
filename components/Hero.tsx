import type { CSSProperties } from "react";
import type { LandingConfig } from "@/data/types";
import { ButtonLink } from "./ButtonLink";

type Props = { config: LandingConfig; whatsappHref: string };
export function Hero({ config, whatsappHref }: Props) {
  const style = { "--landing-primary": config.colors?.primary ?? "#183B56", "--landing-accent": config.colors?.accent ?? "#B88A44" } as CSSProperties;
  return (
    <section className="premium-gradient overflow-hidden border-b border-brand-border" style={style}>
      <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--landing-accent)]">{config.hero.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold text-[var(--landing-primary)] sm:text-6xl lg:text-7xl">{config.hero.headline}</h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-muted sm:text-xl">{config.hero.subheadline}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><ButtonLink href={whatsappHref} className="!bg-[var(--landing-primary)] !text-white">{config.hero.primaryCta}</ButtonLink><ButtonLink href="#servicios" variant="secondary">{config.hero.secondaryCta}</ButtonLink></div>
        </div>
        <div className="relative">
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[var(--landing-accent)]/20 blur-3xl" />
          <div className="relative rounded-[2.25rem] border border-brand-border bg-white p-5 shadow-soft sm:p-6">
            <div className="rounded-[1.75rem] border border-brand-border bg-brand-background p-6">
              <div className="flex items-start justify-between gap-5"><div><p className="text-sm font-semibold text-brand-muted">Landing demo</p><h2 className="mt-2 text-3xl font-semibold text-[var(--landing-primary)]">{config.businessName}</h2><p className="mt-3 text-sm text-brand-muted">{config.location}</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--landing-primary)] shadow-sm">Mobile-first</span></div>
              <div className="mt-8 grid gap-3">{config.trust.slice(0, 4).map((item) => <div key={item} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow-sm"><span className="text-brand-muted">{item}</span><span className="h-2 w-2 rounded-full bg-[var(--landing-accent)]" /></div>)}</div>
              <div className="mt-8 rounded-[1.5rem] bg-[var(--landing-primary)] p-5 text-white"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Acción principal</p><p className="mt-3 text-2xl font-semibold">Contactar por WhatsApp</p><p className="mt-2 text-sm text-white/70">Mensaje prellenado para convertir una visita en conversación.</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
