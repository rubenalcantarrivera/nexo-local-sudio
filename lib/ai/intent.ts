import type { ChatAgentConfig } from "@/data/chatAgentTypes";

export type ChatIntent =
  | "greeting"
  | "ask_services"
  | "ask_price"
  | "ask_hours"
  | "ask_location"
  | "book_appointment"
  | "ask_whatsapp"
  | "emergency"
  | "legal_advice"
  | "medical_advice"
  | "complaint"
  | "human_request"
  | "unknown";

const includesAny = (text: string, words: string[]) => words.some((word) => text.includes(word));

export function detectIntent(input: string, config?: ChatAgentConfig): ChatIntent {
  const text = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (includesAny(text, ["hola", "buen dia", "buenas", "hey"])) return "greeting";
  if (includesAny(text, ["urgencia", "emergencia", "crisis", "suicidio", "no puede respirar", "convuls", "sangra", "dolor fuerte", "dolor intenso", "duele mucho", "mucho dolor", "intoxic"])) return "emergency";
  if (includesAny(text, ["humano", "persona", "asesor", "doctor", "abogado", "recepcion", "alguien"])) return "human_request";
  if (includesAny(text, ["whatsapp", "wats", "mande mensaje", "contactar", "telefono"])) return "ask_whatsapp";
  if (includesAny(text, ["agendar", "agenda", "cita", "reservar", "reserva", "valoracion", "consulta"])) return "book_appointment";
  if (includesAny(text, ["precio", "costo", "cuanto cuesta", "tarifa", "paquete", "cotizar", "presupuesto"])) return "ask_price";
  if (includesAny(text, ["horario", "abren", "cierran", "atienden", "hora"])) return "ask_hours";
  if (includesAny(text, ["ubicacion", "direccion", "donde estan", "mapa", "llegar"])) return "ask_location";
  if (includesAny(text, ["servicio", "tratamiento", "ofrecen", "hacen", "especialidad", "menu"])) return "ask_services";
  if (includesAny(text, ["queja", "molesto", "mal servicio", "reclamo"])) return "complaint";

  if (config?.slug === "abogado-migratorio" && includesAny(text, ["garantizan", "residencia", "visa", "deportacion", "permiso"])) return "legal_advice";
  if (["dental", "estetica", "fisioterapia", "veterinaria", "nutricion", "psicologia", "optica"].includes(config?.slug ?? "") && includesAny(text, ["diagnostico", "medicina", "sintoma", "dolor", "tratamiento"])) return "medical_advice";

  return "unknown";
}

export function shouldShowHandoff(intent: ChatIntent) {
  return ["ask_price", "book_appointment", "ask_whatsapp", "emergency", "human_request", "legal_advice", "medical_advice", "complaint"].includes(intent);
}
