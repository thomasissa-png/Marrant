"""Tests de copie-replit-neon.py sur un Postgres LOCAL jetable (jamais Replit ni Neon).

Seul le transport HTTP Neon est remplacé (psql local) : le SQL du script est exécuté tel quel.
Lancement :
  COPIE_TEST_PGHOST=/chemin/socket COPIE_TEST_PGPORT=55432 python3 -m unittest scripts/infra/test_copie_replit_neon.py -v
Sans COPIE_TEST_PGHOST, les tests sont sautés (pas de base par défaut, par sécurité).
"""
import contextlib
import importlib.util
import io
import json
import os
import pathlib
import subprocess
import unittest

spec = importlib.util.spec_from_file_location(
    "copie", pathlib.Path(__file__).with_name("copie-replit-neon.py"))
copie = importlib.util.module_from_spec(spec)
spec.loader.exec_module(copie)

HOST, PORT = os.environ.get("COPIE_TEST_PGHOST"), os.environ.get("COPIE_TEST_PGPORT", "5432")
DBS = ("copie_test_src", "copie_test_dst")


def psql(db, sql):
    p = subprocess.run(["psql", "-h", HOST, "-p", PORT, "-U", "postgres", "-XAtq", "-v", "ON_ERROR_STOP=1",
                        "-d", db, "-c", sql], capture_output=True, text=True)
    if p.returncode:
        raise SystemExit(f"psql {db} : {p.stderr.strip()}")
    return p.stdout


class PsqlDb(copie.Db):
    """Même classe que le script, transport psql local au lieu de l'API HTTPS de Neon."""

    def _run(self, sql, params):
        for i, v in enumerate(params or [], 1):
            sql = sql.replace(f"${i}", f"$prm${v}$prm$")
        if sql.lstrip().lower().startswith("select"):
            return json.loads(psql(self.url, f"select coalesce(json_agg(r),'[]')::text from ({sql}) r"))
        psql(self.url, sql)
        return []


SCHEMA = '''
create table "User" (id text primary key, email text);
create table "BlogArticle" (id text primary key, slug text, content text, "authorId" text references "User"(id));
create table "Joke" (id text primary key, content text);
create table "Tip" (id text primary key, title text);
'''
SRC_DATA = '''
insert into "User" values ('u1','a@b.fr');
insert into "BlogArticle" values ('b1','citation-drole','ancien texte Replit','u1'),('b2','blague-courte','ancien 2','u1');
insert into "Joke" values ('j1','vanne'),('j2','vanne 2');
insert into "Tip" values ('t1','conseil');
'''
# Cible avant la bascule du 30/09 : refonte s11 appliquée + marqueurs, 2 tables propres à la cible.
DST_EXTRA = '''
alter table "Joke" add column "copyReviewVersion" int default 0;
create table "DataPatch" (id text primary key, "patchId" text unique, note text);
create table "NewsletterSubscriber" (id text primary key, email text);
'''
DST_DATA = '''
insert into "User" values ('u1','a@b.fr');
insert into "BlogArticle" values ('b1','citation-drole','JSON v2 s11','u1'),('b2','blague-courte','JSON v2 bis','u1');
insert into "Joke" values ('j1','vanne refondue',1);
insert into "DataPatch" values ('p1','blog-rewrite:v2:citation-drole',null),('p2','blog-em-dash:v1:blague-courte',null);
insert into "NewsletterSubscriber" values ('n1','abonne@exemple.fr');
'''


