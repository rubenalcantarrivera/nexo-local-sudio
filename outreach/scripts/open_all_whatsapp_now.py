#!/usr/bin/env python3
"""Open WhatsApp chats directly with prefilled messages.

This script does not send messages, click buttons, use WhatsApp Web automation,
or call unofficial APIs. It only opens wa.me links in the default browser.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import os
import re
import sys
import time
import urllib.parse
import webbrowser
from pathlib import Path


AGENCY_WHATSAPP = "525545609027"
DEFAULT_LIMIT = 50
MAX_LIMIT = 100
DEFAULT_DELAY = 1.0
MAX_MESSAGE_CHARS = 650

LOG_COLUMNS = [
    "opened_at",
    "business_name",
    "original_phone",
    "normalized_phone",
    "whatsapp_url",
    "message_char_count",
    "status",
    "notes",
]


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    if not path.exists():
        return [], []
    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        return list(reader.fieldnames or []), list(reader)


def append_csv(path: Path, rows: list[dict[str, str]], columns: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    exists = path.exists()
    with path.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        if not exists:
            writer.writeheader()
        writer.writerows(rows)


def normalize_phone(value: str) -> tuple[str, str]:
    original = value or ""
    no_ext = re.sub(r"(?:\bext\.?|\bextension\b|\bextensión\b|\bx)\s*\d+.*$", "", original, flags=re.I)
    digits = re.sub(r"\D+", "", no_ext)
    if digits.startswith("00"):
        digits = digits[2:]
    if not digits:
        return "", "missing_phone"
    if len(digits) == 10:
        return "52" + digits, "valid"
    if len(digits) == 12 and digits.startswith("52"):
        return digits, "valid"
    if len(digits) == 13 and digits.startswith("521"):
        return "52" + digits[-10:], "valid"
    return "", "invalid_phone"


def clean_homepage_url(value: str) -> str:
    url = (value or "").strip().rstrip("/")
    if not url:
        return ""
    if "localhost" in url or "YOUR-VERCEL-URL" in url:
        return ""
    if "/demos/" in url:
        return url.split("/demos/", 1)[0].rstrip("/")
    if url.endswith("/demos"):
        return url[:-6].rstrip("/")
    return url


def find_homepage_url(campaign: Path, rows: list[dict[str, str]]) -> str:
    env_url = clean_homepage_url(os.environ.get("NEXO_PUBLIC_URL", ""))
    if env_url:
        return env_url
    for row in rows:
        url = clean_homepage_url(row.get("homepage_url", ""))
        if url:
            return url
    for relative in ["docs/LINKS_TO_SEND.md", "outreach/README_WHATSAPP_OUTREACH.md", "README.md"]:
        path = Path(relative)
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        match = re.search(r"https://nexo-local-studio-public\.vercel\.app(?!/demos/?)", text)
        if match:
            return match.group(0).rstrip("/")
    return ""


def message_template(homepage_url: str) -> str:
    return f"""Hola, buen día.

Somos Nexo Local Studio. Hacemos páginas web rápidas y profesionales para negocios locales, conectadas a WhatsApp, ubicación y formularios.

Pueden ver nuestra página aquí:
{homepage_url}

Tenemos precios de lanzamiento desde $2,500 MXN.

