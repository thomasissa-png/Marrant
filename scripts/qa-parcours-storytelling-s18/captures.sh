#!/bin/bash
# s18 : contrôle local du parcours Storytelling (inactif puis forcé actif) et captures pour @design / @ux.
# Instance LOCALE jetable uniquement : Postgres sur 127.0.0.1:55433, app en env propre (cleanenv.sh s17),
# Chromium limité à localhost. Jamais contre la prod.
# Usage : captures.sh [--sans-inactif]
# Étapes : base (schéma + seed + vannes + conseils simulés comme en prod) -> build interrupteur à false ->
#   app : tâche de démarrage, parcours INACTIF, 404 -> build interrupteur FORCÉ à true (restauré à false
#   en sortie, quoi qu'il arrive) -> app : parcours actif -> captures 375/768/1280 visiteur et Premium.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
S17="$HERE/../qa-parcours-s17"
REPO=/home/user/Marrant
WEB=$REPO/apps/web
SWITCH=$WEB/src/config/parcours-publication.ts
PGBIN=/usr/lib/postgresql/16/bin
PGPORT=55433
PGDIR=/var/lib/postgresql/qa-marrant-storytelling
CLEAN="$S17/cleanenv.sh"
PSQL="psql -h 127.0.0.1 -p $PGPORT -U postgres -d marrant_qa -v ON_ERROR_STOP=1 -q"
OUT=$REPO/docs/qa/captures-parcours-storytelling-s18
LOG="${QA_LOG:-$HERE/run-$(date +%H%M%S)}"; mkdir -p "$LOG" "$OUT"
INACTIF=1; [ "${1:-}" = "--sans-inactif" ] && INACTIF=0

if curl -s -o /dev/null -m 2 http://127.0.0.1:5000/; then echo "STOP : port 5000 occupé."; exit 1; fi
if $PGBIN/pg_isready -h 127.0.0.1 -p $PGPORT >/dev/null 2>&1; then echo "STOP : Postgres déjà sur $PGPORT."; exit 1; fi

APP_PID=""
stop_app() { [ -n "$APP_PID" ] && kill -- -"$APP_PID" 2>/dev/null || true; APP_PID=""; sleep 2; }
cleanup() {
  echo "== Nettoyage : interrupteur remis à false, app arrêtée, base supprimée"
  sed -i 's/export const STORYTELLING_PUBLIE = true;/export const STORYTELLING_PUBLIE = false;/' "$SWITCH"
  stop_app
  su postgres -c "$PGBIN/pg_ctl -D $PGDIR/data -m fast stop" >/dev/null 2>&1 || true
  rm -rf "$PGDIR"
}
trap cleanup EXIT

start_app() {
  QA_NODE_ENV=production setsid "$CLEAN" npx next start -H 127.0.0.1 -p 5000 >"$LOG/app-$1.log" 2>&1 &
  APP_PID=$!
  for i in $(seq 1 60); do curl -s -o /dev/null http://127.0.0.1:5000/ && break; sleep 1; done
  local srv; srv=$(pgrep -f "^next-server" | head -1)
  [ -n "$srv" ] || { echo "STOP : next-server introuvable"; exit 1; }
  if tr '\0' '\n' </proc/$srv/environ | grep -i -E "neon|replit_database|stripe|resend|umami|cloudflare|anthropic|admin_password" >/dev/null; then
    echo "STOP : variable sensible dans l'environnement de l'app"; exit 1; fi
  for i in $(seq 1 90); do grep -q "parcours-storytelling:" "$LOG/app-$1.log" && break; sleep 2; done
  sleep 3
  grep -E "^\[startup\] .*(storytelling|parcours-content)" "$LOG/app-$1.log" | cut -c1-600 || true
}

build() {
  QA_NODE_ENV=production "$CLEAN" npm run build >"$LOG/build-$1.log" 2>&1 || { tail -30 "$LOG/build-$1.log"; exit 1; }
}

