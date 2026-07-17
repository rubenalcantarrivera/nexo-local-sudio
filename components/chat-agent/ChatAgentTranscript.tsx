type Props = {
  items: string[];
};

export function ChatAgentTranscript({ items }: Props) {
  return (
    <div className="rounded-[2rem] border border-brand-border bg-white p-6 shadow-card">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted">Transcripción demo</p>
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <p key={`${item}-${index}`} className="rounded-2xl bg-brand-softAccent/40 px-4 py-3 text-sm text-brand-primary">{item}</p>
        ))}
      </div>
    </div>
  );
}
