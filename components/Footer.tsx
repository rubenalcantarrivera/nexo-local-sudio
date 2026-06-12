import Link from "next/link";
import { agency } from "@/data/agency";

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-primary text-sm font-bold text-white">NL</span><div><p className="font-semibold text-brand-primary">{agency.name}</p><p className="text-sm text-brand-muted">{agency.tagline}</p></div></div><p className="mt-5 max-w-md text-sm text-brand-muted">Estudio digital boutique para negocios locales. Landing pages rápidas, claras y orientadas a contacto.</p></div>
        <div><p className="text-sm font-semibold text-brand-primary">Explorar</p><div className="mt-4 flex flex-col gap-3 text-sm text-brand-muted"><Link href="/demos" className="hover:text-brand-primary">Demos por nicho</Link><Link href="/#paquetes" className="hover:text-brand-primary">Paquetes</Link><Link href="/#proceso" className="hover:text-brand-primary">Proceso</Link></div></div>
        <div><p className="text-sm font-semibold text-brand-primary">Contacto</p><div className="mt-4 flex flex-col gap-3 text-sm text-brand-muted"><span>{agency.location}</span><a href={`mailto:${agency.email}`} className="hover:text-brand-primary">{agency.email}</a><span>WhatsApp disponible para diagnóstico.</span></div></div>
      </div>
      <div className="border-t border-brand-border py-5"><div className="container-page flex flex-col gap-2 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Nexo Local Studio.</span><span>Marca operada como estudio boutique. Sin promesas de ventas garantizadas.</span></div></div>
    </footer>
  );
}
