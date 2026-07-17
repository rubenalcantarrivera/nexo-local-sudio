const useCases = ["Clínicas dentales", "Clínicas estéticas", "Fisioterapia", "Restaurantes", "Veterinarias", "Abogados", "Ópticas", "Nutrición", "Psicología", "Arquitectura"];

export function ChatAgentUseCases() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {useCases.map((item) => (
        <div key={item} className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm">
          <p className="font-display text-xl font-semibold text-brand-primary">{item}</p>
          <p className="mt-2 text-sm text-brand-muted">FAQs, captura de datos y paso a WhatsApp.</p>
        </div>
      ))}
    </div>
  );
}
