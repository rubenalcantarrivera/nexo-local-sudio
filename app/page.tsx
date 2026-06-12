import type { Metadata } from "next";
import Link from "next/link";
import { AgencyCTA } from "@/components/AgencyCTA";
import { ButtonLink } from "@/components/ButtonLink";
import { ContactForm } from "@/components/ContactForm";
import { DemoCard } from "@/components/DemoCard";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PricingCards } from "@/components/PricingCards";
import { ProcessSteps } from "@/components/ProcessSteps";
import { SectionHeader } from "@/components/SectionHeader";
import { ServicesGrid } from "@/components/ServicesGrid";
import { agency, agencyFaqs, nichesServed, packages } from "@/data/agency";
import { landingConfigs } from "@/data/landingConfigs";
import { createWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Landing pages para negocios locales",
  description: "Nexo Local Studio crea landing pages rápidas, premium y conectadas a WhatsApp para negocios locales en México y LATAM.",
  keywords: ["landing pages para negocios locales", "páginas web para clínicas", "WhatsApp CTA", "SEO local básico", "Nexo Local Studio"]
};

const services = [
  { title: "Landing pages mobile-first", description: "Páginas rápidas y claras para convertir tráfico local en conversaciones reales." },
  { title: "Copy orientado a contacto", description: "Textos que explican servicios, reducen dudas y llevan al usuario hacia WhatsApp o formulario." },
  { title: "SEO local básico", description: "Estructura inicial de títulos, descripciones y contenido para reforzar búsquedas locales." },
  { title: "WhatsApp y formularios", description: "Mensajes prellenados, CTAs visibles y formularios listos para conectar a herramientas externas." },
  { title: "Google Maps", description: "Sección de ubicación para que el visitante entienda zona de atención y llegue con menos fricción." },
  { title: "Demos por nicho", description: "Estructuras reutilizables para ópticas, clínicas, despachos, restaurantes, academias y más." }
];

const process = [
  { step: "01", title: "Diagnóstico breve", description: "Revisamos negocio, servicios, ubicación, reseñas y objetivo principal de contacto." },
  { step: "02", title: "Estructura comercial", description: "Definimos secciones, mensajes, prueba social, FAQs y CTA principal." },
  { step: "03", title: "Diseño y copy", description: "Creamos una página sobria, mobile-first y alineada al nivel del negocio." },
  { step: "04", title: "Entrega funcional", description: "Publicamos o dejamos lista la landing con WhatsApp, formulario, mapa y SEO básico." }
];

export default function HomePage() {
  const whatsappHref = createWhatsAppLink(agency.phone, agency.whatsappMessage);
  const featuredDemos = landingConfigs.slice(0, 6);

  return (
    <main className="min-h-screen bg-brand-background">
      <Header ctaHref={whatsappHref} />
      <section className="premium-gradient border-b border-brand-border">
        <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <p className="eyebrow">Nexo Local Studio</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold text-brand-primary sm:text-6xl lg:text-7xl">Landing pages que convierten búsquedas locales en clientes.</h1>
            <p className="mt-6 max-w-2xl text-lg text-brand-muted sm:text-xl">Creamos páginas rápidas, claras y conectadas a WhatsApp para negocios locales que quieren más citas, cotizaciones y reservas.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><ButtonLink href={whatsappHref}>Solicitar diagnóstico</ButtonLink><ButtonLink href="/demos" variant="secondary">Ver demos</ButtonLink></div>
            <div className="mt-10 grid gap-3 text-sm text-brand-muted sm:grid-cols-3"><div className="rounded-2xl border border-brand-border bg-white/70 p-4"><p className="font-semibold text-brand-primary">72 horas</p><p className="mt-1">Primera versión con materiales completos.</p></div><div className="rounded-2xl border border-brand-border bg-white/70 p-4"><p className="font-semibold text-brand-primary">WhatsApp-first</p><p className="mt-1">Diseñado para iniciar conversaciones.</p></div><div className="rounded-2xl border border-brand-border bg-white/70 p-4"><p className="font-semibold text-brand-primary">SEO local</p><p className="mt-1">Base técnica y contenido inicial.</p></div></div>
          </div>
          <div className="rounded-[2.25rem] border border-brand-border bg-white p-5 shadow-soft sm:p-6"><div className="rounded-[1.75rem] bg-brand-primary p-6 text-white"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-softAccent">Sistema reusable</p><h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Un motor de landing pages para múltiples nichos.</h2><p className="mt-4 text-sm text-white/70">Cambia el archivo de configuración, reemplaza textos, teléfono, mapa y SEO. El layout se mantiene consistente, premium y listo para presentar.</p><div className="mt-8 grid gap-3">{["/demos/optica", "/demos/dental", "/demos/abogado-migratorio"].map((href) => <Link key={href} href={href} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15">{href}</Link>)}</div></div></div>
        </div>
      </section>
      <ServicesGrid items={services} eyebrow="Servicios" title="Páginas sobrias, rápidas y orientadas a contacto." description="No hacemos una web genérica. Construimos una landing que explica el negocio, genera confianza y facilita que el cliente escriba o reserve." />
      <section id="paquetes" className="bg-white py-16 sm:py-20"><div className="container-page"><SectionHeader eyebrow="Paquetes" title="Tres niveles para vender sin sobredimensionar el proyecto." description="Precios claros para negocios locales que necesitan una presencia digital más funcional." /><div className="mt-10"><PricingCards packages={packages} ctaHref={whatsappHref} /></div></div></section>
      <section className="container-page py-16 sm:py-20"><SectionHeader eyebrow="Nichos" title="Diseñado para negocios locales con reputación y capacidad de pago." description="El sistema funciona especialmente bien cuando el negocio ya tiene clientes, reseñas, ubicación o demanda, pero su web no refleja ese nivel." /><div className="mt-10 flex flex-wrap gap-3">{nichesServed.map((niche) => <span key={niche} className="rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-medium text-brand-primary">{niche}</span>)}</div></section>
      <ProcessSteps items={process} />
      <section className="bg-white py-16 sm:py-20"><div className="container-page"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><SectionHeader eyebrow="Demos" title="Galería de landing pages por nicho." description="Cada demo está construido con el mismo motor reusable y contenido adaptado al mercado local." /><ButtonLink href="/demos" variant="secondary" className="shrink-0">Ver todos</ButtonLink></div><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{featuredDemos.map((demo) => <DemoCard key={demo.slug} demo={demo} />)}</div></div></section>
      <FAQ items={agencyFaqs} />
      <AgencyCTA primaryHref={whatsappHref} />
      <ContactForm title="Solicita un diagnóstico breve" description="Comparte el tipo de negocio, ubicación y estado actual de tu web. El formulario es visual; para producción se conecta a Formspree, CRM o correo." whatsappHref={whatsappHref} />
      <Footer />
    </main>
  );
}
