#!/bin/bash
# s19 : contrôle local du parcours Boulot (inactif puis forcé actif) et captures pour @design / @ux.
# Modèle : scripts/qa-parcours-storytelling-s18/captures.sh.
# Instance LOCALE jetable uniquement : Postgres sur 127.0.0.1:55433, app en env propre (cleanenv.sh s17),
# Chromium limité à localhost. Jamais contre la prod.
# Usage : captures.sh [--sans-inactif]
# Étapes : base (schéma + seed + données simulées comme en prod) -> build interrupteur à false ->
#   app : tâche de démarrage, parcours INACTIF, 404, fiches vidéo corrigées, 2e démarrage idempotent ->
#   build interrupteur FORCÉ à true (BOULOT_PUBLIE seul, remis à false en sortie quoi qu'il arrive) ->
#   app : parcours actif -> captures 375/768/1280 visiteur et Premium.
# STORYTELLING_PUBLIE (en ligne, true) n'est JAMAIS touché par ce script.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
S17="$HERE/../qa-parcours-s17"
REPO=/home/user/Marrant
WEB=$REPO/apps/web
SWITCH=$WEB/src/config/parcours-publication.ts
PGBIN=/usr/lib/postgresql/16/bin
PGPORT=55433
PGDIR=/var/lib/postgresql/qa-marrant-boulot
CLEAN="$S17/cleanenv.sh"
PSQL="psql -h 127.0.0.1 -p $PGPORT -U postgres -d marrant_qa -v ON_ERROR_STOP=1 -q"
OUT=$REPO/docs/qa/captures-parcours-boulot-s19
LOG="${QA_LOG:-$HERE/run-$(date +%H%M%S)}"; mkdir -p "$LOG" "$OUT"
INACTIF=1; [ "${1:-}" = "--sans-inactif" ] && INACTIF=0
BOULOT_OFF='export const BOULOT_PUBLIE = false;'
BOULOT_ON='export const BOULOT_PUBLIE = true;'

grep -qx "$BOULOT_OFF" "$SWITCH" || { echo "STOP : BOULOT_PUBLIE n'est pas à false au départ."; exit 1; }
STORY_AVANT=$(grep '^export const STORYTELLING_PUBLIE' "$SWITCH")
if curl -s -o /dev/null -m 2 http://127.0.0.1:5000/; then echo "STOP : port 5000 occupé."; exit 1; fi
if $PGBIN/pg_isready -h 127.0.0.1 -p $PGPORT >/dev/null 2>&1; then echo "STOP : Postgres déjà sur $PGPORT."; exit 1; fi

boulot_off() { sed -i "s/^$BOULOT_ON\$/$BOULOT_OFF/" "$SWITCH"; }
APP_PID=""
stop_app() { [ -n "$APP_PID" ] && kill -- -"$APP_PID" 2>/dev/null || true; APP_PID=""; sleep 2; }
cleanup() {
  echo "== Nettoyage : BOULOT_PUBLIE remis à false, app arrêtée, base supprimée"
  boulot_off
  stop_app
  su postgres -c "$PGBIN/pg_ctl -D $PGDIR/data -m fast stop" >/dev/null 2>&1 || true
  rm -rf "$PGDIR"
  [ "$(grep '^export const STORYTELLING_PUBLIE' "$SWITCH")" = "$STORY_AVANT" ] || echo "ALERTE : STORYTELLING_PUBLIE a changé"
  if git -C "$REPO" diff --quiet -- "$SWITCH"; then echo "   git diff de l'interrupteur : vide"; else echo "ALERTE : git diff de l'interrupteur NON vide"; fi
}
trap cleanup EXIT
trap 'exit 130' INT TERM HUP

start_app() {
  QA_NODE_ENV=production setsid "$CLEAN" npx next start -H 127.0.0.1 -p 5000 >"$LOG/app-$1.log" 2>&1 &
  APP_PID=$!
  for i in $(seq 1 60); do curl -s -o /dev/null http://127.0.0.1:5000/ && break; sleep 1; done
  local srv; srv=$(pgrep -f "^next-server" | head -1)
  [ -n "$srv" ] || { echo "STOP : next-server introuvable"; exit 1; }
  if tr '\0' '\n' </proc/$srv/environ | grep -i -E "neon|replit_database|stripe|resend|umami|cloudflare|anthropic|admin_password" >/dev/null; then
    echo "STOP : variable sensible dans l'environnement de l'app"; exit 1; fi
  for i in $(seq 1 90); do grep -q "parcours-boulot:" "$LOG/app-$1.log" && break; sleep 2; done
  sleep 3
  grep -E "^\[startup\] .*(boulot|storytelling)" "$LOG/app-$1.log" | cut -c1-900 || true
}

build() {
  QA_NODE_ENV=production "$CLEAN" npm run build >"$LOG/build-$1.log" 2>&1 || { tail -30 "$LOG/build-$1.log"; exit 1; }
}

videos() { $PSQL -At -c "select string_agg(\"youtubeId\"||' « '||title||' » '||duration, ' | ' order by \"youtubeId\") from \"Video\" where \"youtubeId\" in ('m30qZa8p_Js','qdqIc-uzdbA','rldvVgHQSvo')"; }

