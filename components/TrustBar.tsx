type Props = { items: string[] };
export function TrustBar({ items }: Props) {
  return <section className="border-b border-brand-border bg-white"><div className="container-page flex flex-wrap items-center justify-center gap-3 py-5">{items.map((item) => <span key={item} className="rounded-full border border-brand-border bg-brand-background px-4 py-2 text-sm font-medium text-brand-primary">{item}</span>)}</div></section>;
}
