/**
 * Mesure d'usage (s24, lot 0) : tableau « une ligne par abonné » (§5.2 du brief espace client),
 * en LECTURE SEULE.
 *
 * Deux requêtes (`src/lib/mesure/tableau-abonnes.ts`) dans une transaction `READ ONLY` (Postgres
 * refuse toute écriture). Aucun identifiant ne sort de la base : les comptes deviennent M-A, M-B…
 * dans l'ordre des souscriptions. Heures affichées en heure de Paris. L'URL de base n'est jamais
 * affichée. Sortie : Markdown sur la sortie standard.
 *
 * Options (date seule = minuit à PARIS, ex. 2026-11-08 ; ou date-heure ISO avec fuseau) :
 *   --depuis <date>      ignorer les souscriptions antérieures (facteur confondant du §5.2) ;
 *   --activation <date>  activation de l'espace : référence (10 dernières avant) et suivantes ;
 *                        le seuil « cas par cas sous 15 » porte alors sur les abonnés d'après.
 *
 * Production (Neon, depuis apps/web) :
 *   NEON_DATABASE_URL=<url> npx tsx scripts/mesure-usage/tableau-abonnes.ts [options]
 * Derrière un proxy : ajouter HTTPS_PROXY et NODE_EXTRA_CA_CERTS.
 * Base locale (Postgres classique, sans pilote HTTP), commande vérifiée telle quelle :
 *   npx tsx scripts/mesure-usage/tableau-abonnes.ts --sql-json > /tmp/q.sql
 *   PGOPTIONS='-c default_transaction_read_only=on' psql "$DATABASE_URL" -qAt -f /tmp/q.sql > /tmp/l.json
 *   npx tsx scripts/mesure-usage/tableau-abonnes.ts --depuis-json /tmp/l.json [options]
 */
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import {
  lireDateParis,
  SQL_JSON,
  SQL_SANS_SOUSCRIPTION,
  SQL_TABLEAU_ABONNES,
  tableauAbonnes,
  type LigneBrute,
  type OptionsLecture,
} from "../../src/lib/mesure/tableau-abonnes";

function argument(nom: string): string | null {
  const i = process.argv.indexOf(nom);
  return i > 0 ? process.argv[i + 1] ?? null : null;
}

function dateOption(nom: string): Date | null {
  const v = argument(nom);
  if (!v) return null;
  const d = lireDateParis(v);
  if (!d) throw new Error(`${nom} : date illisible (${v}).`);
  return d;
}

async function main() {
  if (process.argv.includes("--sql-json")) {
    console.log(SQL_JSON);
    return;
  }
  const options: OptionsLecture = { depuis: dateOption("--depuis"), activation: dateOption("--activation") };

  const fichier = argument("--depuis-json");
  if (fichier) {
    const json = JSON.parse(readFileSync(fichier, "utf8")) as { lignes: LigneBrute[]; sansSouscription: number };
    console.log(tableauAbonnes(json.lignes, new Date(), { ...options, sansSouscription: json.sansSouscription }));
    return;
  }

  const url = process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("NEON_DATABASE_URL absente : lecture non lancée.");
  if (process.env.HTTPS_PROXY) setGlobalDispatcher(new EnvHttpProxyAgent());
  const sql = neon(url);
  const [lignes, compte] = (await sql.transaction([sql.query(SQL_TABLEAU_ABONNES), sql.query(SQL_SANS_SOUSCRIPTION)], {
    readOnly: true,
  })) as unknown as [LigneBrute[], Array<{ n: number }>];
  console.log(tableauAbonnes(lignes ?? [], new Date(), { ...options, sansSouscription: compte?.[0]?.n ?? null }));
}

main().catch((err) => {
  console.error("Lecture impossible :", err instanceof Error ? err.message : err);
  process.exit(1);
});
