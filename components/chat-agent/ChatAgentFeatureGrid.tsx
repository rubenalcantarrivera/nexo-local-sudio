const features = [
  "Respuestas basadas en información del negocio",
  "Captura de nombre, teléfono y servicio",
  "CTA a WhatsApp con mensaje prellenado",
  "Flujos por tipo de negocio",
  "Escalamiento a humano",
  "Tono profesional",
  "Restricciones por salud/legal",
  "Modo demo sin API key"
];

export function ChatAgentFeatureGrid() {
  return (
    <div className="grid gap-px overflow-hidden rounded-[2rem] border border-brand-border bg-brand-border sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <div key={feature} className="bg-white p-6">
          <p className="font-display text-xl font-semibold leading-tight text-brand-primary">{feature}</p>
        </div>
      ))}
    </div>
  );
}
