import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeader } from "@/components/SectionHeader";
import { chatAgentConfigs } from "@/data/chatAgentConfigs";

export const metadata: Metadata = {
  title: "Demos de asistentes IA por tipo de negocio",
  description: "Prueba demos de Nexo Chat Agent para negocios locales."
};

export default function ChatAgentDemosPage() {
  return (
    <main className="min-h-screen bg-brand-background">
      <Header />
      <section className="container-page section-pad">
        <SectionHeader eyebrow="Nexo Chat Agent" title="Demos de asistentes IA por tipo de negocio" description="Prueba cómo respondería un asistente configurado para distintos negocios locales." />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chatAgentConfigs.map((config) => (
            <Link key={config.slug} href={`/chat-agent/demos/${config.slug}`} className="lift-card block rounded-[2rem] border border-brand-border bg-white p-6 shadow-card">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">{config.niche}</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-brand-primary">{config.businessName}</h2>
              <p className="mt-3 text-sm leading-6 text-brand-muted">{config.leadGoals.primaryGoal}. Responde dudas y prepara el paso a WhatsApp.</p>
              <span className="mt-6 inline-flex rounded-full bg-[#0B1220] px-4 py-2 text-xs font-bold text-white">Probar demo →</span>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
