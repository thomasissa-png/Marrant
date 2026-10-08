#!/usr/bin/env python3
"""Construit docs/content/parcours-storytelling-s18.json à partir des textes VALIDÉS (s18).

Aucun texte n'est retapé : tout est extrait des deux fichiers de copy validés
(`docs/copy/etalons-parcours-storytelling-s18.md` §2, §3 ; `docs/copy/parcours-storytelling-etapes-2-6-s18.md`).
Usage : python3 -I scripts/content/storytelling-s18-extraire.py  (réécrit le JSON, idempotent)
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ETALONS = os.path.join(ROOT, "docs/copy/etalons-parcours-storytelling-s18.md")
ETAPES = os.path.join(ROOT, "docs/copy/parcours-storytelling-etapes-2-6-s18.md")
OUT = os.path.join(ROOT, "docs/content/parcours-storytelling-s18.json")

# Squelette (spec s17 §2.2 et annexe A.1 ; titres des conseils : base, après import s18).
STEPS = [
    (1, "Raconter une anecdote en 3 actes", 3, 50, True),
    (2, "La technique du personnage", 10, 75, False),
    (3, "Rigoler de ses échecs", 17, 100, False),
    (4, "Le twist final", 24, 125, False),
    (5, "La blague à tiroirs", 31, 150, False),
    (6, "Le callback : faire revenir une vanne au bon moment", 38, 200, False),
]
VIDEOS = {  # youtubeId, artiste, titre (videos-seed.json), dans l'ordre obligatoire puis facultative
    1: [("JuB6-b0fhLE", "Panayotis Pascot", "Amsterdam et le Kem's"), ("v-ySkBGAXLI", "Thomas Ngijol", "Le voisin")],
    2: [("fnu6fRa-BN4", "Samia Orosemane", "Les accents africains"), ("PrQTbXOz2iU", "Laura Domenge", "La vie de couple")],
    3: [("Fw14PLdtSyA", "Nora Hamzawi", "Les chagrins d'amour (chronique France Inter)"), ("0FmK8RA_hnE", "Nordine Ganso", "La première fois")],
    4: [("RYjfe8OSRFw", "Paul Mirabel", "Je me suis fait racketter"), ("uEj_jmlANXE", "Djimo", "J'aurais kiffé être une tortue")],
    5: [("cl-fIl6hjTw", "Jason Brokerss", "Le mariage (Montreux)"), ("JtU_EB5i2Mk", "Sugar Sammy", "L'andrologue")],
    6: [("eYhWcDdI3rM", "Jonathan Cohen", "Serge le Mytho (Bloqués)")],
}


def section(text, start, end=None):
    i = text.index(start)
    j = text.index(end, i + len(start)) if end else len(text)
    return text[i:j]


def champ(block, name):
    m = re.search(r"^\| `" + re.escape(name) + r"`[^|]*\| (.+?) \|$", block, re.M)
    if not m:
        sys.exit(f"champ {name} introuvable")
    return re.sub(r" `\[.*?\]`$", "", m.group(1)).strip()


def quiz(block):
    out = []
    for q in re.split(r"^\*\*Question \d+[^\n]*\n", block, flags=re.M)[1:]:
        lines = [l[2:] if l.startswith("> ") else l for l in q.split("\n") if l.startswith(">")]
        question = re.match(r"\*\*(.+)\*\*$", lines[0]).group(1)
        options, correct, expl = [], None, None
        for l in lines[1:]:
            m = re.match(r"(\*\*)?([A-D])\. (.+?)(\*\*)?$", l)
            if m:
                opt = re.sub(r" \((?:la |chute|montée)[^)]*\)$", "", m.group(3)) if not m.group(1) else m.group(3)
                if m.group(1):
                    correct = len(options)
                options.append(opt)
            e = re.match(r"\*\*Explication[^*]*\*\* : (.+)$", l)
            if e:
                expl = e.group(1)
        assert len(options) == 4 and correct is not None and expl, question
        out.append({"question": question, "options": options, "correctIndex": correct, "explanation": expl})
    return out


def legendes(block):
    rows = re.findall(r"^\| \*{1,2}(?:Obligatoire|Facultative)[^|]*\| (.+?) \|$", block, re.M)
    return rows


def vannes(block):
    rows = re.findall(r"^\| \d \| « (.+?) » / « (.+?) » \| (.+?) \|$", block, re.M)
    assert len(rows) == 5, rows
    return rows


def main():
    et = open(ETALONS, encoding="utf-8").read()
    ep = open(ETAPES, encoding="utf-8").read()
    fiche = section(et, "## 2. Fiche du parcours", "## 3.")
    fiche_b = {}
    for key in ("description", "personaTagline", "testimonial"):
        m = re.search(r"^\| `" + key + r"` \| .+? \| (.+?) \|$", fiche, re.M)
        fiche_b[key] = m.group(1)
    blocks = {1: section(et, "## 3. Étape 1 complète", "## 4.")}
    for n in range(2, 7):
        blocks[n] = section(ep, f"## Étape {n} :", f"## Étape {n + 1} :" if n < 6 else "## Tableau récapitulatif")
    steps, neuves = [], []
    for week, tip, day, xp, free in STEPS:
        b = blocks[week]
        why_label = "why" if week > 1 else "why"
        leg = legendes(b)
        assert len(leg) == len(VIDEOS[week]), (week, leg)
        rows = vannes(b)
        step = {
            "week": week, "tipTitle": tip, "dayNumber": day,
            "why": champ(b, why_label), "moduleTitle": champ(b, "moduleTitle"),
            "moduleDetail": champ(b, "moduleDetail"),
            "moduleFormat": "Un conseil, un défi, 5 vannes, une vidéo, un petit quiz." if week == 6
            else "Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz.",
            "moduleXp": xp, "free": free,
            "jokeContents": [r[0] for r in rows],
            "videos": [{"youtubeId": y, "artist": a, "title": t, "why": w} for (y, a, t), w in zip(VIDEOS[week], leg)],
            "quiz": quiz(b),
        }
        prot = re.search(r"^\*\*Phrase de protection\*\*[^:]*: (.+)$", b, re.M)
        if prot:
            step["exerciceProtection"] = prot.group(1).strip()
        steps.append(step)
        if week == 5:
            # Catégories (enum JokeCategory) : choix @fullstack, une par vanne, dans l'ordre du tableau.
            cats = ["SITUATION", "SOIREES", "SITUATION", "SITUATION", "BOULOT"]
            neuves = [{"content": c, "punchline": p, "category": k, "comedyTechnique": "Le tiroir",
                       "techniqueExplanation": d} for (c, p, d), k in zip(rows, cats)]
    # Conseils réactivés (étalons §1a, 1b, 1c) : titre inchangé, textes validés à l'identique.
    conseils = []
    for sub, tip_id, title in (("### 1a.", "cmmp8ozsx000mqk63ux155ma1", "Raconter une anecdote en 3 actes"),
                               ("### 1b.", "cmmp8ozsx000tqk63yhagsgqi", "Le twist final"),
                               ("### 1c.", "cmmp8ozsx0012qk63kxfsux75", "La blague à tiroirs")):
        b = section(et, sub, "### 1" + chr(ord(sub[5]) + 1) + "." if sub != "### 1c." else "---")
        parts = {}
        for key in ("contenu", "exemple", "exercice"):
            m = re.search(r"\*\*" + key + r"\*\*\n(.+?)(?:\n\n|\Z)", b, re.S)
            parts[key] = m.group(1).strip()
        assert title in b
        conseils.append({"id": tip_id, "title": title, "content": parts["contenu"],
                         "example": parts["exemple"], "exercise": parts["exercice"]})
    # Retouches de défi (étalons §7, choix 6 : A à l'étape 3 avec repli solo, B à l'étape 6).
    repli = re.search(r"On ajoute à la fin : « (.+?) » En base", et).group(1)
    defi_b = re.search(r"\| \*\*B \(reco\)\*\* \| On ajoute au défi : « (.+?) » Une soirée", et).group(1)
    s6 = section(ep, "**Exercice « aujourd'hui »** : le défi du conseil (version de l'audit)", "**Vérification")
    assert defi_b in s6 and repli in blocks[3]
    retouches = [
        {"cle": "storytelling-3", "tipTitle": "Rigoler de ses échecs", "ajouterALaFin": repli,
         "quand": "toujours (repli solo générique, acquis s17)"},
        {"cle": "storytelling-6", "tipTitle": "Le callback : faire revenir une vanne au bon moment",
         "ajouterALaFin": defi_b, "separateur": "\n\n",
         "quand": "seulement si STORYTELLING_PUBLIE (le défi cite le parcours)"},
    ]
    data = {
        "_meta": {
            "conseilsReactives": conseils,
            "defisRetouches": retouches,
            "session": "s18", "auteur": "@fullstack (extraction automatique, aucun texte retapé)",
            "sources": ["docs/copy/etalons-parcours-storytelling-s18.md", "docs/copy/parcours-storytelling-etapes-2-6-s18.md"],
            "publication": "Publié seulement si STORYTELLING_PUBLIE = true (apps/web/src/config/parcours-publication.ts).",
            "manques": ["Étape 1 : questions 3 et 4 du quiz non écrites (étalons §3).",
                        "nextParcoursReason non écrit : repli sur la personaTagline du parcours proposé.",
                        "icon provisoire, à choisir par @design."],
            "vannesNeuvesEtape5": neuves,
        },
        "parcours": {
            "slug": "storytelling", "title": "Parcours Storytelling",
            "description": fiche_b["description"], "duration": "6 semaines", "timePerWeek": "20 min/semaine",
            "difficulty": "INTERMEDIAIRE", "difficultyLabel": "DEBUTANT → INTERMEDIAIRE",
            "icon": "📖", "order": 4, "persona": "Marc (34 ans, récemment séparé)",
            "personaTagline": fiche_b["personaTagline"], "testimonial": fiche_b["testimonial"],
            "nextParcours": "machine-a-cafe",
            "nextParcoursRanking": ["machine-a-cafe", "repartie", "confiance", "pro"],
            "steps": steps,
        },
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"écrit {OUT} : {len(steps)} étapes, {sum(len(s['quiz']) for s in steps)} questions")


if __name__ == "__main__":
    main()