echo "== 1. Postgres jetable"
rm -rf "$PGDIR"; mkdir -p "$PGDIR"; chown postgres "$PGDIR"
su postgres -c "$PGBIN/initdb -D $PGDIR/data -U postgres --auth=trust -E UTF8 --locale=C.UTF-8" >"$LOG/initdb.log" 2>&1
su postgres -c "$PGBIN/pg_ctl -D $PGDIR/data -o '-p $PGPORT -k $PGDIR -c listen_addresses=127.0.0.1' -l $PGDIR/pg.log start" >/dev/null
sleep 2
psql -h 127.0.0.1 -p $PGPORT -U postgres -qc "create database marrant_qa"

echo "== 2. Schéma + seed + données dans l'état de la prod (env propre)"
cd "$WEB"
QA_NODE_ENV=development "$CLEAN" npx prisma db push --skip-generate >"$LOG/dbpush.log" 2>&1
"$CLEAN" npx esbuild prisma/seed-data.ts --bundle --platform=node --outfile="$LOG/seed.cjs" --external:@prisma/client >/dev/null 2>&1
QA_NODE_ENV=development QA_EXTRA="NODE_PATH=$WEB/node_modules" "$CLEAN" node "$LOG/seed.cjs" | tail -2
python3 -I "$HERE/fixtures.py" "$REPO" >"$LOG/fixtures.sql"
$PSQL -f "$LOG/fixtures.sql"
echo "   conseils 2-5 : $($PSQL -At -c "select string_agg(left(title,25)||'='||\"isActive\", ' | ' order by title) from \"Tip\" where id like 'cmmw0t%'")"
echo "   vannes en ligne à l'id de prod : $($PSQL -At -c "select count(*) from \"Joke\" where id in (select unnest(string_to_array('$(python3 -I -c "import json;print(','.join(v['id'] for v in json.load(open('$REPO/docs/content/parcours-boulot-s19.json'))['_meta']['vannesEnLigne']))")', ',')))")/20"
echo "   fiches vidéo (avant) : $(videos)"

if [ $INACTIF = 1 ]; then
  echo "== 3. Interrupteur à false : build, démarrage, parcours importé INACTIF"
  build inactif; start_app inactif
  echo "   base : $($PSQL -At -c "select slug||' isActive='||\"isActive\"||' étapes='||(select count(*) from \"LearningPathStep\" s where s.\"learningPathId\"=p.id) from \"LearningPath\" p where slug='boulot'")"
  echo "   conseils : $($PSQL -At -c "select count(*) from \"Tip\" where (id like 'cmmw0t%' or id like 'cs19tipboulot%') and \"isActive\" and not \"generatedByAI\"")/6 actifs, generatedByAI=false"
  echo "   vannes neuves : $($PSQL -At -c "select count(*) from \"Joke\" where id like 'cs19jkboulot%' and \"isActive\"")/10"
  echo "   fiches vidéo (après) : $(videos)"
  echo "   marqueurs vidéo : $($PSQL -At -c "select count(*) from \"DataPatch\" where \"patchId\" like 'parcours-boulot:s19:video:%'")/3 ; global : $($PSQL -At -c "select string_agg(\"patchId\", ' ') from \"DataPatch\" where \"patchId\" like 'parcours-boulot:s19-v%'")"
  echo "   /parcours/boulot : HTTP $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:5000/parcours/boulot)"
  echo "   hub cite Boulot : $(curl -s http://127.0.0.1:5000/parcours | grep -c 'Parcours Boulot' || true)"
  echo "   sitemap / llms.txt citent boulot : $(curl -s http://127.0.0.1:5000/sitemap.xml | grep -c 'parcours/boulot' || true) / $(curl -s http://127.0.0.1:5000/llms.txt | grep -c -E 'parcours/boulot|Parcours Boulot' || true)"
  stop_app
  echo "== 3 bis. 2e démarrage (idempotence)"
  start_app inactif-2 >/dev/null
  grep -E "parcours-boulot:s19-v1:publie=false déjà appliqué" "$LOG/app-inactif-2.log" | head -1 | sed 's/^/   /' || echo "   ALERTE : la tâche Boulot n'a pas sauté au 2e démarrage"
  echo "   fiches vidéo (inchangées) : $(videos)"
  stop_app
fi

echo "== 4. BOULOT_PUBLIE FORCÉ à true (local seulement, remis à false juste après le build et en sortie)"
# Simule l'état d'après activation pour le pré-rendu ISR du build (sinon repli seed, voir s18).
$PSQL -c "update \"LearningPath\" set \"isActive\"=true where slug='boulot'"
sed -i "s/^$BOULOT_OFF\$/$BOULOT_ON/" "$SWITCH"
grep -qx "$BOULOT_ON" "$SWITCH" || { echo "STOP : interrupteur non basculé"; exit 1; }
build actif
boulot_off
start_app actif
echo "   base : $($PSQL -At -c "select 'isActive='||\"isActive\" from \"LearningPath\" where slug='boulot'")"
"$HERE/comptes.sh"

echo "== 5. Captures"
cd "$HERE"
QA_OUT="$OUT" node captures.js 2>&1 | tee "$LOG/captures.txt" | grep -E "^(PASS|FAIL|CAPTURE)" || true
echo "== Bilan : $(grep -c '^PASS' "$LOG/captures.txt" || true) PASS, $(grep -c '^FAIL' "$LOG/captures.txt" || true) FAIL, $(grep -c '^CAPTURE' "$LOG/captures.txt" || true) captures. Journaux : $LOG"
