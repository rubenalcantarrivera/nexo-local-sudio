import { ButtonLink } from "./ButtonLink";
import { SectionHeader } from "./SectionHeader";

type Props = { title: string; description: string; address: string; mapEmbedUrl?: string; whatsappHref: string };
export function LocationSection({ title, description, address, mapEmbedUrl, whatsappHref }: Props) {
  return (
    <section id="ubicacion" className="bg-white py-16 sm:py-20"><div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><SectionHeader eyebrow="Ubicación" title={title} description={description} /><div className="mt-8 rounded-[1.5rem] border border-brand-border bg-brand-background p-6"><p className="text-sm font-semibold text-brand-primary">Dirección o zona de atención</p><p className="mt-2 text-brand-muted">{address}</p><ButtonLink href={whatsappHref} className="mt-6">Confirmar disponibilidad</ButtonLink></div></div><div className="overflow-hidden rounded-[2rem] border border-brand-border bg-brand-background shadow-card">{mapEmbedUrl ? <iframe title={`Mapa de ${address}`} src={mapEmbedUrl} className="h-[360px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="grid h-[360px] place-items-center p-8 text-center"><div><p className="text-sm font-semibold text-brand-primary">Mapa pendiente</p><p className="mt-2 max-w-sm text-sm text-brand-muted">Reemplaza este bloque con el embed de Google Maps del cliente.</p></div></div>}</div></div></section>
  );
}
