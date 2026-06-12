import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { getLandingConfig, landingConfigs } from "@/data/landingConfigs";

type DemoPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return landingConfigs.map((config) => ({ slug: config.slug }));
}

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getLandingConfig(slug);
  if (!config) return { title: "Demo no encontrado" };
  return {
    title: { absolute: config.seo.title },
    description: config.seo.description,
    keywords: config.seo.keywords,
    openGraph: { title: config.seo.title, description: config.seo.description, type: "website", locale: "es_MX" }
  };
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;
  const config = getLandingConfig(slug);
  if (!config) return notFound();
  return <LandingPage config={config} />;
}
