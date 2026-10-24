/**
 * Inventaire des contenus EN BASE qui citent l'ancien prix Premium (s22, décision Thomas du
 * 24/10/2026 : 2,99 € → 1,99 € par mois, 24,99 € → 16,99 € par an), en LECTURE SEULE.
 *
 * Balaye toutes les colonnes texte (text, varchar, json, jsonb, tableaux) du schéma public et
 * relève chaque ligne qui contient un ancien montant ou un chiffre dérivé (2,08 € par mois,
 * 10,89 € économisés, 35,88 €). Tables d'authentification et de données personnelles exclues ;
 * journaux techniques comptés sans extrait.
 *
 * Aucune écriture en base : chaque requête tourne dans une transaction `READ ONLY` (Postgres
 * refuse toute écriture). L'URL de base n'est jamais affichée. Sortie : tableau Markdown sur la
 * sortie standard (table, id, champ, statut et date si présents, extrait).
 *
 * Lancement (depuis apps/web) :
 *   NEON_DATABASE_URL=<url> npx tsx scripts/prix-s22/inventaire-prix-base.ts
 * Derrière un proxy : ajouter HTTPS_PROXY et NODE_EXTRA_CA_CERTS.
 */
import { neon } from "@neondatabase/serverless";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";

/** Même motif que le garde-fou du code (src/__tests__/lib/prix-199-s22.test.ts), en regex Postgres. */
const MOTIF = "(^|[^0-9.,])(2[,.]99|24[,.]99|2,08|10,89|35,88)([^0-9]|$)";
const MOTIF_JS = /(^|[^0-9.,])(2[,.]99|24[,.]99|2,08|10,89|35,88)(?!\d)/;

/** Données personnelles ou d'authentification : jamais lues. */
const EXCLUES = new Set([
  "Account", "Session", "VerificationToken", "PushToken", "User", "NewsletterSubscriber",
  "WebhookEvent", "RetractationRequest", "Subscription", "_prisma_migrations",
]);
/** Journaux techniques : comptés, sans extrait (rien de publié). */
const JOURNAUX = new Set(["LlmUsageLog", "CeoAuditLog", "CeoDedup", "JobLock"]);
/** Colonnes de contexte reprises si la table les a. */
const CONTEXTE = ["status", "scheduledAt", "publishedAt", "slug", "platform", "isActive"];

type Colonne = { table: string; column: string };
type Ligne = Record<string, unknown> & { _id: string; _val: string };

const q = (ident: string) => `"${ident.replace(/"/g, '""')}"`;
const uneLigne = (t: string) => t.replace(/\s+/g, " ").trim();

function extrait(texte: string): string {
  const plat = uneLigne(texte);
  const m = MOTIF_JS.exec(plat);
  const i = m ? m.index : 0;
  return `${i > 70 ? "…" : ""}${plat.slice(Math.max(0, i - 70), i + 90)}${plat.length > i + 90 ? "…" : ""}`.replace(/\|/g, "\\|");
}

async function main() {
  const url = process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("NEON_DATABASE_URL absente : inventaire non lancé.");
  if (process.env.HTTPS_PROXY) setGlobalDispatcher(new EnvHttpProxyAgent());
  const sql = neon(url);

  const [colonnes, toutes] = (await sql.transaction(
    [
      sql`SELECT table_name AS table, column_name AS column FROM information_schema.columns
          WHERE table_schema = 'public' AND (data_type IN ('text', 'character varying', 'json', 'jsonb', 'ARRAY'))
          ORDER BY table_name, ordinal_position`,
      sql`SELECT table_name AS table, column_name AS column FROM information_schema.columns
          WHERE table_schema = 'public'`,
    ],
    { readOnly: true },
  )) as unknown as [Colonne[], Colonne[]];

  const parTable = new Map<string, Set<string>>();
  for (const c of toutes) parTable.set(c.table, (parTable.get(c.table) ?? new Set()).add(c.column));
  const cibles = colonnes.filter((c) => !EXCLUES.has(c.table));

  const requetes = cibles.map((c) => {
    const cols = parTable.get(c.table) ?? new Set<string>();
    const id = cols.has("id") ? `${q("id")}::text` : "ctid::text";
    const ctx = CONTEXTE.filter((k) => cols.has(k)).map((k) => `${q(k)}::text AS ${q(k)}`);
    return sql.query(
      `SELECT ${[`${id} AS "_id"`, `${q(c.column)}::text AS "_val"`, ...ctx].join(", ")}
       FROM ${q(c.table)} WHERE ${q(c.column)}::text ~ $1 ORDER BY 1`,
      [MOTIF],
    );
  });
  const resultats = (await sql.transaction(requetes, { readOnly: true })) as unknown as Ligne[][];

  const lignes = ["| Table | id | Champ | Contexte | Extrait |", "|---|---|---|---|---|"];
  const journaux: string[] = [];
  let total = 0;
  cibles.forEach((c, i) => {
    const rows = resultats[i] ?? [];
    if (!rows.length) return;
    if (JOURNAUX.has(c.table)) {
      journaux.push(`${c.table}.${c.column} : ${rows.length} ligne(s)`);
      return;
    }
    for (const r of rows) {
      total += 1;
      const ctx = CONTEXTE.filter((k) => r[k] !== undefined && r[k] !== null).map((k) => `${k}=${String(r[k]).slice(0, 25)}`);
      lignes.push(`| ${c.table} | \`${r._id}\` | ${c.column} | ${ctx.join(", ")} | ${extrait(r._val)} |`);
    }
  });

  console.log(`# Inventaire base, prix ${new Date().toISOString().slice(0, 10)} (lecture seule)\n`);
  console.log(`${cibles.length} colonnes texte balayées, ${total} occurrence(s) hors journaux.\n`);
  console.log(total ? lignes.join("\n") : "Aucune occurrence.");
  if (journaux.length) console.log(`\nJournaux techniques (non publiés, sans extrait) : ${journaux.join(" ; ")}`);
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message.replace(/postgres(ql)?:\/\/\S+/g, "<url masquée>") : "Erreur inconnue");
  process.exit(1);
});
