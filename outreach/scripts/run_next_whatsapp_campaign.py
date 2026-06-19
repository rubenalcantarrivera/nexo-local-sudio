#!/usr/bin/env python3
"""Run a safe, manual WhatsApp outreach campaign.

This script never sends messages. It only opens wa.me links and waits for the
user to confirm what they did manually in WhatsApp.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import sys
import time
import urllib.parse
import webbrowser
from pathlib import Path


AGENCY_WHATSAPP = "525545609027"
MAX_LIMIT = 20
DEFAULT_LIMIT = 5
MAX_MESSAGE_CHARS = 650


QUALIFIED_COLUMNS = [
    "priority", "score", "business_name", "niche", "city", "zone", "rating",
    "reviews_count", "website_status", "website_url", "google_maps_url",
    "phone", "normalized_phone", "instagram", "email", "contact_person",
    "problem_detected", "verification_notes", "homepage_url", "first_message",
    "last_checked", "source_url",
]
VERIFICATION_COLUMNS = [
    "verification_status", "business_name", "niche", "city", "zone",
    "original_phone", "normalized_phone", "wa_check_url", "google_maps_url",
    "phone_source", "source_confidence", "notes", "verified_at",
]
QUEUE_COLUMNS = [
    "priority", "score", "business_name", "niche", "city", "zone",
    "normalized_phone", "phone_status", "whatsapp_verification_status",
    "message", "homepage_url", "whatsapp_url", "message_char_count",
    "encoded_url_length", "url_validation_status", "status", "last_contacted",
    "follow_up_date", "response_status", "opened_at", "follow_up_url",
    "follow_up_message", "notes",
]
SUPPRESSION_COLUMNS = ["normalized_phone", "business_name", "reason", "date_added"]
SENT_LOG_COLUMNS = [
    "business_name", "normalized_phone", "event", "event_date", "notes",
]


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    if not path.exists():
        return [], []
    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        return list(reader.fieldnames or []), list(reader)


def write_csv(path: Path, headers: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def ensure_csv(path: Path, headers: list[str]) -> None:
    if path.exists():
        return
    write_csv(path, headers, [])


def today() -> dt.date:
    return dt.date.today()


def now_iso() -> str:
    return dt.datetime.now().isoformat(timespec="seconds")


def cap_limit(value: int) -> int:
    if value < 1:
        return 1
    if value > MAX_LIMIT:
        print(f"Limit {value} is too high. Capping at {MAX_LIMIT}.")
        return MAX_LIMIT
    return value


def campaign_paths(campaign: Path) -> dict[str, Path]:
    return {
        "qualified": campaign / "qualified_prospects.csv",
        "verification": campaign / "whatsapp_number_verification_queue.csv",
        "verified": campaign / "whatsapp_verified_channels.csv",
        "queue": campaign / "whatsapp_outreach_queue.csv",
        "suppression": campaign / "whatsapp_suppression_list.csv",
        "sent_log": campaign / "whatsapp_sent_log.csv",
    }


def message_for(row: dict[str, str]) -> str:
    business_name = (row.get("business_name") or "su negocio").strip()
    homepage_url = (row.get("homepage_url") or "").strip()
    return f"""Hola, {business_name}. Vi que su negocio tiene presencia local y señales de reputación.

Soy Ruben, de Nexo Local Studio. Hacemos páginas web rápidas y profesionales para negocios locales, conectadas a WhatsApp, ubicación y formularios.

Puedes ver nuestro trabajo aquí:
{homepage_url}

Tenemos precios de lanzamiento desde $2,500 MXN.

Si te interesa, puedo enviarte una propuesta breve. Si prefieres no recibir más mensajes, dime baja.""".strip()


def followup_one(row: dict[str, str]) -> str:
    return f"""Hola, {row.get("business_name", "su negocio")}. Solo retomo el mensaje anterior.

Te compartí la página de Nexo Local Studio:
{row.get("homepage_url", "")}

Hacemos páginas web rápidas y profesionales para negocios locales, conectadas a WhatsApp, ubicación y formularios.

Si tiene sentido, puedo enviarte una propuesta breve con alcance, tiempo y precio.

