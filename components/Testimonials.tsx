import { SectionHeader } from "./SectionHeader";

type Item = { quote: string; name: string; detail: string };
export function Testimonials({ items }: { items: Item[] }) {
  return <section className="bg-white section-pad"><div className="container-page"><SectionHeader eyebrow="Confianza" title="Reseñas y testimonios como prueba social útil." description="Opiniones breves para conocer la experiencia, resolver dudas y contactar con mayor confianza." /><div className="mt-10 grid gap-5 md:grid-cols-3">{items.map((item) => <figure key={item.name + item.detail} className="border border-brand-border bg-brand-background p-6"><blockquote className="font-display text-xl font-medium leading-8 text-brand-primary">“{item.quote}”</blockquote><figcaption className="mt-8 border-t border-brand-border pt-4"><p className="font-semibold text-brand-text">{item.name}</p><p className="text-sm text-brand-muted">{item.detail}</p></figcaption></figure>)}</div></div></section>;
}
