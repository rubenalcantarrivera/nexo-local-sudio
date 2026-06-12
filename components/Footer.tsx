import Link from "next/link";
import { agency } from "@/data/agency";
import { Logo } from "./Logo";

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
    <footer className={isClient ? "border-t border-brand-border bg-white" : "dark-grain texture-overlay relative overflow-hidden text-white"}>
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.25fr_0.75fr_0.9fr]">
        <div>
          <div className="flex items-center gap-3">
            {isClient ? <span className="grid h-11 w-11 place-items-center border border-brand-border bg-brand-background font-display text-sm font-semibold text-brand-primary">{mark}</span> : <Logo tone="light" />}
            {isClient ? <div><p className="font-display text-lg font-semibold text-brand-primary">{displayName}</p><p className="text-sm text-brand-muted">{displayTagline}</p></div> : null}
          </div>
          <p className={isClient ? "mt-5 max-w-md text-sm text-brand-muted" : "mt-7 max-w-md text-sm text-white/60"}>{isClient ? "Servicios, ubicación y contacto directo para facilitar tu próxima visita." : "Estudio digital boutique para negocios locales. Creamos presencia digital clara, premium y conectada a WhatsApp."}</p>
        </div>
        <div><p className={isClient ? "text-sm font-semibold text-brand-primary" : "text-sm font-semibold text-white"}>Explorar</p><div className={isClient ? "mt-4 flex flex-col gap-3 text-sm text-brand-muted" : "mt-4 flex flex-col gap-3 text-sm text-white/60"}>{isClient ? <><Link href="#servicios" className="hover:text-brand-primary">Servicios</Link><Link href="#ubicacion" className="hover:text-brand-primary">Ubicación</Link><Link href="#faq" className="hover:text-brand-primary">FAQ</Link></> : <><Link href="/demos" className="hover:text-white">Demos por nicho</Link><Link href="/#paquetes" className="hover:text-white">Paquetes</Link><Link href="/#proceso" className="hover:text-white">Proceso</Link></>}</div></div>
        <div><p className={isClient ? "text-sm font-semibold text-brand-primary" : "text-sm font-semibold text-white"}>Contacto</p><div className={isClient ? "mt-4 flex flex-col gap-3 text-sm text-brand-muted" : "mt-4 flex flex-col gap-3 text-sm text-white/60"}><span>{displayLocation}</span>{isClient ? <span>WhatsApp disponible para citas e información.</span> : <><a href={`mailto:${agency.email}`} className="hover:text-white">{agency.email}</a><span>WhatsApp: {agency.phoneDisplay}</span></>}</div></div>
      </div>
      <div className={isClient ? "border-t border-brand-border py-5" : "border-t border-white/10 py-5"}><div className={isClient ? "container-page flex flex-col gap-2 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between" : "container-page flex flex-col gap-2 text-xs text-white/48 sm:flex-row sm:items-center sm:justify-between"}><span>© {new Date().getFullYear()} {displayName}.</span><span>{isClient ? "Atención sujeta a disponibilidad y valoración cuando aplique." : "Estudio boutique con estructura ligera y comunicación directa."}</span></div></div>
    </footer>
  );
}
