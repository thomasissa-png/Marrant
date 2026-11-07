#!/bin/bash
# Comptes de test LOCAUX (base jetable) : un abonné Premium, un compte gratuit (s23, exercices des fiches).
set -euo pipefail
PSQL="psql -h 127.0.0.1 -p 55435 -U postgres -d marrant_qa -v ON_ERROR_STOP=1 -q"
H=$(node -e 'const c=require("crypto");const s=c.randomBytes(16).toString("hex");c.scrypt("QaLocal-2026!",s,64,{N:32768,r:8,p:1,maxmem:64*1024*1024},(e,k)=>console.log(s+":"+k.toString("hex")))')
$PSQL <<SQL
insert into "User"(id,email,name,"passwordHash",plan,level,xp,streak,"emailOptOut","createdAt","updatedAt","emailVerified") values
('qa_premium','premium@local.test','Yanis Martin','$H','PREMIUM','NOVICE',0,0,false,now()-interval '40 days',now(),now()),
('qa_free','gratuit@local.test','Gratuit','$H','FREE','NOVICE',0,0,false,now()-interval '10 days',now(),now());
SQL
echo "   comptes : $($PSQL -At -c "select string_agg(id||'='||plan, ', ') from \"User\" where id like 'qa_%'")"
