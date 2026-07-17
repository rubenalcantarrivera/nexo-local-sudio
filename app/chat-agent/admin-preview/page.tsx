import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeader } from "@/components/SectionHeader";
import { ChatAgentAdminPreview } from "@/components/chat-agent/ChatAgentAdminPreview";
import { chatAgentConfigs } from "@/data/chatAgentConfigs";

export const metadata: Metadata = {
  title: "Admin preview | Nexo Chat Agent",
  description: "Vista demo interna de configuración para Nexo Chat Agent."
};

export default function AdminPreviewPage() {
  return (
    <main className="min-h-screen bg-brand-background">
      <Header />
      <section className="container-page pt-14">
        <SectionHeader eyebrow="Vista interna" title="Configuración del asistente por negocio." description="Una vista simple para revisar servicios, FAQs, disclaimers y comportamiento del agente." />
      </section>
      <ChatAgentAdminPreview configs={chatAgentConfigs} />
      <Footer />
    </main>
  );
}
