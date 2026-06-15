import type { LandingConfig } from "@/data/types";
import { ButtonLink } from "./ButtonLink";

type Props = { config: LandingConfig; whatsappHref: string };

export function ClientFinalCTA({ config, whatsappHref }: Props) {
  const image = config.images?.gallery?.[1] ?? config.images?.feature ?? config.images?.hero;

  return (
    <section className="container-page pb-16 sm:pb-20 lg:pb-28">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-primary text-white shadow-soft">
        {image ? <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,18,32,.96),rgba(11,18,32,.78),rgba(11,18,32,.48))]" />
        <div className="relative max-w-3xl p-7 sm:p-10 lg:p-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/82">{config.location}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
            ¿Listo para solicitar información en {config.businessName}?
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/86">
            Escríbenos por WhatsApp para confirmar disponibilidad, resolver dudas y revisar el siguiente paso según el servicio que necesitas.
          </p>
          {config.disclaimer ? <p className="mt-5 max-w-2xl border-l border-white/45 pl-4 text-sm text-white/82">{config.disclaimer}</p> : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={whatsappHref} variant="light">{config.hero.primaryCta}</ButtonLink>
            <ButtonLink href="#ubicacion" variant="secondaryOnDark">Ver ubicación</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
