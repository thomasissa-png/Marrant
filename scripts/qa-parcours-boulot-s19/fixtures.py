#!/usr/bin/env python3
"""SQL des fixtures locales s19 (base jetable uniquement) : état de la prod avant la tâche Boulot.

Après le seed local (qui contient déjà les textes neufs, `conseils-seed.json` et `videos-seed.json`
ayant été mis à jour en s19), on remet la base dans l'état de la prod relevé le 10/10
(`boulot-base-s19.json`, lecture seule) :
- 20 vannes en ligne du Boulot : à leur id de prod, actives, texte exact (`_meta.vannesEnLigne`),
  champs complémentaires depuis l'export `vannes-actives-s17.json` ;
- 10 vannes neuves du Boulot : absentes (la tâche de démarrage les crée) ;
- conseils des étapes 2 à 5 : à leur id de prod, avec leur ancien texte, catégorie et `isActive`
  de prod ; conseils des étapes 1 et 6 : absents (la tâche les crée) ;
- 3 fiches vidéo fausses : titre et durée de prod (la tâche les corrige) ;
- vannes des autres parcours (seed + Storytelling, hors les 5 neuves de l'étape 5) et conseils
  Storytelling : comme le script s18 (la tâche Storytelling, en ligne, les réaligne).
Usage : python3 -I fixtures.py /home/user/Marrant > fixtures.sql
"""
import hashlib
import json
import os
import sys

repo = sys.argv[1]
content = lambda *p: os.path.join(repo, "docs/content", *p)
load = lambda name: json.load(open(content(name), encoding="utf-8"))
q = lambda v: "NULL" if v is None else "$q$" + str(v) + "$q$"

act = {j["content"]: j for j in load("vannes-actives-s17.json")[1:]}
boulot = load("parcours-boulot-s19.json")
base = load("boulot-base-s19.json")
story = load("parcours-storytelling-s18.json")
story_base = {t["title"]: t for t in load("conseils-storytelling-base-s18.json")[1:]}
meta = boulot["_meta"]


def joke_values(jid, j, active="true"):
    return "(%s,%s,%s,%s::\"JokeCategory\",%s,%s::\"JokeType\",%s,now(),%s,%s,%s)" % (
        q(jid), q(j["content"]), q(j.get("punchline") or ""), q(j.get("category") or "BOULOT"),
        j.get("maturityLevel") or 1, q(j.get("type") or "CLASSIQUE"), active,
        q(j.get("comedyTechnique")), q(j.get("techniqueExplanation")), q("GARDER"),
    )


COLS = '"Joke"(id,content,punchline,category,"maturityLevel",type,"isActive","updatedAt","comedyTechnique","techniqueExplanation","copyVerdict")'

# 1. Vannes en ligne du Boulot, à l'id de prod.
deja = set()
for v in meta["vannesEnLigne"]:
    j = act.get(v["content"])
    if not j:
        sys.stderr.write("vanne en ligne absente de l'export : " + v["id"] + "\n")
        continue
    print('update "Joke" set id=%s, "isActive"=true where content=%s and id<>%s;' % (q(v["id"]), q(v["content"]), q(v["id"])))
    print("insert into %s values %s on conflict (id) do nothing;" % (COLS, joke_values(v["id"], j)))
    deja.add(v["content"])

# 2. Vannes neuves du Boulot : absentes.
for v in meta["vannesNeuves"]:
    print('delete from "Joke" where content=%s;' % q(v["content"]))

# 3. Vannes des autres parcours (s18).
neuves_story = {v["content"] for v in story["_meta"]["vannesNeuvesEtape5"]}
for p in load("parcours-seed.json") + [story["parcours"]]:
    for s in p["steps"]:
        for c in s.get("jokeContents", []):
            if c in neuves_story or c in deja:
                continue
            deja.add(c)
            j = act.get(c)
            if not j:
                sys.stderr.write("vanne absente de l'export : " + c[:60] + "\n")
                continue
            jid = "qafx" + hashlib.sha1(c.encode()).hexdigest()[:16]
            print("insert into %s select * from (values %s) v where not exists (select 1 from \"Joke\" where content=%s);"
                  % (COLS, joke_values(jid, j), q(c)))

# 4. Conseils du Boulot.
prod = {t["id"]: t for t in base["conseils"]}
for c in meta["conseils"]:
    if not c["id"]:
        print('delete from "Tip" where title=%s;' % q(c["title"]))
        continue
    t = prod[c["id"]]
    print('update "Tip" set id=%s, "isActive"=%s, content=%s, example=%s, exercise=%s, category=%s, difficulty=%s, '
          '"generatedByAI"=false where title=%s;'
          % (q(t["id"]), "true" if t["isActive"] else "false", q(t["content"]), q(t["example"]), q(t["exercise"]),
             q(t["category"]), q(t["difficulty"]), q(c["title"])))

# 5. Conseils Storytelling (s18).
for c in story["_meta"]["conseilsReactives"]:
    old = story_base[c["title"]]
    print('update "Tip" set id=%s, "isActive"=false, content=%s, example=%s, exercise=%s where title=%s;'
          % (q(c["id"]), q(old["contenu"]), q(old["exemple"]), q(old["exercice"]), q(c["title"])))
rig = story_base["Rigoler de ses échecs"]
print('update "Tip" set content=%s, example=%s, exercise=%s where title=%s;'
      % (q(rig["contenu"]), q(rig["exemple"]), q(rig["exercice"]), q("Rigoler de ses échecs")))

# 6. Fiches vidéo dans l'état de la prod (avant correction).
videos = {v["youtubeId"]: v for v in base["videosActives"]}
for yid in ("m30qZa8p_Js", "qdqIc-uzdbA", "rldvVgHQSvo"):
    v = videos[yid]
    print('update "Video" set title=%s, duration=%s where "youtubeId"=%s;' % (q(v["title"]), q(v["duration"]), q(yid)))
