import type { Metadata } from "next";
import { AgencyCTA } from "@/components/AgencyCTA";
import { ButtonLink } from "@/components/ButtonLink";
import { DemoCard } from "@/components/DemoCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ImagePanel } from "@/components/ImagePanel";
import { SectionHeader } from "@/components/SectionHeader";
import { agency } from "@/data/agency";
import { landingConfigs } from "@/data/landingConfigs";
import { createWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Demos por nicho",
  description: "Galería de demos de landing pages para ópticas, clínicas, restaurantes, despachos, academias, veterinarias y otros negocios locales.",
  keywords: ["demos landing pages", "landing pages por nicho", "negocios locales", "Nexo Local Studio"]
};

export default function DemosPage() {
  const whatsappHref = createWhatsAppLink(agency.phone, "Hola, quiero adaptar uno de los demos de Nexo Local Studio para mi negocio.");
  const heroDemos = landingConfigs.slice(0, 3);

  return (
    <main className="min-h-screen bg-brand-background">
      <Header ctaHref={whatsappHref} />
      <section className="relative overflow-hidden border-b border-brand-border bg-paper">
        <div className="absolute inset-0 bg-line-grid opacity-30" aria-hidden="true" />
        <div className="container-page relative grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-16">
          <div>
            <p className="eyebrow">Galería de demos</p>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.45rem,4.8vw,4.6rem)] font-semibold leading-[0.98] text-brand-primary">
              Galería de demos por tipo de negocio.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
              Explora ejemplos de páginas para distintos negocios locales. Cada demo muestra una experiencia visual, clara y conectada a WhatsApp.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={whatsappHref}>Solicitar una demo personalizada</ButtonLink>
              <ButtonLink href="#galeria" variant="secondary">Explorar galería</ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:gap-5">
            {heroDemos.map((demo, index) => (
              <ImagePanel key={demo.slug} image={demo.images?.hero} label={demo.niche} className={index === 1 ? "aspect-[3/4] sm:mt-10" : "aspect-[3/4]"} imageClassName="min-h-0" />
            ))}
          </div>
        </div>
      </section>
      <section className="container-page py-10">
        <div className="grid gap-5 border border-brand-border bg-white p-6 shadow-card lg:grid-cols-[1fr_auto] lg:items-center">
          <p className="text-sm leading-7 text-brand-muted">
            <span className="font-semibold text-brand-primary">Nota de galería:</span> las marcas, testimonios e imágenes son conceptuales. Antes de enviar una propuesta real, reemplaza fotos, servicios, ubicación, WhatsApp y reseñas con datos autorizados del prospecto.
          </p>
          <ButtonLink href={whatsappHref} variant="secondary">Solicitar diagnóstico</ButtonLink>
        </div>
      </section>
      <section id="galeria" className="container-page section-pad pt-8">
        <SectionHeader eyebrow="Sectores" title="Elige el sector más cercano a tu prospecto." description="Cada tarjeta abre una página pensada para verse como el sitio final del negocio, con servicios, ubicación, confianza y contacto claro." />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{landingConfigs.map((demo) => <DemoCard key={demo.slug} demo={demo} />)}</div>
      </section>
      <AgencyCTA primaryHref={whatsappHref} title="Convierte una demo en una propuesta real." description="Podemos adaptar el estilo, servicios, ubicación, fotografías y mensajes de contacto para presentar una página más cercana al negocio de tu prospecto." />
      <Footer />
    </main>
  );
}
