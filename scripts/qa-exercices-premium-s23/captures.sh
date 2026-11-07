#!/bin/bash
# s23 : exercice des fiches conseil et vidéo pour l'abonné Premium, captures AVANT / APRÈS.
# Modèle : scripts/qa-resiliation-s23/. Instance LOCALE jetable uniquement : Postgres sur
# 127.0.0.1:55435 rempli par le seed, app en env propre (cleanenv.sh s17 : aucun secret, ni
# Stripe, ni Resend), Chromium limité à localhost. Jamais contre la prod, aucun appel Stripe.
# AVANT = code de AVANT_REF (défaut 2a18cb8^) construit dans un worktree jetable ; APRÈS = dépôt.
# Preuve de non-fuite : HTML et payload RSC d'une fiche, sans session, ne contiennent ni
# l'exercice ni les points clés (contrôle refait sur la vanne, pour mémoire).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO=/home/user/Marrant
WEB=$REPO/apps/web
AVANT_REF="${AVANT_REF:-2a18cb8^}"
PGBIN=/usr/lib/postgresql/16/bin
PGPORT=55435
PGDIR=/var/lib/postgresql/qa-marrant-exercices
WT=/tmp/qa-marrant-exercices-avant
CLEAN="$REPO/scripts/qa-parcours-s17/cleanenv.sh"
DBURL="postgresql://postgres@127.0.0.1:$PGPORT/marrant_qa"
PSQL="psql -h 127.0.0.1 -p $PGPORT -U postgres -d marrant_qa -v ON_ERROR_STOP=1 -q"
OUT=$REPO/docs/captures/s23-exercices-premium
LOG="${QA_LOG:-$HERE/run-$(date +%H%M%S)}"; mkdir -p "$LOG" "$OUT"

if curl -s -o /dev/null -m 2 http://127.0.0.1:5000/; then echo "STOP : port 5000 occupé."; exit 1; fi
if $PGBIN/pg_isready -h 127.0.0.1 -p $PGPORT >/dev/null 2>&1; then echo "STOP : Postgres déjà sur $PGPORT."; exit 1; fi

APP_PID=""
stop_app() {
  [ -n "$APP_PID" ] && kill -- -"$APP_PID" 2>/dev/null || true; APP_PID=""; sleep 2
  if curl -s -o /dev/null -m 2 http://127.0.0.1:5000/; then echo "STOP : l'app ne s'est pas arrêtée"; exit 1; fi
}
cleanup() {
  echo "== Nettoyage : app arrêtée, base et worktree supprimés"
  stop_app
  su postgres -c "$PGBIN/pg_ctl -D $PGDIR/data -m fast stop" >/dev/null 2>&1 || true
  rm -rf "$PGDIR"
  git -C "$REPO" worktree remove --force "$WT" >/dev/null 2>&1 || rm -rf "$WT"
  git -C "$REPO" worktree prune
}
trap cleanup EXIT
trap 'exit 130' INT TERM HUP

export QA_EXTRA="DATABASE_URL=$DBURL"
start_app() { # $1 = nom, $2 = dossier apps/web
  # setsid lancé depuis ce shell (pas dans un sous-shell) : APP_PID est le chef du groupe, que stop_app tue.
  cd "$2"
  QA_NODE_ENV=production setsid "$CLEAN" npx next start -H 127.0.0.1 -p 5000 >"$LOG/app-$1.log" 2>&1 &
  APP_PID=$!
  for i in $(seq 1 60); do curl -s -o /dev/null http://127.0.0.1:5000/cgu && break; sleep 1; done
  local srv; srv=$(pgrep -f "^next-server" | head -1)
  [ -n "$srv" ] || { echo "STOP : next-server introuvable"; exit 1; }
  if tr '\0' '\n' </proc/$srv/environ | grep -i -E "neon|stripe|resend|umami|cloudflare|anthropic|admin_password" >/dev/null; then
    echo "STOP : variable sensible dans l'environnement de l'app"; exit 1; fi
}
build() { (cd "$2" && QA_NODE_ENV=production "$CLEAN" npm run build >"$LOG/build-$1.log" 2>&1) || { tail -30 "$LOG/build-$1.log"; exit 1; }; }

