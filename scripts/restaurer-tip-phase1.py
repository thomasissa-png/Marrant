#!/usr/bin/env python3
"""Restauration des 69 conseils de la phase 1 (s18, 08/10/2026) dans la table Tip.

Remet, pour chaque conseil de la sauvegarde, l'état exact d'avant la mise en base :
title, content, example, exercise, updatedAt, copyReviewedAt, copyReviewVersion,
copyVerdict, originalTitle, originalContent. Ne touche ni isActive, ni aucun autre
conseil. Une seule transaction (API HTTP Neon) : tout ou rien.

Usage :
  NEON_DATABASE_URL=... python3 -I scripts/restaurer-tip-phase1.py            # simulation
  NEON_DATABASE_URL=... python3 -I scripts/restaurer-tip-phase1.py --appliquer

Sauvegarde : docs/marrant/audit-conseils-s18/sauvegarde-tip-avant-phase1.json
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
BACKUP = os.path.join(ROOT, "docs/marrant/audit-conseils-s18/sauvegarde-tip-avant-phase1.json")
FIELDS = ["title", "content", "example", "exercise", "updatedAt", "copyReviewedAt",
          "copyReviewVersion", "copyVerdict", "originalTitle", "originalContent"]

UPDATE = ('UPDATE "Tip" SET ' + ", ".join(f'"{f}" = ${n}' for n, f in enumerate(FIELDS, start=2))
          + ' WHERE id = $1 RETURNING id')


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
    tips = json.load(open(BACKUP, encoding="utf-8"))["tips"]
    ids = [t["id"] for t in tips]
    rows = post(conn, {"query": 'SELECT id, title FROM "Tip" WHERE id = ANY($1)', "params": [ids]},
                read_only=True)["rows"]
    current = {r["id"]: r["title"] for r in rows}
    missing = [i for i in ids if i not in current]
    print(f"{len(tips)} conseils dans la sauvegarde, {len(current)} trouvés en base, manquants : {missing}")
    if missing:
        sys.exit("ARRÊT : des conseils de la sauvegarde n'existent plus en base.")
    for t in tips:
        if current[t["id"]] != t["title"]:
            print(f"  {t['id']} : « {current[t['id']]} » → « {t['title']} »")
    if "--appliquer" not in sys.argv:
        print("Simulation seulement. Relancer avec --appliquer pour restaurer.")
        return
    queries = [{"query": UPDATE, "params": [t["id"]] + [t[f] for f in FIELDS]} for t in tips]
    res = post(conn, {"queries": queries})
    done = sum(1 for r in res["results"] if r["rows"])
    print(f"Restauration : {done}/{len(tips)} conseils remis à l'état du {BACKUP.rsplit('/', 1)[-1]}.")


if __name__ == "__main__":
    main()
