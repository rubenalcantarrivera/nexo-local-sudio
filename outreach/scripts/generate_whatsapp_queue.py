#!/usr/bin/env python3
"""Generate human-reviewed wa.me outreach links.

No messages are sent. The output is a review queue with prefilled WhatsApp URLs.
"""

from __future__ import annotations

import csv
import sys
import urllib.parse
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SUPPRESSION_PATH = ROOT / "outreach" / "whatsapp_suppression_list.csv"
DEFAULT_HOMEPAGE = "https://nexo-local-studio-public.vercel.app"
DEMO_MAP = {
    "dental": "/demos/dental",
    "clínica estética": "/demos/estetica",
    "clinica estetica": "/demos/estetica",
    "óptica": "/demos/optica",
    "optica": "/demos/optica",
    "fisioterapia": "/demos/fisioterapia",
    "abogado": "/demos/abogado-migratorio",
    "restaurante": "/demos/restaurante",
    "veterinaria": "/demos/veterinaria",
    "arquitectura": "/demos/arquitectura",
    "interiorismo": "/demos/arquitectura",
    "psicología": "/demos/psicologia",
    "psicologia": "/demos/psicologia",
    "nutrición": "/demos/nutricion",
    "nutricion": "/demos/nutricion",
}
QUEUE_COLUMNS = [
    "priority", "score", "business_name", "niche", "city", "zone", "normalized_phone",
    "whatsapp_url", "message", "demo_url", "homepage_url", "status", "last_contacted",
    "follow_up_date", "response_status", "opened_at", "follow_up_url", "follow_up_message", "notes",
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


def demo_url_for(row: dict[str, str]) -> str:
    current = row.get("demo_url", "").strip()
    if current:
        return current
    homepage = row.get("homepage_url", "").strip() or DEFAULT_HOMEPAGE
    niche = row.get("niche", "").lower()
    for key, path in DEMO_MAP.items():
        if key in niche:
            return homepage.rstrip("/") + path
    return ""


def greeting(row: dict[str, str]) -> str:
    person = row.get("contact_person", "").strip()
    if person and person.lower() != "no público":
        return person
    return row.get("business_name", "").strip()


def first_message(row: dict[str, str], demo_url: str) -> str:
    business = row.get("business_name", "").strip()
    return f"""Hola, {greeting(row)}. Vi que {business} ya tiene presencia en Google Maps y señales de reputación local.

Trabajo bajo la marca Nexo Local Studio. Hacemos páginas web rápidas y profesionales para negocios locales, conectadas a WhatsApp, ubicación y formularios.

Te comparto un ejemplo para negocios de tu sector:
{demo_url}

La idea es que tus clientes puedan ver servicios, ubicación, reseñas y escribirte fácilmente desde el celular.

Tenemos precios de lanzamiento desde $2,500 MXN.

Si te interesa, puedo enviarte una propuesta breve.

Si no eres la persona indicada o prefieres no recibir más mensajes, dime “baja” y no vuelvo a contactarte."""


def wa_url(phone: str, message: str) -> str:
    return f"https://wa.me/{phone}?text={urllib.parse.quote(message)}"


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
        row_status = row.get("status", "").strip()
        if row.get("phone_status") == "invalid_phone" or not phone or row_status in {"do_not_contact", "baja"}:
            skipped += 1
            continue
        if phone in suppressed:
            skipped += 1
            continue
        demo_url = demo_url_for(row)
        if not demo_url:
            skipped += 1
            continue
        homepage = row.get("homepage_url", "").strip() or DEFAULT_HOMEPAGE
        message = first_message(row, demo_url)
        output_rows.append({
            "priority": row.get("priority", ""),
            "score": row.get("score", ""),
            "business_name": row.get("business_name", ""),
            "niche": row.get("niche", ""),
            "city": row.get("city", ""),
            "zone": row.get("zone", ""),
            "normalized_phone": phone,
            "whatsapp_url": wa_url(phone, message),
            "message": message,
            "demo_url": demo_url,
            "homepage_url": homepage,
            "status": "ready_to_review",
            "last_contacted": "",
            "follow_up_date": "",
            "response_status": "",
            "opened_at": "",
            "follow_up_url": "",
            "follow_up_message": "",
            "notes": row.get("notes", ""),
        })

    write_csv(output_path, output_rows)
    print(f"Queue rows generated: {len(output_rows)}")
    print(f"Skipped rows: {skipped}")
    print(f"Wrote: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
