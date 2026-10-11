#!/bin/bash
# Refait TOUTES les captures + contrôles des parcours d'apprentissage sur une instance LOCALE jetable.
# Usage : refaire-captures.sh <dossier-captures> [--sans-build] [--smoke] [--seul <script.js> (diagnostic : un seul script)]
#   ex.   refaire-captures.sh docs/qa/captures-parcours-apprentissage-s17/iter-2/
# Tour 4 : survols réels + « -repos », cadrage barre + carte (375/768/1280), validation-echec adaptative, 1 seul « Réessayer », focus après Espace.
# Tour 3 : chargement/échec cadrés (375, 1280), échec de validation, focus + annonce après « Valider », survols, accueil Premium (1 bouton plein), fin rechargée sous l'en-tête.
# Tour 2 : + local-etats.js (focus, survol, « On valide… », chargement/échec, rappel, Reprendre, personas 375, 3 parcours).
# Étapes : Postgres jetable -> schéma + seed + vannes des parcours + comptes de test -> build (env propre)
#          -> app lancée en env propre (contrôle : aucune variable NEON/secret) -> captures + axe + index.md
#          -> [option] smoke Playwright @s16 du repo contre localhost -> arrêt app + suppression base.
# Sécurité : aucun secret transmis à l'app (env -i), Chromium bloque tout hôte externe sauf localhost.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO=/home/user/Marrant
WEB=$REPO/apps/web
PGBIN=/usr/lib/postgresql/16/bin
PGPORT=55433
# Hors /tmp/claude-0 : le bac à sable y remet des droits 700 que l'utilisateur postgres ne traverse pas.
PGDIR=/var/lib/postgresql/qa-marrant-captures
CLEAN="$HERE/cleanenv.sh"
DB="postgresql://postgres@127.0.0.1:$PGPORT/marrant_qa"
PSQL="psql -h 127.0.0.1 -p $PGPORT -U postgres -d marrant_qa -v ON_ERROR_STOP=1 -q"

