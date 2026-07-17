import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ChatAgentDemoFrame } from "@/components/chat-agent/ChatAgentDemoFrame";
import { getAllChatAgentSlugs, getChatAgentConfig } from "@/data/chatAgentConfigs";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllChatAgentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = getChatAgentConfig(slug);
  return {
    title: config ? `Demo asistente IA | ${config.businessName}` : "Demo asistente IA",
    description: config ? `Prueba el asistente IA configurado para ${config.niche}.` : "Demo de Nexo Chat Agent."
  };
}

export default async function ChatAgentDemoPage({ params }: Props) {
  const { slug } = await params;
  const config = getChatAgentConfig(slug);
  if (!config) notFound();

  return (
    <main className="min-h-screen bg-brand-background">
      <Header />
      <div className="border-b border-brand-border bg-white/80">
        <div className="container-page py-4 text-sm font-semibold text-brand-muted">Demo de asistente IA configurado por nicho</div>
      </div>
      <ChatAgentDemoFrame config={config} />
      <Footer />
    </main>
  );
}
