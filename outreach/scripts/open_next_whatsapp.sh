#!/usr/bin/env bash
set -euo pipefail

python3 outreach/scripts/open_whatsapp_batch.py outreach/whatsapp_outreach_queue.csv --limit 5
