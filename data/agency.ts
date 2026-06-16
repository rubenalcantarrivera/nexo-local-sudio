import type { Package } from "./types";

export const agency = {
  name: "Nexo Local Studio",
  shortName: "Nexo Local",
  tagline: "Convertimos búsquedas locales en mensajes, citas y cotizaciones.",
  descriptor: "Páginas web profesionales para negocios locales.",
  phone: "525545609027",
  phoneDisplay: "55 4560 9027",
  whatsappMessage: "Hola, quiero cotizar una página web para mi negocio.",
  email: "nexo.local.studio@gmail.com",
  location: "México / LATAM"
};

export const packages: Package[] = [
  {
    name: "Página Local Inicial",
    price: "$2,500 MXN",
    description: "Para negocios que necesitan una página sencilla, clara y profesional para mostrar servicios, ubicación y recibir mensajes por WhatsApp.",
    includes: ["Página web de una sola página", "Diseño adaptable a celular", "Sección de servicios", "Botón directo a WhatsApp", "Ubicación / Google Maps", "Datos de contacto", "Texto básico a partir de la información del cliente", "1 ronda de ajustes", "Entrega en 72 horas desde materiales completos"],
    notIncluded: ["Logo", "Fotografía profesional", "SEO avanzado", "Publicidad", "Dominio/hosting", "Automatizaciones", "Sistema de reservas", "Varias páginas internas"],
    cta: "Cotizar Inicial"
  },
  {
    name: "Página Local Plus",
    price: "$4,500 MXN",
    description: "Para negocios que quieren una página más completa, con mejor presentación, confianza y contacto directo por WhatsApp.",
    includes: ["Todo lo de Inicial", "Diseño visual más cuidado", "Mejor estructura comercial", "Sección de beneficios", "Sección de reseñas/testimonios", "Preguntas frecuentes", "Formulario de contacto", "Google Maps", "SEO local básico", "Mensaje de WhatsApp prellenado", "2 rondas de ajustes", "Entrega en 72 horas desde materiales completos"],
    notIncluded: ["Campañas publicitarias", "SEO mensual", "Branding completo", "Fotografía profesional", "Integraciones complejas", "CRM", "E-commerce"],
    cta: "Cotizar Plus",
    highlighted: true
  },
  {
    name: "Página Local Premium",
    price: "$6,500 MXN",
    description: "Para negocios que quieren una página más cuidada visualmente y una presentación más profesional desde celular.",
    includes: ["Todo lo de Plus", "Dirección visual más personalizada", "Copy más trabajado", "Secciones más completas", "Galería o bloque visual", "Sección de proceso o metodología", "Mayor cuidado en diseño móvil", "Optimización básica de velocidad", "SEO local básico más completo", "3 rondas de ajustes", "Soporte ligero por 7 días después de entrega"],
    notIncluded: ["Publicidad pagada", "SEO mensual", "Branding completo", "Fotografía profesional", "Video", "Sistema personalizado", "E-commerce", "Mantenimiento mensual"],
    cta: "Cotizar Premium"
  }
];

export const nichesServed = [
  "Ópticas", "Clínicas dentales", "Clínicas estéticas", "Fisioterapeutas", "Psicólogos premium", "Nutriólogos", "Despachos legales", "Arquitectos e interioristas", "Restaurantes boutique", "Academias privadas", "Veterinarias"
];

export const agencyFaqs = [
  { question: "¿La entrega de 72 horas siempre aplica?", answer: "Aplica cuando el anticipo está confirmado y los materiales mínimos están completos. Si faltan materiales, el plazo se recorre proporcionalmente." },
  { question: "¿Garantizan ventas o leads?", answer: "No garantizamos ventas, leads ni posiciones específicas en Google. Sí entregamos una página funcional, responsive y conectada a WhatsApp según el alcance acordado." },
  { question: "¿Pueden adaptar un ejemplo a mi negocio?", answer: "Sí. Podemos adaptar textos, servicios, teléfono, SEO, ubicación e imágenes para que la página se entienda mejor para tu tipo de negocio." },
  { question: "¿Incluye hosting y dominio?", answer: "No por defecto. Podemos orientar la publicación en Vercel y la conexión de dominio, o cotizar la configuración técnica si se requiere." }
];
