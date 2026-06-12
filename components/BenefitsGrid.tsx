import { SectionHeader } from "./SectionHeader";

type Item = { title: string; description: string };
export function BenefitsGrid({ items }: { items: Item[] }) {
  return (
    <section className="bg-white py-16 sm:py-20"><div className="container-page"><SectionHeader eyebrow="Beneficios" title="Una experiencia pensada para generar confianza antes del contacto." description="La información está organizada para reducir dudas y dirigir al visitante hacia una acción concreta." /><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map((item) => <article key={item.title} className="rounded-[1.5rem] border border-brand-border bg-brand-background p-6"><div className="h-1.5 w-12 rounded-full bg-brand-accent" /><h3 className="mt-5 text-lg font-semibold text-brand-primary">{item.title}</h3><p className="mt-3 text-sm text-brand-muted">{item.description}</p></article>)}</div></div></section>
  );
}
