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
  title: "Páginas web para negocios locales",
  description: "Nexo Local Studio crea páginas web rápidas, profesionales y conectadas a WhatsApp para negocios locales en México.",
  keywords: ["páginas web para negocios locales", "páginas web para clínicas", "WhatsApp", "SEO local básico", "Nexo Local Studio"]
};

const services = [
  { title: "Páginas web profesionales", description: "Diseño adaptable a celular, estructura clara y una presentación sobria para servicios locales." },
  { title: "Copy orientado a contacto", description: "Textos que explican servicios, reducen dudas y llevan al usuario hacia WhatsApp o formulario." },
  { title: "SEO local básico", description: "Metadata, jerarquía de contenido y señales locales iniciales sin prometer rankings." },
  { title: "WhatsApp y formularios", description: "Mensajes prellenados, CTAs visibles y formularios estáticos listos para conectar cuando sea necesario." },
  { title: "Google Maps", description: "Ubicación, zona de atención y mapa para convertir reputación local en confianza web." },
  { title: "Ejemplos por nicho", description: "Páginas de ejemplo para ópticas, clínicas, despachos, restaurantes, academias y más." }
];

const process = [
  { step: "01", title: "Revisión breve", description: "Revisamos negocio, servicios, ubicación, reseñas y objetivo principal de contacto." },
  { step: "02", title: "Estructura comercial", description: "Definimos secciones, mensajes, prueba social, preguntas frecuentes y botón principal de contacto." },
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
              Creamos la web que tu negocio necesita. Conectamos los clientes que buscas.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-brand-muted sm:text-lg">
              Creamos páginas rápidas, claras y profesionales para que tus clientes vean tus servicios, ubicación, reseñas y te contacten desde el celular.
            </p>
            <p className="mt-5 max-w-xl border-l-2 border-brand-accent pl-4 text-sm font-semibold text-brand-primary">
              Entrega en 72 horas desde materiales completos. Precios de lanzamiento desde $2,500 MXN.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={whatsappHref}>Cotizar mi página</ButtonLink>
              <ButtonLink href="/demos" variant="secondary">Ver ejemplos</ButtonLink>
            </div>
            <p className="mt-5 max-w-xl text-sm font-semibold text-brand-primary">
              Para clínicas, ópticas, restaurantes, despachos y servicios profesionales.
            </p>
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
                <div className="rounded-2xl bg-[#0B1220] px-5 py-4 text-white shadow-card">
                  <p className="text-sm font-semibold">Mensaje listo para enviar</p>
                  <p className="mt-1 text-xs text-white/84">Sin fricción desde móvil.</p>
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
        <SectionHeader eyebrow="Servicios" title="Una página clara para que tu negocio se entienda rápido." description="No se trata de hacer una web complicada. Se trata de ordenar servicios, ubicación, reseñas y contacto en una experiencia móvil clara." />
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <article className="editorial-frame lg:row-span-2">
            <ImagePanel image={{ src: "/images/agency/premium-interior.jpg", alt: "Interior premium que representa una presencia digital cuidada" }} className="h-full min-h-[520px] rounded-none border-0 shadow-none" imageClassName="min-h-0" />
            <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(180deg,rgba(11,18,32,0),rgba(11,18,32,.88)_34%,rgba(11,18,32,.96))] p-7 pt-24 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/88">Presencia premium</p>
              <h3 className="mt-3 max-w-md font-display text-4xl font-semibold leading-tight text-white drop-shadow-sm">Servicios, ubicación y WhatsApp en una página profesional.</h3>
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
              <article key={title} className="border border-white/20 bg-white/[0.14] p-7 backdrop-blur">
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
            <SectionHeader eyebrow="Ejemplos" title="Ejemplos de páginas web por nicho." description="Explora ejemplos de páginas para distintos negocios locales. Cada ejemplo muestra una experiencia visual clara, profesional y conectada a WhatsApp." />
            <ButtonLink href="/demos" variant="secondary" className="shrink-0">Ver ejemplos</ButtonLink>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{featuredDemos.map((demo) => <DemoCard key={demo.slug} demo={demo} />)}</div>
        </div>
      </section>

      <section id="paquetes" className="container-page section-pad">
        <SectionHeader eyebrow="Precios de lanzamiento" title="Tres opciones para empezar con una página profesional." description="Precios claros para negocios locales que necesitan mostrar mejor sus servicios, ubicación y formas de contacto." />
        <p className="mt-6 max-w-3xl border-l-2 border-brand-accent bg-white/70 p-4 text-sm leading-7 text-brand-muted">
          Precios de lanzamiento para los primeros proyectos de Nexo Local Studio. El precio final puede variar según alcance, materiales e integraciones requeridas.
        </p>
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
        title="Cotiza tu página web"
        description={`Cuéntanos sobre tu negocio, ubicación y lo que necesitas mostrar. También puedes escribir directamente a ${agency.email} o WhatsApp ${agency.phoneDisplay}.`}
        noteTitle="Contacto directo"
        note="Respuesta por WhatsApp o correo con una recomendación inicial y la opción más adecuada."
        whatsappHref={whatsappHref}
      />
      <Footer />
    </main>
  );
}
