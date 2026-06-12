import type { LandingConfig } from "@/data/types";
import { agency } from "@/data/agency";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { AuditBanner } from "./AuditBanner";
import { BenefitsGrid } from "./BenefitsGrid";
import { ContactForm } from "./ContactForm";
import { FAQ } from "./FAQ";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { LocationSection } from "./LocationSection";
import { ProcessSteps } from "./ProcessSteps";
import { ServicesGrid } from "./ServicesGrid";
import { Testimonials } from "./Testimonials";
import { TrustBar } from "./TrustBar";
import { WhatsAppStickyButton } from "./WhatsAppStickyButton";

export function LandingPage({ config }: { config: LandingConfig }) {
  const clientWhatsapp = createWhatsAppLink(config.phone, config.whatsappMessage);
  const agencyWhatsapp = createWhatsAppLink(agency.phone, `Hola, quiero adaptar el demo de ${config.businessName} para mi negocio.`);

  return (
    <main className="min-h-screen bg-brand-background">
      <Header brand={config.businessName} descriptor={`${config.niche} · ${config.location}`} navItems={[{ label: "Servicios", href: "#servicios" }, { label: "Proceso", href: "#proceso" }, { label: "Ubicación", href: "#ubicacion" }, { label: "FAQ", href: "#faq" }, { label: "Demos", href: "/demos" }]} ctaHref={clientWhatsapp} ctaLabel="WhatsApp" />
      <Hero config={config} whatsappHref={clientWhatsapp} />
      <TrustBar items={config.trust} />
      <AuditBanner whatsappHref={agencyWhatsapp} demoName={config.businessName} />
      <ServicesGrid items={config.services} />
      <BenefitsGrid items={config.benefits} />
      <ProcessSteps items={config.process} />
      <Testimonials items={config.testimonials} />
      <LocationSection title={config.locationSection.title} description={config.locationSection.description} address={config.locationSection.address} mapEmbedUrl={config.locationSection.mapEmbedUrl} whatsappHref={clientWhatsapp} />
      <FAQ items={config.faqs} />
      <ContactForm whatsappHref={clientWhatsapp} />
      <Footer />
      <WhatsAppStickyButton href={clientWhatsapp} label="Agendar por WhatsApp" />
    </main>
  );
}
