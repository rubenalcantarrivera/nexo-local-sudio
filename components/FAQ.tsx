import { SectionHeader } from "./SectionHeader";

type Item = { question: string; answer: string };
type Props = { items: Item[]; title?: string; description?: string };
export function FAQ({ items, title = "Preguntas frecuentes", description = "Respuestas claras para resolver fricción antes de que el cliente escriba o agende." }: Props) {
  return <section id="faq" className="container-page py-16 sm:py-20"><SectionHeader eyebrow="FAQ" title={title} description={description} /><div className="mt-10 grid gap-4 lg:grid-cols-2">{items.map((item) => <article key={item.question} className="rounded-[1.5rem] border border-brand-border bg-white p-6 shadow-card"><h3 className="text-lg font-semibold text-brand-primary">{item.question}</h3><p className="mt-3 text-sm text-brand-muted">{item.answer}</p></article>)}</div></section>;
}
