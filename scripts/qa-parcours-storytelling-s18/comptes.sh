#!/bin/bash
# Comptes de test LOCAUX (base jetable) : un Premium neuf par largeur, un Premium qui a fini Storytelling.
set -euo pipefail
PSQL="psql -h 127.0.0.1 -p 55433 -U postgres -d marrant_qa -v ON_ERROR_STOP=1 -q"
H=$(node -e 'const c=require("crypto");const s=c.randomBytes(16).toString("hex");c.scrypt("QaLocal-2026!",s,64,{N:32768,r:8,p:1,maxmem:64*1024*1024},(e,k)=>console.log(s+":"+k.toString("hex")))')
$PSQL <<SQL
insert into "User"(id,email,name,"passwordHash",plan,level,xp,streak,"emailOptOut","createdAt","updatedAt","emailVerified") values
('qa_s375','qa-s375@local.test','Premium 375','$H','PREMIUM','NOVICE',0,0,false,now(),now(),now()),
('qa_s768','qa-s768@local.test','Premium 768','$H','PREMIUM','NOVICE',0,0,false,now(),now(),now()),
('qa_s1280','qa-s1280@local.test','Premium 1280','$H','PREMIUM','NOVICE',0,0,false,now(),now(),now()),
('qa_e5_375','qa-e5-375@local.test','Premium étape 5','$H','PREMIUM','NOVICE',350,0,false,now(),now(),now()),
('qa_e5_768','qa-e5-768@local.test','Premium étape 5','$H','PREMIUM','NOVICE',350,0,false,now(),now(),now()),
('qa_e5_1280','qa-e5-1280@local.test','Premium étape 5','$H','PREMIUM','NOVICE',350,0,false,now(),now(),now()),
('qa_fin','qa-fin@local.test','Premium fin','$H','PREMIUM','NOVICE',800,0,false,now(),now(),now());
insert into "Subscription"(id,"userId",plan,status,"currentPeriodEnd","billingInterval","priceAmountCents","cancelAtPeriodEnd","createdAt","updatedAt")
select 'sub_'||id, id, 'PREMIUM', 'ACTIVE', now()+interval '30 days', 'month', 299, false, now(), now() from "User" where id like 'qa_%';
insert into "UserPathProgress"(id,"userId","learningPathId","currentStep","completedSteps","startedAt","completedAt")
select 'upp_fin', 'qa_fin', id, 6, array[1,2,3,4,5,6], now()-interval '40 days', now() from "LearningPath" where slug='storytelling';
insert into "UserPathStepCompletion"(id,"userId","learningPathId","stepOrder","completedAt")
select 'upc_fin_'||n, 'qa_fin', p.id, n, now()-((6-n)*interval '7 days') from "LearningPath" p, generate_series(1,6) n where p.slug='storytelling';
insert into "UserPathProgress"(id,"userId","learningPathId","currentStep","completedSteps","startedAt","completedAt")
select 'upp_'||u.id, u.id, p.id, 4, array[1,2,3,4], now()-interval '30 days', null from "User" u, "LearningPath" p where u.id like 'qa_e5_%' and p.slug='storytelling';
insert into "UserPathStepCompletion"(id,"userId","learningPathId","stepOrder","completedAt")
select 'upc_'||u.id||'_'||n, u.id, p.id, n, now()-((5-n)*interval '7 days') from "User" u, "LearningPath" p, generate_series(1,4) n where u.id like 'qa_e5_%' and p.slug='storytelling';
SQL
echo "   comptes : $($PSQL -At -c "select count(*) from \"User\" where id like 'qa_%'") ; fin de parcours : $($PSQL -At -c "select count(*) from \"UserPathStepCompletion\" where \"userId\"='qa_fin'") étapes"
