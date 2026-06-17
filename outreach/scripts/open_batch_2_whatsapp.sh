#!/usr/bin/env bash
set -euo pipefail

cat <<'EOF'
Este lote quedó BLOQUEADO.

Motivo: los teléfonos del batch 2 salieron de campos públicos de OpenStreetMap,
pero el usuario confirmó que no existen en WhatsApp. No se deben abrir ni usar
sin una nueva verificación manual.

Usa un lote nuevo con números confirmados explícitamente como WhatsApp.
EOF

exit 1
