#!/usr/bin/env python3
"""Construit docs/content/parcours-boulot-s19.json à partir des textes VALIDÉS (s19).

Aucun texte n'est retapé : tout est extrait des documents validés, puis chaque texte
écrit est revérifié contre sa source (présence mot pour mot), et chaque conseil est
comparé à sa source qui fait foi (C6) : un écart = rien n'est écrit, sortie en erreur.

Sources (liste d'import unique : docs/marrant/parcours-boulot-s19/import-boulot.md = I) :
  E = docs/copy/etalons-parcours-boulot-s19.md (§1 conseils, §2 fiche, §3 étape 1)
  P = docs/copy/parcours-boulot-etapes-2-6-s19.md (étapes 2 à 6, fin de parcours)
  V = docs/marrant/parcours-boulot-s19/vannes-neuves/vannes-finales.md (30 vannes, décryptages)
  conseils-boulot-s19-v1/v2/v5/v6.md (sources qui font foi des conseils, I §3)
  videos-seed.json (artiste et titre des vidéos), boulot-base-s19.json (ids des conseils)

Usage : python3 -I scripts/content/boulot-s19-extraire.py  (réécrit le JSON, idempotent)
Pas de typographie ajoutée (espaces insécables) : le rendu applique `frTypo` au slug `boulot`.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P_ = lambda rel: os.path.join(ROOT, rel)  # noqa: E731
I_PATH = P_("docs/marrant/parcours-boulot-s19/import-boulot.md")
E_PATH = P_("docs/copy/etalons-parcours-boulot-s19.md")
P_PATH = P_("docs/copy/parcours-boulot-etapes-2-6-s19.md")
V_PATH = P_("docs/marrant/parcours-boulot-s19/vannes-neuves/vannes-finales.md")
CONSEILS = {n: P_(f"docs/copy/conseils-boulot-s19-v{n}.md") for n in (1, 2, 5, 6)}
VIDEOS_SEED = P_("docs/content/videos-seed.json")
BASE = P_("docs/content/boulot-base-s19.json")
OUT = P_("docs/content/parcours-boulot-s19.json")

SAUT = re.compile(r" `\[saut de paragraphe \(\\n\\n\)\]` ")
NOTE_FIN = re.compile(r" `\[.*?\]`$")


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def section(text, start, end=None):
    assert text.count(start) == 1, f"repère non unique ou absent : {start!r}"
    i = text.index(start)
    j = text.index(end, i + len(start)) if end else len(text)
    return text[i:j]


def ligne_tableau(block, label_regex):
    """Cellule de droite de la ligne `| label | texte |` (première ligne qui correspond)."""
    m = re.search(r"^\| " + label_regex + r"[^|]*\| (.+?) \|$", block, re.M)
    if not m:
        sys.exit(f"ligne de tableau introuvable : {label_regex}")
    return m.group(1)


def champ(block, name):
    texte = ligne_tableau(block, "`" + re.escape(name) + "`")
    texte = SAUT.sub("\n\n", texte)
    return NOTE_FIN.sub("", texte).strip()


def quiz(block, sans_guillemets=()):
    out = []
    for n, q in enumerate(re.split(r"^\*\*Question \d+[^\n]*\n", block, flags=re.M)[1:], start=1):
        lines = [l[2:] if l.startswith("> ") else l[1:] for l in q.split("\n") if l.startswith(">")]
        question = re.match(r"\*\*(.+)\*\*$", lines[0]).group(1)
        options, correct, expl = [], None, None
        for l in lines[1:]:
            m = re.match(r"(\*\*)?([A-D])\. (.+?)(\*\*)?(?: \(\d+(?: mots)?\))?$", l)
            if m:
                assert m.group(2) == "ABCD"[len(options)], (question, l)
                opt = m.group(3)
                if n in sans_guillemets:  # I §2 : guillemets des consignes de Q3 (étape 1) retirés
                    opt = re.fullmatch(r"« (.+) »", opt).group(1)
                if m.group(1):
                    correct = len(options)
                options.append(opt)
            e = re.match(r"\*\*Explication[^*]*\*\* : (.+)$", l)
            if e:
                expl = e.group(1)
        assert len(options) == 4 and correct is not None and expl, question
        assert expl.startswith(f"La {'ABCD'[correct]}."), question
        out.append({"question": question, "options": options, "correctIndex": correct, "explanation": expl})
    return out


def legendes(block):
    return re.findall(r"^\| \*{1,2}(?:Obligatoire|Première|Facultative)[^|]*\| (.+?) \|$", block, re.M)


def vannes_v(v_text):
    """V, « Tableau par étape » : {étape: [(place, content, punchline, id|None)]}."""
    out = {}
    for n in range(1, 7):
        b = section(v_text, f"### Étape {n} :", f"### Étape {n + 1} :" if n < 6 else "## S-2")
        rows = re.findall(r"^\| ([^|]+?) \| [^|]+? \| (.+?) \| (.+?) \| (.+?) \|$", b, re.M)
        rows = [r for r in rows if r[0] not in ("Place",) and not r[0].startswith("---")]
        assert len(rows) == 5, (n, rows)
        out[n] = [(p, c, pl, (re.fullmatch(r"`([a-z0-9]+)`", i) or [None, None])[1]) for p, c, pl, i in rows]
    return out


def decryptages(v_text):
    b = section(v_text, "## Décryptages des 10 neuves validées", "## Ce que la répartition")
    out = {}
    for m in re.finditer(r"^\*\*(V-\d-\d)\*\* \(`v\d\.md`\)\. \*(.+?)\.\* (.+?) \*(À toi de jouer : .+)\*$", b, re.M):
        out[m.group(1)] = {"comedyTechnique": m.group(2), "techniqueExplanation": m.group(3).strip(),
                           "howToApply": m.group(4)}
    assert len(out) == 10, sorted(out)
    return out


def conseil_inline(block):
    """E §1 : `**contenu** : …`, `**exemple** : …` (ou retour à la ligne), `**exercice** : …`."""
    m = re.search(r"^\*\*contenu\*\* : (.+?)\n\*\*exemple\*\* :[ \n](.+?)\n\*\*exercice\*\* : (.+?)$", block, re.M | re.S)
    assert m, block[:80]
    return {"content": m.group(1), "example": m.group(2), "exercise": m.group(3)}


def conseil_source(block):
    """Sources -vN : `**contenu**\\n…\\n\\n**exemple**\\n…\\n\\n**exercice**\\n…\\n\\n`."""
    parts = {}
    for key, name in (("contenu", "content"), ("exemple", "example"), ("exercice", "exercise")):
        m = re.search(r"^\*\*" + key + r"\*\*\n(.+?)(?:\n\n|\Z)", block, re.M | re.S)
        assert m, (key, block[:80])
        parts[name] = m.group(1).strip()
    return parts


def categorie(block):
    m = re.search(r"\*\*Catégorie\*\* : ([A-Z_]+).*?· \*\*Difficulté\*\* : ([A-Z]+)", block)
    return m.group(1), m.group(2)


def strings(value):
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        return [s for v in value for s in strings(v)]
    if isinstance(value, dict):
        return [s for v in value.values() for s in strings(v)]
    return []


def main():
    I, E, P, V = read(I_PATH), read(E_PATH), read(P_PATH), read(V_PATH)
    src_conseils = {n: read(p) for n, p in CONSEILS.items()}
    i1 = section(I, "## 1. Parcours `boulot`", "## 2. Les 6 étapes")
    i2 = section(I, "## 2. Les 6 étapes", "## 3. Conseils")
    i3 = section(I, "## 3. Conseils", "## 4. Vannes")
    fiche = section(E, "## 2. Fiche du parcours", "## 3.")
    fiche_b = {k: re.search(r"^\| `" + k + r"` \| .+? \| (.+?) \|$", fiche, re.M).group(1)
               for k in ("description", "personaTagline", "testimonial")}
    duration, time_per_week = champ(i1, "duration").split(" / ")
    difficulty, difficulty_label = champ(i1, "difficulty").split(" / ")

    # Étapes : XP / dayNumber (I §2), tipTitle (I §2, C2), vidéos (I §2), textes (E §3, P).
    xp_day = {int(n): (int(x), int(d)) for n, x, d in
              re.findall(r"^\| (\d) \| .*?XP (\d+).*?`dayNumber` (\d+)", i2, re.M)}
    tip_titles = {int(n): t for n, t in re.findall(r"^\| (\d) \| ([^|`]+?) \|$",
                                                   section(i2, "| Étape | `tipTitle`", "Le `title` écrit"), re.M)}
    videos_para = section(i2, "**Vidéos (`youtubeId`)**", "\n")
    video_ids = {}
    for seg in videos_para.split(" ; "):
        video_ids[int(re.search(r"étape (\d)", seg).group(1))] = re.findall(r"`([\w-]{11})`", seg)
    seed_videos = {v["youtubeId"]: v for v in json.loads(read(VIDEOS_SEED))}
    assert sorted(xp_day) == sorted(tip_titles) == sorted(video_ids) == [1, 2, 3, 4, 5, 6]

    blocks = {1: section(E, "## 3. Étape 1 :", "## 4.")}
    for n in range(2, 7):
        blocks[n] = section(P, f"## Étape {n} :", f"## Étape {n + 1} :" if n < 6 else "## Positions des bonnes réponses")
    vannes = vannes_v(V)
    decs = decryptages(V)

    steps, neuves, en_ligne = [], [], []
    for n in range(1, 7):
        b = blocks[n]
        xp, day = xp_day[n]
        leg = legendes(b)
        assert len(leg) == len(video_ids[n]), (n, leg, video_ids[n])
        videos = []
        for yid, why in zip(video_ids[n], leg):
            artist, title = seed_videos[yid]["title"].split(" - ", 1)
            videos.append({"youtubeId": yid, "artist": artist, "title": title, "why": why})
        step = {
            "week": n, "tipTitle": tip_titles[n], "dayNumber": day,
            "why": champ(b, "why"), "moduleTitle": champ(b, "moduleTitle"),
            "moduleDetail": champ(b, "moduleDetail"), "moduleFormat": champ(b, "moduleFormat"),
            "moduleXp": xp, "free": n == 1,
            "jokeContents": [c for _, c, _, _ in vannes[n]],
            "videos": videos,
            "quiz": quiz(b, sans_guillemets=(3,) if n == 1 else ()),
        }
        if n == 6:  # I §2 : seule l'étape 6 a un dureeTexte (les autres : défaut de la page)
            step["dureeTexte"] = champ(b, "dureeTexte")
        if n in (2, 3, 6):
            step["retourExerciceNote"] = champ(b, "retourExerciceNote")
        steps.append(step)
        for place, c, pl, jid in vannes[n]:
            if jid:
                en_ligne.append({"etape": n, "place": place, "id": jid, "content": c})
            else:
                assert place in decs, place
                neuves.append({"place": place, "content": c, "punchline": pl, "category": "BOULOT",
                               "type": "ONE_LINER", **decs[place]})
    assert len(neuves) == 10 and len(en_ligne) == 20, (len(neuves), len(en_ligne))
    all_jokes = [c for s in steps for c in s["jokeContents"]]
    assert len(set(all_jokes)) == 30

    # Conseils (I §3) : texte de E §1 comparé champ par champ à la source qui fait foi (C6).
    e1 = section(E, "## 1. Les 6 conseils", "## 2. Fiche du parcours")
    e_blocks = {1: section(e1, "### Étape 1 :", "### Étape 3 :"), 3: section(e1, "### Étape 3 :", "### Étape 4 :"),
                4: section(e1, "### Étape 4 :", "### Étape 5 :"), 5: section(e1, "### Étape 5 :", "### Étape 6 :"),
                6: section(e1, "### Étape 6 :", "### Choix 7"),
                2: section(e1, "**Le conseil complet**", "**Les deux chutes.**")}
    sources = {1: section(src_conseils[5], "## Étape 1, variante de réserve P2-bis", "\n---"),
               3: section(src_conseils[2], "**Titre** : La vanne de couloir", "\n---"),
               4: section(src_conseils[1], "**Titre** : L'afterwork", "\n---"),
               5: section(src_conseils[1], "**Titre** : Survivre (et briller)", "\n---"),
               6: section(src_conseils[6], "## Variante T-b")}
    ids = {}
    for n, cells in ((int(r[0]), r) for r in re.findall(r"^\| (\d) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$", i3, re.M)):
        m = re.search(r"`(c[a-z0-9]{20,})`", cells[3])
        ids[n] = m.group(1) if m else None
    base_titles = {c["id"]: c["title"] for c in json.loads(read(BASE))["conseils"]}
    conseils, ecarts = [], []
    for n in range(1, 7):
        texte = conseil_inline(e_blocks[n])
        cat, diff = categorie(e_blocks[n])
        if n in sources:
            assert tip_titles[n] in sources[n], (n, "titre absent de la source")
            src = conseil_source(sources[n])
            ecarts += [(n, k, texte[k], src[k]) for k in texte if texte[k] != src[k]]
        assert tip_titles[n] in (e_blocks[n] if n != 2 else e1), n
        defi = re.search(r"^> (DÉFI [^\n]+)$", blocks[n], re.M).group(1)
        assert defi == texte["exercise"], (n, "défi de l'étape différent du conseil")
        if ids[n]:
            assert base_titles.get(ids[n]) == tip_titles[n], (n, ids[n], base_titles.get(ids[n]))
        conseils.append({"etape": n, "id": ids[n], "title": tip_titles[n], "category": cat, "difficulty": diff,
                         **texte})
    if ecarts:
        for n, k, a, b in ecarts:
            print(f"ÉCART conseil étape {n}, champ {k} :\n  E §1  : {a}\n  source: {b}", file=sys.stderr)
        sys.exit("écart E §1 / source : rien n'est écrit (C6), à signaler à la session")
    exemple_p = ligne_tableau(blocks[2], r"`exemple` du conseil")
    assert exemple_p == conseils[1]["example"], "exemple du PS : P et E différents"

    parcours = {
        "slug": "boulot", "title": champ(i1, "title"),
        "pageTitle": ligne_tableau(i1, r"Titre de page `<title>`"),
        "description": fiche_b["description"], "duration": duration, "timePerWeek": time_per_week,
        "difficulty": difficulty, "difficultyLabel": difficulty_label,
        # [PROVISOIRE] icône à choisir par @design (I §1) ; champ obligatoire en base.
        "icon": "💼", "order": int(champ(i1, "order")),
        "persona": re.search(r"`persona` « (.+?) »", fiche).group(1),
        "personaTagline": fiche_b["personaTagline"], "testimonial": fiche_b["testimonial"],
        "nextParcours": re.fullmatch(r"`(.+)`", champ(i1, "nextParcours")).group(1),
        "nextParcoursReason": champ(i1, "nextParcoursReason"),
        "metaDescription": champ(i1, "metaDescription"),
        "nextParcoursRanking": json.loads(re.fullmatch(r"`(.+)`", champ(i1, "nextParcoursRanking")).group(1)),
        "steps": steps,
    }

    # Contrôle final : chaque texte écrit se retrouve mot pour mot dans une source validée.
    corpus = "\n".join([I, E, P, V, read(VIDEOS_SEED)] + list(src_conseils.values()))
    constantes = {"boulot", "BOULOT", "ONE_LINER", "OBSERVATION", "STORYTELLING", "AUTODERISION", "ABSURDE",
                  "💼", "6 semaines", "15 min/semaine", "DEBUTANT", "INTERMEDIAIRE", "DEBUTANT → INTERMEDIAIRE"}
    manquants = []
    for t in strings(parcours) + strings(conseils) + strings(neuves) + strings(en_ligne):
        variantes = (t, t.replace("\n\n", " `[saut de paragraphe (\\n\\n)]` "), f"« {t} »")
        if t not in constantes and not any(v in corpus for v in variantes):
            manquants.append(t[:80])
    if manquants:
        sys.exit("textes introuvables dans les sources :\n  " + "\n  ".join(manquants))
    # Contrôles de contenu (I §6) sur les textes importés.
    for t in strings(parcours) + strings(conseils) + strings(neuves):
        assert "—" not in t and not re.search(r"blague|carnet", t, re.I) and not re.search(r"`?\[[^\]]+\]`?", t), t[:80]

    data = {
        "_meta": {
            "session": "s19", "auteur": "@fullstack (extraction automatique, aucun texte retapé)",
            "sources": [os.path.relpath(p, ROOT) for p in (I_PATH, E_PATH, P_PATH, V_PATH)],
            "publication": "Publié seulement si BOULOT_PUBLIE = true (apps/web/src/config/parcours-publication.ts).",
            "icone": "[PROVISOIRE] 💼, à choisir par @design (import-boulot.md §1)",
            "conseils": conseils,
            "vannesNeuves": neuves,
            "vannesEnLigne": en_ligne,
        },
        "parcours": parcours,
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"écrit {os.path.relpath(OUT, ROOT)} : {len(steps)} étapes, {sum(len(s['quiz']) for s in steps)} questions, "
          f"{len(conseils)} conseils, {len(neuves)} vannes neuves, {len(en_ligne)} vannes en ligne contrôlées")


if __name__ == "__main__":
    main()
