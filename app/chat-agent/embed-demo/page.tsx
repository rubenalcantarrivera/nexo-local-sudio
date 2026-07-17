import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeader } from "@/components/SectionHeader";
import { ChatWidget } from "@/components/chat-agent/ChatWidget";

export const metadata: Metadata = {
  title: "Widget embebido | Nexo Chat Agent",
  description: "Demo de cómo se ve el widget de Nexo Chat Agent embebido en una página."
};

export default function EmbedDemoPage() {
  return (
    <main className="min-h-screen bg-brand-background">
      <Header />
      <section className="container-page section-pad">
        <SectionHeader eyebrow="Embed demo" title="Así se vería integrado en una página de cliente." description="El widget flota sobre la experiencia y abre un panel de atención sin sacar al usuario del sitio." />
        <div className="mt-10 rounded-[2.5rem] border border-brand-border bg-white p-8 shadow-soft">
          <div className="grid min-h-[560px] gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <p className="eyebrow">Clínica Dental Nara</p>
              <h1 className="mt-5 max-w-2xl font-display text-5xl font-semibold leading-tight text-brand-primary">Atención dental clara, cercana y profesional.</h1>
              <p className="mt-5 max-w-xl text-brand-muted">El asistente puede resolver preguntas frecuentes y pasar al cliente a WhatsApp cuando quiera agendar.</p>
            </div>
            <ChatWidget businessSlug="dental" mode="embedded" initialOpen />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
