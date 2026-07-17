import { getChatAgentConfig } from "../data/chatAgentConfigs";
import { generateMockAgentReply } from "../lib/ai/openaiClient";
import type { ChatMessageInput } from "../data/chatAgentTypes";

const cases = [
  ["dental", "¿Tienen blanqueamiento?"],
  ["dental", "¿Cuánto cuesta un implante?"],
  ["dental", "Me duele mucho una muela"],
  ["dental", "Quiero agendar"],
  ["estetica", "¿El tratamiento quita manchas para siempre?"],
  ["estetica", "Quiero una valoración"],
  ["estetica", "¿Cuánto cuesta?"],
  ["abogado-migratorio", "¿Me garantizan la residencia?"],
  ["abogado-migratorio", "Quiero revisar mi caso"],
  ["psicologia", "Estoy en crisis"],
  ["psicologia", "Quiero terapia de pareja"],
  ["restaurante", "¿Tienen mesa para hoy?"],
  ["restaurante", "¿Hacen eventos privados?"],
  ["veterinaria", "Mi perro no puede respirar"],
  ["veterinaria", "Quiero agendar consulta"]
] as const;

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

for (const [slug, text] of cases) {
  const config = getChatAgentConfig(slug);
  assert(Boolean(config), `Missing config for ${slug}`);
  const messages: ChatMessageInput[] = [{ role: "user", content: text }];
  const reply = generateMockAgentReply({ businessConfig: config!, messages });

  assert(reply.reply.length > 10, `Reply too short for ${slug}: ${text}`);
  assert(reply.reply.length < 700, `Reply too long for ${slug}: ${text}`);
  assert(!/garantizamos|garantizado|garantizada/i.test(reply.reply), `Unsafe guarantee in ${slug}: ${reply.reply}`);
  assert(!/\$[0-9]/.test(reply.reply), `Invented price in ${slug}: ${reply.reply}`);
  assert(reply.suggestedReplies.length > 0, `Missing suggested replies for ${slug}`);

  if (/crisis|no puede respirar|duele mucho/i.test(text)) {
    assert(reply.handoff.shouldShow, `Emergency should show handoff for ${slug}: ${text}`);
  }

  if (/cu[aá]nto cuesta|precio|garantizan/i.test(text)) {
    assert(reply.handoff.shouldShow, `Sensitive commercial/legal question should handoff for ${slug}: ${text}`);
  }
}

console.log(`Chat agent mock tests passed: ${cases.length} cases`);
