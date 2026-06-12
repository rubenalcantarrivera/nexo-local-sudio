import type { LandingConfig } from "./types";

const mapEmbed = (query: string) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

// Replace these stock/editorial local placeholders with real client photography before production.
const demoVisuals: Record<string, Pick<LandingConfig, "images" | "visual" | "disclaimer">> = {
  optica: {
    images: {
      hero: { src: "/images/demos/optica-hero.svg", alt: "Interior editorial de óptica boutique con armazones premium" },
      feature: { src: "/images/demos/optica-feature.svg", alt: "Detalle editorial de armazones y atención óptica" },
      gallery: [
        { src: "/images/demos/optica-gallery.svg", alt: "Ambiente luminoso de óptica premium" },
        { src: "/images/demos/optica-feature.svg", alt: "Selección de lentes y ajustes personalizados" }
      ]
    },
    visual: { mood: "Bright retail premium", heroLayout: "split" }
  },
  dental: {
    images: {
      hero: { src: "/images/demos/dental-hero.svg", alt: "Clínica dental premium con ambiente claro y profesional" },
      feature: { src: "/images/demos/dental-feature.svg", alt: "Detalle editorial de atención dental profesional" },
      gallery: [
        { src: "/images/demos/dental-gallery.svg", alt: "Ambiente clínico dental sobrio y confiable" },
        { src: "/images/demos/dental-feature.svg", alt: "Consulta dental en entorno premium" }
      ]
    },
    visual: { mood: "Calm clinical premium", heroLayout: "split" },
    disclaimer: "Cada tratamiento se recomienda después de una valoración profesional."
  },
  estetica: {
    images: {
      hero: { src: "/images/demos/estetica-hero.svg", alt: "Clínica estética con atmósfera champagne y tratamiento facial" },
      feature: { src: "/images/demos/estetica-feature.svg", alt: "Sala de valoración estética con estilo cálido y refinado" },
      gallery: [
        { src: "/images/demos/estetica-gallery.svg", alt: "Ambiente spa premium para tratamientos estéticos" },
        { src: "/images/demos/estetica-feature.svg", alt: "Detalle de skincare y cuidado facial" }
      ]
    },
    visual: { mood: "Spa-like luxury", heroLayout: "immersive" },
    disclaimer: "Los tratamientos se recomiendan después de una valoración. Los resultados pueden variar."
  },
  fisioterapia: {
    images: {
      hero: { src: "/images/demos/fisioterapia-hero.svg", alt: "Espacio de fisioterapia con enfoque en movimiento y rehabilitación" },
      feature: { src: "/images/demos/fisioterapia-feature.svg", alt: "Entorno de terapia funcional y valoración de movimiento" },
      gallery: [
        { src: "/images/demos/fisioterapia-gallery.svg", alt: "Ambiente de rehabilitación limpio y profesional" },
        { src: "/images/demos/fisioterapia-feature.svg", alt: "Detalle de terapia manual y seguimiento" }
      ]
    },
    visual: { mood: "Active calm rehab", heroLayout: "split" },
    disclaimer: "El plan de atención depende de la valoración funcional de cada paciente."
  },
  psicologia: {
    images: {
      hero: { src: "/images/demos/psicologia-hero.svg", alt: "Consultorio de psicología cálido, discreto y profesional" },
      feature: { src: "/images/demos/psicologia-feature.svg", alt: "Interior tranquilo para terapia individual" },
      gallery: [
        { src: "/images/demos/psicologia-gallery.svg", alt: "Ambiente sereno de consulta psicológica" },
        { src: "/images/demos/psicologia-feature.svg", alt: "Sala profesional para conversación terapéutica" }
      ]
    },
    visual: { mood: "Warm discreet therapy", heroLayout: "editorial" },
    disclaimer: "La atención psicológica no sustituye servicios de emergencia. En crisis, contacta servicios locales de emergencia."
  },
  nutricion: {
    images: {
      hero: { src: "/images/demos/nutricion-hero.svg", alt: "Mesa de nutrición con ingredientes naturales y consulta profesional" },
      feature: { src: "/images/demos/nutricion-feature.svg", alt: "Detalle de alimentos frescos y plan nutricional" },
      gallery: [
        { src: "/images/demos/nutricion-gallery.svg", alt: "Ambiente wellness orgánico y profesional" },
        { src: "/images/demos/nutricion-feature.svg", alt: "Consulta nutricional con enfoque práctico" }
      ]
    },
    visual: { mood: "Organic grounded wellness", heroLayout: "split" },
    disclaimer: "Los planes se adaptan a cada persona después de una valoración."
  },
  "abogado-migratorio": {
    images: {
      hero: { src: "/images/demos/abogado-migratorio-hero.svg", alt: "Despacho legal sobrio con documentos y mesa de consulta" },
      feature: { src: "/images/demos/abogado-migratorio-feature.svg", alt: "Detalle editorial de documentos legales y asesoría" },
      gallery: [
        { src: "/images/demos/abogado-migratorio-gallery.svg", alt: "Ambiente profesional de consultoría migratoria" },
        { src: "/images/demos/abogado-migratorio-feature.svg", alt: "Mesa de trabajo legal con documentos ordenados" }
      ]
    },
    visual: { mood: "Serious legal trust", heroLayout: "editorial" },
    disclaimer: "La información inicial no constituye asesoría legal definitiva. Cada caso requiere revisión documental."
  },
  arquitectura: {
    images: {
      hero: { src: "/images/demos/arquitectura-hero.svg", alt: "Interior arquitectónico moderno con composición editorial" },
      feature: { src: "/images/demos/arquitectura-feature.svg", alt: "Materiales, planos y detalles de diseño interior" },
      gallery: [
        { src: "/images/demos/arquitectura-gallery.svg", alt: "Ambiente residencial contemporáneo de alto diseño" },
        { src: "/images/demos/arquitectura-feature.svg", alt: "Moodboard arquitectónico con acabados premium" }
      ]
    },
    visual: { mood: "Editorial architecture", heroLayout: "editorial" }
  },
  restaurante: {
    images: {
      hero: { src: "/images/demos/restaurante-hero.svg", alt: "Restaurante boutique cálido con mesa servida y atmósfera íntima" },
      feature: { src: "/images/demos/restaurante-feature.svg", alt: "Detalle de plato de temporada y mesa elegante" },
      gallery: [
        { src: "/images/demos/restaurante-gallery.svg", alt: "Comedor de restaurante boutique con luz cálida" },
        { src: "/images/demos/restaurante-feature.svg", alt: "Mesa para cena especial y eventos privados" }
      ]
    },
    visual: { mood: "Warm atmospheric dining", heroLayout: "immersive" }
  },
  "academia-idiomas": {
    images: {
      hero: { src: "/images/demos/academia-idiomas-hero.svg", alt: "Academia de idiomas con materiales de estudio y clase profesional" },
      feature: { src: "/images/demos/academia-idiomas-feature.svg", alt: "Detalle de aprendizaje online y preparación de idioma" },
      gallery: [
        { src: "/images/demos/academia-idiomas-gallery.svg", alt: "Ambiente educativo moderno para clases de idiomas" },
        { src: "/images/demos/academia-idiomas-feature.svg", alt: "Mesa de estudio con cuadernos y sesión virtual" }
      ]
    },
    visual: { mood: "Clean modern education", heroLayout: "split" }
  },
  veterinaria: {
    images: {
      hero: { src: "/images/demos/veterinaria-hero.svg", alt: "Clínica veterinaria cálida con atención profesional para mascotas" },
      feature: { src: "/images/demos/veterinaria-feature.svg", alt: "Detalle de consulta veterinaria limpia y cercana" },
      gallery: [
        { src: "/images/demos/veterinaria-gallery.svg", alt: "Ambiente de cuidado veterinario calmado y profesional" },
        { src: "/images/demos/veterinaria-feature.svg", alt: "Atención preventiva para perros y gatos" }
      ]
    },
    visual: { mood: "Warm pet care", heroLayout: "split" },
    disclaimer: "El diagnóstico y tratamiento dependen de la valoración veterinaria."
  }
};

