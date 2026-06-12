import type { Metadata } from "next";
import { AgencyCTA } from "@/components/AgencyCTA";
import { DemoCard } from "@/components/DemoCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
  return (
    <main className="min-h-screen bg-brand-background">
      <Header ctaHref={whatsappHref} />
      <section className="premium-gradient border-b border-brand-border py-16 sm:py-20"><div className="container-page"><SectionHeader eyebrow="Demos" title="Landing pages listas para adaptar por nicho." description="Explora estructuras premium para negocios locales. Cada demo usa datos de configuración, por lo que se puede personalizar rápido para un cliente real." /></div></section>
      <section className="container-page py-16 sm:py-20"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{landingConfigs.map((demo) => <DemoCard key={demo.slug} demo={demo} />)}</div></section>
      <AgencyCTA primaryHref={whatsappHref} title="Elige un demo y conviértelo en una propuesta real." description="Reemplaza negocio, servicios, ubicación, reseñas, teléfono y SEO. El sistema mantiene consistencia visual y estructura comercial." />
      <Footer />
    </main>
  );
}
