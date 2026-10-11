#!/usr/bin/env python3
"""Export prod en lecture seule des contenus du parcours Boulot (s19).

Conseils de la spec s17 §3 (par titre seed + titres pro voisins), toutes les
vannes actives de catégorie BOULOT, vidéos de la spec, et état du parcours.
Aucune écriture : en-tête Neon-Batch-Read-Only.

  NEON_DATABASE_URL=... python3 -I scripts/content/boulot-s19-exporter.py
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

SORTIE = "docs/content/boulot-base-s19.json"

VIDEOS_SPEC = ["57Ip2k3us_8", "dQ--q5y2e4k", "jKhIOyk9kdU", "zGT7TX66JFQ",
               "NebHsD_K9lM", "3v8Y4C9Q5hE", "tj6qta_9PaM", "TDmd7JRlxFc",
               "qdqIc-uzdbA", "ztKRY4eNUTA", "4t9a0To2ygo"]

MOTS_PRO = ["réunion", "reunion", "mail", "slack", "couloir", "afterwork",
            "networking", "boulot", "bureau", "collègue", "collegue", "pot de",
            "toast", "discours", "présentation", "presentation", "prise de parole",
            "manager", "chef", "entretien", "visio", "open space", "audience"]


def requete(conn, sql):
    host = urllib.parse.urlparse(conn).hostname
    headers = {"Neon-Connection-String": conn, "Content-Type": "application/json",
               "Neon-Batch-Read-Only": "true"}
    body = {"query": sql, "params": []}
    req = urllib.request.Request(f"https://{host}/sql", data=json.dumps(body).encode(),
                                 headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read())["rows"]
    except urllib.error.HTTPError as e:
        sys.exit(f"Erreur Neon HTTP {e.code} : {e.read().decode()[:500]}")


def main():
    conn = os.environ.get("NEON_DATABASE_URL")
    if not conn:
        sys.exit("NEON_DATABASE_URL absente de l'environnement.")

    filtre = " OR ".join(f"lower(title) LIKE '%{m}%'" for m in MOTS_PRO)
    conseils = requete(conn, f'''SELECT id, title, category, difficulty, "isActive",
        content, example, exercise FROM "Tip" WHERE {filtre} ORDER BY "isActive" DESC, title''')

    vannes = requete(conn, '''SELECT id, content, punchline, type, "maturityLevel",
        "comedyTechnique", "techniqueExplanation", "howToApply" FROM "Joke"
        WHERE category = 'BOULOT' AND "isActive" ORDER BY "createdAt"''')
    nb_boulot = requete(conn, '''SELECT "isActive", count(*) AS n FROM "Joke"
        WHERE category = 'BOULOT' GROUP BY "isActive"''')

    ids = ",".join(f"'{v}'" for v in VIDEOS_SPEC)
    videos = requete(conn, f'''SELECT "youtubeId", title, "channelName", duration, category,
        technique, "isActive", description FROM "Video" WHERE "youtubeId" IN ({ids})''')
    nb_videos = requete(conn, '''SELECT count(*) AS n FROM "Video" WHERE "isActive"''')
    videos_actives = requete(conn, '''SELECT "youtubeId", title, "channelName", duration, category,
        technique, left(description, 300) AS description FROM "Video" WHERE "isActive" ORDER BY title''')

    parcours = requete(conn, '''SELECT slug, title, "isActive" FROM "LearningPath" ORDER BY slug''')

    meta = {"_meta": {
        "date": "2026-10-10",
        "source": "Neon prod, requêtes HTTP en lecture seule (Neon-Batch-Read-Only)",
        "perimetre": "conseils au titre pro, vannes BOULOT actives, 11 vidéos de la spec s17 §3, parcours",
        "conseils": len(conseils), "conseilsActifs": sum(1 for c in conseils if c["isActive"]),
        "vannesBoulot": nb_boulot, "videosSpecTrouvees": len(videos),
        "videosActivesTotal": nb_videos[0]["n"], "parcours": parcours,
        "donneesPersonnelles": "aucune"}}
    os.makedirs(os.path.dirname(SORTIE), exist_ok=True)
    with open(SORTIE, "w", encoding="utf-8") as f:
        json.dump({**meta, "conseils": conseils, "vannes": vannes, "videos": videos,
                   "videosActives": videos_actives},
                  f, ensure_ascii=False, indent=2)
    print(json.dumps(meta, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
