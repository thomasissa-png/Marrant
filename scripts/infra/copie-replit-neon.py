#!/usr/bin/env python3
"""Copie base Replit (Neon us-west-2) -> base Neon Francfort, via l'API SQL HTTPS de Neon.

Aucune connexion TCP Postgres nécessaire (l'environnement Claude n'ouvre que du HTTPS).
Lecture seule côté source. Utilisé en s12 (copie initiale, 35/35 tables identiques)
et à rejouer au moment de la bascule (étape D).

Variables : REPLIT_DATABASE_URL (source), NEON_DATABASE_URL (cible, schéma déjà créé).
Usage :
  python3 scripts/infra/copie-replit-neon.py            # copie les tables vides de la cible
  python3 scripts/infra/copie-replit-neon.py --reset    # vide d'abord la cible (bascule)
  python3 scripts/infra/copie-replit-neon.py --verify   # compare lignes + md5 par table
"""
import json
import os
import subprocess
import sys

SRC = os.environ["REPLIT_DATABASE_URL"]
DST = os.environ["NEON_DATABASE_URL"]
BATCH = 1000


def q(url, sql, params=None):
    host = url.split("@")[1].split("/")[0].split("?")[0]
    out = subprocess.run(
        ["curl", "-sS", "-X", "POST", f"https://{host}/sql",
         "-H", f"Neon-Connection-String: {url}", "-H", "Content-Type: application/json",
         "--data-binary", "@-"],
        input=json.dumps({"query": sql, "params": params or []}),
        capture_output=True, text=True,
    ).stdout
    r = json.loads(out)
    if "rows" not in r:
        raise SystemExit(f"ERREUR {sql[:80]} : {r.get('message')}")
    return r["rows"]


def schema():
    cols, pks = {}, {}
    for r in q(SRC, "select table_name t, column_name c from information_schema.columns "
                    "where table_schema='public' and table_name<>'_prisma_migrations' order by 1, ordinal_position"):
        cols.setdefault(r["t"], []).append(r["c"])
    for r in q(SRC, "select tc.table_name t, string_agg(k.column_name, ',' order by k.ordinal_position) pk "
                    "from information_schema.table_constraints tc join information_schema.key_column_usage k "
                    "using (constraint_name, table_schema) where tc.constraint_type='PRIMARY KEY' "
                    "and tc.table_schema='public' group by 1"):
        pks[r["t"]] = r["pk"].split(",")
    return cols, pks


def order_by(t, cols, pks):
    return ",".join(f'"{c}"' for c in pks.get(t, cols[t]))


def parents_first(cols):
    fks = q(DST, "select conrelid::regclass::text child, confrelid::regclass::text parent "
                 "from pg_constraint where contype='f'")
    dep = {t: set() for t in cols}
    for f in fks:
        c, p = f["child"].strip('"'), f["parent"].strip('"')
        if c in dep and p != c:
            dep[c].add(p)
    order = []
    while dep:
        ready = sorted(t for t, d in dep.items() if not d - set(order))
        if not ready:
            raise SystemExit(f"Cycle de clés étrangères : {sorted(dep)}")
        order += ready
        for t in ready:
            dep.pop(t)
    return order


def copy(reset):
    cols, pks = schema()
    order = parents_first(cols)
    if reset:
        q(DST, "truncate " + ",".join(f'"{t}"' for t in order) + " cascade")
        print("Cible vidée.")
    total = 0
    for t in order:
        cl = ",".join(f'"{c}"' for c in cols[t])
        n = int(q(SRC, f'select count(*) n from "{t}"')[0]["n"])
        have = int(q(DST, f'select count(*) n from "{t}"')[0]["n"])
        if have == n:
            total += n
            continue
        if have:
            raise SystemExit(f"{t} : copie partielle {have}/{n}, relancer avec --reset")
        for off in range(0, n, BATCH):
            j = q(SRC, f"select coalesce(json_agg(x),'[]')::text j from (select {cl} from \"{t}\" "
                       f"order by {order_by(t, cols, pks)} limit {BATCH} offset {off}) x")[0]["j"]
            q(DST, f'insert into "{t}" ({cl}) select {cl} from json_populate_recordset(null::"{t}", $1::json)', [j])
        total += n
        print(f"{t} : {n}", flush=True)
    q(DST, "analyze")
    print("TOTAL", total)


def verify():
    cols, pks = schema()
    bad = 0
    for t in sorted(cols):
        cl = ",".join(f'"{c}"' for c in cols[t])
        sql = (f"select count(*) n, md5(coalesce(string_agg(x::text, chr(10) order by {order_by(t, cols, pks)}),'')) h "
               f'from (select {cl} from "{t}") x')
        a, b = q(SRC, sql)[0], q(DST, sql)[0]
        if a != b:
            bad += 1
            print("ÉCART", t, a, b)
    print(f"tables identiques : {len(cols) - bad}/{len(cols)}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    verify() if "--verify" in sys.argv else copy("--reset" in sys.argv)
