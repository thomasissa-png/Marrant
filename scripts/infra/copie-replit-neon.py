#!/usr/bin/env python3
"""Copie base Replit (Neon us-west-2) -> base Neon Francfort, via l'API SQL HTTPS de Neon.

+--------------------------------------------------------------------------------------------+
| LEÇON DU 30/09 : `--reset` ne vidait que les tables de la source. `DataPatch` (absente de     |
| Replit) a gardé ses marqueurs, `BlogArticle` est revenu à l'ancien texte et les tâches de     |
| démarrage ont sauté la refonte s11. Désormais : refus par défaut + `--verify` sur la cible.   |
+--------------------------------------------------------------------------------------------+

Aucune connexion TCP Postgres nécessaire (l'environnement Claude n'ouvre que du HTTPS).
Lecture seule côté source (garde-fou : toute requête non SELECT vers la source est refusée).
Utilisé en s12 (copie initiale), le 30/09 (bascule) et par le retour arrière documenté.

Variables : REPLIT_DATABASE_URL (source), NEON_DATABASE_URL (cible, schéma déjà créé).
Usage :
  python3 scripts/infra/copie-replit-neon.py            # copie les tables vides de la cible
  python3 scripts/infra/copie-replit-neon.py --reset    # vide d'abord la cible (bascule)
  python3 scripts/infra/copie-replit-neon.py --verify   # compare les deux bases (voir verify())
Options d'écriture :
  --dry-run                      affiche le plan (lit les deux bases), n'écrit RIEN
  --purge-target-only-tables     vide aussi les tables présentes seulement dans la cible
  --keep-target-only-tables=A,B  conserve explicitement ces tables (interdit pour les tables d'état)

Tables « cible seulement » (ex. `DataPatch`, `NewsletterSubscriber`) : si l'une est NON VIDE,
la copie s'arrête (code 2) et les liste, tant qu'on n'a pas choisi de les vider ou de les garder.
Vider `DataPatch` = toutes les tâches de démarrage se rejoueront : appeler ensuite
`/api/cron/startup-tasks`. Garder `DataPatch` est refusé : ses marqueurs décriraient un contenu
qui vient d'être remplacé.
"""
import json
import os
import subprocess
import sys

BATCH = 1000
SAMPLE = 50
IGNORED = {"_prisma_migrations"}
# Tables d'état des tâches : un marqueur présent = « travail déjà fait », jamais revérifié.
STATE_TABLES = {
    "DataPatch": "marqueurs des tâches de démarrage (blog-rewrite, blog-em-dash, catalogue-content...)",
    "JobLock": "verrous des jobs planifiés",
    "SocialPostDailyLock": "verrous quotidiens des posts sociaux",
    "CeoDedup": "dédoublonnage de l'agent CEO",
}
# Tables de contenu éditorial : contrôle ligne à ligne (hash) en plus du hash global.
CONTENT_TABLES = ("BlogArticle", "Joke", "Tip")


class Refus(SystemExit):
    """Arrêt volontaire avant toute écriture (code 2)."""

    def __init__(self, msg):
        print(msg, file=sys.stderr)
        super().__init__(2)


class Db:
    def __init__(self, url, label, readonly=False):
        self.url, self.label, self.readonly = url, label, readonly

    def q(self, sql, params=None):
        if self.readonly and not sql.lstrip().lower().startswith("select"):
            raise SystemExit(f"REFUS : écriture vers la source {self.label} : {sql[:60]}")
        return self._run(sql, params)

    def _run(self, sql, params):
        host = self.url.split("@")[1].split("/")[0].split("?")[0]
        p = subprocess.run(
            ["curl", "-sS", "-X", "POST", f"https://{host}/sql",
             "-H", f"Neon-Connection-String: {self.url}", "-H", "Content-Type: application/json",
             "--data-binary", "@-"],
            input=json.dumps({"query": sql, "params": params or []}),
            capture_output=True, text=True,
        )
        try:
            r = json.loads(p.stdout)
        except ValueError:
            raise SystemExit(f"ERREUR {self.label} (curl {p.returncode}) : {p.stderr.strip()[:200]}")
        if "rows" not in r:
            raise SystemExit(f"ERREUR {self.label} {sql[:80]} : {r.get('message')}")
        return r["rows"]

    def columns(self):
        cols = {}
        for r in self.q("select table_name t, column_name c from information_schema.columns "
                        "where table_schema='public' order by 1, ordinal_position"):
            if r["t"] not in IGNORED:
                cols.setdefault(r["t"], []).append(r["c"])
        return cols

    def pks(self):
        return {r["t"]: r["pk"].split(",") for r in self.q(
            "select tc.table_name t, string_agg(k.column_name, ',' order by k.ordinal_position) pk "
            "from information_schema.table_constraints tc join information_schema.key_column_usage k "
            "using (constraint_name, table_schema) where tc.constraint_type='PRIMARY KEY' "
            "and tc.table_schema='public' group by 1")}

    def fks(self):
        return [(f["child"].strip('"'), f["parent"].strip('"')) for f in self.q(
            "select conrelid::regclass::text child, confrelid::regclass::text parent "
            "from pg_constraint where contype='f'")]

    def count(self, t):
        return int(self.q(f'select count(*) n from "{t}"')[0]["n"])


