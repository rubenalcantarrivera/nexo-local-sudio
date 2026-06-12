import type { CSSProperties } from "react";
import type { LandingConfig } from "@/data/types";
import { ButtonLink } from "./ButtonLink";
import { ImagePanel } from "./ImagePanel";

type Props = { config: LandingConfig; whatsappHref: string };

export function Hero({ config, whatsappHref }: Props) {
  const style = {
    "--landing-primary": config.colors?.primary ?? "#183B56",
    "--landing-accent": config.colors?.accent ?? "#B88A44"
  } as CSSProperties;
  const heroImage = config.images?.hero;
  const gallery = config.images?.gallery ?? [];

  return (
    <section className="relative overflow-hidden border-b border-brand-border bg-paper" style={style}>
      <div className="absolute inset-0 bg-line-grid opacity-35" aria-hidden="true" />
      <div className="container-page relative grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-16 xl:py-20">
        <div className="reveal-in">
          <p className="eyebrow text-[var(--landing-accent)]">{config.hero.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.3rem,4.7vw,4.35rem)] font-semibold leading-[1.02] text-[var(--landing-primary)]">
            {config.hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-brand-muted sm:text-xl">
            {config.hero.subheadline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={whatsappHref} className="!bg-[var(--landing-primary)] !text-white">{config.hero.primaryCta}</ButtonLink>
            <ButtonLink href="#servicios" variant="secondary">{config.hero.secondaryCta}</ButtonLink>
          </div>
          <div className="mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {config.trust.slice(0, 4).map((item) => (
              <div key={item} className="border-l bg-white/50 px-3 py-2" style={{ borderColor: "color-mix(in srgb, var(--landing-accent) 55%, transparent)" }}>
                <p className="text-xs font-semibold leading-5 text-[var(--landing-primary)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[440px] lg:min-h-[540px]">
          <ImagePanel image={heroImage} priority label={config.visual?.mood} className="absolute inset-x-0 top-0 h-[360px] rounded-[2.4rem] lg:h-[470px]" />
          <div className="absolute bottom-0 left-4 right-4 grid gap-4 rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur md:left-8 md:right-auto md:w-[420px]">
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
          {gallery[0] ? <ImagePanel image={gallery[0]} className="absolute right-0 top-10 hidden h-48 w-48 rounded-none shadow-card xl:block" imageClassName="min-h-0 h-full" /> : null}
        </div>
      </div>
    </section>
  );
}
