#!/usr/bin/env bash
# Captures d'un article de blog (même programmé) tel qu'il sortira en production.
#
#   ADMIN_PASSWORD=… scripts/content/snapshot-article.sh <slug> <dossier>   (depuis apps/web)
#
# 1. curl récupère l'aperçu /blog/apercu/<slug> avec `Authorization: Bearer $ADMIN_PASSWORD`
#    (en-tête passé par stdin : le mot de passe n'apparaît ni à l'écran ni dans `ps`) ;
# 2. curl télécharge les CSS /_next/static/… référencées et leurs polices ;
# 3. snapshot-article.cjs les inline (HTML autonome, sans JS) puis Playwright capture
#    depuis file:// : tranches de 1600 px à 390 px (m00.png, m01.png…), haut et bas
#    à 1280 px (d-haut.png, d-bas.png).
# Le navigateur ne passe pas par le réseau : tout transite par curl puis un fichier local.
#
# Variables : ADMIN_PASSWORD (obligatoire), SNAPSHOT_BASE_URL (défaut https://deviens-marrant.fr),
# CHROMIUM_PATH (défaut /opt/pw-browsers/chromium).
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage : $0 <slug> <dossier>" >&2
  exit 2
fi
SLUG="$1"
OUT_DIR="$2"
BASE_URL="${SNAPSHOT_BASE_URL:-https://deviens-marrant.fr}"
BASE_URL="${BASE_URL%/}"

if [ -z "${ADMIN_PASSWORD:-}" ]; then
  echo "ADMIN_PASSWORD absent de l'environnement." >&2
  exit 2
fi
if ! printf '%s' "$SLUG" | grep -Eq '^[a-z0-9-]+$'; then
  echo "Slug invalide : $SLUG (attendu : minuscules, chiffres, tirets)." >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$OUT_DIR/assets"
OUT_DIR="$(cd "$OUT_DIR" && pwd)"
ASSETS="$OUT_DIR/assets"
PAGE="$OUT_DIR/apercu-source.html"

# Nom local d'un chemin /_next/static/… (même règle dans snapshot-article.cjs).
local_name() {
  printf '%s' "${1#/}" | sed 's/[^A-Za-z0-9._-]/_/g'
}

fetch_asset() {
  local path="$1"
  local dest="$ASSETS/$(local_name "$path")"
  [ -s "$dest" ] && return 0
  curl -fsS --max-time 30 -o "$dest" "$BASE_URL$path"
}

echo "Aperçu : $BASE_URL/blog/apercu/$SLUG"
STATUS="$(printf 'Authorization: Bearer %s\n' "$ADMIN_PASSWORD" \
  | curl -sS --max-time 30 -H @- -o "$PAGE" -w '%{http_code}' "$BASE_URL/blog/apercu/$SLUG")"
if [ "$STATUS" != "200" ]; then
  echo "Aperçu indisponible (HTTP $STATUS) : slug inconnu, mot de passe refusé ou route non déployée." >&2
  exit 1
fi

CSS_PATHS="$(grep -oE '/_next/static/[^"'"'"' )?]+\.css' "$PAGE" | sort -u || true)"
if [ -z "$CSS_PATHS" ]; then
  echo "Aucune CSS /_next/static trouvée dans l'aperçu." >&2
  exit 1
fi
for css in $CSS_PATHS; do
  fetch_asset "$css"
  # Polices et images référencées par la CSS (url(/_next/static/media/…)).
  for media in $(grep -oE '/_next/static/media/[^"'"'"' )?#]+' "$ASSETS/$(local_name "$css")" | sort -u || true); do
    fetch_asset "$media"
  done
done
echo "CSS : $(printf '%s\n' "$CSS_PATHS" | wc -l | tr -d ' ') fichier(s) téléchargé(s)."

node "$SCRIPT_DIR/snapshot-article.cjs" "$PAGE" "$OUT_DIR"
