#!/usr/bin/env python3
"""Validate WhatsApp outreach queue before opening any chats."""

from __future__ import annotations

import csv
import json
import re
import sys
import urllib.parse
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SUPPRESSION_PATH = ROOT / "outreach" / "whatsapp_suppression_list.csv"
AGENCY_WHATSAPP = "525545609027"
MAX_MESSAGE_CHARS = 360
MAX_URL_CHARS = 650
VALID_STATUSES = {
    "ready_to_review", "opened_for_manual_send", "sent_manual", "replied", "interested",
    "proposal_sent", "closed", "no_response", "follow_up_due", "follow_up_1_sent",
    "follow_up_2_sent", "not_interested", "do_not_contact", "baja", "blocked", "suppressed",
}


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def ensure_suppression_list() -> None:
    if SUPPRESSION_PATH.exists():
        return
    with SUPPRESSION_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["normalized_phone", "business_name", "reason", "date_added"])
        writer.writeheader()


def suppressed_numbers() -> set[str]:
    ensure_suppression_list()
    return {row.get("normalized_phone", "").strip() for row in read_csv(SUPPRESSION_PATH) if row.get("normalized_phone", "").strip()}


def decoded_text_from_url(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    values = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
    return values.get("text", [""])[0]


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python3 outreach/scripts/validate_whatsapp_queue.py outreach/whatsapp_outreach_queue.csv", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    if not path.exists():
        print(f"Queue file not found: {path}", file=sys.stderr)
        return 1

    rows = read_csv(path)
    suppressed = suppressed_numbers()
    seen: dict[str, str] = {}
    report = {
        "rows": len(rows),
        "missing_business_name": 0,
        "missing_phone_rows": 0,
        "invalid_phone_rows": 0,
        "invalid_ready_phone": 0,
        "agency_number_errors": 0,
        "ready_agency_number_errors": 0,
        "missing_message": 0,
        "missing_homepage_url": 0,
        "invalid_whatsapp_url": 0,
        "ready_invalid_whatsapp_url": 0,
        "url_encoding_errors": 0,
        "ready_url_encoding_errors": 0,
        "message_too_long": 0,
        "url_too_long": 0,
        "messages_under_limit": 0,
        "messages_with_demo_links": 0,
        "messages_with_placeholder_url": 0,
        "messages_with_localhost": 0,
        "invalid_status": 0,
        "duplicate_phone_same_business": 0,
        "suppressed": 0,
        "ready_suppressed": 0,
        "do_not_contact_rows": 0,
        "ready_to_review": 0,
        "ready_rows_with_invalid_flags": 0,
    }
    for row in rows:
        business = row.get("business_name", "").strip()
        phone = row.get("normalized_phone", "").strip()
        phone_status = row.get("phone_status", "").strip()
        url_validation_status = row.get("url_validation_status", "").strip()
        message = row.get("message", "")
        status = row.get("status", "").strip()
        is_ready = status == "ready_to_review"
        if not business:
            report["missing_business_name"] += 1
        if not phone:
            report["missing_phone_rows"] += 1
        elif not re.fullmatch(r"\d{11,15}", phone) or not phone.startswith("52"):
            report["invalid_phone_rows"] += 1
            if is_ready:
                report["invalid_ready_phone"] += 1
        if phone_status != "valid" and is_ready:
            report["invalid_ready_phone"] += 1
        if phone == AGENCY_WHATSAPP or phone_status == "agency_number_error":
            report["agency_number_errors"] += 1
            if is_ready:
                report["ready_agency_number_errors"] += 1
        if not message.strip():
            report["missing_message"] += 1
        if not row.get("homepage_url", "").strip():
            report["missing_homepage_url"] += 1
        whatsapp_url = row.get("whatsapp_url", "")
        if not whatsapp_url.startswith("https://wa.me/"):
            report["invalid_whatsapp_url"] += 1
            if is_ready:
                report["ready_invalid_whatsapp_url"] += 1
        elif decoded_text_from_url(whatsapp_url) != message:
            report["url_encoding_errors"] += 1
            if is_ready:
                report["ready_url_encoding_errors"] += 1
        if len(message) > MAX_MESSAGE_CHARS:
            report["message_too_long"] += 1
        else:
            report["messages_under_limit"] += 1
        if len(whatsapp_url) > MAX_URL_CHARS:
            report["url_too_long"] += 1
        if "/demos/" in message or "/demos/" in row.get("whatsapp_url", ""):
            report["messages_with_demo_links"] += 1
        if "YOUR-VERCEL-URL" in message or "YOUR-VERCEL-URL" in row.get("homepage_url", ""):
            report["messages_with_placeholder_url"] += 1
        if "localhost" in message or "localhost" in row.get("homepage_url", ""):
            report["messages_with_localhost"] += 1
        if url_validation_status != "url_valid" and is_ready and decoded_text_from_url(whatsapp_url) == message:
            report["ready_url_encoding_errors"] += 1
        if status not in VALID_STATUSES:
            report["invalid_status"] += 1
        if phone in suppressed:
            report["suppressed"] += 1
            if is_ready:
                report["ready_suppressed"] += 1
        if status in {"do_not_contact", "baja"}:
            report["do_not_contact_rows"] += 1
        if is_ready:
            report["ready_to_review"] += 1
            if phone_status != "valid" or url_validation_status != "url_valid" or phone in suppressed:
                report["ready_rows_with_invalid_flags"] += 1
        if phone:
            previous = seen.get(phone)
            if previous and previous == business:
                report["duplicate_phone_same_business"] += 1
            seen[phone] = business

    print(json.dumps(report, ensure_ascii=False, indent=2))
    blocking_keys = {
        "missing_business_name",
        "missing_message",
        "missing_homepage_url",
        "ready_invalid_whatsapp_url",
        "ready_url_encoding_errors",
        "ready_agency_number_errors",
        "ready_suppressed",
        "invalid_ready_phone",
        "invalid_status",
        "ready_rows_with_invalid_flags",
        "messages_with_demo_links",
        "messages_with_placeholder_url",
        "messages_with_localhost",
        "message_too_long",
        "url_too_long",
    }
    errors = sum(report[key] for key in blocking_keys)
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
