#!/bin/bash
# s23 : contrôle local de la page de résiliation et captures pour @ux, @design, @legal, @reviewer.
# Modèle : scripts/qa-parcours-boulot-s19/captures.sh. Instance LOCALE jetable uniquement :
# Postgres sur 127.0.0.1:55434, app en env propre (cleanenv.sh s17 : aucun secret, ni Stripe, ni
# Resend), Chromium limité à localhost. Jamais contre la prod, aucun appel Stripe réel.
# Étapes : base jetable (schéma sans la table neuve) -> migration 17 jouée DEUX fois + écart Prisma ->
#   build interrupteur FERMÉ (état livré) : 404, captures « avant » (pied de page, carte du profil) ->
#   build interrupteur FORCÉ ouvert (remis à false juste après le build et en sortie quoi qu'il arrive)
#   -> captures 1440 / 390 des états.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO=/home/user/Marrant
WEB=$REPO/apps/web
SWITCH=$WEB/src/config/resiliation.ts
PGBIN=/usr/lib/postgresql/16/bin
PGPORT=55434
PGDIR=/var/lib/postgresql/qa-marrant-resiliation
CLEAN="$REPO/scripts/qa-parcours-s17/cleanenv.sh"
DBURL="postgresql://postgres@127.0.0.1:$PGPORT/marrant_qa"
PSQL="psql -h 127.0.0.1 -p $PGPORT -U postgres -d marrant_qa -v ON_ERROR_STOP=1 -q"
OUT=$REPO/docs/captures/s23-resiliation
LOG="${QA_LOG:-$HERE/run-$(date +%H%M%S)}"; mkdir -p "$LOG" "$OUT"
OFF='export const RESILIATION_PAGE_OUVERTE: boolean = false;'
ON='export const RESILIATION_PAGE_OUVERTE: boolean = true;'

grep -qx "$OFF" "$SWITCH" || { echo "STOP : RESILIATION_PAGE_OUVERTE n'est pas à false au départ."; exit 1; }
if curl -s -o /dev/null -m 2 http://127.0.0.1:5000/; then echo "STOP : port 5000 occupé."; exit 1; fi
if $PGBIN/pg_isready -h 127.0.0.1 -p $PGPORT >/dev/null 2>&1; then echo "STOP : Postgres déjà sur $PGPORT."; exit 1; fi

ferme() { sed -i "s/^$ON\$/$OFF/" "$SWITCH"; }
APP_PID=""
stop_app() { [ -n "$APP_PID" ] && kill -- -"$APP_PID" 2>/dev/null || true; APP_PID=""; sleep 2; }
cleanup() {
  echo "== Nettoyage : interrupteur remis à false, app arrêtée, base supprimée"
  ferme; stop_app
  su postgres -c "$PGBIN/pg_ctl -D $PGDIR/data -m fast stop" >/dev/null 2>&1 || true
  rm -rf "$PGDIR"
  if git -C "$REPO" diff --quiet -- "$SWITCH" 2>/dev/null || ! git -C "$REPO" ls-files --error-unmatch "$SWITCH" >/dev/null 2>&1; then
    grep -qx "$OFF" "$SWITCH" && echo "   interrupteur : false" || echo "ALERTE : interrupteur pas à false"
  fi
}
trap cleanup EXIT
trap 'exit 130' INT TERM HUP

export QA_EXTRA="DATABASE_URL=$DBURL"
start_app() {
  QA_NODE_ENV=production setsid "$CLEAN" npx next start -H 127.0.0.1 -p 5000 >"$LOG/app-$1.log" 2>&1 &
  APP_PID=$!
  for i in $(seq 1 60); do curl -s -o /dev/null http://127.0.0.1:5000/cgu && break; sleep 1; done
  local srv; srv=$(pgrep -f "^next-server" | head -1)
  [ -n "$srv" ] || { echo "STOP : next-server introuvable"; exit 1; }
  if tr '\0' '\n' </proc/$srv/environ | grep -i -E "neon|stripe|resend|umami|cloudflare|anthropic|admin_password" >/dev/null; then
    echo "STOP : variable sensible dans l'environnement de l'app"; exit 1; fi
}
build() { QA_NODE_ENV=production "$CLEAN" npm run build >"$LOG/build-$1.log" 2>&1 || { tail -30 "$LOG/build-$1.log"; exit 1; }; }

