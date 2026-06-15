import type { Metadata } from "next";
import { AgencyCTA } from "@/components/AgencyCTA";
import { ButtonLink } from "@/components/ButtonLink";
import { ContactForm } from "@/components/ContactForm";
import { DemoCard } from "@/components/DemoCard";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ImagePanel } from "@/components/ImagePanel";
import { PricingCards } from "@/components/PricingCards";
import { ProcessSteps } from "@/components/ProcessSteps";
import { SectionHeader } from "@/components/SectionHeader";
import { agency, agencyFaqs, nichesServed, packages } from "@/data/agency";
import { landingConfigs } from "@/data/landingConfigs";
import { createWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Landing pages para negocios locales",
  description: "Nexo Local Studio crea landing pages rápidas, premium y conectadas a WhatsApp para negocios locales en México y LATAM.",
  keywords: ["landing pages para negocios locales", "páginas web para clínicas", "WhatsApp CTA", "SEO local básico", "Nexo Local Studio"]
};

const services = [
  { title: "Landing pages premium", description: "Diseño mobile-first, estructura clara y una narrativa comercial sobria para servicios locales." },
  { title: "Copy orientado a contacto", description: "Textos que explican servicios, reducen dudas y llevan al usuario hacia WhatsApp o formulario." },
  { title: "SEO local básico", description: "Metadata, jerarquía de contenido y señales locales iniciales sin prometer rankings." },
  { title: "WhatsApp y formularios", description: "Mensajes prellenados, CTAs visibles y formularios estáticos listos para conectar cuando sea necesario." },
  { title: "Google Maps", description: "Ubicación, zona de atención y mapa para convertir reputación local en confianza web." },
  { title: "Demos por nicho", description: "Estructuras reutilizables para ópticas, clínicas, despachos, restaurantes, academias y más." }
];

const process = [
  { step: "01", title: "Diagnóstico breve", description: "Revisamos negocio, servicios, ubicación, reseñas y objetivo principal de contacto." },
  { step: "02", title: "Estructura comercial", description: "Definimos secciones, mensajes, prueba social, FAQs y CTA principal." },
  { step: "03", title: "Diseño y copy", description: "Creamos una página sobria, mobile-first y alineada al nivel del negocio." },
  { step: "04", title: "Entrega funcional", description: "Publicamos o dejamos lista la página con WhatsApp, formulario, mapa y SEO básico." }
];

const flow = [
  { step: "01", title: "Búsqueda local" },
  { step: "02", title: "Página clara" },
  { step: "03", title: "WhatsApp" }
];