echo "== 1. Postgres jetable, schéma + seed"
rm -rf "$PGDIR"; mkdir -p "$PGDIR"; chown postgres "$PGDIR"
su postgres -c "$PGBIN/initdb -D $PGDIR/data -U postgres --auth=trust -E UTF8 --locale=C.UTF-8" >"$LOG/initdb.log" 2>&1
su postgres -c "$PGBIN/pg_ctl -D $PGDIR/data -o '-p $PGPORT -k $PGDIR -c listen_addresses=127.0.0.1' -l $PGDIR/pg.log start" >/dev/null
sleep 2
psql -h 127.0.0.1 -p $PGPORT -U postgres -qc "create database marrant_qa"
cd "$WEB"
QA_NODE_ENV=development "$CLEAN" npx prisma db push --skip-generate >"$LOG/dbpush.log" 2>&1
"$CLEAN" npx esbuild prisma/seed-data.ts --bundle --platform=node --outfile="$LOG/seed.cjs" --external:@prisma/client >/dev/null 2>&1
QA_NODE_ENV=development QA_EXTRA="DATABASE_URL=$DBURL NODE_PATH=$WEB/node_modules" "$CLEAN" node "$LOG/seed.cjs" >"$LOG/seed.log" 2>&1 || { tail -20 "$LOG/seed.log"; exit 1; }
"$HERE/comptes.sh"
# Fiches capturées : un conseil avec exercice, une vidéo avec exercice et points clés.
FICHES=$($PSQL -At -F '|' -c "
  (select 'conseil', id, title, exercise from \"Tip\" where \"isActive\" and btrim(exercise) <> '' order by \"createdAt\", id limit 1)
  union all
  (select 'video', id, title, exercise from \"Video\" where \"isActive\" and btrim(coalesce(exercise,'')) <> '' and cardinality(learnings) > 0 order by \"createdAt\", id limit 1)")
echo "$FICHES" | cut -d'|' -f1,2 | sed 's/^/   fiche : /'
export QA_FICHES="$LOG/fiches.json"
$PSQL -At -c "select json_build_object(
  'conseil', (select json_build_object('id', id, 'title', title, 'exercice', exercise) from \"Tip\" where \"isActive\" and btrim(exercise) <> '' order by \"createdAt\", id limit 1),
  'video', (select json_build_object('id', id, 'title', title, 'exercice', exercise, 'points', learnings) from \"Video\" where \"isActive\" and btrim(coalesce(exercise,'')) <> '' and cardinality(learnings) > 0 order by \"createdAt\", id limit 1),
  'vanne', (select json_build_object('id', id, 'content', content, 'exercice', \"howToApply\") from \"Joke\" where \"isActive\" and btrim(coalesce(\"howToApply\",'')) <> '' order by \"createdAt\", id limit 1))" >"$QA_FICHES"

echo "== 2. AVANT : code de $AVANT_REF dans un worktree jetable"
rm -rf "$WT"; git -C "$REPO" worktree add --detach "$WT" "$AVANT_REF" >/dev/null 2>&1
ln -s "$WEB/node_modules" "$WT/apps/web/node_modules"
build avant "$WT/apps/web"; start_app avant "$WT/apps/web"
cd "$HERE"; QA_OUT="$OUT" QA_PHASE=avant node captures.js 2>&1 | tee "$LOG/captures-avant.txt" | grep -E "^(PASS|FAIL|CAPTURE|INFO)" || true
stop_app

echo "== 3. APRÈS : code du dépôt"
build apres "$WEB"; start_app apres "$WEB"
cd "$HERE"; QA_OUT="$OUT" QA_PHASE=apres node captures.js 2>&1 | tee "$LOG/captures-apres.txt" | grep -E "^(PASS|FAIL|CAPTURE|INFO)" || true
echo "   appels Stripe dans le journal de l'app : $(grep -c -i 'api.stripe.com' "$LOG/app-apres.log" || true)"
stop_app
T="$LOG/captures-avant.txt $LOG/captures-apres.txt"
echo "== Bilan : $(cat $T | grep -c '^PASS' || true) PASS, $(cat $T | grep -c '^FAIL' || true) FAIL, $(cat $T | grep -c '^CAPTURE' || true) captures. Journaux : $LOG"
