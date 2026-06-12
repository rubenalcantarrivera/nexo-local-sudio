import { SectionHeader } from "./SectionHeader";
import { ImagePanel } from "./ImagePanel";

type Item = { title: string; description: string };
type Props = { items: Item[]; image?: { src: string; alt: string }; mood?: string };
export function BenefitsGrid({ items, image, mood }: Props) {
  return (
    <section className="bg-white section-pad"><div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div>{image ? <ImagePanel image={image} label={mood} className="h-[420px]" /> : <div className="h-[420px] rounded-[2rem] bg-line-grid" />}</div><div><SectionHeader eyebrow="Beneficios" title="Una experiencia pensada para generar confianza antes del contacto." description="La información está organizada para reducir dudas y dirigir al visitante hacia una acción concreta." /><div className="mt-8 grid gap-4 sm:grid-cols-2">{items.map((item) => <article key={item.title} className="border-t border-brand-border pt-5"><h3 className="text-lg font-semibold text-brand-primary">{item.title}</h3><p className="mt-2 text-sm text-brand-muted">{item.description}</p></article>)}</div></div></div></section>
  );
}
