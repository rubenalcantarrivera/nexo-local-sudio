import Link from "next/link";
import { agency } from "@/data/agency";

type Props = {
  businessName?: string;
  tagline?: string;
  location?: string;
};

export function Footer({ businessName, tagline, location }: Props) {
  const isClient = Boolean(businessName);
  const displayName = businessName ?? agency.name;
  const displayTagline = tagline ?? agency.tagline;
  const displayLocation = location ?? agency.location;
  const mark = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <footer className="border-t border-brand-border bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-primary text-sm font-bold text-white">{mark}</span><div><p className="font-semibold text-brand-primary">{displayName}</p><p className="text-sm text-brand-muted">{displayTagline}</p></div></div><p className="mt-5 max-w-md text-sm text-brand-muted">{isClient ? "Servicios, ubicación y contacto directo para facilitar tu próxima visita." : "Estudio digital boutique para negocios locales. Landing pages rápidas, claras y orientadas a contacto."}</p></div>
        <div><p className="text-sm font-semibold text-brand-primary">Explorar</p><div className="mt-4 flex flex-col gap-3 text-sm text-brand-muted">{isClient ? <><Link href="#servicios" className="hover:text-brand-primary">Servicios</Link><Link href="#ubicacion" className="hover:text-brand-primary">Ubicación</Link><Link href="#faq" className="hover:text-brand-primary">FAQ</Link></> : <><Link href="/demos" className="hover:text-brand-primary">Demos por nicho</Link><Link href="/#paquetes" className="hover:text-brand-primary">Paquetes</Link><Link href="/#proceso" className="hover:text-brand-primary">Proceso</Link></>}</div></div>
        <div><p className="text-sm font-semibold text-brand-primary">Contacto</p><div className="mt-4 flex flex-col gap-3 text-sm text-brand-muted"><span>{displayLocation}</span>{isClient ? <span>WhatsApp disponible para citas e información.</span> : <><a href={`mailto:${agency.email}`} className="hover:text-brand-primary">{agency.email}</a><span>WhatsApp: {agency.phoneDisplay}</span></>}</div></div>
      </div>
      <div className="border-t border-brand-border py-5"><div className="container-page flex flex-col gap-2 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} {displayName}.</span><span>{isClient ? "Atención sujeta a disponibilidad y valoración cuando aplique." : "Marca operada como estudio boutique. Sin promesas de ventas garantizadas."}</span></div></div>
    </footer>
  );
}
