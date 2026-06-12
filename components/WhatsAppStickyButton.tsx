type Props = { href: string; label?: string };
export function WhatsAppStickyButton({ href, label = "WhatsApp" }: Props) {
  return <a href={href} target="_blank" rel="noreferrer" className="focus-ring fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#183B56,#0B1220)] px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 sm:right-6">{label}</a>;
}
