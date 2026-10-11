#!/bin/bash
# Comptes de test LOCAUX (base jetable) pour le parcours Boulot :
#  - qa_b<w> : Premium neuf (étape 1 ouverte), un par largeur ;
#  - qa_b<k>_<w> : Premium qui a validé les étapes 1 à k-1 (étape k ouverte), k = 2..6, par largeur ;
#  - qa_bfin : Premium qui a fini les 6 étapes (600 XP).
set -euo pipefail
PSQL="psql -h 127.0.0.1 -p 55433 -U postgres -d marrant_qa -v ON_ERROR_STOP=1 -q"
H=$(node -e 'const c=require("crypto");const s=c.randomBytes(16).toString("hex");c.scrypt("QaLocal-2026!",s,64,{N:32768,r:8,p:1,maxmem:64*1024*1024},(e,k)=>console.log(s+":"+k.toString("hex")))')
$PSQL <<SQL
insert into "User"(id,email,name,"passwordHash",plan,level,xp,streak,"emailOptOut","createdAt","updatedAt","emailVerified")
select 'qa_b'||w, 'qa-b'||w||'@local.test', 'Premium '||w, '$H', 'PREMIUM', 'NOVICE', 0, 0, false, now(), now(), now()
from unnest(array[375,768,1280]) w;
insert into "User"(id,email,name,"passwordHash",plan,level,xp,streak,"emailOptOut","createdAt","updatedAt","emailVerified")
select 'qa_b'||k||'_'||w, 'qa-b'||k||'-'||w||'@local.test', 'Premium étape '||k, '$H', 'PREMIUM', 'NOVICE', 0, 0, false, now(), now(), now()
from unnest(array[375,768,1280]) w, generate_series(2,6) k;
insert into "User"(id,email,name,"passwordHash",plan,level,xp,streak,"emailOptOut","createdAt","updatedAt","emailVerified") values
('qa_bfin','qa-bfin@local.test','Premium fin','$H','PREMIUM','NOVICE',600,0,false,now(),now(),now());
insert into "Subscription"(id,"userId",plan,status,"currentPeriodEnd","billingInterval","priceAmountCents","cancelAtPeriodEnd","createdAt","updatedAt")
select 'sub_'||id, id, 'PREMIUM', 'ACTIVE', now()+interval '30 days', 'month', 299, false, now(), now() from "User" where id like 'qa_b%';
-- Étape k ouverte : étapes 1 à k-1 validées (une par semaine), currentStep = k-1 comme s18.
insert into "UserPathProgress"(id,"userId","learningPathId","currentStep","completedSteps","startedAt","completedAt")
select 'upp_'||u.id, u.id, p.id, k-1, (select array_agg(n order by n) from generate_series(1,k-1) n), now()-interval '40 days', null
from "LearningPath" p, (select id, split_part(substr(id,5),'_',1)::int k from "User" where id ~ '^qa_b[2-6]_') u
where p.slug='boulot';
insert into "UserPathStepCompletion"(id,"userId","learningPathId","stepOrder","completedAt")
select 'upc_'||u.id||'_'||n, u.id, p.id, n, now()-((u.k-n)*interval '7 days')
from "LearningPath" p, (select id, split_part(substr(id,5),'_',1)::int k from "User" where id ~ '^qa_b[2-6]_') u, generate_series(1,5) n
where p.slug='boulot' and n < u.k;
insert into "UserPathProgress"(id,"userId","learningPathId","currentStep","completedSteps","startedAt","completedAt")
select 'upp_bfin', 'qa_bfin', id, 6, array[1,2,3,4,5,6], now()-interval '45 days', now() from "LearningPath" where slug='boulot';
insert into "UserPathStepCompletion"(id,"userId","learningPathId","stepOrder","completedAt")
select 'upc_bfin_'||n, 'qa_bfin', p.id, n, now()-((6-n)*interval '7 days') from "LearningPath" p, generate_series(1,6) n where p.slug='boulot';
SQL
echo "   comptes : $($PSQL -At -c "select count(*) from \"User\" where id like 'qa_b%'") ; progressions : $($PSQL -At -c "select string_agg(\"userId\"||'='||array_length(\"completedSteps\",1), ' ' order by \"userId\") from \"UserPathProgress\" where \"userId\" like 'qa_b%' and \"userId\" like '%375'") ; fin : $($PSQL -At -c "select count(*) from \"UserPathStepCompletion\" where \"userId\"='qa_bfin'") étapes"
