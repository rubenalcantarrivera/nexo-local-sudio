type ChatEventName =
  | "chat_opened"
  | "message_sent"
  | "ai_reply_received"
  | "suggested_reply_clicked"
  | "whatsapp_handoff_clicked"
  | "lead_captured"
  | "fallback_triggered";

export function trackChatEvent(name: ChatEventName, payload: Record<string, unknown> = {}) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[chat-agent] ${name}`, payload);
  }
}
