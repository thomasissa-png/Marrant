#!/bin/bash
# Comptes de test LOCAUX (base jetable) pour la page de résiliation (s23). Identifiants Stripe FACTICES
# (`cus_qa_*`, `sub_qa_*`) : formule, prix et fin de période sont en base, donc aucune lecture Stripe.
set -euo pipefail
PSQL="psql -h 127.0.0.1 -p 55434 -U postgres -d marrant_qa -v ON_ERROR_STOP=1 -q"
H=$(node -e 'const c=require("crypto");const s=c.randomBytes(16).toString("hex");c.scrypt("QaLocal-2026!",s,64,{N:32768,r:8,p:1,maxmem:64*1024*1024},(e,k)=>console.log(s+":"+k.toString("hex")))')
$PSQL <<SQL
insert into "User"(id,email,name,"passwordHash",plan,level,xp,streak,"emailOptOut","createdAt","updatedAt","emailVerified") values
('qa_avant','yanis.avant@local.test','Yanis Martin','$H','PREMIUM','NOVICE',0,0,false,now()-interval '40 days',now(),now()),
('qa_actif','yanis@local.test','Yanis Martin','$H','PREMIUM','NOVICE',0,0,false,now()-interval '40 days',now(),now()),
('qa_annuel','sophie.annuel@local.test','Sophie','$H','PREMIUM','NOVICE',0,0,false,now()-interval '200 days',now(),now()),
('qa_resilie','marc@local.test','Marc','$H','PREMIUM','NOVICE',0,0,false,now()-interval '90 days',now(),now()),
('qa_sansstripe','offert@local.test',null,'$H','PREMIUM','NOVICE',0,0,false,now()-interval '10 days',now(),now()),
('qa_free','gratuit@local.test','Gratuit','$H','FREE','NOVICE',0,0,false,now()-interval '10 days',now(),now()),
('qa_impaye','impaye@local.test','Inès','$H','PREMIUM','NOVICE',0,0,false,now()-interval '40 days',now(),now()),
('qa_flux_1440','flux1440@local.test','Yanis Martin','$H','PREMIUM','NOVICE',0,0,false,now()-interval '40 days',now(),now()),
('qa_flux_390','flux390@local.test','Yanis Martin','$H','PREMIUM','NOVICE',0,0,false,now()-interval '40 days',now(),now()),
('qa_flux_768','flux768@local.test','Yanis Martin','$H','PREMIUM','NOVICE',0,0,false,now()-interval '40 days',now(),now());
insert into "Subscription"(id,"userId",plan,status,"stripeCustomerId","stripeSubscriptionId","currentPeriodEnd","billingInterval","priceAmountCents","cancelAtPeriodEnd","createdAt","updatedAt")
select 'sub_'||id, id, 'PREMIUM', 'ACTIVE', 'cus_qa_'||id, 'sub_qa_'||id, timestamp '2026-12-01 10:00:00', 'month', 199, false, now()-interval '36 days', now()
from "User" where id in ('qa_avant','qa_actif','qa_flux_1440','qa_flux_390','qa_flux_768');
insert into "Subscription"(id,"userId",plan,status,"stripeCustomerId","stripeSubscriptionId","currentPeriodEnd","billingInterval","priceAmountCents","cancelAtPeriodEnd","createdAt","updatedAt") values
('sub_qa_annuel','qa_annuel','PREMIUM','ACTIVE','cus_qa_annuel','sub_qa_annuel',timestamp '2027-04-20 10:00:00','year',1699,false,now()-interval '200 days',now()),
('sub_qa_resilie','qa_resilie','PREMIUM','ACTIVE','cus_qa_resilie','sub_qa_resilie',timestamp '2026-11-24 10:00:00','month',199,true,now()-interval '90 days',now()),
('sub_qa_impaye','qa_impaye','PREMIUM','PAST_DUE','cus_qa_impaye','sub_qa_impaye',timestamp '2026-12-01 10:00:00','month',199,false,now()-interval '36 days',now());
SQL
echo "   comptes : $($PSQL -At -c "select count(*) from \"User\" where id like 'qa_%'") ; abonnements : $($PSQL -At -c "select count(*) from \"Subscription\"")"
