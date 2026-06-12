import { ButtonLink } from "./ButtonLink";

type Props = { whatsappHref: string; demoName?: string };
export function AuditBanner({ whatsappHref, demoName }: Props) {
  return (
    <aside className="border-y border-brand-border bg-white">
      <div className="container-page flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brand-muted"><span className="font-semibold text-brand-primary">Demo editable.</span> {demoName ? `${demoName} está construido desde configuración TypeScript.` : "Esta página está construida desde configuración TypeScript."} Cambia servicios, ubicación, WhatsApp, SEO y testimonios sin tocar el motor de layout.</p>
        <ButtonLink href={whatsappHref} variant="secondary" className="shrink-0">Pedir adaptación</ButtonLink>
      </div>
    </aside>
  );
}
