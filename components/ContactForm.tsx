import { ButtonLink } from "./ButtonLink";

type Props = {
  title?: string;
  description?: string;
  whatsappHref: string;
  noteTitle?: string;
  note?: string;
  submitLabel?: string;
};

export function ContactForm({
  title = "Solicita información",
  description = "Déjanos tus datos y te contactaremos para confirmar disponibilidad. También puedes escribirnos directamente por WhatsApp.",
  whatsappHref,
  noteTitle = "Atención por WhatsApp",
  note = "Si prefieres avanzar más rápido, envía un mensaje con el servicio que te interesa y el horario que tienes disponible.",
  submitLabel = "Enviar solicitud"
}: Props) {
  return (
    <section id="contacto" className="container-page section-pad"><div className="grid gap-8 border border-brand-border bg-white p-6 shadow-soft sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10"><div><p className="eyebrow">Contacto</p><h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-brand-primary sm:text-5xl">{title}</h2><p className="mt-5 text-brand-muted">{description}</p><div className="mt-8 border-l-2 border-brand-accent bg-brand-background p-5"><p className="text-sm font-semibold text-brand-primary">{noteTitle}</p><p className="mt-2 text-sm text-brand-muted">{note}</p><ButtonLink href={whatsappHref} className="mt-5">Escribir por WhatsApp</ButtonLink></div></div><form className="grid gap-4" action="#" method="post"><label className="grid gap-2 text-sm font-medium text-brand-primary">Nombre<input name="name" type="text" placeholder="Tu nombre" className="focus-ring border border-brand-border bg-brand-background px-4 py-3 text-brand-text placeholder:text-brand-muted/70" /></label><label className="grid gap-2 text-sm font-medium text-brand-primary">WhatsApp<input name="phone" type="tel" placeholder="55 0000 0000" className="focus-ring border border-brand-border bg-brand-background px-4 py-3 text-brand-text placeholder:text-brand-muted/70" /></label><label className="grid gap-2 text-sm font-medium text-brand-primary">Servicio de interés<select name="service" className="focus-ring border border-brand-border bg-brand-background px-4 py-3 text-brand-text" defaultValue=""><option value="" disabled>Selecciona una opción</option><option>Agendar cita</option><option>Solicitar cotización</option><option>Pedir información</option><option>Otro</option></select></label><label className="grid gap-2 text-sm font-medium text-brand-primary">Mensaje<textarea name="message" rows={5} placeholder="Cuéntanos brevemente qué necesitas." className="focus-ring resize-none border border-brand-border bg-brand-background px-4 py-3 text-brand-text placeholder:text-brand-muted/70" /></label><button type="button" className="focus-ring rounded-full bg-[linear-gradient(135deg,#183B56,#0B1220)] px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">{submitLabel}</button></form></div></section>
  );
}
