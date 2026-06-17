#!/usr/bin/env python3
"""Open a small batch of WhatsApp prefilled links for manual review.

This script never clicks Send. It only opens wa.me links in the default browser.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import random
import sys
import time
import webbrowser
from pathlib import Path


MAX_LIMIT = 20
DEFAULT_LIMIT = 5
AGENCY_WHATSAPP = "525545609027"


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        return list(reader.fieldnames or []), list(reader)


def write_csv(path: Path, headers: list[str], rows: list[dict[str, str]]) -> None:
    for extra in ["opened_at"]:
        if extra not in headers:
            headers.append(extra)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("queue_csv")
    parser.add_argument("--limit", type=int, default=DEFAULT_LIMIT)
    parser.add_argument("--yes", action="store_true", help="Open the reviewed batch without interactive confirmation.")
    args = parser.parse_args()

    path = Path(args.queue_csv)
    if not path.exists():
        print(f"Queue file not found: {path}", file=sys.stderr)
        return 1
    limit = args.limit
    if limit > MAX_LIMIT:
        print(f"Requested limit {limit} is too high. Capping at {MAX_LIMIT}.")
        limit = MAX_LIMIT
    if limit < 1:
        print("Limit must be at least 1.", file=sys.stderr)
        return 1

    headers, rows = read_csv(path)
    summary = {
        "ready_rows": 0,
        "blocked_not_verified": 0,
        "not_on_whatsapp": 0,
        "needs_review": 0,
        "agency_number_errors": 0,
        "invalid_phones": 0,
    }
    for row in rows:
        status = row.get("status", "")
        verification = row.get("whatsapp_verification_status", "")
        phone_status = row.get("phone_status", "")
        phone = row.get("normalized_phone", "")
        if status == "ready_to_review":
            summary["ready_rows"] += 1
        if status == "blocked_not_verified" or verification in {"pending_manual_check", ""}:
            summary["blocked_not_verified"] += 1
        if verification == "not_on_whatsapp":
            summary["not_on_whatsapp"] += 1
        if verification in {"needs_review", "wrong_number"}:
            summary["needs_review"] += 1
        if phone_status == "agency_number_error" or phone == AGENCY_WHATSAPP:
            summary["agency_number_errors"] += 1
        if phone_status in {"invalid_phone", "missing_phone", "needs_manual_review"}:
            summary["invalid_phones"] += 1

    print("Queue summary:")
    print(f"Ready rows: {summary['ready_rows']}")
    print(f"Blocked not verified: {summary['blocked_not_verified']}")
    print(f"Not on WhatsApp: {summary['not_on_whatsapp']}")
    print(f"Needs review: {summary['needs_review']}")
    print(f"Agency number errors: {summary['agency_number_errors']}")
    print(f"Invalid phones: {summary['invalid_phones']}\n")

    selected: list[dict[str, str]] = []
    for row in rows:
        if len(selected) >= limit:
            break
        if row.get("status") != "ready_to_review":
            continue
        if row.get("phone_status") not in {"valid_format_only", "valid"}:
            continue
        if row.get("whatsapp_verification_status") != "exists_on_whatsapp":
            continue
        if row.get("url_validation_status") != "url_valid":
            continue
        if row.get("normalized_phone") == AGENCY_WHATSAPP:
            continue
        if row.get("status") in {"do_not_contact", "baja", "suppressed"}:
            continue
        url = row.get("whatsapp_url", "").strip()
        if not url.startswith("https://wa.me/"):
            continue
        selected.append(row)

    if not selected:
        print("No ready, valid WhatsApp rows found.")
        return 0

    print(f"About to open {len(selected)} verified WhatsApp chats.")
    print("No messages will be sent automatically.")
    print("You must review each chat and press Send manually.\n")
    for row in selected:
        message = (row.get("message") or "").replace("\n", " ")
        preview = message[:120] + ("..." if len(message) > 120 else "")
        print(f"- {row.get('business_name')} | {row.get('normalized_phone')} | chars={row.get('message_char_count')} | url_len={row.get('encoded_url_length')}")
        print(f"  {preview}")

    if not args.yes:
        answer = input("\nContinue? [y/N] ").strip().lower()
        if answer not in {"y", "yes", "s", "si", "sí"}:
            print("Cancelled. No WhatsApp chats were opened.")
            return 0

    opened = 0
    now = dt.datetime.now().isoformat(timespec="seconds")
    selected_ids = {id(row) for row in selected}
    for row in rows:
        if id(row) not in selected_ids:
            continue
        url = row.get("whatsapp_url", "").strip()
        print(f"Opening for manual review: {row.get('business_name')} -> {url[:80]}...")
        webbrowser.open(url)
        row["status"] = "opened_for_manual_send"
        row["opened_at"] = now
        opened += 1
        time.sleep(random.uniform(4, 6))

    write_csv(path, headers, rows)
    print(f"Opened {opened} WhatsApp links. You must manually review and press Send.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
