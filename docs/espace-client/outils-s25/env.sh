#!/bin/bash
# Préversion locale s25 : environnement commun (sourcé par les autres scripts).
# RÈGLE P0 : tout build, serveur ou outil Node/Prisma passe par `env_vide` (env -i) : aucune variable
# du shell (clés de production Neon, Cloudflare, Stripe...) n'atteint le code. Uniquement des valeurs
# factices calquées sur le job CI `e2e-local`, et une base Postgres LOCALE jetable.
set -euo pipefail

PREV_DIR="${PREV_DIR:-/root/marrant-preversion-s25}"
DEPOT_SOURCE="${DEPOT_SOURCE:-/home/user/Marrant}"
COPIE="$PREV_DIR/depot"
WEB="$COPIE/apps/web"
PORT_SITE=5400
PORT_RESEND=5401
BASE=marrant_preview_s25
ROLE_PG=preversion
URL_BASE="postgresql://$ROLE_PG:$ROLE_PG@127.0.0.1:5432/$BASE"

env_vide() {
  env -i PATH="$PATH" HOME="$HOME" LANG=C.UTF-8 \
    CI=true NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="$URL_BASE" \
    NEXTAUTH_URL="http://localhost:$PORT_SITE" \
    NEXTAUTH_SECRET=secret-factice-preversion-s25 \
    RESEND_API_KEY=re_factice_preversion \
    RESEND_BASE_URL="http://127.0.0.1:$PORT_RESEND" \
    STRIPE_PREMIUM_PRICE_ID=price_preversion_mensuel \
    STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_preversion_annuel \
    "$@"
}

# psql en super-utilisateur local (socket, authentification peer), jamais vers une base distante.
psql_admin() { su postgres -c "psql -v ON_ERROR_STOP=1 -qAt $*"; }
psql_base() { env -i PATH="$PATH" PGPASSWORD="$ROLE_PG" psql -v ON_ERROR_STOP=1 -qAt -h 127.0.0.1 -U "$ROLE_PG" -d "$BASE" "$@"; }

postgres_demarre() {
  if ! pg_lsclusters -h | awk '$1==16 && $2=="main" {print $4}' | grep -q online; then
    pg_ctlcluster 16 main start
  fi
  for _ in $(seq 1 20); do pg_isready -q -h 127.0.0.1 -p 5432 && return 0; sleep 0.5; done
  echo "Postgres local injoignable" >&2; return 1
}

# Base et rôle jetables (idempotent).
base_prete() {
  postgres_demarre
  psql_admin "-c \"DO \\\$\\\$BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='$ROLE_PG') THEN CREATE ROLE $ROLE_PG LOGIN PASSWORD '$ROLE_PG'; END IF; END\\\$\\\$;\""
  if [ -z "$(psql_admin "-c \"SELECT 1 FROM pg_database WHERE datname='$BASE'\"")" ]; then
    psql_admin "-c \"CREATE DATABASE $BASE OWNER $ROLE_PG\""
  fi
}

# Le serveur Next se renomme « next-server » : on le reconnaît à son dossier courant (standalone de la copie).
serveur_pid() {
  local p
  for p in $(pgrep -f "next-server|standalone/server.js" || true); do
    [ "$(readlink "/proc/$p/cwd" 2>/dev/null)" = "$WEB/.next/standalone" ] && echo "$p"
  done
  return 0
}
resend_pid() { pgrep -f "node $PREV_DIR/faux-resend.mjs" || true; }
