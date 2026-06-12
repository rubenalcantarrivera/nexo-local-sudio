import type { Package } from "@/data/types";
import { cn } from "@/lib/utils";
import { ButtonLink } from "./ButtonLink";

type Props = { packages: Package[]; ctaHref: string };
export function PricingCards({ packages, ctaHref }: Props) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {packages.map((item) => (
        <article key={item.name} className={cn("relative flex h-full flex-col rounded-[2rem] border bg-white p-6 shadow-card", item.highlighted ? "border-brand-accent ring-4 ring-brand-softAccent" : "border-brand-border")}>
          {item.highlighted ? <span className="absolute right-5 top-5 rounded-full bg-brand-softAccent px-3 py-1 text-xs font-semibold text-brand-primary">Recomendado</span> : null}
          <h3 className="text-2xl font-semibold text-brand-primary">{item.name}</h3>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-brand-text">{item.price}</p>
          <p className="mt-4 text-sm text-brand-muted">{item.description}</p>
          <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-brand-text">
            {item.includes.map((feature) => <li key={feature} className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-accent" /><span>{feature}</span></li>)}
          </ul>
          <ButtonLink href={ctaHref} variant={item.highlighted ? "primary" : "secondary"} className="mt-8 w-full">Solicitar {item.name}</ButtonLink>
        </article>
      ))}
    </div>
  );
}
