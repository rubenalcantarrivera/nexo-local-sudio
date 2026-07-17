import { ButtonLink } from "@/components/ButtonLink";

const plans = [
  {
    name: "Chat Inicial",
    price: "$1,500 MXN setup + $499/mes",
    includes: ["Chat web básico", "FAQs del negocio", "Servicios principales", "WhatsApp handoff", "1 flujo de captación", "Modo demo"]
  },
  {
    name: "Chat Plus",
    price: "$3,500 MXN setup + $999/mes",
    highlighted: true,
    includes: ["Todo lo de Inicial", "Configuración por nicho", "Captura de datos", "Resumen de conversación", "3 flujos de intención", "Ajustes mensuales ligeros", "Reporte básico de conversaciones"]
  },
  {
    name: "Chat Premium",
    price: "$6,500 MXN setup + $1,900/mes",
    includes: ["Todo lo de Plus", "Entrenamiento con documentos/FAQs", "Flujos avanzados", "Handoff inteligente", "Personalidad más personalizada", "Optimización mensual", "Soporte prioritario"]
  }
];

export function ChatAgentPricing({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {plans.map((plan) => (
        <article key={plan.name} className={["rounded-[2rem] border p-6 shadow-card", plan.highlighted ? "border-brand-accent bg-[#0B1220] text-white" : "border-brand-border bg-white text-brand-primary"].join(" ")}>
          {plan.highlighted ? <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-softAccent">Recomendado</p> : null}
          <h3 className="font-display text-3xl font-semibold">{plan.name}</h3>
          <p className={["mt-3 text-lg font-bold", plan.highlighted ? "text-white" : "text-brand-primary"].join(" ")}>{plan.price}</p>
          <ul className="mt-6 space-y-3 text-sm">
            {plan.includes.map((item) => (
              <li key={item} className={plan.highlighted ? "text-white/86" : "text-brand-muted"}>• {item}</li>
            ))}
          </ul>
          <ButtonLink href={ctaHref} variant={plan.highlighted ? "light" : "primary"} className="mt-7 w-full">Cotizar asistente IA</ButtonLink>
        </article>
      ))}
    </div>
  );
}