def qi(names):
    return ",".join(f'"{c}"' for c in names)


def order_by(t, cols, pks):
    return qi(pks.get(t, cols[t]))


def parents_first(tables, fks):
    dep = {t: set() for t in tables}
    for c, p in fks:
        if c in dep and p != c and p in dep:
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


def plan(src, dst, reset, purge, keep):
    """Calcule ce qui sera vidé / copié, sans rien écrire. Lève Refus si l'état serait incohérent."""
    cols, dcols = src.columns(), dst.columns()
    missing = sorted(set(cols) - set(dcols))
    if missing:
        raise Refus(f"REFUS : tables de la source absentes de la cible (schéma à créer d'abord) : {missing}")
    fks = dst.fks()
    order = parents_first(list(cols), fks)
    only = {t: dst.count(t) for t in sorted(set(dcols) - set(cols))}
    unknown = sorted(set(keep) - set(only))
    if unknown:
        raise Refus(f"REFUS : --keep-target-only-tables cite des tables qui ne sont pas « cible seulement » : {unknown}")
    kept_state = sorted(set(keep) & set(STATE_TABLES))
    if kept_state:
        raise Refus(f"REFUS : impossible de garder {kept_state} (tables d'état) pendant une copie : "
                    "leurs marqueurs décriraient un contenu remplacé. Utiliser --purge-target-only-tables.")
    # TRUNCATE ... CASCADE videra de toute façon une table cible-seulement qui référence une table vidée.
    cascaded = sorted({c for c, p in fks if c in keep and p in cols}) if reset else []
    if cascaded:
        raise Refus(f"REFUS : {cascaded} référencent des tables vidées par --reset (TRUNCATE CASCADE) : "
                    "elles seraient vidées malgré --keep-target-only-tables.")
    blocking = [t for t, n in only.items() if n and t not in keep]
    if blocking and not purge:
        lines = [f"  - {t} : {only[t]} lignes" + (f"  [ÉTAT : {STATE_TABLES[t]}]" if t in STATE_TABLES else "")
                 for t in blocking]
        raise Refus(
            "REFUS : la cible contient des tables NON VIDES absentes de la source :\n" + "\n".join(lines) +
            "\nLa copie les laisserait intactes alors que le contenu revient à l'état de la source "
            "(cause de l'incident du 30/09).\n"
            "  --purge-target-only-tables      les vider (puis appeler /api/cron/startup-tasks : "
            "les marqueurs effacés, toutes les tâches de démarrage se rejouent)\n"
            "  --keep-target-only-tables=A,B   garder des tables de données (ex. NewsletterSubscriber), "
            "jamais une table d'état")
    purge_list = [t for t in only if t not in keep] if purge else []
    return {"cols": cols, "pks": src.pks(), "order": order, "only": only,
            "truncate": (order if reset else []) + purge_list, "purge": purge_list, "keep": sorted(keep)}


def show(p, src, dst, reset):
    print(f"PLAN ({'--reset' if reset else 'copie des tables vides'}), tables source : {len(p['order'])}")
    print("  à vider :", ", ".join(p["truncate"]) or "aucune")
    for t, n in p["only"].items():
        tag = "VIDÉE" if t in p["purge"] else ("GARDÉE (explicite)" if t in p["keep"] else "intacte")
        etat = f" [ÉTAT : {STATE_TABLES[t]}]" if t in STATE_TABLES else ""
        print(f"  cible seulement : {t} ({n} lignes) -> {tag}{etat}")
    gone = set(p["truncate"])
    for t in p["order"]:
        n, have = src.count(t), (0 if t in gone else dst.count(t))
        action = "déjà identique en nombre" if have == n else ("ARRÊT : copie partielle" if have else "copie")
        print(f"  {t} : source {n} / cible {have} -> {action}")
    if any(t in STATE_TABLES for t in p["purge"]):
        print("ATTENTION : marqueurs de tâches effacés -> appeler /api/cron/startup-tasks après la copie.")


def copy(src, dst, reset, purge=False, keep=(), dry_run=False):
    p = plan(src, dst, reset, purge, keep)
    show(p, src, dst, reset)
    if dry_run:
        print("DRY-RUN : aucune écriture.")
        return p
    cols, pks = p["cols"], p["pks"]
    if p["truncate"]:
        dst.q("truncate " + qi(p["truncate"]) + " cascade")
        print("Cible vidée :", ", ".join(p["truncate"]))
    total = 0
    for t in p["order"]:
        cl = qi(cols[t])
        n, have = src.count(t), dst.count(t)
        if have == n:
            total += n
            continue
        if have:
            raise SystemExit(f"{t} : copie partielle {have}/{n}, relancer avec --reset")
        for off in range(0, n, BATCH):
            j = src.q(f"select coalesce(json_agg(x),'[]')::text j from (select {cl} from \"{t}\" "
                      f"order by {order_by(t, cols, pks)} limit {BATCH} offset {off}) x")[0]["j"]
            dst.q(f'insert into "{t}" ({cl}) select {cl} from json_populate_recordset(null::"{t}", $1::json)', [j])
        total += n
        print(f"{t} : {n}", flush=True)
    dst.q("analyze")
    print("TOTAL", total)
    if any(t in STATE_TABLES for t in p["purge"]):
        print("ATTENTION : marqueurs de tâches effacés -> appeler /api/cron/startup-tasks maintenant.")
    return p