Si prefieres no recibir más mensajes, dime baja.""".strip()


def wa_url(phone: str, message: str) -> str:
    return f"https://wa.me/{phone}?text={urllib.parse.quote(message, safe='')}"


def decoded_text(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    return urllib.parse.parse_qs(parsed.query, keep_blank_values=True).get("text", [""])[0]


def suppressed_numbers(path: Path) -> set[str]:
    ensure_csv(path, SUPPRESSION_COLUMNS)
    _, rows = read_csv(path)
    return {row.get("normalized_phone", "").strip() for row in rows if row.get("normalized_phone", "").strip()}


def add_suppression(path: Path, phone: str, business_name: str, reason: str) -> None:
    ensure_csv(path, SUPPRESSION_COLUMNS)
    headers, rows = read_csv(path)
    if any(row.get("normalized_phone") == phone for row in rows):
        return
    rows.append({
        "normalized_phone": phone,
        "business_name": business_name,
        "reason": reason,
        "date_added": today().isoformat(),
    })
    write_csv(path, headers or SUPPRESSION_COLUMNS, rows)


def append_log(path: Path, business_name: str, phone: str, event: str, notes: str = "") -> None:
    ensure_csv(path, SENT_LOG_COLUMNS)
    headers, rows = read_csv(path)
    rows.append({
        "business_name": business_name,
        "normalized_phone": phone,
        "event": event,
        "event_date": now_iso(),
        "notes": notes,
    })
    write_csv(path, headers or SENT_LOG_COLUMNS, rows)


def regenerate(campaign: Path) -> int:
    paths = campaign_paths(campaign)
    ensure_csv(paths["suppression"], SUPPRESSION_COLUMNS)
    ensure_csv(paths["sent_log"], SENT_LOG_COLUMNS)
    _, qualified = read_csv(paths["qualified"])
    if not qualified:
        print(f"No qualified prospects found at {paths['qualified']}", file=sys.stderr)
        return 1

    _, verification_rows = read_csv(paths["verification"])
    verification_by_key = {
        (row.get("business_name", ""), row.get("normalized_phone", "")): row
        for row in verification_rows
    }
    suppression = suppressed_numbers(paths["suppression"])
    verified_rows: list[dict[str, str]] = []
    queue_rows: list[dict[str, str]] = []
    for row in qualified:
        phone = row.get("normalized_phone", "").strip()
        key = (row.get("business_name", ""), phone)
        verification = verification_by_key.get(key, {})
        verification_status = verification.get("verification_status", "pending_manual_check") or "pending_manual_check"
        message = message_for(row)
        url = wa_url(phone, message) if phone else ""
        url_validation = "url_valid" if url and decoded_text(url) == message else "url_encoding_error"
        status = "ready_to_review"
        notes = row.get("verification_notes", "")
        if phone == AGENCY_WHATSAPP:
            status = "blocked"
            notes += " | Bloqueado: coincide con el WhatsApp de Nexo."
        elif phone in suppression:
            status = "suppressed"
            notes += " | Bloqueado por lista de supresión."
        elif verification_status != "exists_on_whatsapp":
            status = "blocked_not_verified"
            notes += " | Bloqueado hasta verificar manualmente que el número existe en WhatsApp."
        elif len(message) > MAX_MESSAGE_CHARS:
            status = "blocked"
            url_validation = "message_too_long"
            notes += " | Mensaje excede límite seguro."
        elif url_validation != "url_valid":
            status = "blocked"

        if verification_status == "exists_on_whatsapp":
            verified_rows.append({
                **row,
                "phone_status": "valid",
                "whatsapp_verification_status": verification_status,
                "whatsapp_verified_at": verification.get("verified_at", ""),
                "whatsapp_verification_notes": verification.get("notes", ""),
            })

        queue_rows.append({
            "priority": row.get("priority", ""),
            "score": row.get("score", ""),
            "business_name": row.get("business_name", ""),
            "niche": row.get("niche", ""),
            "city": row.get("city", ""),
            "zone": row.get("zone", ""),
            "normalized_phone": phone,
            "phone_status": "valid",
            "whatsapp_verification_status": verification_status,
            "message": message,
            "homepage_url": row.get("homepage_url", ""),
            "whatsapp_url": url,
            "message_char_count": str(len(message)),
            "encoded_url_length": str(len(url)),
            "url_validation_status": url_validation,
            "status": status,
            "last_contacted": "",
            "follow_up_date": "",
            "response_status": "",
            "opened_at": "",
            "follow_up_url": "",
            "follow_up_message": "",
            "notes": notes,
        })

    write_csv(paths["verified"], QUALIFIED_COLUMNS + ["phone_status", "whatsapp_verification_status", "whatsapp_verified_at", "whatsapp_verification_notes"], verified_rows)
    write_csv(paths["queue"], QUEUE_COLUMNS, queue_rows)
    print(f"Regenerated queue: {paths['queue']}")
    print(f"Qualified prospects: {len(qualified)}")
    print(f"Verified WhatsApp numbers: {len(verified_rows)}")
    print(f"Ready to review: {sum(row['status'] == 'ready_to_review' for row in queue_rows)}")
    print(f"Blocked pending verification: {sum(row['status'] == 'blocked_not_verified' for row in queue_rows)}")
    return 0


def mode_status(campaign: Path) -> int:
    paths = campaign_paths(campaign)
    _, qualified = read_csv(paths["qualified"])
    _, verification = read_csv(paths["verification"])
    _, queue = read_csv(paths["queue"])
    counts = {
        "total_prospects": len(qualified),
        "pending_verification": sum(row.get("verification_status") == "pending_manual_check" for row in verification),
        "exists_on_whatsapp": sum(row.get("verification_status") == "exists_on_whatsapp" for row in verification),
        "not_on_whatsapp": sum(row.get("verification_status") == "not_on_whatsapp" for row in verification),
        "needs_review": sum(row.get("verification_status") in {"needs_review", "wrong_number"} for row in verification),
        "ready_to_review": sum(row.get("status") == "ready_to_review" for row in queue),
        "sent_manual": sum(row.get("status") == "sent_manual" for row in queue),
        "replies": sum(row.get("status") == "replied" for row in queue),
        "interested": sum(row.get("response_status") == "interested" for row in queue),
        "follow_up_due": sum(row.get("status") == "no_response" and row.get("follow_up_date", "9999-99-99") <= today().isoformat() for row in queue),
        "do_not_contact": sum(row.get("status") in {"do_not_contact", "baja"} for row in queue),
        "blocked_not_verified": sum(row.get("status") == "blocked_not_verified" for row in queue),
    }
    for key, value in counts.items():
        print(f"{key}: {value}")
    return 0


def mode_verify(campaign: Path, limit: int) -> int:
    paths = campaign_paths(campaign)
    headers, rows = read_csv(paths["verification"])
    if not rows:
        print("No verification queue found. Regenerate campaign files first.", file=sys.stderr)
        return 1
    pending = [row for row in rows if row.get("verification_status") == "pending_manual_check"][:cap_limit(limit)]
    if not pending:
        print("No pending WhatsApp numbers to verify.")
        return 0
    for row in pending:
        print("\nBusiness:", row.get("business_name"))
        print("Zone:", row.get("zone"))
        print("Phone:", row.get("normalized_phone"))
        print("Google Maps:", row.get("google_maps_url"))
        print("Check URL:", row.get("wa_check_url"))
        webbrowser.open(row.get("wa_check_url", ""))
        answer = input("[y] exists / [n] not WhatsApp / [w] wrong number / [s] skip / [q] quit: ").strip().lower()
        if answer == "q":
            break
        if answer == "y":
            row["verification_status"] = "exists_on_whatsapp"
        elif answer == "n":
            row["verification_status"] = "not_on_whatsapp"
        elif answer == "w":
            row["verification_status"] = "wrong_number"
        elif answer == "s":
            row["verification_status"] = "needs_review"
        else:
            print("Unknown input; leaving pending.")
            continue
        row["verified_at"] = now_iso()
        write_csv(paths["verification"], headers or VERIFICATION_COLUMNS, rows)
        print("Saved.")
        time.sleep(1)
    regenerate(campaign)
    return 0


def mode_send(campaign: Path, limit: int) -> int:
    paths = campaign_paths(campaign)
    headers, rows = read_csv(paths["queue"])
    if not rows:
        regenerate(campaign)
        headers, rows = read_csv(paths["queue"])
    ready = [
        row for row in rows
        if row.get("status") == "ready_to_review"
        and row.get("whatsapp_verification_status") == "exists_on_whatsapp"
        and row.get("url_validation_status") == "url_valid"
        and row.get("normalized_phone") != AGENCY_WHATSAPP
    ][:cap_limit(limit)]
    if not ready:
        print("No ready rows. Verify numbers first, then regenerate the queue.")
        return 0
    for row in ready:
        print("\nBusiness:", row.get("business_name"))
        print("Phone:", row.get("normalized_phone"))
        print("Homepage:", row.get("homepage_url"))
        print("Message preview:", row.get("message", "")[:220].replace("\n", " "), "...")
        webbrowser.open(row.get("whatsapp_url", ""))
        answer = input("[enter] sent manually / [s] skip / [b] baja / [r] replied interested / [n] not interested / [q] quit: ").strip().lower()
        if answer == "q":
            break
        if answer == "":
            row["status"] = "sent_manual"
            row["last_contacted"] = today().isoformat()
            row["follow_up_date"] = (today() + dt.timedelta(days=2)).isoformat()
            row["opened_at"] = now_iso()
            append_log(paths["sent_log"], row.get("business_name", ""), row.get("normalized_phone", ""), "sent_manual")
        elif answer == "s":
            row["status"] = "skipped"
        elif answer == "b":
            row["status"] = "do_not_contact"
            add_suppression(paths["suppression"], row.get("normalized_phone", ""), row.get("business_name", ""), "baja/do_not_contact")
            append_log(paths["sent_log"], row.get("business_name", ""), row.get("normalized_phone", ""), "do_not_contact")
        elif answer == "r":
            row["status"] = "replied"
            row["response_status"] = "interested"
            append_log(paths["sent_log"], row.get("business_name", ""), row.get("normalized_phone", ""), "replied_interested")
        elif answer == "n":
            row["status"] = "not_interested"
            append_log(paths["sent_log"], row.get("business_name", ""), row.get("normalized_phone", ""), "not_interested")
        write_csv(paths["queue"], headers or QUEUE_COLUMNS, rows)
        print("Saved.")
        time.sleep(1)
    return 0


def mode_followup(campaign: Path, limit: int) -> int:
    paths = campaign_paths(campaign)
    headers, rows = read_csv(paths["queue"])
    due = [
        row for row in rows
        if row.get("status") in {"sent_manual", "no_response"}
        and row.get("follow_up_date")
        and row.get("follow_up_date") <= today().isoformat()
        and row.get("whatsapp_verification_status") == "exists_on_whatsapp"
    ][:cap_limit(limit)]
    if not due:
        print("No follow-ups due.")
        return 0
    for row in due:
        message = followup_one(row)
        url = wa_url(row.get("normalized_phone", ""), message)
        print("\nFollow-up:", row.get("business_name"))
        print("Message preview:", message[:220].replace("\n", " "), "...")
        webbrowser.open(url)
        answer = input("[enter] follow-up sent manually / [s] skip / [b] baja / [q] quit: ").strip().lower()
        if answer == "q":
            break
        if answer == "":
            row["status"] = "follow_up_1_sent"
            row["last_contacted"] = today().isoformat()
            row["follow_up_message"] = message
            row["follow_up_url"] = url
            append_log(paths["sent_log"], row.get("business_name", ""), row.get("normalized_phone", ""), "follow_up_1_sent")
        elif answer == "b":
            row["status"] = "do_not_contact"
            add_suppression(paths["suppression"], row.get("normalized_phone", ""), row.get("business_name", ""), "baja/do_not_contact")
        write_csv(paths["queue"], headers or QUEUE_COLUMNS, rows)
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--campaign", required=True)
    parser.add_argument("--mode", required=True, choices=["verify", "send", "followup", "status", "regenerate"])
    parser.add_argument("--limit", type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    campaign = Path(args.campaign)
    if not campaign.exists():
        print(f"Campaign folder not found: {campaign}", file=sys.stderr)
        return 1
    if args.mode == "status":
        return mode_status(campaign)
    if args.mode == "regenerate":
        return regenerate(campaign)
    if args.mode == "verify":
        return mode_verify(campaign, args.limit)
    if args.mode == "send":
        return mode_send(campaign, args.limit)
    if args.mode == "followup":
        return mode_followup(campaign, args.limit)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
