#!/usr/bin/env python3
"""Generate review-only outreach emails and manual-channel messages."""

from __future__ import annotations

import csv
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MANUAL_CHANNELS_PATH = ROOT / "outreach" / "manual_channels.csv"
EMAIL_RE = re.compile(r"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$", re.I)
READY_COLUMNS = [
    "business_name", "email", "subject", "email_body", "demo_url", "homepage_url",
    "recommended_channel", "status", "email_status", "notes",
]
MANUAL_COLUMNS = [
    "business_name", "niche", "phone", "instagram", "google_maps_url",
    "recommended_channel", "message", "demo_url", "status",
]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, str]], columns: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def valid_email(email: str) -> bool:
    return bool(EMAIL_RE.fullmatch((email or "").strip()))


def greeting_name(row: dict[str, str]) -> str:
    person = row.get("contact_person", "").strip()
    if person and person.lower() != "no público":
        return person
    return row.get("business_name", "").strip()


def website_sentence(status: str) -> str:
    normalized = status.lower()
    if "only instagram" in normalized or "facebook" in normalized:
        return "vi que su presencia digital parece concentrarse principalmente en redes sociales."
    if "weak" in normalized or "outdated" in normalized or "not mobile" in normalized:
        return "su página actual podría presentar mejor servicios, ubicación y contacto desde celular."
    if "broken" in normalized or "expired" in normalized:
        return "el enlace web público parece no estar funcionando correctamente."
    return "no encontré una página web oficial clara enlazada desde su perfil público."


def subject_for(row: dict[str, str]) -> str:
    return f"Página web para {row.get('business_name', '').strip()}"


def email_body(row: dict[str, str]) -> str:
    business_name = row.get("business_name", "").strip()
    demo_url = row.get("demo_url", "").strip()
    sentence = website_sentence(row.get("website_status", ""))
    return f"""Hola, {greeting_name(row)}.

Vi que {business_name} ya tiene presencia en Google Maps y señales claras de reputación local. También noté que {sentence}

Trabajo bajo la marca Nexo Local Studio. Hacemos páginas web rápidas y profesionales para negocios locales, conectadas a WhatsApp, ubicación y formularios.

Te comparto un ejemplo para negocios de tu sector:
{demo_url}

La idea es que tus clientes puedan ver servicios, ubicación, reseñas y escribirte fácilmente desde el celular.

Tenemos precios de lanzamiento desde $2,500 MXN, con opciones de $4,500 y $6,500 según el nivel de detalle.

Si te interesa, puedo enviarte una propuesta breve.

Saludos,
Ruben
Nexo Local Studio
nexo.local.studio@gmail.com
55 4560 9027

Si no eres la persona indicada o prefieres no recibir más mensajes, responde “baja” y no vuelvo a contactarte."""


def manual_message(row: dict[str, str]) -> str:
    return f"""Hola, {row.get('business_name', '').strip()}. Vi que tienen presencia en Google Maps y señales de reputación local.

Trabajo bajo la marca Nexo Local Studio. Hacemos páginas web rápidas y profesionales para negocios locales, conectadas a WhatsApp, ubicación y formularios.

Te comparto un ejemplo para negocios de tu sector:
{row.get('demo_url', '').strip()}

Tenemos precios de lanzamiento desde $2,500 MXN. Si te interesa, puedo enviarte una propuesta breve."""


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python3 outreach/scripts/generate_outreach_emails.py outreach/enriched_prospects.csv outreach/ready_to_draft.csv", file=sys.stderr)
        return 2
    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    if not input_path.exists():
        print(f"File not found: {input_path}", file=sys.stderr)
        return 1

    rows = read_csv(input_path)
    ready: list[dict[str, str]] = []
    manual: list[dict[str, str]] = []
    for row in rows:
        email = row.get("email", "").strip().lower()
        email_status = row.get("email_status", "").strip()
        if email_status == "public_email_found" and valid_email(email):
            ready.append({
                "business_name": row.get("business_name", ""),
                "email": email,
                "subject": subject_for(row),
                "email_body": email_body(row),
                "demo_url": row.get("demo_url", ""),
                "homepage_url": row.get("homepage_url", ""),
                "recommended_channel": "email",
                "status": "ready_to_review",
                "email_status": email_status,
                "notes": row.get("verification_notes", ""),
            })
        else:
            manual.append({
                "business_name": row.get("business_name", ""),
                "niche": row.get("niche", ""),
                "phone": row.get("phone", ""),
                "instagram": row.get("instagram", ""),
                "google_maps_url": row.get("google_maps_url", ""),
                "recommended_channel": row.get("recommended_channel", "manual"),
                "message": manual_message(row),
                "demo_url": row.get("demo_url", ""),
                "status": "manual_review",
            })

    write_csv(output_path, ready, READY_COLUMNS)
    write_csv(MANUAL_CHANNELS_PATH, manual, MANUAL_COLUMNS)
    print(f"Ready to review/draft: {len(ready)}")
    print(f"Manual channel rows: {len(manual)}")
    print(f"Wrote: {output_path}")
    print(f"Wrote: {MANUAL_CHANNELS_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
