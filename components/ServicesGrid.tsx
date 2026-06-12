import { SectionHeader } from "./SectionHeader";

type Item = { title: string; description: string };
type Props = { items: Item[]; eyebrow?: string; title?: string; description?: string };
export function ServicesGrid({ items, eyebrow = "Servicios", title = "Servicios claros para elegir sin fricción.", description = "Cada servicio se explica con lenguaje breve, útil y orientado a tomar acción." }: Props) {
  return (
    <section id="servicios" className="container-page py-16 sm:py-20">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <article key={item.title} className="rounded-[1.5rem] border border-brand-border bg-white p-6 shadow-card"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-softAccent text-sm font-bold text-brand-primary">{item.title.slice(0, 1)}</div><h3 className="mt-5 text-xl font-semibold text-brand-primary">{item.title}</h3><p className="mt-3 text-sm text-brand-muted">{item.description}</p></article>)}</div>
    </section>
  );
}