Si les interesa, podemos enviarles una propuesta breve. Si prefieren no recibir más mensajes, pueden responder “baja”.""".strip()


def wa_url(phone: str, message: str) -> str:
    return f"https://wa.me/{phone}?text={urllib.parse.quote(message, safe='')}"


def decoded_text_from_url(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    return urllib.parse.parse_qs(parsed.query, keep_blank_values=True).get("text", [""])[0]


def suppression_numbers(campaign: Path) -> set[str]:
    numbers: set[str] = set()
    for path in [campaign / "whatsapp_suppression_list.csv", Path("outreach/whatsapp_suppression_list.csv")]:
        _, rows = read_csv(path)
        for row in rows:
            phone = row.get("normalized_phone", "").strip()
            if phone:
                numbers.add(phone)
    return numbers


def source_files(campaign: Path) -> list[Path]:
    return [
        campaign / "whatsapp_outreach_queue.csv",
        campaign / "whatsapp_manual_channels.csv",
        campaign / "qualified_prospects.csv",
    ]


def row_has_usable_phone(row: dict[str, str]) -> bool:
    phone, status = normalize_phone(row.get("normalized_phone") or row.get("phone") or row.get("original_phone") or "")
    return bool(phone and status == "valid")


def load_best_rows(campaign: Path) -> tuple[Path, list[dict[str, str]]]:
    for path in source_files(campaign):
        _, rows = read_csv(path)
        if not rows:
            continue
        if any(row_has_usable_phone(row) for row in rows):
            return path, rows
    return Path(), []


def row_status_blocked(row: dict[str, str]) -> bool:
    return row.get("status", "").strip() in {"do_not_contact", "baja", "suppressed"}


def build_links(campaign: Path, rows: list[dict[str, str]], limit: int) -> tuple[list[dict[str, str]], list[dict[str, str]], str]:
    homepage_url = find_homepage_url(campaign, rows)
    if not homepage_url:
        print("Missing homepage URL. Set NEXO_PUBLIC_URL first.", file=sys.stderr)
        raise SystemExit(1)
    message = message_template(homepage_url)
    suppressed = suppression_numbers(campaign)
    seen_phones: set[str] = set()
    opened: list[dict[str, str]] = []
    skipped: list[dict[str, str]] = []

    for row in rows:
        if len(opened) >= limit:
            break
        business_name = row.get("business_name", "")
        original_phone = row.get("phone") or row.get("original_phone") or row.get("normalized_phone") or ""
        normalized_phone, phone_status = normalize_phone(row.get("normalized_phone") or original_phone)
        base_log = {
            "opened_at": "",
            "business_name": business_name,
            "original_phone": original_phone,
            "normalized_phone": normalized_phone,
            "whatsapp_url": "",
            "message_char_count": str(len(message)),
            "status": "",
            "notes": "",
        }

        if row_status_blocked(row):
            skipped.append({**base_log, "status": "skipped_suppressed", "notes": "Row status blocks outreach."})
            continue
        if not normalized_phone or phone_status != "valid":
            skipped.append({**base_log, "status": "skipped_invalid_phone", "notes": "Phone could not be normalized."})
            continue
        if normalized_phone == AGENCY_WHATSAPP:
            skipped.append({**base_log, "status": "skipped_agency_number", "notes": "Recipient equals agency WhatsApp number."})
            continue
        if normalized_phone in suppressed:
            skipped.append({**base_log, "status": "skipped_suppressed", "notes": "Phone is in suppression list."})
            continue
        if normalized_phone in seen_phones:
            skipped.append({**base_log, "status": "skipped_duplicate", "notes": "Duplicate normalized phone in this run."})
            continue
        if not homepage_url:
            skipped.append({**base_log, "status": "skipped_no_homepage_url", "notes": "Missing homepage URL."})
            continue
        if len(message) > MAX_MESSAGE_CHARS or "/demos/" in message or "localhost" in message or "YOUR-VERCEL-URL" in message:
            skipped.append({**base_log, "status": "skipped_url_encoding_error", "notes": "Message failed safety checks."})
            continue

        url = wa_url(normalized_phone, message)
        if decoded_text_from_url(url) != message:
            skipped.append({**base_log, "status": "skipped_url_encoding_error", "notes": "Decoded text does not match original message."})
            continue

        seen_phones.add(normalized_phone)
        opened.append({
            **base_log,
            "whatsapp_url": url,
            "status": "opened",
            "notes": "Opened wa.me link with prefilled message." if not row.get("whatsapp_verification_status") else f"Verification status: {row.get('whatsapp_verification_status')}",
        })

    return opened, skipped, homepage_url


def write_summary(campaign: Path, source_path: Path, scanned: int, opened: list[dict[str, str]], skipped: list[dict[str, str]], homepage_url: str, dry_run: bool) -> None:
    counts: dict[str, int] = {}
    for row in skipped:
        counts[row["status"]] = counts.get(row["status"], 0) + 1
    summary = f"""timestamp: {dt.datetime.now().isoformat(timespec="seconds")}
campaign path: {campaign}
source file: {source_path}
dry run: {dry_run}
rows scanned: {scanned}
rows opened: {len(opened)}
rows skipped: {len(skipped)}
skipped invalid phones: {counts.get("skipped_invalid_phone", 0)}
skipped agency number: {counts.get("skipped_agency_number", 0)}
skipped suppressed: {counts.get("skipped_suppressed", 0)}
skipped encoding errors: {counts.get("skipped_url_encoding_error", 0)}
skipped duplicate: {counts.get("skipped_duplicate", 0)}
homepage URL used: {homepage_url}
message template used:
{message_template(homepage_url)}
"""
    (campaign / "open_all_summary.txt").write_text(summary, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--campaign", required=True)
    parser.add_argument("--limit", type=int, default=DEFAULT_LIMIT)
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    campaign = Path(args.campaign)
    if not campaign.exists():
        print(f"Campaign folder not found: {campaign}", file=sys.stderr)
        return 1
    limit = max(1, min(args.limit, MAX_LIMIT))
    delay = max(0, args.delay)
    source_path, rows = load_best_rows(campaign)
    if not rows:
        print("No usable campaign data found.", file=sys.stderr)
        return 1

    opened, skipped, homepage_url = build_links(campaign, rows, limit)
    write_summary(campaign, source_path, len(rows), opened, skipped, homepage_url, args.dry_run)

    print(f"Opening {len(opened)} WhatsApp chats.")
    print("No messages will be sent automatically.")
    print("You must press Send manually in WhatsApp.")
    print(f"Skipped {len(skipped)} rows.")

    if args.dry_run:
        print("Dry run only. No WhatsApp chats were opened.")
        return 0

    now = dt.datetime.now().isoformat(timespec="seconds")
    log_rows: list[dict[str, str]] = []
    for row in opened:
        webbrowser.open(row["whatsapp_url"])
        log_rows.append({**row, "opened_at": now})
        time.sleep(delay)
    log_rows.extend(skipped)
    append_csv(campaign / "opened_whatsapp_links_log.csv", log_rows, LOG_COLUMNS)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
