#!/usr/bin/env python3
"""Generate Campaign 03 WhatsApp outreach queue from manually verified numbers."""

from __future__ import annotations

import argparse
from pathlib import Path

from campaign03_common import (
    AGENCY_WHATSAPP,
    HOMEPAGE_URL,
    MAX_MESSAGE_CHARS,
    QUEUE_COLUMNS,
    first_message,
    read_csv,
    validate_message_url,
    wa_url,
    write_csv,
)


def suppression_numbers(campaign: Path) -> set[str]:
    rows = read_csv(campaign / "whatsapp_suppression_list.csv")
    return {row.get("normalized_phone", "").strip() for row in rows if row.get("normalized_phone", "").strip()}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--campaign", required=True)
    args = parser.parse_args()

    campaign = Path(args.campaign)
    qualified = read_csv(campaign / "qualified_prospects.csv")
    verification = read_csv(campaign / "whatsapp_number_verification_queue.csv")
    by_phone = {row.get("normalized_phone", ""): row for row in verification}
    suppressed = suppression_numbers(campaign)

    message = first_message(HOMEPAGE_URL)
    queue_rows: list[dict[str, str]] = []
    for row in qualified:
        phone = row.get("normalized_phone", "").strip()
        verification_row = by_phone.get(phone, {})
        verification_status = verification_row.get("verification_status", "pending_manual_check")
        url = wa_url(phone, message) if phone else ""
        url_validation = validate_message_url(phone, message, url, HOMEPAGE_URL)
        status = "ready_to_send"
        notes = row.get("verification_notes", "")

        if verification_status != "exists_on_whatsapp":
            status = "blocked_not_verified"
        elif phone == AGENCY_WHATSAPP:
            status = "blocked_agency_number"
        elif phone in suppressed:
            status = "suppressed"
        elif url_validation != "url_valid":
            status = "blocked_url_invalid"
        elif len(message) > MAX_MESSAGE_CHARS:
            status = "blocked_message_too_long"

        queue_rows.append({
            "priority": row.get("priority", ""),
            "score": row.get("score", ""),
            "business_name": row.get("business_name", ""),
            "niche": row.get("niche", ""),
            "country": row.get("country", ""),
            "city": row.get("city", ""),
            "zone": row.get("zone", ""),
            "normalized_phone": phone,
            "verification_status": verification_status,
            "message": message,
            "homepage_url": HOMEPAGE_URL,
            "whatsapp_url": url,
            "message_char_count": str(len(message)),
            "encoded_url_length": str(len(url)),
            "url_validation_status": url_validation,
            "status": status,
            "last_contacted": "",
            "follow_up_date": "",
            "response_status": "",
            "notes": notes,
        })

    output = campaign / "whatsapp_outreach_queue.csv"
    write_csv(output, queue_rows, QUEUE_COLUMNS)
    ready = sum(1 for row in queue_rows if row["status"] == "ready_to_send")
    blocked = len(queue_rows) - ready
    print(f"Queue rows: {len(queue_rows)}")
    print(f"Ready to send: {ready}")
    print(f"Blocked: {blocked}")
    print(f"Wrote: {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
