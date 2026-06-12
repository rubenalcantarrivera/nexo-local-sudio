import { ButtonLink } from "./ButtonLink";

type Props = { title?: string; description?: string; primaryHref: string; secondaryHref?: string };
export function AgencyCTA({ title = "¿Tu negocio ya tiene reputación local, pero no una web a la altura?", description = "Podemos convertir tu presencia en Google Maps, reseñas y servicios en una landing clara, mobile-first y conectada a WhatsApp.", primaryHref, secondaryHref = "/demos" }: Props) {
  return (
    <section className="container-page py-16">
      <div className="overflow-hidden rounded-[2rem] border border-brand-border bg-brand-primary p-8 text-white shadow-soft sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-softAccent">Diagnóstico sin compromiso</p><h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">{title}</h2><p className="mt-5 max-w-2xl text-base text-white/75 sm:text-lg">{description}</p></div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end"><ButtonLink href={primaryHref} className="!bg-white !text-brand-primary hover:!bg-brand-softAccent">Solicitar diagnóstico</ButtonLink><ButtonLink href={secondaryHref} variant="secondary" className="border-white/25 bg-white/10 text-white hover:bg-white/20">Ver demos</ButtonLink></div>
        </div>
      </div>
    </section>
  );
}