const process = (first: string): LandingConfig["process"] => [
  { step: "01", title: first, description: "El visitante entiende la oferta principal, la ubicación y la forma de contacto desde la primera pantalla." },
  { step: "02", title: "Revisa servicios", description: "La información está ordenada por servicios, beneficios y diferenciales con descripciones breves y accionables." },
  { step: "03", title: "Resuelve dudas", description: "Preguntas frecuentes, testimonios y detalles prácticos reducen fricción antes de escribir." },
  { step: "04", title: "Contacta por WhatsApp", description: "Los botones de contacto llevan a una conversación concreta con mensaje prellenado y contexto suficiente." }
];

const testimonial = (service: string): LandingConfig["testimonials"] => [
  { quote: "La información fue clara y pude decidir escribir por WhatsApp sin tener que llamar varias veces.", name: "Cliente verificado", detail: service },
  { quote: "La experiencia se sintió profesional desde el primer contacto y el proceso fue fácil de entender.", name: "Mariana G.", detail: "Atención local" },
  { quote: "Me ayudó ver servicios, ubicación y preguntas frecuentes antes de agendar.", name: "Rodrigo S.", detail: "Primera visita" }
];

const safeFaqs = (noun: string, booking = "cita"): LandingConfig["faqs"] => [
  { question: `¿Puedo agendar por WhatsApp?`, answer: `Sí. Puedes solicitar disponibilidad, compartir datos básicos y confirmar tu ${booking} por WhatsApp.` },
  { question: `¿La primera atención define todo el proceso?`, answer: `No necesariamente. La primera interacción ayuda a entender necesidades, resolver dudas y orientar siguientes pasos.` },
  { question: `¿Los precios se dan antes de la visita?`, answer: `Se pueden compartir rangos o servicios base. Algunos casos requieren valoración o revisión para cotizar con precisión.` },
  { question: `¿Prometen resultados garantizados?`, answer: `No se prometen resultados específicos. La información comunica servicios y facilita el contacto sin exagerar alcances.` }
];

