#!/usr/bin/env python3
"""Shared helpers for Campaign 03 outreach tooling.

The helpers intentionally avoid unofficial WhatsApp APIs. They only prepare
public-data CSVs and wa.me links for human review.
"""

from __future__ import annotations

import csv
import datetime as dt
import re
import unicodedata
import urllib.parse
from pathlib import Path


AGENCY_WHATSAPP = "525545609027"
HOMEPAGE_URL = "https://nexo-local-studio-public.vercel.app"
MAX_MESSAGE_CHARS = 650

CAMPAIGN_COLUMNS = [
    "priority",
    "score",
    "business_name",
    "niche",
    "country",
    "city",
    "zone",
    "rating",
    "reviews_count",
    "website_status",
    "website_url",
    "google_maps_url",
    "source_url",
    "phone",
    "normalized_phone",
    "phone_status",
    "instagram",
    "email",
    "contact_person",
    "problem_detected",
    "verification_notes",
    "homepage_url",
    "first_message",
    "last_checked",
]

DEDUPE_COLUMNS = [
    "source_file",
    "business_name",
    "normalized_business_name",
    "phone",
    "normalized_phone",
    "google_maps_url",
    "website_url",
    "instagram",
]

EXCLUDED_COLUMNS = [
    "business_name",
    "country",
    "city",
    "zone",
    "reason",
    "matched_existing_record",
    "matched_source_file",
    "source_url",
]

VERIFICATION_COLUMNS = [
    "verification_status",
    "business_name",
    "niche",
    "country",
    "city",
    "zone",
    "original_phone",
    "normalized_phone",
    "wa_check_url",
    "google_maps_url",
    "source_url",
    "phone_source",
    "source_confidence",
    "notes",
    "verified_at",
]

QUEUE_COLUMNS = [
    "priority",
    "score",
    "business_name",
    "niche",
    "country",
    "city",
    "zone",
    "normalized_phone",
    "verification_status",
    "message",
    "homepage_url",
    "whatsapp_url",
    "message_char_count",
    "encoded_url_length",
    "url_validation_status",
    "status",
    "last_contacted",
    "follow_up_date",
    "response_status",
    "notes",
]

SENT_LOG_COLUMNS = [
    "sent_at",
    "business_name",
    "normalized_phone",
    "status",
    "notes",
]

SUPPRESSION_COLUMNS = [
    "normalized_phone",
    "business_name",
    "reason",
    "date_added",
]


COUNTRY_CODES = {
    "Mexico": "52",
    "Colombia": "57",
    "Peru": "51",
    "Chile": "56",
    "Argentina": "54",
    "Panama": "507",
    "Costa Rica": "506",
    "Dominican Republic": "1",
    "Ecuador": "593",
    "Uruguay": "598",
    "Paraguay": "595",
}


def today_iso() -> str:
    return dt.date.today().isoformat()


def now_iso() -> str:
    return dt.datetime.now().isoformat(timespec="seconds")