[ $# -ge 1 ] || { echo "Usage : $0 <dossier-captures> [--sans-build] [--smoke]"; exit 2; }
OUT="$1"; shift
case "$OUT" in /*) ;; *) OUT="$REPO/$OUT" ;; esac
BUILD=1; SMOKE=0
SEUL=""
while [ $# -gt 0 ]; do case "$1" in --sans-build) BUILD=0 ;; --smoke) SMOKE=1 ;; --seul) shift; SEUL="$1" ;; *) echo "option inconnue $1"; exit 2 ;; esac; shift; done
mkdir -p "$OUT"
# Captures du tour précédent dans CE dossier : remplacées (noms stables), aucune capture orpheline.
rm -f "$OUT"/v-*.png "$OUT"/p-*.png "$OUT"/index.md
LOG="$HERE/run-$(date +%H%M%S)"; mkdir -p "$LOG"

if curl -s -o /dev/null -m 2 http://127.0.0.1:5000/; then echo "STOP : le port 5000 est déjà occupé (arrêter l'autre instance d'abord)."; exit 1; fi
if $PGBIN/pg_isready -h 127.0.0.1 -p $PGPORT >/dev/null 2>&1; then echo "STOP : un Postgres écoute déjà sur $PGPORT."; exit 1; fi

APP_PID=""
cleanup() {
  echo "== Nettoyage : arrêt de l'app et suppression de la base locale"
  [ -n "$APP_PID" ] && kill -- -"$APP_PID" 2>/dev/null || true
  sleep 1
  su postgres -c "$PGBIN/pg_ctl -D $PGDIR/data -m fast stop" >/dev/null 2>&1 || true
  rm -rf "$PGDIR"
}
trap cleanup EXIT

echo "== 1. Postgres jetable ($PGDIR, port $PGPORT)"
rm -rf "$PGDIR"; mkdir -p "$PGDIR"; chown postgres "$PGDIR"
su postgres -c "$PGBIN/initdb -D $PGDIR/data -U postgres --auth=trust -E UTF8 --locale=C.UTF-8" >"$LOG/initdb.log" 2>&1
su postgres -c "$PGBIN/pg_ctl -D $PGDIR/data -o '-p $PGPORT -k $PGDIR -c listen_addresses=127.0.0.1' -l $PGDIR/pg.log start" >/dev/null
sleep 2
psql -h 127.0.0.1 -p $PGPORT -U postgres -qc "create database marrant_qa"

echo "== 2. Schéma + seed (env propre)"
cd "$WEB"
QA_NODE_ENV=development "$CLEAN" npx prisma db push --skip-generate >"$LOG/dbpush.log" 2>&1
"$CLEAN" npx esbuild prisma/seed-data.ts --bundle --platform=node --outfile="$LOG/seed.cjs" --external:@prisma/client >/dev/null 2>&1
QA_NODE_ENV=development QA_EXTRA="NODE_PATH=$WEB/node_modules" "$CLEAN" node "$LOG/seed.cjs" | tail -3

echo "== 3. Vannes des parcours (fixtures, absentes du seed) + comptes de test"
python3 - "$HERE/fixtures-vannes-actives.json" "$REPO/docs/content/parcours-seed.json" >"$LOG/jokes.sql" <<'PY'
import json, sys, hashlib
act = {j['content']: j for j in json.load(open(sys.argv[1]))}
q = lambda v: 'NULL' if v is None else "$q$" + str(v) + "$q$"
for p in json.load(open(sys.argv[2])):
    for s in p['steps']:
        for c in s.get('jokeContents', []):
            j = act.get(c)
            if not j: sys.stderr.write('vanne absente des fixtures : ' + c[:60] + '\n'); continue
            jid = 'qafx' + hashlib.sha1(c.encode()).hexdigest()[:16]  # id stable -> URL de fiche stable
            print('insert into "Joke"(id,content,punchline,category,"maturityLevel",type,"isActive","updatedAt","comedyTechnique","techniqueExplanation","howToApply") values (%s,%s,%s,%s,%s,%s,true,now(),%s,%s,%s) on conflict do nothing;' % (
                q(jid), q(j['content']), q(j['punchline']), q(j['category']), j.get('maturityLevel', 1), q(j.get('type', 'CLASSIQUE')),
                q(j.get('comedyTechnique')), q(j.get('techniqueExplanation')), q(j.get('howToApply'))))
PY
$PSQL -f "$LOG/jokes.sql"
H=$(node -e 'const c=require("crypto");const s=c.randomBytes(16).toString("hex");c.scrypt("QaLocal-2026!",s,64,{N:32768,r:8,p:1,maxmem:64*1024*1024},(e,k)=>console.log(s+":"+k.toString("hex")))')
$PSQL <<SQL
insert into "User"(id,email,name,"passwordHash",plan,level,xp,streak,"emailOptOut","createdAt","updatedAt","emailVerified") values
('qa_prem','qa-premium@local.test','Premium QA','$H','PREMIUM','NOVICE',0,0,false,now(),now(),null),
('qa_free','qa-free@local.test','Free QA','$H','FREE','NOVICE',0,0,false,now(),now(),null),
('qa_premv','qa-premium-verif@local.test','Premium Verif QA','$H','PREMIUM','NOVICE',0,0,false,now(),now(),now()),
('qa_p375','qa-p375@local.test','Premium 375','$H','PREMIUM','NOVICE',0,0,false,now(),now(),null),
('qa_p768','qa-p768@local.test','Premium 768','$H','PREMIUM','NOVICE',0,0,false,now(),now(),null),
('qa_conf','qa-conf@local.test','Premium Confiance','$H','PREMIUM','NOVICE',0,0,false,now(),now(),null),
('qa_mac375','qa-mac375@local.test','Sophie QA','$H','PREMIUM','NOVICE',0,0,false,now(),now(),null),
('qa_c375','qa-c375@local.test','Marc QA','$H','PREMIUM','NOVICE',0,0,false,now(),now(),null),
('qa_etats375','qa-etats375@local.test','Etats 375','$H','PREMIUM','NOVICE',0,0,false,now(),now(),null),
('qa_etats1280','qa-etats1280@local.test','Etats 1280','$H','PREMIUM','NOVICE',0,0,false,now(),now(),null),
('qa_etats768','qa-etats768@local.test','Etats 768','$H','PREMIUM','NOVICE',0,0,false,now(),now(),null);
insert into "Subscription"(id,"userId",plan,status,"currentPeriodEnd","billingInterval","priceAmountCents","cancelAtPeriodEnd","createdAt","updatedAt")
select 'sub_'||id, id, 'PREMIUM', 'ACTIVE', now()+interval '30 days', 'month', 299, false, now(), now() from "User" where plan='PREMIUM';
SQL
echo "   $($PSQL -At -c "select count(*) from \"Joke\" where id like 'qafx%'") vannes fixtures, $($PSQL -At -c 'select count(*) from "User"') comptes"

if [ $BUILD = 1 ]; then
  echo "== 4. Build (env propre, aucune clé NEXT_PUBLIC prod : pas d'Umami dans le HTML)"
  QA_NODE_ENV=production "$CLEAN" npm run build >"$LOG/build.log" 2>&1 || { tail -30 "$LOG/build.log"; exit 1; }
fi

echo "== 5. Lancement de l'app (env propre)"
QA_NODE_ENV=production setsid "$CLEAN" npx next start -H 127.0.0.1 -p 5000 >"$LOG/app.log" 2>&1 &
APP_PID=$!
for i in $(seq 1 60); do curl -s -o /dev/null http://127.0.0.1:5000/ && break; sleep 1; done
SRV=$(pgrep -f "^next-server" | head -1)
[ -n "$SRV" ] || { echo "STOP : next-server introuvable"; exit 1; }
if tr '\0' '\n' </proc/$SRV/environ | grep -i -E "neon|replit_database|stripe|resend|umami|cloudflare|bing|anthropic|google_client_secret|admin_password" >/dev/null; then
  echo "STOP : variable sensible présente dans l'environnement de l'app"; exit 1; fi
echo "   contrôle env | grep -i neon dans le processus de l'app (PID $SRV) : vide"
echo "   attente des tâches de démarrage (T+30 s)..."
for i in $(seq 1 90); do grep -q "parcours-content" "$LOG/app.log" && break; sleep 2; done
grep "^\[startup\]" "$LOG/app.log" | cut -c1-160 || true

cd "$HERE"
if [ -n "$SEUL" ]; then
  echo "== 6. Script seul : $SEUL"
  QA_OUT="$OUT" node "$SEUL" 2>&1 | tee "$LOG/seul.txt" | grep -v "^LOGS" || true
  exit 0
fi
echo "== 6. Captures + contrôles (visiteur, Premium, profil, axe)"
QA_OUT="$OUT" node local-visiteur.js >"$LOG/visiteur.txt" 2>&1 || echo "   (script visiteur interrompu, voir $LOG/visiteur.txt)"
grep -E "^(PASS|FAIL)" "$LOG/visiteur.txt" || true
QA_OUT="$OUT" node local-premium.js >"$LOG/premium.txt" 2>&1 || echo "   (script Premium interrompu, voir $LOG/premium.txt)"
grep -E "^(PASS|FAIL|VUE)" "$LOG/premium.txt" || true
echo "   états du tour 2 (focus, survol, chargement, échec, rappel, personas 375, 3 parcours)..."
QA_OUT="$OUT" node local-etats.js >"$LOG/etats.txt" 2>&1 || echo "   (script états interrompu, voir $LOG/etats.txt)"
grep -E "^(PASS|FAIL|ANNONCE|REESSAYER)" "$LOG/etats.txt" || true
node gen-index.js "$OUT"

if [ $SMOKE = 1 ]; then
  echo "== 7. Smoke Playwright du repo, @s16 sans @achat, contre localhost uniquement"
  cd "$WEB"
  E2E_BASE_URL=http://localhost:5000 QA_PW_OUT="$LOG/pw" QA_EXTRA="NODE_PATH=$WEB/node_modules E2E_BASE_URL=http://localhost:5000 QA_PW_OUT=$LOG/pw" \
    "$CLEAN" npx playwright test -c "$HERE/pw-smoke.config.ts" --grep @s16 --grep-invert @achat 2>&1 | tee "$LOG/smoke.txt" | tail -25 || true
fi

echo "== Bilan : $(cat "$LOG"/visiteur.txt "$LOG"/premium.txt "$LOG"/etats.txt 2>/dev/null | grep -c '^PASS') PASS, $(cat "$LOG"/visiteur.txt "$LOG"/premium.txt "$LOG"/etats.txt 2>/dev/null | grep -c '^FAIL' || true) FAIL. Journaux : $LOG ; captures : $OUT"