echo "== 1. Postgres jetable"
rm -rf "$PGDIR"; mkdir -p "$PGDIR"; chown postgres "$PGDIR"
su postgres -c "$PGBIN/initdb -D $PGDIR/data -U postgres --auth=trust -E UTF8 --locale=C.UTF-8" >"$LOG/initdb.log" 2>&1
su postgres -c "$PGBIN/pg_ctl -D $PGDIR/data -o '-p $PGPORT -k $PGDIR -c listen_addresses=127.0.0.1' -l $PGDIR/pg.log start" >/dev/null
sleep 2
psql -h 127.0.0.1 -p $PGPORT -U postgres -qc "create database marrant_qa"

echo "== 2. Schéma de la prod (sans la table neuve), puis migration 17 jouée deux fois"
cd "$WEB"
QA_NODE_ENV=development "$CLEAN" npx prisma db push --skip-generate >"$LOG/dbpush.log" 2>&1
$PSQL -c 'drop table "CancellationFeedback"'
echo "   table avant : $($PSQL -At -c "select count(*) from information_schema.tables where table_name='CancellationFeedback'")"
for passe in 1 2; do
  $PSQL -f prisma/migrations/17_resiliation_motif_s23/migration.sql && echo "   passe $passe : OK"
done
QA_NODE_ENV=development "$CLEAN" npx prisma migrate diff --from-url "$DBURL" --to-schema-datamodel prisma/schema.prisma --script >"$LOG/ecart.sql" 2>&1 || true
echo "   écart base / schema.prisma après migration : $(grep -v -E '^\s*$|^--' "$LOG/ecart.sql" | grep -c . || true) ligne(s) SQL (attendu 0)"
"$HERE/comptes.sh"

echo "== 3. Interrupteur FERMÉ (état livré) : 404 et captures « avant »"
build ferme; start_app ferme
echo "   /resiliation : HTTP $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:5000/resiliation) (attendu 404)"
echo "   /resiliation/confirmee : HTTP $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:5000/resiliation/confirmee) (attendu 404)"
echo "   API : HTTP $(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'origin: http://localhost:5000' -H 'content-type: application/json' -d '{}' http://127.0.0.1:5000/api/user/subscription/resiliation) (attendu 404)"
echo "   pied de page : $(curl -s http://127.0.0.1:5000/cgu | grep -o 'href="[^"]*"[^>]*>Résilier ton contrat' | head -1)"
cd "$HERE"; QA_OUT="$OUT" QA_PHASE=avant node captures.js 2>&1 | tee "$LOG/captures-avant.txt" | grep -E "^(PASS|FAIL|CAPTURE|INFO)" || true
cd "$WEB"; stop_app

echo "== 4. Interrupteur FORCÉ ouvert (local seulement, remis à false juste après le build)"
sed -i "s/^$OFF\$/$ON/" "$SWITCH"; grep -qx "$ON" "$SWITCH" || { echo "STOP : interrupteur non basculé"; exit 1; }
build ouvert
ferme; grep -qx "$OFF" "$SWITCH" && echo "   interrupteur remis à false (le build ouvert reste dans .next)"
start_app ouvert
cd "$HERE"; QA_OUT="$OUT" QA_PHASE=apres QA_PSQL="$PSQL" node captures.js 2>&1 | tee "$LOG/captures-apres.txt" | grep -E "^(PASS|FAIL|CAPTURE|INFO)" || true
echo "   motifs en base : $($PSQL -At -c "select count(*)||' ligne(s), raisons='||coalesce(string_agg(array_to_string(reasons,'+'),' ; '),'-') from \"CancellationFeedback\"")"
echo "   appels Stripe dans le journal de l'app : $(grep -c -i 'api.stripe.com' "$LOG/app-ouvert.log" || true)"
cd "$WEB"; stop_app
echo "== 5. Build final interrupteur FERMÉ (laisse .next dans l'état livré)"
build final
T="$LOG/captures-avant.txt $LOG/captures-apres.txt"
echo "== Bilan : $(cat $T | grep -c '^PASS' || true) PASS, $(cat $T | grep -c '^FAIL' || true) FAIL, $(cat $T | grep -c '^CAPTURE' || true) captures. Journaux : $LOG"
