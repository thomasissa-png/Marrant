#!/bin/bash
# Comptes de test LOCAUX (base jetable) pour la non-régression des 4 parcours en ligne (s19, après 508cd96) :
#  - qa_r2_<slug>_<w> : Premium qui a validé l'étape 1 du parcours <slug> (étape 2, première Premium, ouverte),
#    un par largeur (375, 1280) ;
#  - qa_rfin_<slug> : Premium qui a fini toutes les étapes du parcours <slug> (carte de fin).
# Mot de passe : celui de comptes.sh. Jamais contre la prod (port 55433, base marrant_qa).
set -euo pipefail
PSQL="psql -h 127.0.0.1 -p 55433 -U postgres -d marrant_qa -v ON_ERROR_STOP=1 -q"
H=$(node -e 'const c=require("crypto");const s=c.randomBytes(16).toString("hex");c.scrypt("QaLocal-2026!",s,64,{N:32768,r:8,p:1,maxmem:64*1024*1024},(e,k)=>console.log(s+":"+k.toString("hex")))')
$PSQL <<SQL
with p as (select slug from "LearningPath" where slug in ('machine-a-cafe','repartie','confiance','storytelling'))
insert into "User"(id,email,name,"passwordHash",plan,level,xp,streak,"emailOptOut","createdAt","updatedAt","emailVerified")
select 'qa_r2_'||p.slug||'_'||w, 'qa-r2-'||p.slug||'-'||w||'@local.test', 'Premium étape 2', '$H', 'PREMIUM', 'NOVICE', 50, 0, false, now(), now(), now()
from p, unnest(array[375,1280]) w;
with p as (select slug from "LearningPath" where slug in ('machine-a-cafe','repartie','confiance','storytelling'))
insert into "User"(id,email,name,"passwordHash",plan,level,xp,streak,"emailOptOut","createdAt","updatedAt","emailVerified")
select 'qa_rfin_'||p.slug, 'qa-rfin-'||p.slug||'@local.test', 'Premium fin', '$H', 'PREMIUM', 'NOVICE', 300, 0, false, now(), now(), now()
from p;
insert into "Subscription"(id,"userId",plan,status,"currentPeriodEnd","billingInterval","priceAmountCents","cancelAtPeriodEnd","createdAt","updatedAt")
select 'sub_'||id, id, 'PREMIUM', 'ACTIVE', now()+interval '30 days', 'month', 299, false, now(), now() from "User" where id like 'qa_r%';
-- Étape 2 ouverte : étape 1 validée il y a 7 jours.
insert into "UserPathProgress"(id,"userId","learningPathId","currentStep","completedSteps","startedAt","completedAt")
select 'upp_'||u.id, u.id, p.id, 1, array[1], now()-interval '10 days', null
from "User" u join "LearningPath" p on u.id like 'qa_r2_'||p.slug||'_%';
insert into "UserPathStepCompletion"(id,"userId","learningPathId","stepOrder","completedAt")
select 'upc_'||u.id||'_1', u.id, p.id, 1, now()-interval '7 days'
from "User" u join "LearningPath" p on u.id like 'qa_r2_'||p.slug||'_%';
-- Parcours terminé : toutes les étapes validées, une par semaine.
insert into "UserPathProgress"(id,"userId","learningPathId","currentStep","completedSteps","startedAt","completedAt")
select 'upp_'||u.id, u.id, p.id, n.c, (select array_agg(k order by k) from generate_series(1,n.c) k), now()-interval '60 days', now()
from "User" u join "LearningPath" p on u.id = 'qa_rfin_'||p.slug
join (select "learningPathId" lp, count(*)::int c from "LearningPathStep" group by 1) n on n.lp = p.id;
insert into "UserPathStepCompletion"(id,"userId","learningPathId","stepOrder","completedAt")
select 'upc_'||u.id||'_'||s."order", u.id, p.id, s."order", now()-((7-s."order")*interval '7 days')
from "User" u join "LearningPath" p on u.id = 'qa_rfin_'||p.slug join "LearningPathStep" s on s."learningPathId" = p.id;
SQL
echo "   comptes régression : $($PSQL -At -c "select count(*) from \"User\" where id like 'qa_r%'") ; fins : $($PSQL -At -c "select string_agg(u.id||'='||array_length(g.\"completedSteps\",1)||'/'||(select count(*) from \"LearningPathStep\" s where s.\"learningPathId\"=g.\"learningPathId\"), ' ' order by u.id) from \"User\" u join \"UserPathProgress\" g on g.\"userId\"=u.id where u.id like 'qa_rfin_%'")"
