#!/bin/bash
# Tour 13 : serveur de test OUVERT sur 5500, base jetable marrant_e2e_a13, SANS nouvelle copie de build : le build
# ouvert de la préversion (copie hors dépôt) est réutilisé, DATABASE_URL lu au démarrage. Usage : a13-e2e.sh demarrer|arreter
set -euo pipefail
S=/tmp/claude-0/-home-user-Marrant/d6602e0f-29e9-5866-8a98-b2a3406a6992/scratchpad/integ
WEB=/root/marrant-preversion-s25/depot/apps/web
PORT=5500; RESEND=5402; BASE=marrant_e2e_a13
DB="postgresql://preversion:preversion@127.0.0.1:5432/$BASE"
vide() {
  env -i PATH="$PATH" HOME="$HOME" LANG=C.UTF-8 CI=true NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="$DB" NEXTAUTH_URL="http://localhost:$PORT" NEXTAUTH_SECRET=secret-factice-e2e-local \
    RESEND_API_KEY=re_factice_e2e RESEND_BASE_URL="http://127.0.0.1:$RESEND" \
    STRIPE_PREMIUM_PRICE_ID=price_e2e_local_mensuel STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_e2e_local_annuel "$@"
}
arreter() {
  [ -f "$S/a13-serveur.pid" ] && kill "$(cat "$S/a13-serveur.pid")" 2>/dev/null || true
  [ -f "$S/a13-resend.pid" ] && kill "$(cat "$S/a13-resend.pid")" 2>/dev/null || true
  rm -f "$S/a13-serveur.pid" "$S/a13-resend.pid"
}
case "${1:-}" in
  arreter) arreter; echo "arrêté"; exit 0 ;;
  demarrer) ;;
  *) echo "demarrer|arreter ?" >&2; exit 2 ;;
esac
arreter
grep -q "^export const ESPACE_CLIENT_PUBLIE: boolean = true;" "$WEB/src/config/espace-client.ts"
grep -q "^export const ESPACE_CLIENT_PUBLIE: boolean = false;" /home/user/Marrant/apps/web/src/config/espace-client.ts
su postgres -c "psql -v ON_ERROR_STOP=1 -qAt -c 'DROP DATABASE IF EXISTS $BASE' -c 'CREATE DATABASE $BASE OWNER preversion'"
cd "$WEB"
vide bash scripts/seed.sh > "$S/a13-seed.log" 2>&1 || { tail -30 "$S/a13-seed.log"; exit 1; }
mkdir -p "$S/a13-resend" && cp /root/marrant-preversion-s25/faux-resend.mjs "$S/a13-resend/faux-resend.mjs"
env -i PATH="$PATH" HOME="$HOME" PORT_RESEND=$RESEND nohup node "$S/a13-resend/faux-resend.mjs" > "$S/a13-resend.log" 2>&1 &
echo $! > "$S/a13-resend.pid"
cd "$WEB/.next/standalone"
vide PORT=$PORT HOSTNAME=127.0.0.1 nohup node "$WEB/.next/standalone/server.js" > "$S/a13-serveur.log" 2>&1 &
echo $! > "$S/a13-serveur.pid"
for _ in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/lettre" || true)
  [ "$code" = 200 ] && { echo "Serveur ouvert prêt : http://localhost:$PORT (base $BASE)"; exit 0; }
  sleep 1
done
echo "Pas de 200 sur $PORT" >&2; tail -30 "$S/a13-serveur.log" >&2; exit 1
