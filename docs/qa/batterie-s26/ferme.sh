#!/bin/bash
# Serveur RÉGIME FERMÉ (HEAD du dépôt, interrupteur false) sur 5680, base jetable copie de la préversion.
set -euo pipefail
SP="$(cd "$(dirname "$0")" && pwd)"
DEST=/root/marrant-travail-s26/batterie-ferme
WEB=$DEST/apps/web
PORT=5680; RESEND=5681; BASE=marrant_batterie_ferme
DB="postgresql://preversion:preversion@127.0.0.1:5432/$BASE"
vide() {
  env -i PATH="$PATH" HOME="$HOME" LANG=C.UTF-8 CI=true NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="$DB" NEXTAUTH_URL="http://localhost:$PORT" NEXTAUTH_SECRET=secret-factice-batterie \
    RESEND_API_KEY=re_factice_batterie RESEND_BASE_URL="http://127.0.0.1:$RESEND" \
    STRIPE_PREMIUM_PRICE_ID=price_e2e_local_mensuel STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_e2e_local_annuel "$@"
}
grep -q "^export const ESPACE_CLIENT_PUBLIE: boolean = false;" /home/user/Marrant/apps/web/src/config/espace-client.ts
mkdir -p "$DEST"
rsync -a --delete --exclude=.git --exclude=node_modules --exclude=/apps/web/.next --exclude=.open-next --exclude='.env*' --exclude=/docs/captures /home/user/Marrant/ "$DEST/"
[ -d "$WEB/node_modules" ] || cp -al /root/marrant-preversion-s25/depot/apps/web/node_modules "$WEB/node_modules"
su postgres -c "psql -v ON_ERROR_STOP=1 -qAt -c 'DROP DATABASE IF EXISTS $BASE' -c 'CREATE DATABASE $BASE OWNER preversion'"
env -i PATH="$PATH" PGPASSWORD=preversion pg_dump -h 127.0.0.1 -U preversion -d marrant_preview_s25 -Fc -f "$SP/prev.dump"
env -i PATH="$PATH" PGPASSWORD=preversion pg_restore -h 127.0.0.1 -U preversion -d $BASE --no-owner "$SP/prev.dump"
cd "$WEB"
vide NEXT_FONT_GOOGLE_MOCKED_RESPONSES=/root/marrant-preversion-s25/polices/mock.js npm run build > "$SP/ferme-build.log" 2>&1 || { tail -40 "$SP/ferme-build.log"; exit 1; }
cp -r public/. .next/standalone/public/
rm -rf .next/standalone/.next/static && cp -r .next/static .next/standalone/.next/static
cd "$WEB/.next/standalone"
vide PORT=$PORT HOSTNAME=127.0.0.1 nohup node "$WEB/.next/standalone/server.js" > "$SP/ferme-serveur.log" 2>&1 &
echo $! > "$SP/ferme-serveur.pid"
for _ in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/login" || true)
  [ "$code" = 200 ] && { echo "PRET 5680 pid $(cat $SP/ferme-serveur.pid)"; exit 0; }
  sleep 1
done
echo "non pret"; tail -20 "$SP/ferme-serveur.log"; exit 1
