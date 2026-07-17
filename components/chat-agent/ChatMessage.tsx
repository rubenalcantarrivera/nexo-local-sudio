type Props = {
  role: "user" | "assistant";
  content: string;
};

export function ChatMessage({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={[
          "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
          isUser ? "rounded-br-md bg-[#0B1220] text-white" : "rounded-bl-md border border-brand-border bg-white text-brand-primary"
        ].join(" ")}
      >
        {content}
      </div>
    </div>
  );
}
