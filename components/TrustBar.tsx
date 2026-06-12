type Props = { items: string[] };
export function TrustBar({ items }: Props) {
  return <section className="border-b border-brand-border bg-white/90"><div className="container-page grid gap-px bg-brand-border py-px sm:grid-cols-2 lg:grid-cols-4">{items.map((item) => <div key={item} className="bg-white px-5 py-4 text-sm font-semibold text-brand-primary">{item}</div>)}</div></section>;
}
