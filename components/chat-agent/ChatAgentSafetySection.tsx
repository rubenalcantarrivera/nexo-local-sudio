const items = [
  "No inventa precios, horarios ni disponibilidad.",
  "No promete resultados, ventas ni rankings.",
  "No diagnostica ni da asesoría legal definitiva.",
  "Escala a humano cuando la pregunta es sensible.",
  "Incluye disclaimers por salud, legal o bienestar.",
  "Funciona como primera atención, no como reemplazo total."
];

export function ChatAgentSafetySection() {
  return (
    <div className="dark-grain texture-overlay rounded-[2.5rem] p-8 text-white shadow-soft lg:p-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-softAccent">Seguridad</p>
      <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight">Diseñado para vender sin inventar.</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="border border-white/18 bg-white/[0.12] p-5 text-sm leading-6 text-white/88">{item}</div>
        ))}
      </div>
    </div>
  );
}
