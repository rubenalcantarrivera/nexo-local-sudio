import { ButtonLink } from "./ButtonLink";

type Props = { whatsappHref: string; demoName?: string };
export function AuditBanner({ whatsappHref, demoName }: Props) {
  return (
    <aside className="border-y border-brand-border bg-white">
      <div className="container-page flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brand-muted"><span className="font-semibold text-brand-primary">Ejemplo editable.</span> {demoName ? `Podemos adaptar ${demoName} con datos reales del negocio.` : "Podemos adaptar este ejemplo con datos reales del negocio."} Ajustamos servicios, ubicación, WhatsApp, SEO, fotos y testimonios autorizados.</p>
        <ButtonLink href={whatsappHref} variant="secondary" className="shrink-0">Cotizar mi página</ButtonLink>
      </div>
    </aside>
  );
}