@unittest.skipUnless(HOST, "COPIE_TEST_PGHOST absent : Postgres local requis")
class CopieTest(unittest.TestCase):
    def setUp(self):
        for db in DBS:
            psql("postgres", f"drop database if exists {db}")
            psql("postgres", f"create database {db}")
        psql(DBS[0], SCHEMA + SRC_DATA)
        psql(DBS[1], SCHEMA + DST_EXTRA + DST_DATA)
        self.src = PsqlDb(DBS[0], "source", readonly=True)
        self.dst = PsqlDb(DBS[1], "cible")

    def snapshot(self):
        return psql(DBS[1], 'select (select string_agg(content, \'|\' order by id) from "BlogArticle"), '
                            '(select count(*) from "DataPatch"), (select count(*) from "NewsletterSubscriber")')

    def run_quiet(self, fn, *a, **k):
        out = io.StringIO()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
            return fn(*a, **k), out.getvalue()

    def test_reset_refuse_par_defaut_sans_rien_ecrire(self):
        before = self.snapshot()
        with self.assertRaises(copie.Refus) as e:
            self.run_quiet(copie.copy, self.src, self.dst, reset=True)
        self.assertEqual(e.exception.code, 2)
        self.assertEqual(self.snapshot(), before)

    def test_message_de_refus_liste_les_tables_et_signale_les_marqueurs(self):
        out = io.StringIO()
        with contextlib.redirect_stderr(out), self.assertRaises(copie.Refus):
            copie.copy(self.src, self.dst, reset=True)
        msg = out.getvalue()
        self.assertIn("DataPatch : 2 lignes  [ÉTAT", msg)
        self.assertIn("NewsletterSubscriber : 1 lignes", msg)
        self.assertIn("--purge-target-only-tables", msg)

    def test_copie_sans_reset_refuse_aussi(self):
        with self.assertRaises(copie.Refus):
            self.run_quiet(copie.copy, self.src, self.dst, reset=False)

    def test_dry_run_affiche_le_plan_sans_ecrire(self):
        before = self.snapshot()
        _, out = self.run_quiet(copie.copy, self.src, self.dst, reset=True, purge=True, dry_run=True)
        self.assertEqual(self.snapshot(), before)
        self.assertIn("cible seulement : DataPatch (2 lignes) -> VIDÉE", out)
        self.assertIn("DRY-RUN : aucune écriture.", out)
        print("\n--- plan simulé (--reset --purge-target-only-tables --dry-run) ---\n" + out)

    def test_purge_donne_un_etat_coherent_et_verify_vert(self):
        self.run_quiet(copie.copy, self.src, self.dst, reset=True, purge=True)
        self.assertEqual(self.snapshot(), "ancien texte Replit|ancien 2|0|0\n")
        code, _ = self.run_quiet(copie.verify, self.src, self.dst)
        self.assertEqual(code, 0)

    def test_garder_une_table_d_etat_est_refuse(self):
        with self.assertRaises(copie.Refus):
            self.run_quiet(copie.copy, self.src, self.dst, reset=True, purge=True, keep=["DataPatch"])

    def test_garder_newsletter_explicitement(self):
        self.run_quiet(copie.copy, self.src, self.dst, reset=True, purge=True, keep=["NewsletterSubscriber"])
        self.assertEqual(self.snapshot(), "ancien texte Replit|ancien 2|0|1\n")
        self.assertEqual(self.run_quiet(copie.verify, self.src, self.dst, ["NewsletterSubscriber"])[0], 0)
        self.assertEqual(self.run_quiet(copie.verify, self.src, self.dst)[0], 1)

    def test_verify_detecte_l_etat_du_30_09(self):
        # Reproduction de l'ancien --reset : seules les tables de la source vidées, DataPatch intacte.
        psql(DBS[1], 'truncate "User","BlogArticle","Joke","Tip" cascade;' + SRC_DATA)
        code, out = self.run_quiet(copie.verify, self.src, self.dst)
        self.assertEqual(code, 1)
        self.assertIn("ÉCART DataPatch : table propre à la cible, 2 lignes [ÉTAT", out)
        self.assertIn("tables source identiques : 4/4", out)  # l'ancien contrôle aurait dit « vert »

    def test_verify_echantillon_contenu_localise_la_ligne(self):
        self.run_quiet(copie.copy, self.src, self.dst, reset=True, purge=True)
        psql(DBS[1], 'update "BlogArticle" set content = \'modifié\' where id = \'b2\'')
        code, out = self.run_quiet(copie.verify, self.src, self.dst)
        self.assertEqual(code, 1)
        self.assertIn("ÉCART contenu BlogArticle : 1/2 lignes différentes, ex. ['b2']", out)

    def test_source_en_lecture_seule(self):
        with self.assertRaises(SystemExit):
            self.src.q('truncate "User" cascade')
        self.assertEqual(psql(DBS[0], 'select count(*) from "User"'), "1\n")


if __name__ == "__main__":
    unittest.main()
