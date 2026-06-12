import { SectionHeader } from "./SectionHeader";

type Item = { question: string; answer: string };
type Props = { items: Item[]; title?: string; description?: string };
export function FAQ({ items, title = "Preguntas frecuentes", description = "Respuestas claras para resolver fricción antes de que el cliente escriba o agende." }: Props) {
  return <section id="faq" className="container-page section-pad"><SectionHeader eyebrow="FAQ" title={title} description={description} /><div className="mt-10 divide-y divide-brand-border border-y border-brand-border bg-white">{items.map((item) => <details key={item.question} className="group p-6 open:bg-brand-background/70"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-semibold text-brand-primary"><span>{item.question}</span><span className="text-brand-accent transition group-open:rotate-45">+</span></summary><p className="mt-4 max-w-3xl text-sm leading-7 text-brand-muted">{item.answer}</p></details>)}</div></section>;
}
