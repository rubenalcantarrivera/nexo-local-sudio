#!/usr/bin/env python3
"""Update WhatsApp follow-up dates and prefilled follow-up URLs.

No messages are sent. This only updates statuses and wa.me links for manual review.
"""

from __future__ import annotations

import csv
import datetime as dt
import re
import sys
import urllib.parse
from pathlib import Path


SKIP_STATUSES = {"replied", "interested", "proposal_sent", "closed", "not_interested", "do_not_contact", "baja"}
DATE_FMT = "%Y-%m-%d"
DEFAULT_HOMEPAGE = "https://nexo-local-studio-public.vercel.app"


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        return list(reader.fieldnames or []), list(reader)


def write_csv(path: Path, headers: list[str], rows: list[dict[str, str]]) -> None:
    for extra in ["follow_up_url", "follow_up_message", "follow_up_date", "follow_up_url_validation_status"]:
        if extra not in headers:
            headers.append(extra)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def parse_date(value: str) -> dt.date | None:
    value = (value or "").strip()
    if not value:
        return None
    for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S"):
        try:
            return dt.datetime.strptime(value[:19], fmt).date()
        except ValueError:
            pass
    return None


def wa_url(phone: str, message: str) -> str:
    return f"https://wa.me/{phone}?text={urllib.parse.quote(message, safe='')}"


def normalize_message(message: str) -> str:
    message = message.replace("\r\n", "\n").replace("\r", "\n").strip()
    message = re.sub(r"[ \t]+\n", "\n", message)
    message = re.sub(r"\n{3,}", "\n\n", message)
    message = re.sub(r"\s+", " ", message)
    return message


def homepage_url_for(row: dict[str, str]) -> str:
    return (row.get("homepage_url", "").strip() or DEFAULT_HOMEPAGE).rstrip("/")


def decoded_text_from_url(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    values = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
    return values.get("text", [""])[0]


def validated_follow_up_url(phone: str, message: str) -> tuple[str, str]:
    url = wa_url(phone, message)
    return url, "url_valid" if decoded_text_from_url(url) == message else "url_encoding_error"


def follow_up_1(row: dict[str, str]) -> str:
    return normalize_message(
        f"Hola, {row.get('business_name')}. Solo retomo el mensaje anterior. "
        f"Te comparti la pagina de Nexo Local Studio: {homepage_url_for(row)}. "
        "Hacemos paginas web profesionales para negocios locales, conectadas a WhatsApp, ubicacion y formularios. "
        "Si tiene sentido, puedo enviarte una propuesta breve con alcance, tiempo y precio. "
        "Si prefieres no recibir mas mensajes, dime baja."
    )


def follow_up_2(row: dict[str, str]) -> str:
    return normalize_message(
        f"Hola, {row.get('business_name')}. Cierro por aqui para no insistir de mas. "
        f"Si mas adelante quieren una pagina web clara, profesional y conectada a WhatsApp, aqui esta Nexo Local Studio: {homepage_url_for(row)}. "
        "Saludos, Ruben. Nexo Local Studio. 55 4560 9027. "
        "Si prefieres no recibir mas mensajes, dime baja."
    )


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python3 outreach/scripts/update_followups.py outreach/whatsapp_outreach_queue.csv", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    if not path.exists():
        print(f"Queue file not found: {path}", file=sys.stderr)
        return 1

    headers, rows = read_csv(path)
    today = dt.date.today()
    updated = 0
    for row in rows:
        status = row.get("status", "")
        if status in SKIP_STATUSES:
            continue
        phone = row.get("normalized_phone", "")
        if not phone:
            continue
        last_contacted = parse_date(row.get("last_contacted", ""))
        if status == "sent_manual" and last_contacted:
            row["follow_up_date"] = (last_contacted + dt.timedelta(days=2)).isoformat()
            row["response_status"] = row.get("response_status") or "awaiting_response"
            updated += 1
        elif status == "no_response":
            due = parse_date(row.get("follow_up_date", ""))
            if due and due <= today:
                message = follow_up_1(row)
                follow_url, validation_status = validated_follow_up_url(phone, message)
                row["status"] = "follow_up_due"
                row["follow_up_message"] = message
                row["follow_up_url"] = follow_url
                row["follow_up_url_validation_status"] = validation_status
                updated += 1
        elif status == "follow_up_1_sent" and last_contacted:
            if last_contacted + dt.timedelta(days=5) <= today:
                message = follow_up_2(row)
                follow_url, validation_status = validated_follow_up_url(phone, message)
                row["status"] = "follow_up_due"
                row["follow_up_message"] = message
                row["follow_up_url"] = follow_url
                row["follow_up_url_validation_status"] = validation_status
                row["follow_up_date"] = today.isoformat()
                updated += 1

    write_csv(path, headers, rows)
    print(f"Updated rows: {updated}")
    print("No messages were sent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
