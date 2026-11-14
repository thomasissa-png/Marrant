#!/bin/bash
# Préversion locale s25 : démarre Postgres local, le faux Resend (5401) et le serveur (5400) s'ils ne
# tournent pas, puis attend un 200. Idempotent (ne relance rien qui tourne déjà). Ne rebâtit rien.
source "$(dirname "$(readlink -f "$0")")/env.sh"
base_prete
[ -f "$WEB/.next/standalone/server.js" ] || { echo "Pas de build : lancer $PREV_DIR/reconstruire.sh" >&2; exit 1; }

if [ -z "$(resend_pid)" ]; then
  env -i PATH="$PATH" HOME="$HOME" PORT_RESEND="$PORT_RESEND" \
    nohup node "$PREV_DIR/faux-resend.mjs" >> "$PREV_DIR/faux-resend.log" 2>&1 &
fi

if [ -z "$(serveur_pid)" ]; then
  cd "$WEB/.next/standalone"
  env_vide PORT="$PORT_SITE" HOSTNAME=127.0.0.1 nohup node "$WEB/.next/standalone/server.js" > "$PREV_DIR/serveur.log" 2>&1 &
fi

for _ in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT_SITE/" || true)
  [ "$code" = 200 ] && { echo "Serveur prêt : http://localhost:$PORT_SITE (200, pid $(serveur_pid | tr '\n' ' '))"; exit 0; }
  sleep 0.5
done
echo "Pas de 200 sur http://localhost:$PORT_SITE/ (dernier code : ${code:-aucun})" >&2
tail -30 "$PREV_DIR/serveur.log" >&2
exit 1
