#!/bin/bash
# Installe (ou met à jour) l'outillage de la préversion locale s25 hors du dépôt, dans
# /root/marrant-preversion-s25/ (ou $PREV_DIR). Ne touche ni au dépôt ni à la base. Idempotent.
set -euo pipefail
SRC="$(dirname "$(readlink -f "$0")")"
DEST="${PREV_DIR:-/root/marrant-preversion-s25}"
mkdir -p "$DEST"
for f in env.sh reconstruire.sh demarrer.sh arreter.sh comptes.sh comptes.sql polices.sh faux-resend.mjs verifier.mjs; do
  cp "$SRC/$f" "$DEST/$f"
done
chmod +x "$DEST"/*.sh
echo "Outillage installé dans $DEST. Suite : $DEST/reconstruire.sh puis $DEST/comptes.sh"
