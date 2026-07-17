import { trackChatEvent } from "@/lib/analytics/chatEvents";

type Props = {
  href: string;
  businessSlug: string;
};

export function WhatsAppHandoffCard({ href, businessSlug }: Props) {
  return (
    <div className="rounded-2xl border border-[#D8C08D] bg-[#FFF8E6] p-4 text-sm text-brand-primary shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">Siguiente paso</p>
      <p className="mt-1 font-display text-lg font-semibold">Continuar por WhatsApp</p>
      <p className="mt-1 text-sm leading-6 text-brand-muted">Se abrirá WhatsApp con un resumen. El mensaje no se envía solo; el cliente decide enviarlo.</p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackChatEvent("whatsapp_handoff_clicked", { businessSlug })}
        className="focus-ring mt-3 inline-flex w-full justify-center rounded-full bg-[#0B1220] px-4 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 sm:w-auto"
      >
        Continuar por WhatsApp
      </a>
    </div>
  );
}
