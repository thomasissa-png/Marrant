/**
 * Export des vannes candidates au widget « La vanne du jour » (s22), en
 * LECTURE SEULE : pool validé (`VALIDATED_JOKE_WHERE`) hors DATING, SOIREES,
 * COUPLE, vers docs/growth/widget-candidats-s22.md, pour la relecture tout
 * public à la main. La liste blanche finale va ensuite dans
 * src/config/widget-vanne-du-jour.ts (WIDGET_JOKE_IDS).
 *
 * Aucune écriture en base : la requête tourne dans une transaction
 * `READ ONLY` (Postgres refuse toute écriture). L'URL de base n'est jamais affichée.
 *
 * Pilote Neon serverless (HTTPS) plutôt que Prisma (TCP 5432) : passe par un
 * proxy HTTPS, comme dans les sessions cloud (s22). Même filtre que
 * `VALIDATED_JOKE_WHERE` (src/lib/ai/daily-joke-pool.ts), écrit en SQL.
 *
 * Lancement (depuis apps/web) :
 *   NEON_DATABASE_URL=<url> npx tsx scripts/widget/exporter-candidats-widget.ts
 * Derrière un proxy : ajouter HTTPS_PROXY et NODE_EXTRA_CA_CERTS.
 */
import { writeFileSync } from "fs";
import { join } from "path";
import { neon } from "@neondatabase/serverless";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import { buildJokeSlug } from "@/lib/catalogue-slug";
import { WIDGET_CATEGORIES_EXCLUES, WIDGET_ORIGIN } from "@/config/widget-vanne-du-jour";

const SORTIE = join(__dirname, "../../../../docs/growth/widget-candidats-s22.md");

type Candidat = { id: string; category: string; maturityLevel: number; content: string; punchline: string };

const uneLigne = (t: string) => t.replace(/\s+/g, " ").trim();

function markdown(candidats: Candidat[], date: string): string {
  const parCategorie = new Map<string, number>();
  for (const c of candidats) parCategorie.set(c.category, (parCategorie.get(c.category) ?? 0) + 1);
  const lignes = [
    "# Widget « La vanne du jour » : vannes candidates (s22)",
    "",
    `> Export en lecture seule du ${date} par \`apps/web/scripts/widget/exporter-candidats-widget.ts\`.`,
    "> Filtre : `isActive`, `copyVerdict = GARDER`, `comedyTechnique` non nul, catégories DATING, SOIREES, COUPLE exclues.",
    "> PAS ENCORE RELU. Relecture tout public à la main (@reviewer, regard d'un parent et d'un RH) : écarter sexe, alcool,",
    "> drogue, politique, religion, violence, insulte, rupture, deuil, santé mentale, vanne attribuée à un humoriste tiers.",
    "> Les identifiants retenus (90 minimum) vont dans `WIDGET_JOKE_IDS` (`apps/web/src/config/widget-vanne-du-jour.ts`).",
    "",
    `**${candidats.length} candidates.** Par catégorie : ${[...parCategorie].map(([k, v]) => `${k} ${v}`).join(", ") || "aucune"}.`,
    "",
  ];
  for (const c of candidats) {
    lignes.push(
      `## \`${c.id}\` (${c.category}, maturité ${c.maturityLevel})`,
      "",
      `- Amorce : ${uneLigne(c.content)}`,
      `- Chute : ${uneLigne(c.punchline)}`,
      `- Fiche : ${WIDGET_ORIGIN}/vannes/${buildJokeSlug(c)}`,
      "- Verdict relecture : [ ] garder  [ ] écarter (motif : )",
      "",
    );
  }
  return lignes.join("\n");
}

async function main() {
  const url = process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("NEON_DATABASE_URL absente : export non lancé.");
  if (process.env.HTTPS_PROXY) setGlobalDispatcher(new EnvHttpProxyAgent());
  const sql = neon(url);
  const [candidats] = (await sql.transaction(
    [
      sql`SELECT id, category::text AS category, "maturityLevel", content, punchline
          FROM "Joke"
          WHERE "isActive" = true AND "copyVerdict" = 'GARDER' AND "comedyTechnique" IS NOT NULL
            AND NOT (category::text = ANY(${[...WIDGET_CATEGORIES_EXCLUES]}))
          ORDER BY category::text, id`,
    ],
    { readOnly: true },
  )) as unknown as [Candidat[]];
  writeFileSync(SORTIE, markdown(candidats, new Date().toISOString().slice(0, 10)), "utf-8");
  console.log(`${candidats.length} candidates écrites dans docs/growth/widget-candidats-s22.md`);
}

main()
  .catch((e: unknown) => {
    // Code d'erreur seul : le message du pilote peut citer l'hôte de la base, jamais affiché.
    const err = (typeof e === "object" && e !== null ? e : {}) as { code?: unknown; name?: unknown };
    const code = String(err.code ?? err.name ?? "sans code");
    console.error(`Export interrompu (${code}) : connexion ou lecture impossible.`);
    process.exitCode = 1;
  });
