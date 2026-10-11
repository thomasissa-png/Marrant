#!/usr/bin/env python3
"""SQL des fixtures locales s18 (base jetable uniquement) : vannes des parcours et conseils dans l'état de la prod.

- Vannes : celles des étapes (seed s17 + Storytelling, hors les 5 neuves de l'étape 5 que la tâche
  de démarrage doit créer), copiées de l'export prod `vannes-actives-s17.json`.
- Conseils des étapes 1, 4 et 5 : remis à l'id de la prod, INACTIFS, avec leur ancien texte
  (`conseils-storytelling-base-s18.json`) ; « Rigoler de ses échecs » sans le repli solo.
Usage : python3 -I fixtures.py /home/user/Marrant > fixtures.sql
"""
import hashlib
import json
import os
import sys

repo = sys.argv[1]
content = lambda *p: os.path.join(repo, "docs/content", *p)
act = {j["content"]: j for j in json.load(open(content("vannes-actives-s17.json"), encoding="utf-8"))[1:]}
story = json.load(open(content("parcours-storytelling-s18.json"), encoding="utf-8"))
base = {t["title"]: t for t in json.load(open(content("conseils-storytelling-base-s18.json"), encoding="utf-8"))[1:]}
q = lambda v: "NULL" if v is None else "$q$" + str(v) + "$q$"

neuves = {v["content"] for v in story["_meta"]["vannesNeuvesEtape5"]}
parcours = json.load(open(content("parcours-seed.json"), encoding="utf-8")) + [story["parcours"]]
for p in parcours:
    for s in p["steps"]:
        for c in s.get("jokeContents", []):
            if c in neuves:
                continue
            j = act.get(c)
            if not j:
                sys.stderr.write("vanne absente de l'export : " + c[:60] + "\n")
                continue
            jid = "qafx" + hashlib.sha1(c.encode()).hexdigest()[:16]
            print(
                'insert into "Joke"(id,content,punchline,category,"maturityLevel",type,"isActive","updatedAt",'
                '"comedyTechnique","techniqueExplanation","copyVerdict") values (%s,%s,%s,%s,%s,%s,true,now(),%s,%s,%s)'
                " on conflict do nothing;"
                % (q(jid), q(j["content"]), q(j["punchline"]), q(j["category"]), j.get("maturityLevel", 1),
                   q(j.get("type", "CLASSIQUE")), q(j.get("comedyTechnique")), q(j.get("techniqueExplanation")), q("GARDER"))
            )

for c in story["_meta"]["conseilsReactives"]:
    old = base[c["title"]]
    print(
        'update "Tip" set id=%s, "isActive"=false, content=%s, example=%s, exercise=%s where title=%s;'
        % (q(c["id"]), q(old["contenu"]), q(old["exemple"]), q(old["exercice"]), q(c["title"]))
    )
rig = base["Rigoler de ses échecs"]
print('update "Tip" set content=%s, example=%s, exercise=%s where title=%s;'
      % (q(rig["contenu"]), q(rig["exemple"]), q(rig["exercice"]), q("Rigoler de ses échecs")))
