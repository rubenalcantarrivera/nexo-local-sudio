import { ButtonLink } from "./ButtonLink";

type Props = { title?: string; description?: string; primaryHref: string; secondaryHref?: string };
export function AgencyCTA({ title = "¿Tu negocio ya tiene reputación local, pero no una web a la altura?", description = "Podemos convertir tu presencia en Google Maps, reseñas y servicios en una landing clara, mobile-first y conectada a WhatsApp.", primaryHref, secondaryHref = "/demos" }: Props) {
  return (
    <section className="container-page py-16 lg:py-24">
      <div className="dark-grain texture-overlay relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-soft sm:p-10 lg:p-14">
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-softAccent">Diagnóstico sin compromiso</p><h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">{title}</h2><p className="mt-5 max-w-2xl text-base text-white/86 sm:text-lg">{description}</p></div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end"><ButtonLink href={primaryHref} variant="light">Solicitar diagnóstico</ButtonLink><ButtonLink href={secondaryHref} variant="secondaryOnDark">Ver demos</ButtonLink></div>
        </div>
      </div>
    </section>
  );
}
