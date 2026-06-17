#!/usr/bin/env python3
"""Generate human-reviewed wa.me outreach links.

No messages are sent. The output is a review queue with prefilled WhatsApp URLs.
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
import urllib.parse
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SUPPRESSION_PATH = ROOT / "outreach" / "whatsapp_suppression_list.csv"
DEFAULT_HOMEPAGE = "https://nexo-local-studio-public.vercel.app/demos"
AGENCY_WHATSAPP = "525545609027"
MAX_MESSAGE_CHARS = 650
MAX_URL_CHARS = 1200
QUEUE_COLUMNS = [
    "priority", "score", "business_name", "niche", "city", "zone", "normalized_phone",
    "phone_status", "whatsapp_verification_status", "whatsapp_verified_at",
    "whatsapp_verification_notes", "whatsapp_url", "message", "demo_url", "homepage_url",
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
    url = (row.get("homepage_url", "").strip() or DEFAULT_HOMEPAGE).rstrip("/")
    if url.endswith("/demos"):
        return url
    if "/demos/" in url:
        return url.split("/demos/", 1)[0].rstrip("/") + "/demos"
    return url + "/demos"


def first_message(row: dict[str, str], homepage_url: str) -> str:
    message = f"""Hola, vi que su negocio tiene presencia en Google Maps y reputación local.

Somos Nexo Local Studio. Hacemos páginas web rápidas y profesionales para negocios locales, conectadas a WhatsApp, ubicación y formularios.

Pueden ver los ejemplos de Nexo Local Studio aquí:
{homepage_url}

Precios desde $2,500 MXN.

Si les interesa, podemos enviarles una propuesta breve. Si no les interesa recibir más mensajes, dígannos baja."""
    message = normalize_message(message)
    if len(message) <= MAX_MESSAGE_CHARS:
        return message

    shorter = f"""Hola, somos Nexo Local Studio.

Hacemos páginas web profesionales conectadas a WhatsApp para negocios locales.

Pueden ver los ejemplos de Nexo Local Studio aquí:
{homepage_url}

Precios desde $2,500 MXN.

Si les interesa, podemos enviarles una propuesta breve. Si no les interesa recibir más mensajes, dígannos baja."""
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
    parser = argparse.ArgumentParser()
    parser.add_argument("input_csv")
    parser.add_argument("output_csv")
    parser.add_argument(
        "--allow-unverified",
        action="store_true",
        help="Generate ready_to_review rows for valid-format numbers without WhatsApp existence verification.",
    )
    args = parser.parse_args()
    input_path = Path(args.input_csv)
    output_path = Path(args.output_csv)
    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 1

    suppressed = suppressed_numbers()
    input_rows = read_csv(input_path)
    if input_rows and "whatsapp_verification_status" not in input_rows[0]:
        if args.allow_unverified:
            print("Warning: generating unverified queue because --allow-unverified was passed.", file=sys.stderr)
        else:
            print("Warning: This input has not been WhatsApp-verified. Run manual verification first.", file=sys.stderr)

    output_rows: list[dict[str, str]] = []
    skipped = 0
    for row in input_rows:
        phone = row.get("normalized_phone", "").strip()
        phone_status = row.get("phone_status", "").strip()
        verification_status = row.get("whatsapp_verification_status", "").strip() or "pending_manual_check"
        if args.allow_unverified and verification_status == "pending_manual_check":
            verification_status = "bypassed_by_user"
        row_status = row.get("status", "").strip()
        homepage = homepage_url_for(row)
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
        elif verification_status != "exists_on_whatsapp" and not (args.allow_unverified and verification_status == "bypassed_by_user"):
            status = "blocked_not_verified"
            notes = (notes + " | " if notes else "") + "Bloqueado: número no verificado manualmente como existente en WhatsApp."
            skipped += 1
        elif phone_status not in {"valid_format_only", "valid"} or not phone:
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
            "whatsapp_verification_status": verification_status,
            "whatsapp_verified_at": row.get("whatsapp_verified_at", ""),
            "whatsapp_verification_notes": row.get("whatsapp_verification_notes", ""),
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
