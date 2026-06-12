type Props = { href: string; label?: string };
export function WhatsAppStickyButton({ href, label = "WhatsApp" }: Props) {
  return <a href={href} target="_blank" rel="noreferrer" className="focus-ring fixed bottom-4 left-4 right-4 z-50 flex items-center justify-center rounded-full bg-brand-primary px-5 py-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:opacity-95 sm:left-auto sm:right-6 sm:w-auto">{label}</a>;
}
