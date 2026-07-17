#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

limit="${1:-10}"
shift || true

python3 outreach/scripts/open_whatsapp_batch.py outreach/whatsapp_outreach_queue_batch_3.csv --limit "$limit" "$@"
