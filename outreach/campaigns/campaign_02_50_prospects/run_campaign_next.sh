#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../../.."

CAMPAIGN="outreach/campaigns/campaign_02_50_prospects"
SCRIPT="outreach/scripts/run_next_whatsapp_campaign.py"

while true; do
  echo ""
  echo "Nexo Local Studio - Campaign 02"
  echo "1. Open WhatsApp messages one by one, press y for next"
  echo "2. Show campaign status"
  echo "3. Verify next 5 WhatsApp numbers"
  echo "4. Regenerate strict queue from verified numbers"
  echo "5. Fast send next 50 with per-row terminal tracking"
  echo "6. Open next 5 verified outreach messages"
  echo "7. Open next 5 follow-ups"
  echo "8. Exit"
  echo ""
  echo "You can skip this menu entirely:"
  echo "python3 outreach/scripts/open_all_whatsapp_now.py --campaign outreach/campaigns/campaign_02_50_prospects --limit 50"
  printf "Choose an option: "
  read -r choice

  case "$choice" in
    1)
      python3 outreach/scripts/open_all_whatsapp_now.py --campaign "$CAMPAIGN" --limit 50 --delay 1
      ;;
    2)
      python3 "$SCRIPT" --campaign "$CAMPAIGN" --mode status
      ;;
    3)
      python3 "$SCRIPT" --campaign "$CAMPAIGN" --mode verify --limit 5
      ;;
    4)
      python3 "$SCRIPT" --campaign "$CAMPAIGN" --mode regenerate
      ;;
    5)
      echo "This opens chats one by one with prefilled messages. You still press Send manually."
      python3 "$SCRIPT" --campaign "$CAMPAIGN" --mode fast-send --limit 50
      ;;
    6)
      python3 "$SCRIPT" --campaign "$CAMPAIGN" --mode send --limit 5
      ;;
    7)
      python3 "$SCRIPT" --campaign "$CAMPAIGN" --mode followup --limit 5
      ;;
    8)
      exit 0
      ;;
    *)
      echo "Invalid option."
      ;;
  esac
done
