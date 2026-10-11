#!/usr/bin/env python3
"""Réplique les 6 conseils du Parcours Boulot (s19) dans docs/content/conseils-seed.json.

Source : `_meta.conseils` de docs/content/parcours-boulot-s19.json (lui-même extrait des
textes validés par scripts/content/boulot-s19-extraire.py). Sans cette réplication, un
rejeu de `prisma db seed` remettrait l'ancien texte (import-boulot.md §3).

- conseils existants (étapes 2 à 5) : retrouvés par titre exact, contenu / exemple /
  défi / catégorie / difficulté remplacés (le PS passe de JEUX_DE_MOTS à ABSURDE) ;
- conseils neufs (étapes 1 et 6) : ajoutés en fin de liste (id = max + 1), une seule fois.
Idempotent : un second passage ne change rien.
Usage : python3 -I scripts/content/boulot-s19-conseils-seed.py
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CONTENU = os.path.join(ROOT, "docs/content/parcours-boulot-s19.json")
SEED = os.path.join(ROOT, "docs/content/conseils-seed.json")


def main():
    with open(CONTENU, encoding="utf-8") as f:
        conseils = json.load(f)["_meta"]["conseils"]
    with open(SEED, encoding="utf-8") as f:
        seed = json.load(f)
    by_title = {t["title"]: t for t in seed}
    changes = []
    for c in conseils:
        champs = {"content": c["content"], "category": c["category"], "difficulty": c["difficulty"],
                  "example": c["example"], "exercise": c["exercise"]}
        cible = by_title.get(c["title"])
        if cible is None:
            if c["id"]:
                raise SystemExit(f"conseil existant absent du seed : {c['title']}")
            cible = {"id": max(t["id"] for t in seed) + 1, "title": c["title"]}
            seed.append(cible)
            by_title[c["title"]] = cible
            changes.append(f"ajouté #{cible['id']} {c['title']}")
        elif not c["id"]:
            pass  # conseil neuf déjà ajouté (rejeu)
        diff = {k: v for k, v in champs.items() if cible.get(k) != v}
        if diff:
            cible.update(diff)
            changes.append(f"#{cible['id']} {c['title']} : {', '.join(sorted(diff))}")
    with open(SEED, "w", encoding="utf-8") as f:
        f.write(json.dumps(seed, ensure_ascii=False, indent=2) + "\n")
    print("\n".join(changes) if changes else "conseils-seed.json déjà à jour")


if __name__ == "__main__":
    main()
