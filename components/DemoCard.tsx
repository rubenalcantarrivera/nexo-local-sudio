import Link from "next/link";
import type { LandingConfig } from "@/data/types";

type Props = { demo: LandingConfig };
export function DemoCard({ demo }: Props) {
  return (
    <Link href={`/demos/${demo.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-brand-border bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div className="h-36 border-b border-brand-border" style={{ background: `radial-gradient(circle at 24% 24%, ${demo.colors?.accent ?? "#B88A44"}33, transparent 34%), linear-gradient(135deg, #ffffff 0%, #F8F5EF 65%, ${demo.colors?.primary ?? "#183B56"}18 100%)` }}>
        <div className="flex h-full items-end p-5"><span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-brand-primary shadow-sm">{demo.niche}</span></div>
      </div>
      <div className="flex flex-1 flex-col p-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">{demo.location}</p><h3 className="mt-3 text-2xl font-semibold text-brand-primary transition group-hover:text-brand-text">{demo.businessName}</h3><p className="mt-3 flex-1 text-sm text-brand-muted">{demo.tagline}</p><span className="mt-6 text-sm font-semibold text-brand-primary">Ver landing demo →</span></div>
    </Link>
  );
}
