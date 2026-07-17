type Props = {
  role: "user" | "assistant";
  content: string;
};

export function ChatMessage({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div className={isUser ? "flex justify-end" : "flex items-end gap-2"}>
      {!isUser ? <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0B1220] text-[10px] font-bold text-brand-softAccent">IA</span> : null}
      <div
        className={[
          "max-w-[84%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
          isUser ? "rounded-br-md bg-[#0B1220] text-white" : "rounded-bl-md border border-brand-border bg-white text-brand-primary"
        ].join(" ")}
      >
        {content}
      </div>
    </div>
  );
}
