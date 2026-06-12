import { SectionHeader } from "./SectionHeader";

type Item = { quote: string; name: string; detail: string };
export function Testimonials({ items }: { items: Item[] }) {
  return <section className="bg-white py-16 sm:py-20"><div className="container-page"><SectionHeader eyebrow="Confianza" title="Reseñas y testimonios como prueba social útil." description="Opiniones breves para conocer la experiencia, resolver dudas y contactar con mayor confianza." /><div className="mt-10 grid gap-5 md:grid-cols-3">{items.map((item) => <figure key={item.name + item.detail} className="rounded-[1.5rem] border border-brand-border bg-brand-background p-6"><blockquote className="text-base font-medium leading-7 text-brand-primary">“{item.quote}”</blockquote><figcaption className="mt-6 border-t border-brand-border pt-4"><p className="font-semibold text-brand-text">{item.name}</p><p className="text-sm text-brand-muted">{item.detail}</p></figcaption></figure>)}</div></div></section>;
}
