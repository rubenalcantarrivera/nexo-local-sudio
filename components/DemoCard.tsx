import Link from "next/link";
import type { LandingConfig } from "@/data/types";

type Props = { demo: LandingConfig };

export function DemoCard({ demo }: Props) {
  const image = demo.images?.hero;

  return (
    <Link href={`/demos/${demo.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-brand-border bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-accent/50 hover:shadow-soft">
      <div className="relative aspect-[16/11] overflow-hidden bg-brand-softAccent">
        {image ? <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" /> : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,0)_45%,rgba(11,18,32,.34)_100%)]" />
        <div className="absolute left-4 top-4 border-l-2 border-white/80 bg-black/35 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
          {demo.niche}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted">{demo.location}</p>
        <h3 className="mt-2 font-display text-3xl font-semibold leading-tight text-brand-primary">{demo.businessName}</h3>
        <p className="mt-3 text-sm leading-7 text-brand-muted">{demo.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-brand-border pt-5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted">{demo.services.length} servicios</span>
          <span className="text-sm font-semibold text-brand-primary transition group-hover:translate-x-0.5">Ver demo →</span>
        </div>
      </div>
    </Link>
  );
}
