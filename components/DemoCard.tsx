import Link from "next/link";
import type { LandingConfig } from "@/data/types";

type Props = { demo: LandingConfig };

export function DemoCard({ demo }: Props) {
  const image = demo.images?.hero;

  return (
    <Link href={`/demos/${demo.slug}`} className="group block h-full overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative h-72 overflow-hidden bg-line-grid">
        {image ? <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" /> : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,0)_24%,rgba(11,18,32,.72)_100%)]" />
        <div className="absolute left-5 top-5 border-l-2 border-white/70 bg-black/25 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
          {demo.niche}
        </div>
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{demo.location}</p>
          <h3 className="mt-2 font-display text-3xl font-semibold leading-none">{demo.businessName}</h3>
        </div>
      </div>
      <div className="p-6">
        <p className="min-h-[3.5rem] text-sm leading-7 text-brand-muted">{demo.tagline}</p>
        <div className="mt-6 flex items-center justify-between border-t border-brand-border pt-5">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">{demo.services.length} servicios</span>
          <span className="text-sm font-semibold text-brand-primary">Ver sitio →</span>
        </div>
      </div>
    </Link>
  );
}
