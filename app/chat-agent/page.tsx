import type { Metadata } from "next";
import { AgencyCTA } from "@/components/AgencyCTA";
import { ButtonLink } from "@/components/ButtonLink";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeader } from "@/components/SectionHeader";
import { ChatAgentFeatureGrid } from "@/components/chat-agent/ChatAgentFeatureGrid";
import { ChatAgentPricing } from "@/components/chat-agent/ChatAgentPricing";
import { ChatAgentProductHero } from "@/components/chat-agent/ChatAgentProductHero";
import { ChatAgentSafetySection } from "@/components/chat-agent/ChatAgentSafetySection";
import { ChatAgentUseCases } from "@/components/chat-agent/ChatAgentUseCases";
import { ChatWidget } from "@/components/chat-agent/ChatWidget";
import { agency } from "@/data/agency";
import { createWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Nexo Chat Agent | Asistente IA para negocios locales",
  description: "Asistente inteligente para páginas web de negocios locales: responde preguntas, explica servicios y guía hacia WhatsApp."
};

const faqs = [
  { question: "¿El asistente reemplaza a mi equipo?", answer: "No. Funciona como primera atención para resolver dudas comunes y pasar al cliente a WhatsApp cuando se necesita atención humana." },
  { question: "¿Puede agendar citas automáticamente?", answer: "En esta fase guía al cliente a WhatsApp con un mensaje prellenado. La confirmación final la hace el equipo." },
  { question: "¿Puede responder precios?", answer: "Puede explicar información configurada, pero no inventa precios ni disponibilidad. Si falta información, escala a WhatsApp." },
  { question: "¿Funciona con WhatsApp?", answer: "Sí. El objetivo es preparar al cliente y abrir una conversación por WhatsApp con contexto." },
  { question: "¿Funciona sin API key en demo?", answer: "Sí. Incluye modo demo con respuestas determinísticas para mostrar el producto sin credenciales." },
  { question: "¿Puede cometer errores?", answer: "Sí, como cualquier asistente inteligente. Por eso tiene reglas, disclaimers y escalamiento a humano." },
  { question: "¿Qué pasa si no sabe responder?", answer: "Debe decir que el equipo puede confirmarlo por WhatsApp, sin inventar." },
  { question: "¿Se puede adaptar a mi negocio?", answer: "Sí. Se configura con servicios, FAQs, tono, ubicación, disclaimers y objetivos de captación." }
];

