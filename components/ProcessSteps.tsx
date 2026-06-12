import { SectionHeader } from "./SectionHeader";

type Step = { step: string; title: string; description: string };
type Props = { items: Step[]; title?: string; description?: string };
export function ProcessSteps({ items, title = "Del interés inicial al contacto por WhatsApp.", description = "La estructura acompaña al visitante con una secuencia simple: entender, confiar, resolver dudas y contactar." }: Props) {
  return <section id="proceso" className="container-page py-16 sm:py-20"><SectionHeader eyebrow="Proceso" title={title} description={description} /><div className="mt-10 grid gap-5 lg:grid-cols-4">{items.map((item) => <article key={item.step} className="relative rounded-[1.5rem] border border-brand-border bg-white p-6 shadow-card"><span className="text-sm font-bold text-brand-accent">{item.step}</span><h3 className="mt-4 text-xl font-semibold text-brand-primary">{item.title}</h3><p className="mt-3 text-sm text-brand-muted">{item.description}</p></article>)}</div></section>;
}
