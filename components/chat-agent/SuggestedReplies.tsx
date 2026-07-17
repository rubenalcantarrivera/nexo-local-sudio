type Props = {
  replies: string[];
  disabled?: boolean;
  onSelect: (reply: string) => void;
};

export function SuggestedReplies({ replies, disabled, onSelect }: Props) {
  if (!replies.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {replies.map((reply) => (
        <button
          key={reply}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(reply)}
          className="focus-ring rounded-full border border-brand-border bg-white px-3 py-2 text-xs font-bold text-brand-primary shadow-sm transition hover:border-brand-accent hover:bg-brand-softAccent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
