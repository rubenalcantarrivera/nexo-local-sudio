import { trackChatEvent } from "@/lib/analytics/chatEvents";

type Props = {
  href: string;
  businessSlug: string;
};

export function WhatsAppHandoffCard({ href, businessSlug }: Props) {
  return (
    <div className="rounded-2xl border border-[#D8C08D] bg-[#FFF8E6] p-4 text-sm text-brand-primary shadow-sm">
      <p className="font-display text-lg font-semibold">Continuar por WhatsApp</p>
      <p className="mt-1 text-sm leading-6 text-brand-muted">El equipo puede confirmar disponibilidad, costos y siguientes pasos.</p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackChatEvent("whatsapp_handoff_clicked", { businessSlug })}
        className="focus-ring mt-3 inline-flex rounded-full bg-[#0B1220] px-4 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5"
      >
        Abrir WhatsApp
      </a>
    </div>
  );
}
