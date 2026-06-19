#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../../.."

CAMPAIGN="outreach/campaigns/campaign_02_50_prospects"
SCRIPT="outreach/scripts/run_next_whatsapp_campaign.py"

while true; do
  echo ""
  echo "Nexo Local Studio - Campaign 02"
  echo "1. Show campaign status"
  echo "2. Verify next 5 WhatsApp numbers"
  echo "3. Regenerate strict queue from verified numbers"
  echo "4. Fast send next 50 without pre-verification"
  echo "5. Open next 5 verified outreach messages"
  echo "6. Open next 5 follow-ups"
  echo "7. Exit"
  printf "Choose an option: "
  read -r choice

  case "$choice" in
    1)
      python3 "$SCRIPT" --campaign "$CAMPAIGN" --mode status
      ;;
    2)
      python3 "$SCRIPT" --campaign "$CAMPAIGN" --mode verify --limit 5
      ;;
    3)
      python3 "$SCRIPT" --campaign "$CAMPAIGN" --mode regenerate
      ;;
    4)
      echo "This opens chats one by one with prefilled messages. You still press Send manually."
      python3 "$SCRIPT" --campaign "$CAMPAIGN" --mode fast-send --limit 50
      ;;
    5)
      python3 "$SCRIPT" --campaign "$CAMPAIGN" --mode send --limit 5
      ;;
    6)
      python3 "$SCRIPT" --campaign "$CAMPAIGN" --mode followup --limit 5
      ;;
    7)
      exit 0
      ;;
    *)
      echo "Invalid option."
      ;;
  esac
done
