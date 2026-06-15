import type { CSSProperties } from "react";
import type { LandingConfig } from "@/data/types";
import { ButtonLink } from "./ButtonLink";

type Props = { config: LandingConfig; whatsappHref: string };

export function Hero({ config, whatsappHref }: Props) {
  const style = {
    "--landing-primary": config.colors?.primary ?? "#183B56",
    "--landing-accent": config.colors?.accent ?? "#B88A44"
  } as CSSProperties;
  const heroImage = config.images?.hero;
  const gallery = config.images?.gallery ?? [];

  return (
    <section className="relative border-b border-brand-border bg-paper" style={style}>
      <div className="absolute inset-0 bg-line-grid opacity-35" aria-hidden="true" />
      <div className="container-page relative grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-20">
        <div className="reveal-in">
          <p className="eyebrow text-[var(--landing-accent)]">{config.hero.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,4vw,3.8rem)] font-semibold leading-[1.02] text-[var(--landing-primary)]">
            {config.hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-brand-muted sm:text-xl">
            {config.hero.subheadline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={whatsappHref} className="!bg-[var(--landing-primary)] !text-white">{config.hero.primaryCta}</ButtonLink>
            <ButtonLink href="#servicios" variant="secondary">{config.hero.secondaryCta}</ButtonLink>
          </div>
          <div className="mt-9 grid max-w-2xl grid-cols-2 gap-px overflow-hidden border border-brand-border bg-brand-border sm:grid-cols-4">
            {config.trust.slice(0, 4).map((item) => (
              <div key={item} className="bg-white/70 px-4 py-3">
                <p className="text-xs font-semibold leading-5 text-[var(--landing-primary)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/70 bg-brand-softAccent shadow-soft sm:aspect-[4/3] lg:aspect-[5/4]">
          {heroImage ? (
            <img src={heroImage.src} alt={heroImage.alt} loading="eager" decoding="async" className="h-full w-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,18,32,.54),rgba(11,18,32,.12)_48%,rgba(11,18,32,.56))]" />
          {gallery[1] ? (
            <img src={gallery[1].src} alt={gallery[1].alt} loading="lazy" decoding="async" className="absolute right-5 top-5 hidden aspect-[4/3] w-40 rounded-[1.2rem] border border-white/60 object-cover shadow-card sm:block xl:w-48" />
          ) : null}
          {config.visual?.mood ? (
            <p className="absolute left-5 top-5 max-w-[15rem] border-l-2 border-white/90 bg-black/65 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-card backdrop-blur">
              {config.visual.mood}
            </p>
          ) : null}
          <div className="absolute bottom-4 left-4 right-4 grid gap-4 rounded-[1.35rem] border border-white/80 bg-white/[0.97] p-5 shadow-soft backdrop-blur sm:bottom-5 sm:left-5 sm:right-auto sm:w-[420px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--landing-accent)]">Agenda y contacto</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--landing-primary)]">{config.businessName}</h2>
                <p className="mt-1 text-sm text-brand-muted">{config.location}</p>
              </div>
              <div className="hidden h-16 w-px bg-brand-border sm:block" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {config.services.slice(0, 2).map((service) => (
                <div key={service.title} className="border-t border-brand-border pt-3">
                  <p className="font-semibold text-brand-primary">{service.title}</p>
                </div>
              ))}
            </div>
            <ButtonLink href={whatsappHref} className="w-full !bg-[var(--landing-primary)] !text-white">{config.hero.primaryCta}</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
