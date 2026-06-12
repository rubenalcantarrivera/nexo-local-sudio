import { SectionHeader } from "./SectionHeader";

type Step = { step: string; title: string; description: string };
type Props = { items: Step[]; title?: string; description?: string };
export function ProcessSteps({ items, title = "Del interés inicial al contacto por WhatsApp.", description = "La estructura acompaña al visitante con una secuencia simple: entender, confiar, resolver dudas y contactar." }: Props) {
  return <section id="proceso" className="container-page section-pad"><SectionHeader eyebrow="Proceso" title={title} description={description} /><div className="mt-10 grid gap-px overflow-hidden border border-brand-border bg-brand-border lg:grid-cols-4">{items.map((item) => <article key={item.step} className="bg-white p-7"><span className="font-display text-5xl font-semibold text-brand-primary/18">{item.step}</span><h3 className="mt-6 text-xl font-semibold text-brand-primary">{item.title}</h3><p className="mt-3 text-sm text-brand-muted">{item.description}</p></article>)}</div></section>;
}
