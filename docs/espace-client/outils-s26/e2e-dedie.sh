#!/bin/bash
# Serveur e2e OUVERT sur 5500, comme le job CI e2e-local : base jetable semée PUIS build contre CETTE base (sitemap et
# pages prérendues cohérents avec la base), aucun faux Resend permanent (les specs ouvrent le leur sur 5402).
# Copie de build dédiée (la préversion 5400 n'est pas touchée). Variables factices uniquement.
set -euo pipefail
S=/root/marrant-travail-s26/integ
SRC=/root/marrant-preversion-s25/depot
DEST=/root/marrant-travail-s26/e2e-build
WEB=$DEST/apps/web
PORT=5500; RESEND=5402; BASE=marrant_e2e_a13
DB="postgresql://preversion:preversion@127.0.0.1:5432/$BASE"
vide() {
  env -i PATH="$PATH" HOME="$HOME" LANG=C.UTF-8 CI=true NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="$DB" NEXTAUTH_URL="http://localhost:$PORT" NEXTAUTH_SECRET=secret-factice-e2e-local \
    RESEND_API_KEY=re_factice_e2e RESEND_BASE_URL="http://127.0.0.1:$RESEND" \
    STRIPE_PREMIUM_PRICE_ID=price_e2e_local_mensuel STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_e2e_local_annuel "$@"
}
# Arrêt de tout serveur e2e précédent (celui d'a13-e2e.sh compris) et de son faux Resend.
bash /home/user/Marrant/docs/espace-client/outils-s26/a13-e2e.sh arreter >/dev/null
[ -f "$S/dedie-serveur.pid" ] && kill "$(cat "$S/dedie-serveur.pid")" 2>/dev/null || true
# Le serveur Next se renomme « next-server » : on le retrouve par son port (jamais celui de la préversion, 5400).
for p in $(pgrep -f next-server || true); do
  tr '\0' '\n' < /proc/$p/environ 2>/dev/null | grep -qx "PORT=$PORT" && kill "$p" || true
done
pkill -f "$S/a13-resend/faux-resend.mjs" || true
sleep 2
grep -q "^export const ESPACE_CLIENT_PUBLIE: boolean = true;" "$SRC/apps/web/src/config/espace-client.ts"
grep -q "^export const ESPACE_CLIENT_PUBLIE: boolean = false;" /home/user/Marrant/apps/web/src/config/espace-client.ts
mkdir -p "$DEST"
rsync -a --delete --exclude=node_modules --exclude=/apps/web/.next "$SRC/" "$DEST/"
[ -d "$WEB/node_modules" ] || cp -al "$SRC/apps/web/node_modules" "$WEB/node_modules"
su postgres -c "psql -v ON_ERROR_STOP=1 -qAt -c 'DROP DATABASE IF EXISTS $BASE' -c 'CREATE DATABASE $BASE OWNER preversion'"
cd "$WEB"
vide bash scripts/seed.sh > "$S/dedie-seed.log" 2>&1 || { tail -30 "$S/dedie-seed.log"; exit 1; }
vide NEXT_FONT_GOOGLE_MOCKED_RESPONSES=/root/marrant-preversion-s25/polices/mock.js npm run build > "$S/dedie-build.log" 2>&1 || { tail -40 "$S/dedie-build.log"; exit 1; }
cp -r public/. .next/standalone/public/
rm -rf .next/standalone/.next/static && cp -r .next/static .next/standalone/.next/static
cd "$WEB/.next/standalone"
vide PORT=$PORT HOSTNAME=127.0.0.1 nohup node "$WEB/.next/standalone/server.js" > "$S/dedie-serveur.log" 2>&1 &
echo $! > "$S/dedie-serveur.pid"
for _ in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/lettre" || true)
  [ "$code" = 200 ] && { echo "Serveur e2e dédié prêt : http://localhost:$PORT (base $BASE, build contre cette base)"; exit 0; }
  sleep 1
done
echo "serveur non prêt" >&2; tail -20 "$S/dedie-serveur.log"; exit 1
