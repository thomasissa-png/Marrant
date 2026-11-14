#!/bin/bash
# Préversion locale s25 : reconstruit la copie ouverte de l'espace client et (re)démarre le serveur.
#   (a) synchronise l'arbre de travail du dépôt vers la copie (sans .git, node_modules, .next)
#   (b) interrupteur ESPACE_CLIENT_PUBLIE = true dans la COPIE seulement (vérifié par grep)
#   (c) build de production en environnement vide (variables factices uniquement)
#   (d) public et static copiés dans standalone
#   (e) serveur relancé sur http://localhost:5400, attente d'un 200
# Idempotent. Rapide à chaud : node_modules réutilisé (réinstallé seulement si package-lock change),
# schéma + seed seulement si schéma ou seed changent, build sauté si rien n'a changé (--force pour
# rebâtir quand même), cache .next/cache conservé.
# Options : --force (build même sans changement), --seed (rejoue schéma + seed).
source "$(dirname "$(readlink -f "$0")")/env.sh"
FORCE=0; SEED=0
for a in "$@"; do case "$a" in --force) FORCE=1 ;; --seed) SEED=1 ;; *) echo "option inconnue : $a" >&2; exit 2 ;; esac; done
T0=$(date +%s)
etape() { echo "[$(( $(date +%s) - T0 ))s] $*"; }
INTER=apps/web/src/config/espace-client.ts
LIGNE_FERMEE='^export const ESPACE_CLIENT_PUBLIE: boolean = false;'
LIGNE_OUVERTE='^export const ESPACE_CLIENT_PUBLIE: boolean = true;'

# Garde-fou : le dépôt doit rester fermé.
grep -q "$LIGNE_FERMEE" "$DEPOT_SOURCE/$INTER" || { echo "Le dépôt n'a pas l'interrupteur à false : arrêt." >&2; exit 1; }

etape "Postgres local et base jetable $BASE"
base_prete

etape "(a) synchronisation dépôt -> copie"
command -v rsync >/dev/null || apt-get install -y rsync >/dev/null || { apt-get update >/dev/null && apt-get install -y rsync >/dev/null; }
command -v rsync >/dev/null || { echo "rsync absent et non installable" >&2; exit 1; }
mkdir -p "$COPIE"
CHANGES=$(rsync -ai --delete \
  --exclude=/.git --exclude=node_modules --exclude=/apps/web/.next --exclude=/apps/web/.seed-compiled.js \
  --exclude=/playwright/playwright-report --exclude=/playwright/test-results --exclude="/$INTER" \
  "$DEPOT_SOURCE/" "$COPIE/" | grep -v '^\.d' || true)
NB=$(printf '%s\n' "$CHANGES" | grep -c . || true)
if [ "$NB" = 0 ]; then echo "  aucun fichier modifié"; else printf '%s\n' "$CHANGES" > "$PREV_DIR/.dernieres-modifs"; sed -n 1,15p "$PREV_DIR/.dernieres-modifs"; if [ "$NB" -gt 15 ]; then echo "  ... ($NB entrées)"; fi; fi

etape "(b) interrupteur ouvert dans la copie seulement"
TMP=$(mktemp)
sed "s/$LIGNE_FERMEE/export const ESPACE_CLIENT_PUBLIE: boolean = true;/" "$DEPOT_SOURCE/$INTER" > "$TMP"
grep -q "$LIGNE_OUVERTE" "$TMP" || { echo "interrupteur introuvable" >&2; rm -f "$TMP"; exit 1; }
if ! cmp -s "$TMP" "$COPIE/$INTER"; then cp "$TMP" "$COPIE/$INTER"; CHANGES="$CHANGES"$'\n'"interrupteur"; fi
rm -f "$TMP"
grep -n "ESPACE_CLIENT_PUBLIE: boolean" "$COPIE/$INTER"
grep -q "$LIGNE_FERMEE" "$DEPOT_SOURCE/$INTER" && echo "  dépôt : toujours false (vérifié)"

