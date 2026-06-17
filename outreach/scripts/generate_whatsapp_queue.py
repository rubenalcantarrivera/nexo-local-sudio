#!/usr/bin/env python3
"""Generate human-reviewed wa.me outreach links.

No messages are sent. The output is a review queue with prefilled WhatsApp URLs.
"""

from __future__ import annotations

import csv
import re
import sys
import urllib.parse
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SUPPRESSION_PATH = ROOT / "outreach" / "whatsapp_suppression_list.csv"
DEFAULT_HOMEPAGE = "https://nexo-local-studio-public.vercel.app"
AGENCY_WHATSAPP = "525545609027"
MAX_MESSAGE_CHARS = 650
MAX_URL_CHARS = 650
QUEUE_COLUMNS = [
    "priority", "score", "business_name", "niche", "city", "zone", "normalized_phone",
    "phone_status", "whatsapp_url", "message", "demo_url", "homepage_url",
    "message_char_count", "encoded_url_length", "url_validation_status", "status",
    "last_contacted", "follow_up_date", "response_status", "opened_at",
    "follow_up_url", "follow_up_message", "notes",
]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, str]]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=QUEUE_COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def ensure_suppression_list() -> None:
    if SUPPRESSION_PATH.exists():
        return
    SUPPRESSION_PATH.parent.mkdir(parents=True, exist_ok=True)
    with SUPPRESSION_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["normalized_phone", "business_name", "reason", "date_added"])
        writer.writeheader()


def suppressed_numbers() -> set[str]:
    ensure_suppression_list()
    return {row.get("normalized_phone", "").strip() for row in read_csv(SUPPRESSION_PATH) if row.get("normalized_phone", "").strip()}


def normalize_message(message: str) -> str:
    message = message.replace("\r\n", "\n").replace("\r", "\n").strip()
    message = re.sub(r"[ \t]+\n", "\n", message)
    message = re.sub(r"\n{3,}", "\n\n", message)
    message = re.sub(r"\s+", " ", message)
    return message


def display_business_name(value: str, max_chars: int = 72) -> str:
    name = re.sub(r"\s+", " ", (value or "").strip())
    if not name:
        return "su negocio"
    if len(name) <= max_chars:
        return name
    trimmed = name[:max_chars].rsplit(" ", 1)[0].rstrip(" ,.-")
    return trimmed or name[:max_chars].rstrip(" ,.-")


def homepage_url_for(row: dict[str, str]) -> str:
    return (row.get("homepage_url", "").strip() or DEFAULT_HOMEPAGE).rstrip("/")


def first_message(row: dict[str, str], homepage_url: str) -> str:
    business = display_business_name(row.get("business_name", ""), max_chars=36)
    message = (
        f"Hola, {business}. Vi que su negocio tiene presencia en Google Maps y reputación local. "
        "Soy Ruben, de Nexo Local Studio. Hacemos páginas web profesionales conectadas a WhatsApp. "
        f"Puedes ver la página de Nexo Local Studio aquí: {homepage_url}. "
        "Precios desde $2,500 MXN. "
        "Si te interesa, puedo enviarte una propuesta breve. Si prefieres no recibir más mensajes, dime baja."
    )
    message = normalize_message(message)
    if len(message) <= MAX_MESSAGE_CHARS:
        return message

    short_business = display_business_name(row.get("business_name", ""), max_chars=28)
    shorter = (
        f"Hola, {short_business}. Soy Ruben, de Nexo Local Studio. "
        f"Hacemos páginas web profesionales conectadas a WhatsApp. Puedes ver la página de Nexo Local Studio aquí: {homepage_url}. "
        "Precios desde $2,500 MXN. Si te interesa, puedo enviarte una propuesta breve. "
        "Si prefieres no recibir más mensajes, dime baja."
    )
    return normalize_message(shorter)


def wa_url(phone: str, message: str) -> str:
    encoded_message = urllib.parse.quote(message, safe="")
    return f"https://wa.me/{phone}?text={encoded_message}"


