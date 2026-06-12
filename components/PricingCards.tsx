import type { Package } from "@/data/types";
import { cn } from "@/lib/utils";
import { ButtonLink } from "./ButtonLink";

type Props = { packages: Package[]; ctaHref: string };
export function PricingCards({ packages, ctaHref }: Props) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {packages.map((item) => (
        <article key={item.name} className={cn("relative flex h-full flex-col overflow-hidden border bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft", item.highlighted ? "border-brand-accent bg-[#fffaf0]" : "border-brand-border")}>
          {item.highlighted ? <span className="badge-soft absolute right-5 top-5">Recomendado</span> : null}
          <h3 className="font-display text-3xl font-semibold text-brand-primary">{item.name}</h3>
          <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-brand-text">{item.price}</p>
          <p className="mt-4 text-sm text-brand-muted">{item.description}</p>
          <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-brand-text">
            {item.includes.map((feature) => <li key={feature} className="flex gap-3"><span className="shrink-0 font-semibold text-brand-accent">✓</span><span>{feature}</span></li>)}
          </ul>
          <ButtonLink href={ctaHref} variant={item.highlighted ? "primary" : "secondary"} className="mt-8 w-full">Solicitar {item.name}</ButtonLink>
        </article>
      ))}
    </div>
  );
}
