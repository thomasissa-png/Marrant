/**
 * Mesure d'usage (s24, lot 0) : tableau « une ligne par abonné » (§5.2 du brief espace client),
 * en LECTURE SEULE.
 *
 * Une seule requête (`SQL_TABLEAU_ABONNES`, `src/lib/mesure/tableau-abonnes.ts`) dans une transaction
 * `READ ONLY` (Postgres refuse toute écriture). Aucun identifiant ne sort de la base : les comptes
 * sont remplacés par A, B, C… dans l'ordre des souscriptions. L'URL de base n'est jamais affichée.
 * Sortie : tableau Markdown sur la sortie standard.
 *
 * Lancement (depuis apps/web) :
 *   NEON_DATABASE_URL=<url> npx tsx scripts/mesure-usage/tableau-abonnes.ts
 * Derrière un proxy : ajouter HTTPS_PROXY et NODE_EXTRA_CA_CERTS.
 * Base locale (Postgres classique, sans pilote HTTP) : même requête par psql, en lecture seule, puis
 * mise en forme du JSON obtenu :
 *   npx tsx scripts/mesure-usage/tableau-abonnes.ts --sql-json > /tmp/q.sql
 *   psql "$DATABASE_URL" -At -c "SET default_transaction_read_only = on" -f /tmp/q.sql > /tmp/l.json
 *   npx tsx scripts/mesure-usage/tableau-abonnes.ts --depuis-json /tmp/l.json
 */
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import { SQL_TABLEAU_ABONNES, tableauAbonnes, type LigneBrute } from "../../src/lib/mesure/tableau-abonnes";

async function main() {
  if (process.argv.includes("--sql-json")) {
    console.log(`SELECT coalesce(json_agg(t), '[]'::json) FROM (${SQL_TABLEAU_ABONNES}) t;`);
    return;
  }
  const iJson = process.argv.indexOf("--depuis-json");
  if (iJson > 0) {
    const lignes = JSON.parse(readFileSync(process.argv[iJson + 1], "utf8")) as LigneBrute[];
    console.log(tableauAbonnes(lignes, new Date()));
    return;
  }
  const url = process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("NEON_DATABASE_URL absente : lecture non lancée.");
  if (process.env.HTTPS_PROXY) setGlobalDispatcher(new EnvHttpProxyAgent());
  const sql = neon(url);
  const [lignes] = (await sql.transaction([sql.query(SQL_TABLEAU_ABONNES)], { readOnly: true })) as unknown as LigneBrute[][];
  console.log(tableauAbonnes(lignes ?? [], new Date()));
}

main().catch((err) => {
  console.error("Lecture impossible :", err instanceof Error ? err.message : err);
  process.exit(1);
});