export default function ChatAgentPage() {
  const whatsappHref = createWhatsAppLink(agency.phone, "Hola, quiero cotizar un asistente IA para mi negocio.");

  return (
    <main className="min-h-screen bg-brand-background">
      <Header ctaHref={whatsappHref} />
      <ChatAgentProductHero primaryHref={whatsappHref} />

      <section className="container-page section-pad">
        <SectionHeader eyebrow="Demo en vivo" title="Prueba el asistente como si estuviera en una página real." description="Haz preguntas sobre servicios, ubicación, precios o citas. Si no hay API key, responderá en modo demo seguro." />
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[2rem] border border-brand-border bg-white p-7 shadow-card">
            <h2 className="font-display text-3xl font-semibold text-brand-primary">Clínica Dental Nara</h2>
            <p className="mt-3 text-brand-muted">Asistente configurado para explicar tratamientos, cuidar claims médicos y llevar a WhatsApp cuando alguien quiere agendar.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Responde FAQs", "No inventa precios", "Pasa a WhatsApp"].map((item) => (
                <div key={item} className="rounded-2xl border border-brand-border bg-brand-softAccent/35 px-4 py-3 text-sm font-bold text-brand-primary">{item}</div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 text-sm text-brand-primary">
              {["¿Tienen blanqueamiento?", "¿Cuánto cuesta un implante?", "Me duele mucho una muela", "Quiero agendar"].map((item) => <span key={item} className="border-b border-brand-border pb-2">{item}</span>)}
            </div>
          </div>
          <div className="mx-auto w-full max-w-[430px]"><ChatWidget businessSlug="dental" mode="embedded" initialOpen /></div>
        </div>
      </section>

      <section className="bg-white section-pad">
        <div className="container-page">
          <SectionHeader eyebrow="Problema" title="Tus clientes preguntan lo mismo todos los días." description="El asistente atiende dudas repetidas y deja listo el siguiente paso hacia WhatsApp." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["¿Tienen citas?", "¿Cuánto cuesta?", "¿Dónde están?", "¿Qué servicios ofrecen?", "¿Aceptan tarjeta?", "¿Puedo reservar?", "¿Atienden urgencias?", "¿Qué necesito llevar?"].map((item) => (
              <div key={item} className="rounded-2xl border border-brand-border bg-brand-softAccent/35 p-5 font-display text-xl font-semibold text-brand-primary">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page section-pad">
        <SectionHeader eyebrow="Solución" title="El asistente responde, califica y pasa a WhatsApp." description="No reemplaza al negocio. Reduce fricción, ordena dudas y ayuda a que el equipo reciba conversaciones con más contexto." />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {["Responde FAQs", "Explica servicios", "Captura datos", "Resume y pasa a WhatsApp"].map((item, index) => (
            <div key={item} className="border-l-2 border-brand-accent bg-white p-6 shadow-card">
              <span className="font-display text-3xl font-semibold text-brand-accent">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-brand-primary">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="eyebrow">Cómo se vende</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-brand-primary">No es “un bot”. Es una recepción digital para convertir dudas en conversaciones.</h2>
            <p className="mt-5 text-brand-muted">La promesa es simple: menos preguntas repetidas, mejor contexto para el negocio y un camino más claro hacia WhatsApp.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["01", "Pregunta", "El cliente pregunta desde celular sin buscar formularios."],
              ["02", "Respuesta", "El asistente explica con límites y sin inventar."],
              ["03", "Handoff", "WhatsApp se abre con contexto para que el equipo confirme."]
            ].map(([step, title, text]) => (
              <article key={step} className="rounded-[1.5rem] border border-brand-border bg-white p-5 shadow-card">
                <p className="font-display text-3xl font-semibold text-brand-accent">{step}</p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-brand-primary">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-brand-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-pad">
        <div className="container-page">
          <SectionHeader eyebrow="Casos de uso" title="Configurado por tipo de negocio." description="Cada nicho requiere límites distintos: salud, legal, reservas, urgencias, disponibilidad y cotizaciones." />
          <div className="mt-10"><ChatAgentUseCases /></div>
          <div className="mt-8"><ButtonLink href="/chat-agent/demos" variant="secondary">Ver demos por nicho</ButtonLink></div>
        </div>
      </section>

      <section className="container-page section-pad">
        <SectionHeader eyebrow="Funciones" title="Todo lo necesario para una primera atención profesional." description="Un producto vendible como add-on para páginas web de negocios locales." />
        <div className="mt-10"><ChatAgentFeatureGrid /></div>
      </section>

      <section className="container-page section-pad">
        <ChatAgentSafetySection />
      </section>

      <section id="precios-chat" className="bg-white section-pad">
        <div className="container-page">
          <SectionHeader eyebrow="Precios" title="Planes para integrar Nexo Chat Agent." description="El asistente puede venderse como add-on a una página web o como mejora sobre una presencia existente." />
          <p className="mt-5 max-w-3xl text-sm text-brand-muted">Costos de API no incluidos si el volumen de uso crece significativamente.</p>
          <div className="mt-10"><ChatAgentPricing ctaHref={whatsappHref} /></div>
        </div>
      </section>

      <FAQ items={faqs} />
      <AgencyCTA title="Convierte tu página en una recepción digital." description="Podemos integrar un asistente que atiende dudas, prepara al cliente y lo guía a WhatsApp sin prometer de más." primaryHref={whatsappHref} secondaryHref="/chat-agent/demos" />
      <Footer />
    </main>
  );
}