cd "$WEB"
etape "dépendances (node_modules réutilisé si package-lock inchangé)"
HASH_LOCK=$(sha256sum package-lock.json | cut -c1-16)
if [ ! -d node_modules ] || [ "$(cat "$PREV_DIR/.etat-lock" 2>/dev/null)" != "$HASH_LOCK" ]; then
  # Réseau requis (registre npm, moteurs Prisma) : seulement le proxy de sortie, aucune clé applicative.
  env -i PATH="$PATH" HOME="$HOME" HTTPS_PROXY="${HTTPS_PROXY:-}" https_proxy="${HTTPS_PROXY:-}" \
    NO_PROXY="${NO_PROXY:-localhost,127.0.0.1}" NODE_EXTRA_CA_CERTS="${NODE_EXTRA_CA_CERTS:-}" \
    npm_config_https_proxy="${HTTPS_PROXY:-}" NEXT_TELEMETRY_DISABLED=1 \
    npm ci --no-audit --no-fund
  echo "$HASH_LOCK" > "$PREV_DIR/.etat-lock"; rm -f "$PREV_DIR/.etat-schema"
fi

HASH_SCHEMA=$(cat prisma/schema.prisma prisma/seed-data.ts "$COPIE"/docs/content/parcours-seed.json | sha256sum | cut -c1-16)
if [ "$(cat "$PREV_DIR/.etat-schema" 2>/dev/null)" != "$HASH_SCHEMA" ] || [ "$SEED" = 1 ]; then
  etape "Prisma generate + schéma + seed (scripts/seed.sh) sur la base jetable"
  env_vide npx prisma generate >/dev/null
  env_vide bash scripts/seed.sh > "$PREV_DIR/seed.log" 2>&1 || { tail -30 "$PREV_DIR/seed.log"; exit 1; }
  tail -3 "$PREV_DIR/seed.log"
  echo "$HASH_SCHEMA" > "$PREV_DIR/.etat-schema"
else
  etape "schéma et seed inchangés : base gardée"
fi

etape "contenu de l'espace : contrôle de l'import (src/data/espace = sortie de importer-fiches.ts)"
env_vide npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/importer-fiches.ts > "$PREV_DIR/import.log" 2>&1 \
  || { tail -20 "$PREV_DIR/import.log"; echo "Import refusé : voir import.log" >&2; exit 1; }
grep -E "^  total|^Écartées|^Répliques reprises|^Missions" "$PREV_DIR/import.log" | sed 's/^/  /'

# Seuls comptent pour le build : apps/web, docs/content et docs/copy (importés par le code), prisma,
# package*.json, l'interrupteur. Captures, notes .md, Playwright : pas de rebuild.
UTILES=$(printf '%s\n' "$CHANGES" | grep -E ' (apps/web/|docs/content/|docs/copy/|prisma/|package)|^interrupteur' || true)
[ -n "$UTILES" ] && echo "  $(printf '%s\n' "$UTILES" | grep -c .) changement(s) utile(s) au build"
if [ -n "$UTILES" ] || [ "$FORCE" = 1 ] || [ ! -f "$PREV_DIR/.build-ok" ]; then
  rm -f "$PREV_DIR/.build-ok"
  etape "arrêt du serveur avant build"
  "$PREV_DIR/arreter.sh" --serveur >/dev/null
  etape "(c) build de production (environnement vide, polices lues dans le cache local)"
  "$PREV_DIR/polices.sh"
  env_vide NEXT_FONT_GOOGLE_MOCKED_RESPONSES="$PREV_DIR/polices/mock.js" npm run build > "$PREV_DIR/build.log" 2>&1 || { tail -40 "$PREV_DIR/build.log"; exit 1; }
  grep -E "^(Route|├|└|○|ƒ|λ)" "$PREV_DIR/build.log" | wc -l | xargs -I{} echo "  build OK ({} lignes de routes)"
  etape "(d) public et static dans standalone"
  cp -r public/. .next/standalone/public/
  rm -rf .next/standalone/.next/static && cp -r .next/static .next/standalone/.next/static
  touch "$PREV_DIR/.build-ok"
else
  etape "aucun changement : build gardé (--force pour rebâtir)"
fi

etape "(e) serveur"
"$PREV_DIR/demarrer.sh"
etape "terminé en $(( $(date +%s) - T0 ))s"