def read_csv(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, str]], columns: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def append_csv(path: Path, row: dict[str, str], columns: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    exists = path.exists()
    with path.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        if not exists:
            writer.writeheader()
        writer.writerow(row)


def ensure_csv(path: Path, columns: list[str]) -> None:
    if not path.exists():
        write_csv(path, [], columns)


def slug_text(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def clean_phone_digits(phone: str) -> str:
    value = (phone or "").split(";")[0].split(",")[0]
    value = re.sub(r"(?:ext\.?|extension|extensión|anexo|x)\s*\d+.*$", "", value, flags=re.I)
    digits = re.sub(r"\D+", "", value)
    if digits.startswith("00"):
        digits = digits[2:]
    return digits


def normalize_phone(phone: str, country: str) -> tuple[str, str, str]:
    digits = clean_phone_digits(phone)
    if not digits:
        return "", "missing_phone", "No hay teléfono público."

    code = COUNTRY_CODES.get(country)
    if not code:
        return "", "needs_manual_review", f"País no soportado para normalización: {country}."

    if country == "Mexico":
        if len(digits) == 13 and digits.startswith("521"):
            normalized = "52" + digits[-10:]
        elif len(digits) == 12 and digits.startswith("52"):
            normalized = digits
        elif len(digits) == 10:
            normalized = "52" + digits
        else:
            return "", "invalid_phone", "No coincide con formato mexicano esperado."
    elif country == "Colombia":
        if digits.startswith("57") and 11 <= len(digits) <= 12:
            normalized = digits
        elif len(digits) in {7, 8, 10}:
            normalized = "57" + digits
        else:
            return "", "invalid_phone", "No coincide con formato colombiano esperado."
    elif country == "Peru":
        if digits.startswith("51") and 10 <= len(digits) <= 11:
            normalized = digits
        elif len(digits) in {7, 8, 9}:
            normalized = "51" + digits
        else:
            return "", "invalid_phone", "No coincide con formato peruano esperado."
    elif country == "Chile":
        if digits.startswith("56") and 10 <= len(digits) <= 11:
            normalized = digits
        elif len(digits) in {8, 9}:
            normalized = "56" + digits
        else:
            return "", "invalid_phone", "No coincide con formato chileno esperado."
    elif country == "Argentina":
        if digits.startswith("54") and 11 <= len(digits) <= 13:
            normalized = digits
        elif 8 <= len(digits) <= 11:
            normalized = "54" + digits
        else:
            return "", "invalid_phone", "No coincide con formato argentino esperado."
    elif country == "Panama":
        if digits.startswith("507") and len(digits) == 11:
            normalized = digits
        elif len(digits) == 8:
            normalized = "507" + digits
        else:
            return "", "invalid_phone", "No coincide con formato panameño esperado."
    elif country == "Costa Rica":
        if digits.startswith("506") and len(digits) == 11:
            normalized = digits
        elif len(digits) == 8:
            normalized = "506" + digits
        else:
            return "", "invalid_phone", "No coincide con formato costarricense esperado."
    elif country == "Dominican Republic":
        if digits.startswith("1") and len(digits) == 11:
            normalized = digits
        elif len(digits) == 10:
            normalized = "1" + digits
        else:
            return "", "invalid_phone", "No coincide con formato dominicano esperado."
    elif country == "Ecuador":
        if digits.startswith("593") and 11 <= len(digits) <= 12:
            normalized = digits
        elif digits.startswith("0") and len(digits) in {9, 10}:
            normalized = "593" + digits[1:]
        elif len(digits) in {8, 9}:
            normalized = "593" + digits
        else:
            return "", "invalid_phone", "No coincide con formato ecuatoriano esperado."
    elif country == "Uruguay":
        if digits.startswith("598") and 10 <= len(digits) <= 11:
            normalized = digits
        elif len(digits) in {8, 9}:
            normalized = "598" + digits
        else:
            return "", "invalid_phone", "No coincide con formato uruguayo esperado."
    elif country == "Paraguay":
        if digits.startswith("595") and 10 <= len(digits) <= 12:
            normalized = digits
        elif digits.startswith("0") and len(digits) in {9, 10}:
            normalized = "595" + digits[1:]
        elif len(digits) in {8, 9}:
            normalized = "595" + digits
        else:
            return "", "invalid_phone", "No coincide con formato paraguayo esperado."
    else:
        return "", "needs_manual_review", f"País no soportado: {country}."

    if normalized == AGENCY_WHATSAPP:
        return normalized, "agency_number_error", "Coincide con el WhatsApp de Nexo Local Studio."
    if not normalized.isdigit() or len(normalized) < 8 or len(normalized) > 15:
        return "", "invalid_phone", "Número normalizado fuera de rango E.164."
    return normalized, "valid_format_only", "Teléfono normalizado; requiere verificación manual en WhatsApp."


def first_message(homepage_url: str = HOMEPAGE_URL) -> str:
    message = f"""Hola, buen día.

Somos Nexo Local Studio. Hacemos páginas web profesionales para negocios que quieren mostrar servicios, ubicación y contacto de forma clara desde el celular.

También podemos integrar un asistente con IA que responde preguntas frecuentes y guía al cliente hacia WhatsApp.

Pueden ver nuestra página aquí:
{homepage_url}

Tenemos precios de lanzamiento desde $2,500 MXN. Si les interesa, podemos enviarles una propuesta breve.

Si prefieren no recibir más mensajes, respondan “baja”."""
    message = normalize_message(message)
    if len(message) <= MAX_MESSAGE_CHARS:
        return message
    return normalize_message(f"""Hola, buen día.

Somos Nexo Local Studio. Hacemos páginas web profesionales para negocios locales y podemos integrar un asistente con IA que guía al cliente hacia WhatsApp.

Pueden ver nuestra página aquí:
{homepage_url}

Precios de lanzamiento desde $2,500 MXN. Si les interesa, podemos enviarles una propuesta breve.

Si prefieren no recibir más mensajes, respondan “baja”.""")


def normalize_message(message: str) -> str:
    message = message.replace("\r\n", "\n").replace("\r", "\n").strip()
    message = re.sub(r"[ \t]+\n", "\n", message)
    message = re.sub(r"\n{3,}", "\n\n", message)
    return message


def wa_url(phone: str, message: str) -> str:
    return f"https://wa.me/{phone}?text={urllib.parse.quote(message, safe='')}"


def wa_check_url(phone: str) -> str:
    return f"https://wa.me/{phone}"


def decoded_text(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    values = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
    return values.get("text", [""])[0]


def validate_message_url(phone: str, message: str, url: str, homepage_url: str) -> str:
    if not phone or not phone.isdigit():
        return "invalid_phone"
    if phone == AGENCY_WHATSAPP:
        return "agency_number_error"
    if not homepage_url or "localhost" in homepage_url or "YOUR-VERCEL-URL" in homepage_url:
        return "missing_homepage_url"
    if "/demos/" in message or "/demos" in message:
        return "contains_demo_link"
    if "landing" in message.lower():
        return "contains_landing"
    if len(message) > MAX_MESSAGE_CHARS:
        return "message_too_long"
    if not url.startswith(f"https://wa.me/{phone}?text="):
        return "url_encoding_error"
    if decoded_text(url) != message:
        return "url_encoding_error"
    return "url_valid"
