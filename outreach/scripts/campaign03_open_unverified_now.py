#!/usr/bin/env python3
"""Open Campaign 03 WhatsApp messages without prior WhatsApp verification.

This is intentionally a manual-send workflow: it only opens wa.me links with
prefilled text. It never clicks Send and never uses unofficial WhatsApp APIs.
"""

from __future__ import annotations

import argparse
import time
import webbrowser
from pathlib import Path

from campaign03_common import (
    AGENCY_WHATSAPP,
    HOMEPAGE_URL,
    MAX_MESSAGE_CHARS,
    first_message,
    normalize_phone,
    now_iso,
    read_csv,
    validate_message_url,
    wa_url,
    write_csv,
)


LOG_COLUMNS = [
    "opened_at",
    "business_name",
    "country",
    "city",
    "original_phone",
    "normalized_phone",
    "whatsapp_url",
    "message_char_count",
    "status",
    "notes",
]


def suppression_numbers(campaign: Path) -> set[str]:
    rows = read_csv(campaign / "whatsapp_suppression_list.csv")
    return {row.get("normalized_phone", "").strip() for row in rows if row.get("normalized_phone", "").strip()}


def choose_rows(campaign: Path) -> list[dict[str, str]]:
    qualified = read_csv(campaign / "qualified_prospects.csv")
    if qualified:
        return qualified
    queue = read_csv(campaign / "whatsapp_outreach_queue.csv")
    if queue:
        return queue
    return []


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--campaign", required=True)
    parser.add_argument("--limit", type=int, default=250)
    parser.add_argument("--delay", type=float, default=5.0)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    campaign = Path(args.campaign)
    rows = choose_rows(campaign)
    if not rows:
        print(f"No usable rows found in campaign: {campaign}")
        return 1

    limit = min(max(args.limit, 1), 250)
    delay = max(args.delay, 0.2)
    suppressed = suppression_numbers(campaign)
    message = first_message(HOMEPAGE_URL)
    log_path = campaign / "opened_unverified_whatsapp_links_log.csv"
    logs: list[dict[str, str]] = read_csv(log_path)
    opened = 0
    skipped = 0
    seen_phones: set[str] = set()

    print(f"Opening up to {limit} WhatsApp chats.")
    print("No messages will be sent automatically. You must press Send manually in WhatsApp.")

    for row in rows:
        if opened >= limit:
            break
        original_phone = row.get("phone") or row.get("original_phone") or row.get("normalized_phone", "")
        country = row.get("country", "Mexico")
        normalized_phone = row.get("normalized_phone", "").strip()
        phone_status = row.get("phone_status", "").strip()
        if not normalized_phone or not normalized_phone.isdigit():
            normalized_phone, phone_status, _ = normalize_phone(original_phone, country)

        status = "opened"
        notes = ""
        url = wa_url(normalized_phone, message) if normalized_phone else ""
        validation = validate_message_url(normalized_phone, message, url, HOMEPAGE_URL) if normalized_phone else "invalid_phone"

        if not normalized_phone or phone_status in {"missing_phone", "invalid_phone", "needs_manual_review"}:
            status = "skipped_invalid_phone"
        elif normalized_phone == AGENCY_WHATSAPP:
            status = "skipped_agency_number"
        elif normalized_phone in suppressed:
            status = "skipped_suppressed"
        elif normalized_phone in seen_phones:
            status = "skipped_duplicate"
        elif validation != "url_valid":
            status = f"skipped_{validation}"
        elif len(message) > MAX_MESSAGE_CHARS:
            status = "skipped_message_too_long"

        log_row = {
            "opened_at": now_iso() if status == "opened" and not args.dry_run else "",
            "business_name": row.get("business_name", ""),
            "country": country,
            "city": row.get("city", ""),
            "original_phone": original_phone,
            "normalized_phone": normalized_phone,
            "whatsapp_url": url,
            "message_char_count": str(len(message)),
            "status": status,
            "notes": notes,
        }

        if status != "opened":
            skipped += 1
            continue

        seen_phones.add(normalized_phone)
        opened += 1
        verb = "Would open" if args.dry_run else "Opening"
        print(f"[{opened}/{limit}] {verb} {normalized_phone}")
        if not args.dry_run:
            logs.append(log_row)
            webbrowser.open(url)
            time.sleep(delay)

    if not args.dry_run:
        write_csv(log_path, logs, LOG_COLUMNS)
    print(f"Opened: {opened}")
    print(f"Skipped: {skipped}")
    if not args.dry_run:
        print(f"Log: {log_path}")
    if args.dry_run:
        print("Dry run only; no browser tabs were opened.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
