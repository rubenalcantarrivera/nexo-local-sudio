import type { LandingConfig } from "@/data/types";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { BenefitsGrid } from "./BenefitsGrid";
import { ClientFinalCTA } from "./ClientFinalCTA";
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

  return (
    <main id="top" className="min-h-screen bg-brand-background">
      <Header brand={config.businessName} descriptor={`${config.niche} · ${config.location}`} homeHref="#top" navItems={[{ label: "Servicios", href: "#servicios" }, { label: "Proceso", href: "#proceso" }, { label: "Ubicación", href: "#ubicacion" }, { label: "FAQ", href: "#faq" }]} ctaHref={clientWhatsapp} ctaLabel="WhatsApp" />
      <Hero config={config} whatsappHref={clientWhatsapp} />
      <TrustBar items={config.trust} />
      <ServicesGrid items={config.services} />
      <BenefitsGrid items={config.benefits} image={config.images?.feature} mood={config.visual?.mood} />
      <ProcessSteps items={config.process} />
      <Testimonials items={config.testimonials} />
      <LocationSection title={config.locationSection.title} description={config.locationSection.description} address={config.locationSection.address} mapEmbedUrl={config.locationSection.mapEmbedUrl} whatsappHref={clientWhatsapp} />
      <FAQ items={config.faqs} />
      <ContactForm title={`Contacta a ${config.businessName}`} whatsappHref={clientWhatsapp} />
      <ClientFinalCTA config={config} whatsappHref={clientWhatsapp} />
      <Footer businessName={config.businessName} tagline={config.tagline} location={config.location} />
      <WhatsAppStickyButton href={clientWhatsapp} label="Agendar por WhatsApp" />
    </main>
  );
}
