import type { Package } from "./types";

export const agency = {
  name: "Nexo Local Studio",
  shortName: "Nexo Local",
  tagline: "Convertimos búsquedas locales en mensajes, citas y cotizaciones.",
  descriptor: "Landing pages y sistemas de captación por WhatsApp para negocios locales.",
  phone: "525545609027",
  phoneDisplay: "55 4560 9027",
  whatsappMessage: "Hola, quiero solicitar un diagnóstico para una landing page de mi negocio.",
  email: "nexo.local.studio@gmail.com",
  location: "México / LATAM"
};

export const packages: Package[] = [
  {
    name: "Landing Express",
    price: "$6,900 MXN",
    description: "Una landing rápida, clara y lista para contacto sin un proceso largo.",
    includes: ["1 página de aterrizaje", "Diseño mobile-first", "CTA a WhatsApp", "SEO básico", "Formulario de contacto", "Entrega en 72 horas"]
  },
  {
    name: "Growth Local",
    price: "$9,900 MXN",
    description: "La opción recomendada para negocios con reseñas, tráfico local y necesidad de mejor conversión.",
    includes: ["Todo lo de Express", "Copy de conversión mejorado", "Sección Google Maps", "FAQ", "Reseñas o testimonios", "Placeholder de analítica básica", "1 semana de soporte"],
    highlighted: true
  },
  {
    name: "Pro Local",
    price: "$14,900 MXN",
    description: "Una landing premium multi-sección para negocios locales de ticket medio alto.",
    includes: ["Landing premium multi-sección", "Copy avanzado", "Lead form", "CTA WhatsApp", "Guía de SEO local", "2 rondas de revisión", "2 semanas de soporte"]
  }
];

export const nichesServed = [
  "Ópticas", "Clínicas dentales", "Clínicas estéticas", "Fisioterapeutas", "Psicólogos premium", "Nutriólogos", "Despachos legales", "Arquitectos e interioristas", "Restaurantes boutique", "Academias privadas", "Veterinarias"
];

export const agencyFaqs = [
  { question: "¿La entrega de 72 horas siempre aplica?", answer: "Aplica cuando el anticipo está confirmado y los materiales mínimos están completos. Si faltan materiales, el plazo se recorre proporcionalmente." },
  { question: "¿Garantizan ventas o leads?", answer: "No garantizamos ventas, leads ni posiciones específicas en Google. Sí garantizamos una landing funcional, responsive y conectada a los canales acordados." },
  { question: "¿Pueden adaptar un demo a mi negocio?", answer: "Sí. Los demos están construidos desde configuración, así que se pueden adaptar textos, servicios, teléfono, SEO y ubicación con rapidez." },
  { question: "¿Incluye hosting y dominio?", answer: "No por defecto. Podemos orientar la publicación en Vercel y la conexión de dominio, o cotizar la configuración técnica si se requiere." }
];
