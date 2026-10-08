#!/usr/bin/env python3
"""Restauration de la phase 2 (s18, 08/10/2026) dans la table Tip.

1. Remet les 5 conseils des étapes de parcours en ligne à l'état exact d'avant la mise en base :
title, content, example, exercise, updatedAt, copyReviewedAt, copyReviewVersion,
copyVerdict, originalTitle, originalContent.
2. Désactive (isActive = false, sans suppression : favoris et historique gardés) les 3
   conseils créés par la phase 2 (`nouveaux_crees` de la sauvegarde).
Aucun autre conseil n'est touché. Une seule transaction (API HTTP Neon) : tout ou rien.

Usage :
  NEON_DATABASE_URL=... python3 -I scripts/restaurer-tip-phase2.py            # simulation
  NEON_DATABASE_URL=... python3 -I scripts/restaurer-tip-phase2.py --appliquer

Sauvegarde : docs/marrant/audit-conseils-s18/sauvegarde-tip-avant-phase2.json
La chaîne de connexion n'est lue que dans l'environnement (jamais dans le dépôt).
Après restauration : les fiches /conseils/<slug> se régénèrent à la première visite
(ISR, stale-while-revalidate) ; visiter chaque fiche deux fois pour forcer le rafraîchissement.
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKUP = os.path.join(ROOT, "docs/marrant/audit-conseils-s18/sauvegarde-tip-avant-phase2.json")
FIELDS = ["title", "content", "example", "exercise", "updatedAt", "copyReviewedAt",
          "copyReviewVersion", "copyVerdict", "originalTitle", "originalContent"]

UPDATE = ('UPDATE "Tip" SET ' + ", ".join(f'"{f}" = ${n}' for n, f in enumerate(FIELDS, start=2))
          + ' WHERE id = $1 RETURNING id')
DEACTIVATE = ('UPDATE "Tip" SET "isActive" = false, "updatedAt" = now() '
              'WHERE id = ANY($1) AND id LIKE \'cs18tip%\' AND "isActive" = true RETURNING id')


def post(conn, body, read_only=False):
    host = urllib.parse.urlparse(conn).hostname
    headers = {"Neon-Connection-String": conn, "Content-Type": "application/json"}
    if read_only:
        headers["Neon-Batch-Read-Only"] = "true"
    else:
        headers["Neon-Batch-Isolation-Level"] = "Serializable"
    req = urllib.request.Request(f"https://{host}/sql", data=json.dumps(body).encode(),
                                 headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        sys.exit(f"Erreur Neon HTTP {e.code} : {e.read().decode()[:500]}")


def main():
    conn = os.environ.get("NEON_DATABASE_URL")
    if not conn:
        sys.exit("NEON_DATABASE_URL absente de l'environnement.")
    backup = json.load(open(BACKUP, encoding="utf-8"))
    tips = backup["tips"]
    new_ids = [n["id"] for n in backup["nouveaux_crees"]]
    ids = [t["id"] for t in tips]
    rows = post(conn, {"query": 'SELECT id, title FROM "Tip" WHERE id = ANY($1)', "params": [ids]},
                read_only=True)["rows"]
    current = {r["id"]: r["title"] for r in rows}
    missing = [i for i in ids if i not in current]
    print(f"{len(tips)} conseils dans la sauvegarde, {len(current)} trouvés en base, manquants : {missing}")
    if missing:
        sys.exit("ARRÊT : des conseils de la sauvegarde n'existent plus en base.")
    for t in tips:
        print(f"  {t['id']} « {t['title']} » : textes remis à l'état sauvegardé")
    active = post(conn, {"query": 'SELECT id, title FROM "Tip" WHERE id = ANY($1) AND "isActive" = true',
                         "params": [new_ids]}, read_only=True)["rows"]
    for r in active:
        print(f"  {r['id']} « {r['title']} » : sera désactivé")
    if "--appliquer" not in sys.argv:
        print("Simulation seulement. Relancer avec --appliquer pour restaurer.")
        return
    queries = [{"query": UPDATE, "params": [t["id"]] + [t[f] for f in FIELDS]} for t in tips]
    queries.append({"query": DEACTIVATE, "params": [new_ids]})
    res = post(conn, {"queries": queries})
    done = sum(1 for r in res["results"][:-1] if r["rows"])
    off = len(res["results"][-1]["rows"])
    print(f"Restauration : {done}/{len(tips)} conseils remis à l'état du {BACKUP.rsplit('/', 1)[-1]}, "
          f"{off}/{len(new_ids)} nouveaux conseils désactivés.")


if __name__ == "__main__":
    main()