echo "== 1. Postgres jetable"
rm -rf "$PGDIR"; mkdir -p "$PGDIR"; chown postgres "$PGDIR"
su postgres -c "$PGBIN/initdb -D $PGDIR/data -U postgres --auth=trust -E UTF8 --locale=C.UTF-8" >"$LOG/initdb.log" 2>&1
su postgres -c "$PGBIN/pg_ctl -D $PGDIR/data -o '-p $PGPORT -k $PGDIR -c listen_addresses=127.0.0.1' -l $PGDIR/pg.log start" >/dev/null
sleep 2
psql -h 127.0.0.1 -p $PGPORT -U postgres -qc "create database marrant_qa"

echo "== 2. Schéma + seed + vannes + conseils dans l'état de la prod (env propre)"
cd "$WEB"
QA_NODE_ENV=development "$CLEAN" npx prisma db push --skip-generate >"$LOG/dbpush.log" 2>&1
"$CLEAN" npx esbuild prisma/seed-data.ts --bundle --platform=node --outfile="$LOG/seed.cjs" --external:@prisma/client >/dev/null 2>&1
QA_NODE_ENV=development QA_EXTRA="NODE_PATH=$WEB/node_modules" "$CLEAN" node "$LOG/seed.cjs" | tail -2
python3 -I "$HERE/fixtures.py" "$REPO" >"$LOG/fixtures.sql"
$PSQL -f "$LOG/fixtures.sql"
echo "   $($PSQL -At -c "select count(*) from \"Joke\" where id like 'qafx%'") vannes fixtures ; conseils 1/4/5 : $($PSQL -At -c "select string_agg(id||'='||\"isActive\", ' ') from \"Tip\" where id like 'cmmp8ozsx%'")"

if [ $INACTIF = 1 ]; then
  echo "== 3. Interrupteur à false : build, démarrage, parcours importé INACTIF"
  build inactif; start_app inactif
  echo "   base : $($PSQL -At -c "select slug||' isActive='||\"isActive\"||' étapes='||(select count(*) from \"LearningPathStep\" s where s.\"learningPathId\"=p.id) from \"LearningPath\" p where slug='storytelling'")"
  echo "   conseils : $($PSQL -At -c "select string_agg(title||'='||\"isActive\", ' | ') from \"Tip\" where id like 'cmmp8ozsx%'")"
  echo "   défi de « Rigoler de ses échecs » : …$($PSQL -At -c "select right(exercise,70) from \"Tip\" where title='Rigoler de ses échecs'")"
  echo "   vannes neuves : $($PSQL -At -c "select count(*) from \"Joke\" where id like 'cs18jkstory5v%' and \"isActive\"")"
  echo "   /parcours/storytelling : HTTP $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:5000/parcours/storytelling)"
  echo "   hub cite Storytelling : $(curl -s http://127.0.0.1:5000/parcours | grep -c 'Parcours Storytelling' || true)"
  echo "   sitemap cite storytelling : $(curl -s http://127.0.0.1:5000/sitemap.xml | grep -c 'parcours/storytelling' || true)"
  stop_app
fi

echo "== 4. Interrupteur FORCÉ à true (local seulement, restauré en sortie) : build, démarrage"
# Simule l'état d'après activation pour le pré-rendu ISR du build (sinon repli seed, voir le rapport).
$PSQL -c "update \"LearningPath\" set \"isActive\"=true where slug='storytelling'"
sed -i 's/export const STORYTELLING_PUBLIE = false;/export const STORYTELLING_PUBLIE = true;/' "$SWITCH"
build actif
sed -i 's/export const STORYTELLING_PUBLIE = true;/export const STORYTELLING_PUBLIE = false;/' "$SWITCH"
start_app actif
echo "   base : $($PSQL -At -c "select 'isActive='||\"isActive\" from \"LearningPath\" where slug='storytelling'") ; défi B callback : $($PSQL -At -c "select count(*) from \"Tip\" where title like 'Le callback%' and exercise like '%parcours Storytelling%'")"
"$HERE/comptes.sh"

echo "== 5. Captures"
cd "$HERE"
QA_OUT="$OUT" node captures.js 2>&1 | tee "$LOG/captures.txt" | grep -E "^(PASS|FAIL|CAPTURE)" || true
echo "== Bilan : $(grep -c '^PASS' "$LOG/captures.txt" || true) PASS, $(grep -c '^FAIL' "$LOG/captures.txt" || true) FAIL. Journaux : $LOG"