def row_hashes(db, t, cl, kexpr, keys):
    rows = db.q(f'select k, md5(x::text) h from (select {kexpr} k, {cl} from "{t}") x '
                "where k in (select json_array_elements_text($1::json))", [json.dumps(keys)])
    return {r["k"]: r["h"] for r in rows}


def sample_content(src, dst, t, cols, pks):
    """Hash ligne à ligne d'un échantillon déterministe (clés réparties par md5), pris des deux côtés."""
    kexpr = "concat_ws('|'," + qi(pks.get(t, cols)) + ")"
    pick = f"select {kexpr} k from \"{t}\" order by md5({kexpr}) limit {SAMPLE}"
    keys = sorted({r["k"] for r in src.q(pick)} | {r["k"] for r in dst.q(pick)})
    a, b = row_hashes(src, t, qi(cols), kexpr, keys), row_hashes(dst, t, qi(cols), kexpr, keys)
    diff = [k for k in keys if a.get(k) != b.get(k)]
    return len(keys), diff


def verify(src, dst, keep=()):
    """Code 0 seulement si : tables source identiques (lignes + md5 global trié par clé primaire),
    aucune table « cible seulement » non vide (sauf tables de données gardées explicitement via
    --keep-target-only-tables, jamais une table d'état), échantillon de contenu identique ligne à ligne."""
    cols, pks, dcols = src.columns(), src.pks(), dst.columns()
    bad, broken = [], set()
    shared = sorted(t for t in cols if t in dcols)
    for t in sorted(set(cols) - set(dcols)):
        bad.append(t)
        print("ÉCART", t, "absente de la cible")
    for t in shared:
        lost = [c for c in cols[t] if c not in dcols[t]]
        if lost:
            bad.append(t)
            broken.add(t)
            print("ÉCART", t, "colonnes source absentes de la cible :", lost)
            continue
        extra = [c for c in dcols[t] if c not in cols[t]]
        if extra:
            print(f"info {t} : colonnes propres à la cible, non comparées : {extra}")
        sql = (f"select count(*) n, md5(coalesce(string_agg(x::text, chr(10) order by {order_by(t, cols, pks)}),'')) h "
               f'from (select {qi(cols[t])} from "{t}") x')
        a, b = src.q(sql)[0], dst.q(sql)[0]
        if (int(a["n"]), a["h"]) != (int(b["n"]), b["h"]):
            bad.append(t)
            print("ÉCART", t, a, b)
    only_bad = []
    for t in sorted(set(dcols) - set(cols)):
        n = dst.count(t)
        if n and t in keep and t not in STATE_TABLES:
            print(f"info {t} : table propre à la cible, {n} lignes, gardée explicitement")
        elif n:
            only_bad.append(t)
            etat = f" [ÉTAT : {STATE_TABLES[t]}]" if t in STATE_TABLES else ""
            print(f"ÉCART {t} : table propre à la cible, {n} lignes{etat}")
    checked = 0
    for t in CONTENT_TABLES:
        if t not in shared or t in broken:
            continue
        n, diff = sample_content(src, dst, t, cols[t], pks)
        checked += n
        if diff:
            bad.append(t)
            print(f"ÉCART contenu {t} : {len(diff)}/{n} lignes différentes, ex. {diff[:10]}")
    print(f"tables source identiques : {len(cols) - len(set(bad))}/{len(cols)}")
    print(f"tables propres à la cible non vides : {len(only_bad)}" + (f" {only_bad}" if only_bad else ""))
    print(f"échantillon contenu ({', '.join(CONTENT_TABLES)}) : {checked} lignes comparées")
    return 1 if bad or only_bad else 0


def main(argv, env=os.environ):
    keep = []
    for a in argv:
        if a.startswith("--keep-target-only-tables="):
            keep = [t for t in a.split("=", 1)[1].split(",") if t]
    known = {"--reset", "--verify", "--dry-run", "--purge-target-only-tables"}
    unknown = [a for a in argv if a not in known and not a.startswith("--keep-target-only-tables=")]
    if unknown:
        raise Refus(f"Options inconnues : {unknown}\n{__doc__}")
    src = Db(env["REPLIT_DATABASE_URL"], "source", readonly=True)
    dst = Db(env["NEON_DATABASE_URL"], "cible")
    if "--verify" in argv:
        return verify(src, dst, keep)
    copy(src, dst, "--reset" in argv, "--purge-target-only-tables" in argv, keep, "--dry-run" in argv)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
