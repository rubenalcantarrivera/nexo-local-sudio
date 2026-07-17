#!/usr/bin/env python3
"""Open verified Campaign 03 WhatsApp outreach messages sequentially.

The script never sends messages. It opens wa.me links and waits for the user to
manually press Send in WhatsApp, then press Enter in terminal to continue.
"""

from __future__ import annotations

import argparse
import datetime as dt
import webbrowser
from pathlib import Path

from campaign03_common import QUEUE_COLUMNS, SENT_LOG_COLUMNS, SUPPRESSION_COLUMNS, append_csv, now_iso, read_csv, write_csv


def add_suppression(campaign: Path, row: dict[str, str]) -> None:
    append_csv(campaign / "whatsapp_suppression_list.csv", {
        "normalized_phone": row.get("normalized_phone", ""),
        "business_name": row.get("business_name", ""),
        "reason": "baja/do_not_contact during campaign03_send_whatsapp",
        "date_added": dt.date.today().isoformat(),
    }, SUPPRESSION_COLUMNS)


def log_sent(campaign: Path, row: dict[str, str], status: str) -> None:
    append_csv(campaign / "whatsapp_sent_log.csv", {
        "sent_at": now_iso(),
        "business_name": row.get("business_name", ""),
        "normalized_phone": row.get("normalized_phone", ""),
        "status": status,
        "notes": row.get("notes", ""),
    }, SENT_LOG_COLUMNS)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--campaign", required=True)
    parser.add_argument("--limit", type=int, default=250)
    args = parser.parse_args()

    campaign = Path(args.campaign)
    queue_path = campaign / "whatsapp_outreach_queue.csv"
    rows = read_csv(queue_path)
    if not rows:
        print(f"No queue rows found: {queue_path}")
        return 1

    candidates = [row for row in rows if row.get("status") == "ready_to_send" and row.get("verification_status") == "exists_on_whatsapp" and row.get("url_validation_status") == "url_valid"]
    limit = min(max(args.limit, 1), 250)
    total = min(len(candidates), limit)
    if total == 0:
        print("No verified ready_to_send rows. Run verification and queue generation first.")
        return 0

    processed = 0
    for row in rows:
        if processed >= total:
            break
        if row not in candidates:
            continue
        processed += 1
        webbrowser.open(row.get("whatsapp_url", ""))
        print(f"\n[{processed}/{total}] Opened WhatsApp.")
        print("Press Enter after sending | s=skip | b=baja | q=quit")
        choice = input("> ").strip().lower()
        if choice == "q":
            processed -= 1
            break
        if choice == "":
            row["status"] = "sent_manual"
            row["last_contacted"] = dt.date.today().isoformat()
            row["follow_up_date"] = (dt.date.today() + dt.timedelta(days=2)).isoformat()
            log_sent(campaign, row, "sent_manual")
        elif choice == "s":
            row["status"] = "skipped"
        elif choice == "b":
            row["status"] = "do_not_contact"
            row["response_status"] = "baja"
            add_suppression(campaign, row)
        else:
            row["status"] = "skipped"
            row["notes"] = ((row.get("notes") or "") + f" | Unrecognized send input: {choice}").strip(" |")
        write_csv(queue_path, rows, QUEUE_COLUMNS)

    print(f"\nProcessed: {processed}")
    print(f"Saved: {queue_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