def decoded_text_from_url(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    values = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
    return values.get("text", [""])[0]


def validate_whatsapp_url(url: str, message: str) -> str:
    if not url.startswith("https://wa.me/"):
        return "url_encoding_error"
    return "url_valid" if decoded_text_from_url(url) == message else "url_encoding_error"


def row_is_suppressed(phone: str, suppressed: set[str]) -> bool:
    return bool(phone and phone in suppressed)


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python3 outreach/scripts/generate_whatsapp_queue.py outreach/whatsapp_manual_channels.csv outreach/whatsapp_outreach_queue.csv", file=sys.stderr)
        return 2
    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 1

    suppressed = suppressed_numbers()
    output_rows: list[dict[str, str]] = []
    skipped = 0
    for row in read_csv(input_path):
        phone = row.get("normalized_phone", "").strip()
        phone_status = row.get("phone_status", "").strip()
        row_status = row.get("status", "").strip()
        homepage = row.get("homepage_url", "").strip() or DEFAULT_HOMEPAGE
        homepage = homepage.rstrip("/")
        demo_url = row.get("demo_url", "").strip()
        message = first_message(row, homepage)
        message_char_count = len(message)
        url = wa_url(phone, message) if phone else ""
        url_validation_status = validate_whatsapp_url(url, message) if url else "invalid_phone"
        notes = row.get("notes", "")
        status = "ready_to_review"

        if not homepage:
            url_validation_status = "missing_homepage_url"
            status = "blocked"
        elif phone_status != "valid" or not phone:
            url_validation_status = "invalid_phone"
            status = "blocked"
            skipped += 1
        elif phone == AGENCY_WHATSAPP:
            phone_status = "agency_number_error"
            url_validation_status = "invalid_phone"
            status = "blocked"
            notes = (notes + " | " if notes else "") + "Bloqueado: el destinatario coincide con el WhatsApp de Nexo Local Studio."
            skipped += 1
        elif row_status in {"do_not_contact", "baja"}:
            status = row_status
            skipped += 1
        elif row_is_suppressed(phone, suppressed):
            url_validation_status = "suppressed"
            status = "suppressed"
            notes = (notes + " | " if notes else "") + "Bloqueado por whatsapp_suppression_list.csv."
            skipped += 1
        elif message_char_count > MAX_MESSAGE_CHARS:
            url_validation_status = "message_too_long"
            status = "blocked"
            notes = (notes + " | " if notes else "") + f"Mensaje excede {MAX_MESSAGE_CHARS} caracteres."
            skipped += 1
        elif len(url) > MAX_URL_CHARS:
            url_validation_status = "url_too_long"
            status = "blocked"
            notes = (notes + " | " if notes else "") + f"URL excede {MAX_URL_CHARS} caracteres."
            skipped += 1
        elif url_validation_status != "url_valid":
            status = "blocked"
            skipped += 1

        output_rows.append({
            "priority": row.get("priority", ""),
            "score": row.get("score", ""),
            "business_name": row.get("business_name", ""),
            "niche": row.get("niche", ""),
            "city": row.get("city", ""),
            "zone": row.get("zone", ""),
            "normalized_phone": phone,
            "phone_status": phone_status,
            "whatsapp_url": url,
            "message": message,
            "demo_url": demo_url,
            "homepage_url": homepage,
            "message_char_count": str(message_char_count),
            "encoded_url_length": str(len(url)),
            "url_validation_status": url_validation_status,
            "status": status,
            "last_contacted": "",
            "follow_up_date": "",
            "response_status": "",
            "opened_at": "",
            "follow_up_url": "",
            "follow_up_message": "",
            "notes": notes,
        })

    write_csv(output_path, output_rows)
    print(f"Queue rows generated: {len(output_rows)}")
    print(f"Skipped rows: {skipped}")
    print(f"Wrote: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
