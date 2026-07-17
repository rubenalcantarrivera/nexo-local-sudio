import type { ChatAgentConfig } from "./chatAgentTypes";

const defaultPhone = "525545609027";

type RawChatAgentConfig = Omit<ChatAgentConfig, "visual"> & Partial<Pick<ChatAgentConfig, "visual">>;

const rawChatAgentConfigs: RawChatAgentConfig[] = [
  {
    slug: "dental",
    businessName: "Clínica Dental Nara",
    niche: "Clínica dental",
    tone: "calmo, clínico, claro y cercano",
    location: "Polanco, CDMX",
    phone: defaultPhone,
    whatsappMessageBase: "Hola, quiero agendar una valoración dental.",
    services: [
      { title: "Valoración dental", description: "Revisión inicial para entender el caso y recomendar el tratamiento adecuado.", commonQuestions: ["¿La valoración tiene costo?", "¿Cuánto dura?", "¿Puedo ir con dolor?"] },
      { title: "Blanqueamiento", description: "Tratamiento estético indicado después de revisar sensibilidad, esmalte y salud oral.", commonQuestions: ["¿Cuántas sesiones son?", "¿Duele?", "¿Cuánto dura el resultado?"] },
      { title: "Implantes y coronas", description: "Planeación restaurativa con evaluación profesional y revisión de estudios.", commonQuestions: ["¿Cuánto cuesta un implante?", "¿Necesito radiografía?", "¿Cuánto tarda?"] }
    ],
    faqs: [
      { question: "¿Atienden urgencias?", answer: "Podemos orientar por WhatsApp y confirmar disponibilidad. Si hay dolor intenso, inflamación o sangrado, conviene contactar de inmediato a la clínica o a servicios de urgencia." },
      { question: "¿Aceptan tarjeta?", answer: "Sí, aceptamos tarjeta y transferencia. El equipo puede confirmar opciones de pago por WhatsApp." },
      { question: "¿Dan precios por chat?", answer: "Podemos explicar rangos generales, pero cada tratamiento se define después de una valoración profesional." }
    ],
    businessInfo: { hours: "Lunes a viernes 9:00 a 19:00, sábado 9:00 a 14:00", address: "Polanco, Ciudad de México", parking: "Estacionamientos cercanos en la zona", paymentMethods: ["Tarjeta", "Transferencia", "Efectivo"], appointmentRequired: true, emergencyPolicy: "En dolor intenso o urgencias, contactar directamente por WhatsApp o acudir a servicios de urgencia." },
    leadGoals: { primaryGoal: "agendar valoración dental", secondaryGoal: "resolver dudas sobre servicios y ubicación", requiredFields: ["name", "phone", "serviceInterest"] },
    suggestedReplies: ["Quiero una valoración", "¿Tienen blanqueamiento?", "Ver ubicación"],
    disclaimers: ["Cada tratamiento se recomienda después de una valoración profesional."],
    forbiddenClaims: ["No diagnosticar", "No prometer tratamientos sin dolor", "No inventar precios", "No garantizar resultados"],
    escalationRules: ["dolor intenso", "sangrado", "inflamación", "casos complejos", "precios definitivos"]
  },
  {
    slug: "estetica",
    businessName: "Aura Estética",
    niche: "Clínica estética",
    tone: "refinado, discreto y orientado a valoración",
    location: "Roma Norte, CDMX",
    phone: defaultPhone,
    whatsappMessageBase: "Hola, quiero agendar una valoración estética.",
    services: [
      { title: "Valoración facial", description: "Evaluación inicial para recomendar opciones según objetivos y condición de piel.", commonQuestions: ["¿Qué tratamiento necesito?", "¿Cuánto tarda?", "¿Hay recuperación?"] },
      { title: "Cuidado de piel", description: "Protocolos de limpieza, hidratación y textura con seguimiento profesional.", commonQuestions: ["¿Sirve para manchas?", "¿Cuántas sesiones?", "¿Puedo hacerlo antes de un evento?"] },
      { title: "Tratamientos corporales", description: "Opciones no invasivas sujetas a valoración previa.", commonQuestions: ["¿Los resultados son permanentes?", "¿Duele?", "¿Cuánto cuesta?"] }
    ],
    faqs: [
      { question: "¿Pueden decirme qué tratamiento necesito?", answer: "Podemos orientar, pero la recomendación se confirma en valoración." },
      { question: "¿Los resultados son garantizados?", answer: "No. Los resultados pueden variar según cada persona y tratamiento." },
      { question: "¿Atienden con cita?", answer: "Sí, trabajamos con cita para cuidar tiempos y atención." }
    ],
    businessInfo: { hours: "Lunes a sábado 10:00 a 19:00", address: "Roma Norte, Ciudad de México", paymentMethods: ["Tarjeta", "Transferencia"], appointmentRequired: true },
    leadGoals: { primaryGoal: "agendar valoración estética", secondaryGoal: "identificar tratamiento de interés", requiredFields: ["name", "phone", "serviceInterest"] },
    suggestedReplies: ["Quiero una valoración", "Tratamientos faciales", "Preguntar disponibilidad"],
    disclaimers: ["Los tratamientos se recomiendan después de una valoración. Los resultados pueden variar."],
    forbiddenClaims: ["No prometer resultados", "No diagnosticar", "No inventar precios", "No hacer indicaciones médicas definitivas"],
    escalationRules: ["reacciones adversas", "embarazo", "condiciones médicas", "precios definitivos"]
  },
  {
    slug: "fisioterapia",
    businessName: "Centro Kinesis",
    niche: "Fisioterapia",
    tone: "profesional, funcional y tranquilizador",
    location: "Juriquilla, Querétaro",
    phone: defaultPhone,
    whatsappMessageBase: "Hola, quiero información para una valoración de fisioterapia.",
    services: [
      { title: "Valoración funcional", description: "Evaluación de movilidad, dolor y objetivo de recuperación.", commonQuestions: ["¿Necesito cita?", "¿Cuánto dura?", "¿Qué debo llevar?"] },
      { title: "Rehabilitación deportiva", description: "Planes de recuperación y readaptación según valoración.", commonQuestions: ["¿Cuándo puedo volver a entrenar?", "¿Atienden lesiones deportivas?", "¿Cuántas sesiones necesito?"] },
      { title: "Terapia manual y ejercicio", description: "Intervenciones guiadas para mejorar función y movimiento.", commonQuestions: ["¿Quita el dolor?", "¿Es doloroso?", "¿Atienden adultos mayores?"] }
    ],
    faqs: [
      { question: "¿Cuántas sesiones necesito?", answer: "Depende de la valoración funcional y evolución de cada paciente." },
      { question: "¿Atienden dolor agudo?", answer: "Podemos orientar y confirmar disponibilidad. Si el dolor es severo o hay síntomas de alarma, busca atención médica." },
      { question: "¿Aceptan seguro?", answer: "El equipo puede confirmar opciones de facturación y reembolso por WhatsApp." }
    ],
    businessInfo: { hours: "Lunes a viernes 8:00 a 20:00, sábado 9:00 a 14:00", address: "Juriquilla, Querétaro", parking: "Estacionamiento disponible", appointmentRequired: true },
    leadGoals: { primaryGoal: "agendar valoración funcional", secondaryGoal: "entender lesión o molestia", requiredFields: ["name", "phone", "serviceInterest"] },
    suggestedReplies: ["Quiero una valoración", "Tengo dolor", "Ver horarios"],
    disclaimers: ["El plan de atención depende de la valoración funcional de cada paciente."],
    forbiddenClaims: ["No prometer eliminar dolor", "No diagnosticar", "No sustituir atención médica", "No inventar número de sesiones"],
    escalationRules: ["dolor severo", "accidente reciente", "pérdida de sensibilidad", "síntomas neurológicos"]
  },
  {
    slug: "restaurante",
    businessName: "Mesa Brava",
    niche: "Restaurante boutique",
    tone: "hospitalario, cálido y ágil",
    location: "San Pedro Garza García, Nuevo León",
    phone: defaultPhone,
    whatsappMessageBase: "Hola, quiero hacer una reserva.",
    services: [
      { title: "Reservas", description: "Confirmación de disponibilidad para comida, cena o grupos pequeños.", commonQuestions: ["¿Hay mesa hoy?", "¿Puedo reservar terraza?", "¿Aceptan grupos?"] },
      { title: "Eventos privados", description: "Cotización para reuniones, celebraciones y cenas especiales.", commonQuestions: ["¿Tienen menú para grupos?", "¿Cuántas personas caben?", "¿Piden anticipo?"] },
      { title: "Menú de temporada", description: "Propuesta gastronómica con platos y bebidas de temporada.", commonQuestions: ["¿Tienen opciones vegetarianas?", "¿Aceptan niños?", "¿Tienen descorche?"] }
    ],
    faqs: [
      { question: "¿Puedo reservar por WhatsApp?", answer: "Sí, te podemos pasar a WhatsApp para confirmar disponibilidad." },
      { question: "¿Garantizan mesa?", answer: "La disponibilidad se confirma directamente con el restaurante." },
      { question: "¿Hacen eventos?", answer: "Sí, el equipo puede revisar fecha, número de personas y tipo de evento." }
    ],
    businessInfo: { hours: "Martes a sábado 13:00 a 23:00, domingo 13:00 a 18:00", address: "San Pedro Garza García, Nuevo León", parking: "Valet sujeto a disponibilidad", paymentMethods: ["Tarjeta", "Efectivo"], appointmentRequired: false },
    leadGoals: { primaryGoal: "confirmar reserva por WhatsApp", secondaryGoal: "identificar fecha y número de personas", requiredFields: ["name", "phone", "serviceInterest"] },
    suggestedReplies: ["Reservar hoy", "Evento privado", "Ver ubicación"],
    disclaimers: ["La disponibilidad de mesa se confirma directamente por WhatsApp."],
    forbiddenClaims: ["No garantizar disponibilidad", "No inventar menú", "No inventar precios de eventos"],
    escalationRules: ["reservas para hoy", "eventos grandes", "alergias", "precios de grupo"]
  },
  {
    slug: "veterinaria",
    businessName: "Vet Álamo",
    niche: "Veterinaria",
    tone: "empático, claro y cuidadoso",
    location: "Zapopan, Jalisco",
    phone: defaultPhone,
    whatsappMessageBase: "Hola, quiero agendar consulta veterinaria.",
    services: [
      { title: "Consulta general", description: "Revisión veterinaria para perros y gatos con orientación inicial.", commonQuestions: ["¿Necesito cita?", "¿Cuánto dura?", "¿Qué debo llevar?"] },
      { title: "Vacunación", description: "Esquemas preventivos sujetos a edad, historial y valoración.", commonQuestions: ["¿Qué vacunas necesita?", "¿Llevan cartilla?", "¿Atienden cachorros?"] },
      { title: "Urgencias orientativas", description: "Canal directo para saber si conviene acudir de inmediato.", commonQuestions: ["Mi mascota no come", "Mi perro vomita", "No puede respirar"] }
    ],
    faqs: [
      { question: "¿Atienden urgencias?", answer: "El equipo puede confirmar disponibilidad. Si tu mascota no puede respirar, convulsiona o está grave, acude a urgencias veterinarias de inmediato." },
      { question: "¿Atienden gatos?", answer: "Sí, atendemos perros y gatos con cita." },
      { question: "¿Dan diagnóstico por chat?", answer: "No. El diagnóstico y tratamiento dependen de la valoración veterinaria." }
    ],
    businessInfo: { hours: "Lunes a sábado 9:00 a 19:00", address: "Zapopan, Jalisco", parking: "Estacionamiento cercano", paymentMethods: ["Tarjeta", "Transferencia", "Efectivo"], appointmentRequired: true, emergencyPolicy: "En emergencias graves, acudir a urgencias veterinarias." },
    leadGoals: { primaryGoal: "agendar consulta veterinaria", secondaryGoal: "identificar especie y motivo", requiredFields: ["name", "phone", "serviceInterest"] },
    suggestedReplies: ["Agendar consulta", "Vacunas", "Mi mascota está mal"],
    disclaimers: ["El diagnóstico y tratamiento dependen de la valoración veterinaria."],
    forbiddenClaims: ["No diagnosticar", "No prometer resultados", "No sustituir urgencias veterinarias"],
    escalationRules: ["no respira", "convulsiones", "sangrado", "intoxicación", "dolor severo"]
  },
  {
    slug: "abogado-migratorio",
    businessName: "Rivera Legal",
    niche: "Abogado migratorio",
    tone: "formal, prudente y orientado a revisión documental",
    location: "Monterrey, Nuevo León",
    phone: defaultPhone,
    whatsappMessageBase: "Hola, quiero revisar mi caso migratorio.",
    services: [
      { title: "Revisión inicial de caso", description: "Orientación para entender situación, documentos y siguiente paso.", commonQuestions: ["¿Me pueden decir si aplica?", "¿Qué documentos necesito?", "¿Cuánto tarda?"] },
      { title: "Visas y trámites", description: "Acompañamiento según tipo de trámite y país involucrado.", commonQuestions: ["¿Garantizan aprobación?", "¿Cuánto cuesta?", "¿Puedo iniciar en línea?"] },
      { title: "Preparación documental", description: "Orden y revisión de documentos para una consulta legal más eficiente.", commonQuestions: ["¿Qué debo llevar?", "¿Atienden empresas?", "¿Tienen cita remota?"] }
    ],
    faqs: [
      { question: "¿Garantizan la aprobación?", answer: "No. Ningún despacho debe garantizar aprobaciones; cada caso depende de autoridad y documentación." },
      { question: "¿La primera llamada es asesoría legal?", answer: "La información inicial no sustituye una revisión legal completa." },
      { question: "¿Pueden atender por videollamada?", answer: "Sí, el equipo puede confirmar modalidad y disponibilidad por WhatsApp." }
    ],
    businessInfo: { hours: "Lunes a viernes 9:00 a 18:00", address: "Monterrey, Nuevo León", paymentMethods: ["Transferencia", "Tarjeta"], appointmentRequired: true },
    leadGoals: { primaryGoal: "agendar revisión documental", secondaryGoal: "identificar tipo de trámite", requiredFields: ["name", "phone", "serviceInterest"] },
    suggestedReplies: ["Quiero revisar mi caso", "Documentos necesarios", "Agendar llamada"],
    disclaimers: ["La información inicial no constituye asesoría legal definitiva. Cada caso requiere revisión documental."],
    forbiddenClaims: ["No garantizar aprobaciones", "No dar conclusiones legales definitivas", "No inventar plazos", "No inventar costos"],
    escalationRules: ["riesgo de deportación", "plazos urgentes", "revisión legal", "documentos rechazados"]
  },
  {
    slug: "optica",
    businessName: "Óptica Lumen",
    niche: "Óptica",
    tone: "preciso, amable y orientado a atención en tienda",
    location: "Condesa, CDMX",
    phone: defaultPhone,
    whatsappMessageBase: "Hola, quiero información sobre armazones o examen visual.",
    services: [
      { title: "Examen visual", description: "Revisión visual para graduación, sujeta a disponibilidad de agenda.", commonQuestions: ["¿Tiene costo?", "¿Cuánto tarda?", "¿Necesito cita?"] },
      { title: "Armazones premium", description: "Selección de armazones ópticos y solares con asesoría.", commonQuestions: ["¿Tienen marcas?", "¿Puedo ver modelos?", "¿Aceptan tarjeta?"] },
      { title: "Lentes graduados", description: "Opciones de micas según graduación, uso y presupuesto.", commonQuestions: ["¿Cuánto tardan?", "¿Tienen antirreflejante?", "¿Hacen progresivos?"] }
    ],
    faqs: [
      { question: "¿El examen reemplaza al oftalmólogo?", answer: "No sustituye una revisión médica oftalmológica si hay síntomas o condición clínica." },
      { question: "¿Puedo pedir modelos por WhatsApp?", answer: "Sí, el equipo puede orientar y confirmar disponibilidad." },
      { question: "¿Cuánto tardan los lentes?", answer: "Depende de graduación y tipo de mica; el equipo puede confirmar por WhatsApp." }
    ],
    businessInfo: { hours: "Lunes a sábado 10:00 a 19:00", address: "Condesa, Ciudad de México", paymentMethods: ["Tarjeta", "Transferencia", "Efectivo"], appointmentRequired: false },
    leadGoals: { primaryGoal: "llevar al cliente a WhatsApp o tienda", secondaryGoal: "identificar armazón o examen visual", requiredFields: ["name", "phone", "serviceInterest"] },
    suggestedReplies: ["Quiero examen visual", "Ver armazones", "Ubicación"],
    disclaimers: ["El examen visual no sustituye atención médica oftalmológica cuando hay síntomas o padecimientos."],
    forbiddenClaims: ["No diagnosticar enfermedades", "No inventar marcas en stock", "No inventar tiempos de entrega"],
    escalationRules: ["dolor ocular", "pérdida súbita de visión", "stock específico", "graduaciones complejas"]
  },
  {
    slug: "nutricion",
    businessName: "Método Raíz",
    niche: "Nutrición",
    tone: "cercano, profesional y sin promesas extremas",
    location: "Mérida Norte, Yucatán",
    phone: defaultPhone,
    whatsappMessageBase: "Hola, quiero información para una consulta de nutrición.",
    services: [
      { title: "Consulta nutricional", description: "Valoración inicial para crear un plan realista y personalizado.", commonQuestions: ["¿Qué incluye?", "¿Cuánto dura?", "¿Es en línea?"] },
      { title: "Nutrición clínica", description: "Acompañamiento según objetivos y contexto de salud.", commonQuestions: ["¿Atienden resistencia a la insulina?", "¿Dan menú?", "¿Necesito estudios?"] },
      { title: "Cambio de hábitos", description: "Seguimiento para construir hábitos sostenibles sin promesas mágicas.", commonQuestions: ["¿Cuánto bajo de peso?", "¿Cuántas consultas?", "¿Incluye recetas?"] }
    ],
    faqs: [
      { question: "¿Garantizan bajar de peso?", answer: "No se garantizan resultados. El plan se adapta después de una valoración y depende de cada persona." },
      { question: "¿Atienden en línea?", answer: "Sí, el equipo puede confirmar modalidad y horarios por WhatsApp." },
      { question: "¿Pueden darme dieta por chat?", answer: "No. Se requiere valoración para un plan adecuado." }
    ],
    businessInfo: { hours: "Lunes a viernes 8:00 a 18:00", address: "Mérida Norte, Yucatán", paymentMethods: ["Transferencia", "Tarjeta"], appointmentRequired: true },
    leadGoals: { primaryGoal: "agendar consulta nutricional", secondaryGoal: "identificar objetivo principal", requiredFields: ["name", "phone", "serviceInterest"] },
    suggestedReplies: ["Quiero consulta", "Modalidad en línea", "Qué incluye"],
    disclaimers: ["Los planes se adaptan a cada persona después de una valoración."],
    forbiddenClaims: ["No prometer baja de peso", "No dar dietas por chat", "No reemplazar atención médica"],
    escalationRules: ["trastornos alimentarios", "embarazo", "condiciones médicas", "síntomas graves"]
  },
  {
    slug: "psicologia",
    businessName: "Espacio Clara",
    niche: "Psicología",
    tone: "sereno, respetuoso y cuidadoso",
    location: "Del Valle, CDMX",
    phone: defaultPhone,
    whatsappMessageBase: "Hola, quiero información para agendar terapia.",
    services: [
      { title: "Terapia individual", description: "Acompañamiento psicológico con agenda previa.", commonQuestions: ["¿Atienden ansiedad?", "¿Cuánto dura?", "¿Es en línea?"] },
      { title: "Terapia de pareja", description: "Espacio para explorar dinámicas y objetivos de relación.", commonQuestions: ["¿Cómo funciona?", "¿Cuánto cuesta?", "¿Necesitamos ir ambos?"] },
      { title: "Primera orientación", description: "Canal para confirmar modalidad, enfoque y disponibilidad.", commonQuestions: ["¿Qué terapeuta me conviene?", "¿Tienen horario nocturno?", "¿Aceptan tarjeta?"] }
    ],
    faqs: [
      { question: "Estoy en crisis, ¿me pueden ayudar ahora?", answer: "La atención psicológica no sustituye servicios de emergencia. Si estás en crisis o riesgo, contacta servicios locales de emergencia o una línea de crisis." },
      { question: "¿La terapia puede ser en línea?", answer: "Sí, se puede confirmar modalidad y horarios por WhatsApp." },
      { question: "¿Pueden diagnosticar por chat?", answer: "No. Cualquier evaluación requiere atención profesional adecuada." }
    ],
    businessInfo: { hours: "Lunes a viernes 9:00 a 20:00", address: "Del Valle, Ciudad de México", paymentMethods: ["Transferencia", "Tarjeta"], appointmentRequired: true, emergencyPolicy: "En crisis o riesgo, contactar servicios locales de emergencia." },
    leadGoals: { primaryGoal: "agendar primera sesión", secondaryGoal: "identificar modalidad de interés", requiredFields: ["name", "phone", "serviceInterest"] },
    suggestedReplies: ["Quiero terapia", "Terapia de pareja", "Horarios"],
    disclaimers: ["La atención psicológica no sustituye servicios de emergencia. En crisis, contacta servicios locales de emergencia."],
    forbiddenClaims: ["No dar terapia de crisis por chat", "No diagnosticar", "No prometer resultados"],
    escalationRules: ["crisis", "riesgo suicida", "violencia", "emergencia", "diagnóstico"]
  },
  {
    slug: "arquitectura",
    businessName: "Estudio Umbral",
    niche: "Arquitectura e interiorismo",
    tone: "editorial, preciso y consultivo",
    location: "Guadalajara, Jalisco",
    phone: defaultPhone,
    whatsappMessageBase: "Hola, quiero información para un proyecto de arquitectura o interiorismo.",
    services: [
      { title: "Diseño residencial", description: "Conceptualización de espacios y propuesta de distribución.", commonQuestions: ["¿Cuánto cuesta un proyecto?", "¿Cuánto tarda?", "¿Atienden remodelación?"] },
      { title: "Interiorismo", description: "Dirección visual, materiales, mobiliario y ambientación.", commonQuestions: ["¿Trabajan por etapas?", "¿Incluye renders?", "¿Pueden revisar mi espacio?"] },
      { title: "Asesoría inicial", description: "Revisión de objetivos, metraje, presupuesto de referencia y alcance.", commonQuestions: ["¿Qué necesitan para cotizar?", "¿Hacen visita?", "¿Atienden fuera de Guadalajara?"] }
    ],
    faqs: [
      { question: "¿Pueden dar presupuesto por chat?", answer: "Podemos orientar sobre el proceso, pero el presupuesto requiere revisar alcance, metraje y necesidades." },
      { question: "¿Hacen remodelaciones?", answer: "Sí, el equipo puede revisar tipo de espacio y alcance." },
      { question: "¿Incluyen renders?", answer: "Depende del alcance contratado. Se puede confirmar en propuesta." }
    ],
    businessInfo: { hours: "Lunes a viernes 10:00 a 18:00", address: "Guadalajara, Jalisco", paymentMethods: ["Transferencia"], appointmentRequired: true },
    leadGoals: { primaryGoal: "solicitar revisión de proyecto", secondaryGoal: "entender tipo de espacio y alcance", requiredFields: ["name", "phone", "serviceInterest"] },
    suggestedReplies: ["Quiero cotizar proyecto", "Interiorismo", "Qué necesitan"],
    disclaimers: ["Los presupuestos y tiempos dependen de la revisión del proyecto, alcance y materiales."],
    forbiddenClaims: ["No prometer presupuestos sin revisión", "No inventar tiempos", "No garantizar costos de obra"],
    escalationRules: ["presupuesto", "obra en curso", "fechas de entrega", "alcance técnico"]
  }
];

export const chatAgentConfigs: ChatAgentConfig[] = rawChatAgentConfigs.map((config) => ({
  ...config,
  visual: config.visual ?? { primary: "#0B1220", accent: "#B88A44", avatarLabel: config.businessName.slice(0, 2).toUpperCase() }
}));

export function getChatAgentConfig(slug: string) {
  return chatAgentConfigs.find((config) => config.slug === slug);
}

export function getAllChatAgentSlugs() {
  return chatAgentConfigs.map((config) => config.slug);
}
