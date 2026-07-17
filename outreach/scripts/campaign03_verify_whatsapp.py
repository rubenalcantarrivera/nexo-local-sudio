#!/usr/bin/env python3
"""Quick manual WhatsApp existence verification for Campaign 03.

Opens wa.me links without messages. The user confirms whether a valid chat opens.
No messages are sent.
"""

from __future__ import annotations

import argparse
import webbrowser
from pathlib import Path

from campaign03_common import VERIFICATION_COLUMNS, now_iso, read_csv, write_csv


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--campaign", required=True)
    parser.add_argument("--limit", type=int, default=250)
    args = parser.parse_args()

    campaign = Path(args.campaign)
    path = campaign / "whatsapp_number_verification_queue.csv"
    rows = read_csv(path)
    if not rows:
        print(f"No verification rows found: {path}")
        return 1

    pending = [row for row in rows if row.get("verification_status") == "pending_manual_check"]
    limit = min(max(args.limit, 1), 250)
    total = min(len(pending), limit)
    if total == 0:
        print("No pending numbers to verify.")
        return 0

    processed = 0
    for row in rows:
        if processed >= total:
            break
        if row.get("verification_status") != "pending_manual_check":
            continue
        processed += 1
        print(f"\n[{processed}/{total}] {row.get('niche', '')} / {row.get('city', '')} / {row.get('zone', '')}")
        print(f"Phone: {row.get('normalized_phone', '')}")
        print("Enter=valid | n=invalid | w=wrong | s=skip | q=quit")
        webbrowser.open(row.get("wa_check_url", ""))
        choice = input("> ").strip().lower()
        if choice == "q":
            processed -= 1
            break
        if choice == "":
            row["verification_status"] = "exists_on_whatsapp"
        elif choice == "n":
            row["verification_status"] = "not_on_whatsapp"
        elif choice == "w":
            row["verification_status"] = "wrong_number"
        elif choice == "s":
            row["verification_status"] = "needs_review"
        else:
            row["verification_status"] = "needs_review"
            row["notes"] = ((row.get("notes") or "") + f" | Unrecognized input during verification: {choice}").strip(" |")
        row["verified_at"] = now_iso()
        write_csv(path, rows, VERIFICATION_COLUMNS)

    print(f"\nVerified/updated: {processed}")
    print(f"Saved: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