const configs: LandingConfig[] = [
  {
    slug: "optica",
    niche: "Óptica premium",
    businessName: "Óptica Lumen",
    tagline: "Examen de la vista, armazones seleccionados y atención clara en Roma Norte.",
    location: "Roma Norte, CDMX",
    phone: "525545609027",
    whatsappMessage: "Hola, me interesa agendar una cita en Óptica Lumen. ¿Me pueden compartir horarios disponibles?",
    seo: { title: "Óptica Lumen | Óptica premium en Roma Norte", description: "Demo de landing para óptica premium con examen de la vista, lentes graduados, armazones seleccionados y contacto por WhatsApp.", keywords: ["óptica Roma Norte", "examen de la vista", "lentes graduados", "armazones premium"] },
    hero: { eyebrow: "Óptica premium en Roma Norte", headline: "Lentes graduados y armazones seleccionados con atención personalizada.", subheadline: "Agenda tu examen de la vista, elige armazones con asesoría profesional y recibe ajustes postventa en una ubicación céntrica.", primaryCta: "Agendar por WhatsApp", secondaryCta: "Ver servicios" },
    trust: ["Citas por WhatsApp", "Ubicación céntrica", "Ajustes postventa", "Armazones seleccionados"],
    services: [
      { title: "Examen de la vista", description: "Valoración visual clara para conocer tu graduación y elegir la solución óptica adecuada." },
      { title: "Lentes graduados", description: "Micas graduadas con opciones de antirreflejante, filtros y tratamientos según tus necesidades." },
      { title: "Armazones premium", description: "Selección de modelos sobrios, modernos y cómodos para uso diario o profesional." },
      { title: "Lentes de contacto", description: "Asesoría para elegir lentes de contacto según graduación, hábitos y comodidad." },
      { title: "Lentes solares", description: "Modelos solares con enfoque estético y protección visual para uso urbano." },
      { title: "Reparación y ajuste", description: "Ajustes de armazón, limpieza y revisión para prolongar la vida útil de tus lentes." }
    ],
    benefits: ["Atención personalizada", "Entrega rápida", "Armazones seleccionados", "Ubicación céntrica", "Ajustes postventa", "Citas por WhatsApp"].map((title) => ({ title, description: "Un beneficio explicado con lenguaje claro para ayudar al visitante a elegir y contactar con confianza." })),
    process: process("Agenda tu revisión visual"), testimonials: testimonial("Lentes graduados"), faqs: safeFaqs("óptica"),
    locationSection: { title: "Visítanos en Roma Norte", description: "Una ubicación práctica para revisar tu graduación, elegir armazones y resolver dudas con atención directa.", address: "Roma Norte, Cuauhtémoc, CDMX", mapEmbedUrl: mapEmbed("Roma Norte CDMX") },
    colors: { primary: "#183B56", accent: "#B88A44" }
  },
  {
    slug: "dental", niche: "Clínica dental", businessName: "Clínica Dental Nara", tagline: "Odontología clara, estética y preventiva en Polanco.", location: "Polanco, CDMX", phone: "525545609027", whatsappMessage: "Hola, me interesa agendar una valoración en Clínica Dental Nara.",
    seo: { title: "Clínica Dental Nara | Dentista en Polanco", description: "Demo de landing para clínica dental con limpieza, diseño de sonrisa, ortodoncia, implantes, blanqueamiento y urgencias.", keywords: ["dentista Polanco", "clínica dental CDMX", "diseño de sonrisa", "implantes"] },
    hero: { eyebrow: "Clínica dental en Polanco", headline: "Atención dental profesional para cuidar tu sonrisa con claridad y confianza.", subheadline: "Agenda limpieza, valoración estética, ortodoncia o urgencias dentales con un enfoque que explica cada paso antes de iniciar.", primaryCta: "Agendar valoración", secondaryCta: "Conocer tratamientos" },
    trust: ["Valoración inicial", "Atención por cita", "Ubicación en Polanco", "Planes claros"],
    services: ["Limpieza dental", "Diseño de sonrisa", "Ortodoncia", "Implantes", "Blanqueamiento", "Urgencias dentales"].map((title) => ({ title, description: `Servicio de ${title.toLowerCase()} presentado con explicación breve, alcance claro y orientación profesional.` })),
    benefits: ["Explicación sin presión", "Enfoque preventivo", "Agenda ordenada", "Experiencia premium", "Ubicación práctica", "Servicios integrales"].map((title) => ({ title, description: "La página comunica confianza, reduce dudas y facilita que el paciente solicite una valoración." })),
    process: process("Solicita una valoración"), testimonials: testimonial("Valoración dental"), faqs: safeFaqs("clínica dental"),
    locationSection: { title: "Atención dental en Polanco", description: "Agenda tu visita y confirma disponibilidad para valoración, limpieza o tratamiento dental.", address: "Polanco, Miguel Hidalgo, CDMX", mapEmbedUrl: mapEmbed("Polanco CDMX") }, colors: { primary: "#183B56", accent: "#9A7B4F" }
  },
  {
    slug: "estetica", niche: "Clínica estética", businessName: "Aura Estética", tagline: "Tratamientos faciales y corporales con valoración profesional en Santa Fe.", location: "Santa Fe, CDMX", phone: "525545609027", whatsappMessage: "Hola, quiero agendar una valoración en Aura Estética.",
    seo: { title: "Aura Estética | Clínica estética en Santa Fe", description: "Demo de landing para clínica estética con faciales, depilación láser, tratamientos corporales, rejuvenecimiento facial y valoración.", keywords: ["clínica estética Santa Fe", "faciales", "depilación láser", "tratamientos corporales"] },
    hero: { eyebrow: "Estética premium en Santa Fe", headline: "Tratamientos estéticos con valoración previa, criterio profesional y atención discreta.", subheadline: "Conoce opciones faciales y corporales diseñadas para acompañar objetivos realistas, con información clara antes de reservar.", primaryCta: "Agendar valoración", secondaryCta: "Ver tratamientos" },
    trust: ["Valoración previa", "Atención discreta", "Agenda por WhatsApp", "Enfoque realista"],
    services: ["Faciales", "Depilación láser", "Tratamientos corporales", "Rejuvenecimiento facial", "Valoración estética"].map((title) => ({ title, description: `${title} con orientación previa, cuidados explicados y expectativas realistas. Sin promesas médicas exageradas.` })),
    benefits: ["Sin promesas exageradas", "Experiencia sobria", "Contacto inmediato", "Servicios claros", "Ubicación en Santa Fe", "Seguimiento organizado"].map((title) => ({ title, description: "Comunicación premium, discreta y orientada a valoración antes de recomendar tratamientos." })),
    process: process("Agenda una valoración estética"), testimonials: testimonial("Valoración estética"), faqs: safeFaqs("clínica estética"),
    locationSection: { title: "Agenda en Santa Fe", description: "Reserva una valoración para revisar opciones faciales y corporales con atención discreta.", address: "Santa Fe, Álvaro Obregón, CDMX", mapEmbedUrl: mapEmbed("Santa Fe CDMX") }, colors: { primary: "#3B2F2F", accent: "#B88A76" }
  },
  {
    slug: "fisioterapia", niche: "Fisioterapia y rehabilitación", businessName: "Centro Kinesis", tagline: "Rehabilitación y terapia manual con valoración funcional en Del Valle.", location: "Del Valle, CDMX", phone: "525545609027", whatsappMessage: "Hola, quiero agendar una valoración en Centro Kinesis.",
    seo: { title: "Centro Kinesis | Fisioterapia en Del Valle", description: "Demo de landing para fisioterapia con rehabilitación, terapia manual, lesiones deportivas, dolor lumbar y valoración funcional.", keywords: ["fisioterapia Del Valle", "rehabilitación", "terapia manual", "lesiones deportivas"] },
    hero: { eyebrow: "Fisioterapia en Del Valle", headline: "Recupera movilidad con un plan de rehabilitación claro y seguimiento profesional.", subheadline: "Agenda una valoración funcional para identificar necesidades, ordenar prioridades y definir sesiones según tu caso.", primaryCta: "Agendar valoración", secondaryCta: "Ver áreas de atención" },
    trust: ["Valoración funcional", "Atención por cita", "Seguimiento claro", "Del Valle CDMX"],
    services: ["Rehabilitación", "Terapia manual", "Lesiones deportivas", "Dolor lumbar", "Valoración funcional"].map((title) => ({ title, description: `${title} con evaluación inicial, objetivos definidos y seguimiento responsable.` })),
    benefits: ["Plan por etapas", "Comunicación clara", "Citas por WhatsApp", "Enfoque funcional", "Atención local", "Seguimiento responsable"].map((title) => ({ title, description: "El usuario entiende cómo iniciar, qué llevar y qué esperar sin prometer curas absolutas." })),
    process: process("Agenda una valoración funcional"), testimonials: testimonial("Fisioterapia"), faqs: safeFaqs("fisioterapia"),
    locationSection: { title: "Centro de fisioterapia en Del Valle", description: "Agenda una valoración para revisar tu caso y definir una ruta de rehabilitación responsable.", address: "Del Valle, Benito Juárez, CDMX", mapEmbedUrl: mapEmbed("Colonia Del Valle CDMX") }, colors: { primary: "#183B56", accent: "#2F8F83" }
  },
  {
    slug: "psicologia", niche: "Psicología premium", businessName: "Espacio Clara", tagline: "Terapia individual y de pareja en un entorno profesional y discreto.", location: "Condesa, CDMX", phone: "525545609027", whatsappMessage: "Hola, me interesa agendar una primera sesión en Espacio Clara.",
    seo: { title: "Espacio Clara | Psicología en Condesa", description: "Demo de landing para psicología premium con terapia individual, terapia de pareja, ansiedad, estrés y acompañamiento emocional.", keywords: ["psicóloga Condesa", "terapia individual", "terapia de pareja", "acompañamiento emocional"] },
    hero: { eyebrow: "Psicología en Condesa", headline: "Un espacio profesional para hablar, ordenar y acompañar procesos personales.", subheadline: "Agenda una primera sesión para explorar lo que estás viviendo y conocer una ruta de trabajo terapéutico sin promesas simplistas.", primaryCta: "Agendar primera sesión", secondaryCta: "Ver enfoque" },
    trust: ["Atención discreta", "Sesiones por cita", "Enfoque profesional", "Condesa CDMX"],
    services: ["Terapia individual", "Terapia de pareja", "Ansiedad", "Estrés", "Acompañamiento emocional"].map((title) => ({ title, description: `${title} desde un enfoque de conversación profesional, cuidado del encuadre y expectativas realistas.` })),
    benefits: ["Comunicación sensible", "Agenda privada", "Expectativas realistas", "Señales de confianza", "Entorno premium", "Enfoque local"].map((title) => ({ title, description: "La página transmite calma, confidencialidad y claridad sin trivializar procesos personales." })),
    process: process("Solicita una primera sesión"), testimonials: testimonial("Terapia individual"), faqs: safeFaqs("psicología"),
    locationSection: { title: "Terapia en Condesa", description: "Agenda una primera sesión en un entorno discreto, claro y profesional.", address: "Condesa, Cuauhtémoc, CDMX", mapEmbedUrl: mapEmbed("Condesa CDMX") }, colors: { primary: "#2E3A35", accent: "#A98663" }
  },
  {
    slug: "nutricion", niche: "Nutrición y bienestar", businessName: "Método Raíz", tagline: "Nutrición práctica para hábitos sostenibles, rendimiento y seguimiento realista.", location: "Coyoacán, CDMX", phone: "525545609027", whatsappMessage: "Hola, quiero agendar una consulta nutricional en Método Raíz.",
    seo: { title: "Método Raíz | Nutrición en Coyoacán", description: "Demo de landing para nutrición con consulta, plan personalizado, nutrición deportiva, cambio de hábitos y seguimiento mensual.", keywords: ["nutriólogo Coyoacán", "consulta nutricional", "plan personalizado", "nutrición deportiva"] },
    hero: { eyebrow: "Nutrición en Coyoacán", headline: "Planes nutricionales prácticos para construir hábitos que sí puedas sostener.", subheadline: "Agenda una consulta para revisar tu rutina, objetivos y preferencias antes de diseñar un plan claro y adaptable.", primaryCta: "Agendar consulta", secondaryCta: "Ver servicios" },
    trust: ["Plan personalizado", "Seguimiento mensual", "Hábitos sostenibles", "Coyoacán CDMX"],
    services: ["Consulta nutricional", "Plan personalizado", "Nutrición deportiva", "Cambio de hábitos", "Seguimiento mensual"].map((title) => ({ title, description: `${title} con enfoque práctico, adaptación a rutina y seguimiento realista.` })),
    benefits: ["Sin dietas extremas", "Plan claro", "Contacto simple", "Enfoque personalizado", "Experiencia premium", "Seguimiento práctico"].map((title) => ({ title, description: "Comunicación centrada en hábitos sostenibles, no en promesas rápidas de transformación." })),
    process: process("Agenda tu consulta inicial"), testimonials: testimonial("Consulta nutricional"), faqs: safeFaqs("nutrición"),
    locationSection: { title: "Consulta nutricional en Coyoacán", description: "Agenda una consulta para construir un plan práctico, claro y compatible con tu rutina.", address: "Coyoacán, CDMX", mapEmbedUrl: mapEmbed("Coyoacán CDMX") }, colors: { primary: "#234236", accent: "#A77C44" }
  },
  {
    slug: "abogado-migratorio", niche: "Abogado migratorio", businessName: "Rivera Legal", tagline: "Asesoría migratoria clara para personas, familias y profesionales en México.", location: "CDMX", phone: "525545609027", whatsappMessage: "Hola, quiero agendar una consulta migratoria con Rivera Legal.",
    seo: { title: "Rivera Legal | Abogado migratorio en CDMX", description: "Demo de landing para abogado migratorio con visas, regularización, residencia, nacionalidad y consultoría legal.", keywords: ["abogado migratorio CDMX", "regularización migratoria", "residencia México", "consultoría legal"] },
    hero: { eyebrow: "Derecho migratorio en México", headline: "Asesoría migratoria clara para tomar decisiones legales con mejor información.", subheadline: "Agenda una consulta para revisar tu situación, requisitos y rutas posibles sin promesas de resultado ni atajos riesgosos.", primaryCta: "Agendar consulta legal", secondaryCta: "Ver servicios" },
    trust: ["Consulta por cita", "Revisión documental", "Comunicación clara", "Sin garantías falsas"],
    services: ["Visas", "Regularización migratoria", "Residencia", "Nacionalidad", "Consultoría legal"].map((title) => ({ title, description: `${title} con revisión de requisitos, documentos y pasos posibles conforme al caso.` })),
    benefits: ["Sin promesas legales falsas", "Revisión ordenada", "Lenguaje claro", "Contacto directo", "Confianza profesional", "Enfoque preventivo"].map((title) => ({ title, description: "La información evita garantizar aprobaciones y presenta alcances de forma sobria y responsable." })),
    process: process("Solicita una consulta legal"), testimonials: testimonial("Consulta migratoria"), faqs: safeFaqs("abogado migratorio", "consulta"),
    locationSection: { title: "Consulta migratoria en CDMX", description: "Agenda una consulta para revisar tu caso con claridad y conocer los siguientes pasos posibles.", address: "Ciudad de México", mapEmbedUrl: mapEmbed("Ciudad de México") }, colors: { primary: "#1F2933", accent: "#9C7A3A" }
  },
  {
    slug: "arquitectura", niche: "Arquitectura e interiorismo", businessName: "Estudio Umbral", tagline: "Diseño interior, remodelación y proyectos ejecutivos para espacios con intención.", location: "Lomas, CDMX", phone: "525545609027", whatsappMessage: "Hola, quiero conversar sobre un proyecto de diseño o remodelación con Estudio Umbral.",
    seo: { title: "Estudio Umbral | Arquitectura e interiorismo en Lomas", description: "Demo de landing para arquitectura con diseño interior, remodelación, proyecto ejecutivo, visualización 3D y supervisión de obra.", keywords: ["arquitectura Lomas", "interiorismo CDMX", "remodelación", "proyecto ejecutivo"] },
    hero: { eyebrow: "Arquitectura e interiorismo en Lomas", headline: "Espacios diseñados con criterio, proporción y una ejecución más ordenada.", subheadline: "Desde diseño interior hasta supervisión de obra, estructuramos proyectos residenciales y comerciales con una ruta clara.", primaryCta: "Cotizar proyecto", secondaryCta: "Ver servicios" },
    trust: ["Proyecto por etapas", "Visualización 3D", "Diseño interior", "Supervisión de obra"],
    services: ["Diseño interior", "Remodelación", "Proyecto ejecutivo", "Visualización 3D", "Supervisión de obra"].map((title) => ({ title, description: `${title} para ordenar concepto, alcance, materiales y decisiones de ejecución.` })),
    benefits: ["Proceso visible", "Portafolio editorial", "Cotización orientada", "Lenguaje premium", "Claridad de alcance", "Confianza técnica"].map((title) => ({ title, description: "El sitio presenta metodología y servicios con estética editorial para proyectos de alto valor." })),
    process: process("Comparte tu idea de proyecto"), testimonials: testimonial("Proyecto residencial"), faqs: safeFaqs("arquitectura", "reunión"),
    locationSection: { title: "Proyectos en Lomas y CDMX", description: "Comparte la idea de tu proyecto para revisar alcance, estilo y siguientes pasos.", address: "Lomas, CDMX", mapEmbedUrl: mapEmbed("Lomas de Chapultepec CDMX") }, colors: { primary: "#1F2933", accent: "#B88A44" }
  },
  {
    slug: "restaurante", niche: "Restaurante boutique", businessName: "Mesa Brava", tagline: "Cocina de temporada, reservas y cenas especiales en Roma Norte.", location: "Roma Norte, CDMX", phone: "525545609027", whatsappMessage: "Hola, quiero hacer una reserva en Mesa Brava.",
    seo: { title: "Mesa Brava | Restaurante boutique en Roma Norte", description: "Demo de landing para restaurante boutique con reservas, menú de temporada, eventos privados, cenas especiales y catering.", keywords: ["restaurante Roma Norte", "reservas restaurante", "menú de temporada", "eventos privados"] },
    hero: { eyebrow: "Restaurante boutique en Roma Norte", headline: "Cocina de temporada para reservas, cenas especiales y eventos privados.", subheadline: "Explora el concepto, revisa opciones de servicio y reserva por WhatsApp una mesa o una experiencia privada.", primaryCta: "Reservar por WhatsApp", secondaryCta: "Ver experiencia" },
    trust: ["Reservas por WhatsApp", "Menú de temporada", "Eventos privados", "Roma Norte"],
    services: ["Reservas", "Menú de temporada", "Eventos privados", "Cenas especiales", "Catering"].map((title) => ({ title, description: `${title} con comunicación clara para confirmar fecha, formato y disponibilidad.` })),
    benefits: ["Reserva simple", "Propuesta visible", "Sección de eventos", "Diseño editorial", "Ubicación local", "Menos fricción"].map((title) => ({ title, description: "La página convierte búsquedas o recomendaciones en reservas y solicitudes concretas." })),
    process: process("Elige fecha y experiencia"), testimonials: testimonial("Cena especial"), faqs: safeFaqs("restaurante", "reserva"),
    locationSection: { title: "Mesa Brava en Roma Norte", description: "Reserva una mesa o solicita información para cenas especiales y eventos privados.", address: "Roma Norte, Cuauhtémoc, CDMX", mapEmbedUrl: mapEmbed("Roma Norte CDMX restaurante") }, colors: { primary: "#2A241D", accent: "#B66B3A" }
  },
  {
    slug: "academia-idiomas", niche: "Academia de idiomas", businessName: "Aula Norte", tagline: "Clases de idiomas para profesionales, empresas y estudiantes con objetivos claros.", location: "Online/CDMX", phone: "525545609027", whatsappMessage: "Hola, quiero información sobre cursos de idiomas en Aula Norte.",
    seo: { title: "Aula Norte | Academia de idiomas Online/CDMX", description: "Demo de landing para academia de idiomas con inglés, francés, IELTS, clases empresariales y cursos personalizados.", keywords: ["academia de idiomas", "clases de inglés", "preparación IELTS", "clases empresariales"] },
    hero: { eyebrow: "Academia de idiomas Online/CDMX", headline: "Clases de idiomas diseñadas alrededor de objetivos reales, no temarios genéricos.", subheadline: "Aprende inglés o francés, prepara certificaciones y capacita equipos con rutas claras, horarios flexibles y seguimiento.", primaryCta: "Solicitar diagnóstico", secondaryCta: "Ver cursos" },
    trust: ["Clases online", "Preparación IELTS", "Empresas", "Cursos personalizados"],
    services: ["Inglés", "Francés", "Preparación IELTS", "Clases empresariales", "Cursos personalizados"].map((title) => ({ title, description: `${title} con ruta por nivel, objetivo y disponibilidad del estudiante o equipo.` })),
    benefits: ["Diagnóstico inicial", "Enfoque profesional", "Contacto rápido", "Cursos claros", "Modalidad flexible", "Seguimiento por objetivo"].map((title) => ({ title, description: "La información comunica formación seria y práctica sin estética escolar infantil." })),
    process: process("Solicita un diagnóstico de nivel"), testimonials: testimonial("Preparación IELTS"), faqs: safeFaqs("academia de idiomas", "diagnóstico"),
    locationSection: { title: "Clases online y atención en CDMX", description: "Solicita un diagnóstico para elegir la ruta de idioma más adecuada a tu objetivo.", address: "Online / Ciudad de México", mapEmbedUrl: mapEmbed("Ciudad de México") }, colors: { primary: "#183B56", accent: "#7D6AB5" }
  },
  {
    slug: "veterinaria", niche: "Veterinaria premium", businessName: "Vet Álamo", tagline: "Atención veterinaria, vacunación y cuidado preventivo para mascotas en Narvarte.", location: "Narvarte, CDMX", phone: "525545609027", whatsappMessage: "Hola, quiero agendar una cita para mi mascota en Vet Álamo.",
    seo: { title: "Vet Álamo | Veterinaria en Narvarte", description: "Demo de landing para veterinaria con consulta, vacunación, estética canina, urgencias y nutrición animal.", keywords: ["veterinaria Narvarte", "consulta veterinaria", "vacunación mascotas", "estética canina"] },
    hero: { eyebrow: "Veterinaria en Narvarte", headline: "Cuidado veterinario claro, preventivo y cercano para perros y gatos.", subheadline: "Agenda consulta, vacunación o estética canina por WhatsApp y recibe orientación inicial para preparar la visita.", primaryCta: "Agendar cita", secondaryCta: "Ver servicios" },
    trust: ["Citas por WhatsApp", "Cuidado preventivo", "Narvarte CDMX", "Perros y gatos"],
    services: ["Consulta veterinaria", "Vacunación", "Estética canina", "Urgencias", "Nutrición animal"].map((title) => ({ title, description: `${title} con orientación inicial, cuidado responsable y seguimiento cuando corresponda.` })),
    benefits: ["Orientación previa", "Cuidado responsable", "Servicios claros", "Agenda práctica", "Confianza local", "Experiencia cercana"].map((title) => ({ title, description: "La página ayuda a tutores a entender opciones y agendar sin prometer resultados médicos." })),
    process: process("Agenda la cita de tu mascota"), testimonials: testimonial("Consulta veterinaria"), faqs: safeFaqs("veterinaria"),
    locationSection: { title: "Veterinaria en Narvarte", description: "Agenda consulta, vacunación o estética para tu mascota con comunicación clara desde el primer mensaje.", address: "Narvarte, Benito Juárez, CDMX", mapEmbedUrl: mapEmbed("Narvarte CDMX") }, colors: { primary: "#25424A", accent: "#B88A44" }
  }
];

export const landingConfigs = configs.map((config) => ({ ...config, ...demoVisuals[config.slug] }));
export const landingConfigBySlug = new Map(landingConfigs.map((config) => [config.slug, config]));
export function getLandingConfig(slug: string) { return landingConfigBySlug.get(slug); }