export default function HomePage() {
  const whatsappHref = createWhatsAppLink(agency.phone, agency.whatsappMessage);
  const featuredDemos = landingConfigs.slice(0, 6);

  return (
    <main className="min-h-screen bg-brand-background">
      <Header ctaHref={whatsappHref} />

      <section className="relative border-b border-brand-border bg-paper">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-line-grid opacity-25" />
        </div>
        <div className="container-page relative grid gap-10 py-12 sm:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-16">
          <div className="reveal-in">
            <p className="eyebrow">Estudio boutique para negocios locales</p>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.35rem,4.05vw,3.8rem)] font-semibold leading-[1.02] text-brand-primary">
              Landing pages que convierten búsquedas locales en mensajes, citas y cotizaciones.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-brand-muted sm:text-lg">
              Diseñamos páginas rápidas, claras y visualmente premium para negocios locales que necesitan verse mejor, generar confianza y facilitar el contacto desde móvil.
            </p>
            <p className="mt-5 max-w-xl border-l-2 border-brand-accent pl-4 text-sm font-semibold text-brand-primary">
              Para clínicas, ópticas, restaurantes, despachos y servicios premium.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={whatsappHref}>Solicitar diagnóstico</ButtonLink>
              <ButtonLink href="/demos" variant="secondary">Ver demos</ButtonLink>
            </div>
            <div className="mt-7 grid max-w-2xl gap-0 border-y border-brand-border bg-white/35 sm:grid-cols-3">
              {flow.map((item) => (
                <div key={item.step} className="flex items-center gap-3 border-b border-brand-border px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <span className="font-display text-2xl font-semibold text-brand-accent/80">{item.step}</span>
                  <span className="text-sm font-semibold text-brand-primary">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid gap-4 sm:grid-cols-[1.05fr_0.75fr]">
              <ImagePanel
                image={{ src: "/images/agency/local-business-consultation.jpg", alt: "Consultoría para negocio local premium" }}
                priority
                className="aspect-[4/3] rounded-[2rem] sm:aspect-[4/4] lg:aspect-[5/4]"
                imageClassName="min-h-0"
              />
              <div className="grid gap-4">
                <ImagePanel
                  image={{ src: "/images/agency/premium-interior.jpg", alt: "Interior premium representativo de servicios locales" }}
                  className="aspect-[4/3] rounded-[1.5rem]"
                  imageClassName="min-h-0"
                />
                <ImagePanel
                  image={{ src: "/images/agency/boutique-restaurant.jpg", alt: "Restaurante boutique con presencia local" }}
                  className="aspect-[4/3] rounded-[1.5rem]"
                  imageClassName="min-h-0"
                />
              </div>
            </div>
            <div className="relative z-10 mx-4 -mt-8 rounded-[1.5rem] border border-white/80 bg-white/95 p-5 shadow-soft backdrop-blur sm:mx-8 lg:mx-10">
              <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-accent">Ruta de contacto</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-brand-primary">Google Maps, servicios claros y WhatsApp en una sola experiencia.</h2>
                </div>
                <div className="rounded-2xl bg-[#102233] px-5 py-4 text-white">
                  <p className="text-sm font-semibold">Mensaje listo para enviar</p>
                  <p className="mt-1 text-xs text-white/60">Sin fricción desde móvil.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-border bg-white/100">
        <div className="container-page grid gap-0 text-sm font-semibold text-brand-primary sm:grid-cols-3 lg:grid-cols-6">
          {["Mobile-first", "WhatsApp directo", "SEO local básico", "Google Maps", "Copy comercial", "Entrega en 72 horas"].map((item) => (
            <div key={item} className="border-b border-r border-brand-border px-4 py-5 last:border-r-0 sm:border-b-0">{item}</div>
          ))}
        </div>
      </section>

      <section id="servicios" className="container-page section-pad">
        <SectionHeader eyebrow="Servicios" title="Un sistema visual y comercial para que el negocio se entienda rápido." description="No se trata de decorar una página. Se trata de ordenar reputación, servicios, ubicación y acción en una experiencia móvil clara." />
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <article className="editorial-frame lg:row-span-2">
            <ImagePanel image={{ src: "/images/agency/premium-interior.jpg", alt: "Interior premium que representa una presencia digital cuidada" }} className="h-full min-h-[520px] rounded-none border-0 shadow-none" imageClassName="min-h-0" />
            <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Presencia premium</p>
              <h3 className="mt-3 font-display text-4xl font-semibold">Diseño, mensaje y contacto en una sola página clara.</h3>
            </div>
          </article>
          {services.map((service) => (
            <article key={service.title} className="lift-card border border-brand-border bg-white p-6 shadow-card">
              <h3 className="font-display text-2xl font-semibold text-brand-primary">{service.title}</h3>
              <p className="mt-3 text-sm text-brand-muted">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dark-grain texture-overlay relative overflow-hidden section-pad text-white">
        <div className="container-page relative">
          <SectionHeader eyebrow="Antes / Después" title="De presencia dispersa a una página clara." description="Cuando el cliente local llega desde Google Maps, Instagram o una recomendación, necesita entender rápido qué haces, dónde estás y cómo contactar." className="text-white" />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              ["Antes", "Google Maps, Instagram, una web vieja o información incompleta."],
              ["Fricción", "El visitante duda, compara, se sale o no encuentra un botón claro."],
              ["Después", "Servicios, prueba social, ubicación y WhatsApp en una sola ruta."],
            ].map(([title, text]) => (
              <article key={title} className="border border-white/15 bg-white/10 p-7 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-softAccent">{title}</p>
                <p className="mt-5 font-display text-3xl font-semibold leading-tight text-white">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-pad">
        <div className="container-page">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader eyebrow="Demos" title="Galería de sitios por nicho." description="Explora ejemplos de páginas para distintos negocios locales. Cada demo muestra una experiencia visual clara, premium y conectada a WhatsApp." />
            <ButtonLink href="/demos" variant="secondary" className="shrink-0">Ver todos</ButtonLink>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{featuredDemos.map((demo) => <DemoCard key={demo.slug} demo={demo} />)}</div>
        </div>
      </section>

      <section id="paquetes" className="container-page section-pad">
        <SectionHeader eyebrow="Paquetes" title="Tres niveles para vender sin sobredimensionar el proyecto." description="Precios claros para negocios locales que necesitan una presencia digital más funcional." />
        <div className="mt-10"><PricingCards packages={packages} ctaHref={whatsappHref} /></div>
      </section>

      <section className="bg-white section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <ImagePanel image={{ src: "/images/agency/local-business-consultation.jpg", alt: "Reunión de estrategia para presencia digital de negocio local" }} className="h-[460px]" imageClassName="min-h-0" />
          <div>
            <SectionHeader eyebrow="Nichos" title="Hecho para negocios locales con reputación y capacidad de pago." description="Funciona especialmente bien cuando ya existen reseñas, ubicación o demanda, pero la presencia web no refleja ese nivel." />
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-brand-border bg-brand-border sm:grid-cols-3">
              {nichesServed.map((niche) => <div key={niche} className="bg-white px-4 py-4 text-sm font-semibold text-brand-primary">{niche}</div>)}
            </div>
          </div>
        </div>
      </section>

      <ProcessSteps items={process} />
      <FAQ items={agencyFaqs} />
      <AgencyCTA primaryHref={whatsappHref} />
      <ContactForm
        title="Solicita un diagnóstico breve"
        description={`Cuéntanos sobre tu negocio, ubicación y estado actual de tu web. También puedes escribir directamente a ${agency.email} o WhatsApp ${agency.phoneDisplay}.`}
        noteTitle="Contacto directo"
        note="Respuesta por WhatsApp o correo con una recomendación inicial y el paquete más adecuado."
        whatsappHref={whatsappHref}
      />
      <Footer />
    </main>
  );
}
