/**
 * Export des vannes candidates au widget « La vanne du jour » (s22), en
 * LECTURE SEULE : pool validé (`VALIDATED_JOKE_WHERE`) hors DATING, SOIREES,
 * COUPLE, vers docs/growth/widget-candidats-s22.md, pour la relecture tout
 * public à la main. La liste blanche finale va ensuite dans
 * src/config/widget-vanne-du-jour.ts (WIDGET_JOKE_IDS).
 *
 * Aucune écriture en base : la requête tourne dans une transaction
 * `READ ONLY` (Postgres refuse toute écriture), puis la connexion est fermée.
 * L'URL de base n'est jamais affichée.
 *
 * Lancement (depuis apps/web) :
 *   DATABASE_URL=<url> npx tsx scripts/widget/exporter-candidats-widget.ts
 */
import { writeFileSync } from "fs";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import { VALIDATED_JOKE_WHERE } from "@/lib/ai/daily-joke-pool";
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
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL absente : export non lancé.");
  const candidats = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe("SET TRANSACTION READ ONLY");
    return tx.joke.findMany({
      where: { ...VALIDATED_JOKE_WHERE, category: { notIn: [...WIDGET_CATEGORIES_EXCLUES] } },
      select: { id: true, category: true, maturityLevel: true, content: true, punchline: true },
      orderBy: [{ category: "asc" }, { id: "asc" }],
    });
  });
  writeFileSync(SORTIE, markdown(candidats, new Date().toISOString().slice(0, 10)), "utf-8");
  console.log(`${candidats.length} candidates écrites dans docs/growth/widget-candidats-s22.md`);
}

main()
  .catch((e: unknown) => {
    // Code d'erreur seul : le message Prisma peut citer l'hôte de la base, jamais affiché.
    const err = (typeof e === "object" && e !== null ? e : {}) as { code?: unknown; errorCode?: unknown };
    const code = String(err.code ?? err.errorCode ?? "sans code");
    console.error(`Export interrompu (${code}) : connexion ou lecture impossible.`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
