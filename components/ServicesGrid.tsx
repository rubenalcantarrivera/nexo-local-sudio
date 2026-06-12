import { SectionHeader } from "./SectionHeader";

type Item = { title: string; description: string };
type Props = { items: Item[]; eyebrow?: string; title?: string; description?: string };
export function ServicesGrid({ items, eyebrow = "Servicios", title = "Servicios claros para elegir sin fricción.", description = "Cada servicio se explica con lenguaje breve, útil y orientado a tomar acción." }: Props) {
  return (
    <section id="servicios" className="container-page section-pad">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <article key={item.title} className="lift-card group relative overflow-hidden rounded-[1.65rem] border border-brand-border bg-white p-6 shadow-card"><div className="absolute inset-x-0 top-0 h-1 bg-brand-accent/70 opacity-0 transition group-hover:opacity-100" /><div className="flex items-start justify-between gap-5"><span className="font-display text-4xl font-semibold text-brand-primary/18">{String(index + 1).padStart(2, "0")}</span><span className="h-px flex-1 translate-y-5 bg-brand-border" /></div><h3 className="mt-6 text-xl font-semibold text-brand-primary">{item.title}</h3><p className="mt-3 text-sm text-brand-muted">{item.description}</p></article>)}</div>
    </section>
  );
}
