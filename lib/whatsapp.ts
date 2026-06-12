export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function createWhatsAppLink(phone: string, message: string) {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
}
