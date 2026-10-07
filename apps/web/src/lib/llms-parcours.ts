/**
 * Section « Programme des parcours » de llms-full.txt (SEO-08, s17 lot C).
 *
 * Contenu PUBLIC uniquement, celui que montre déjà la page d'un parcours à un
 * visiteur : titre, objectif, durée, titre et objectif de chaque étape, et la
 * mention « première étape gratuite » (D8 ; jamais « cours gratuit »). Aucun
 * contenu payant (conseil complet, quiz, vidéos des étapes 2 et suivantes).
 * Source : `getParcoursCatalogue()` (seed, mêmes champs que la liste /parcours).
 */
import { getParcoursCatalogue, type ParcoursCatalogueItem } from "@/lib/parcours-catalogue";

const BASE_URL = "https://deviens-marrant.fr";

export function renderLlmsParcoursProgramme(
  catalogue: readonly ParcoursCatalogueItem[] = getParcoursCatalogue(),
): string[] {
  const lines: string[] = ["## Programme des parcours", ""];
  lines.push(
    "Chaque parcours suit une étape par semaine (conseil, vannes, vidéos d'humoristes, exercice et quiz). La première étape de chaque parcours est gratuite, en lecture libre et sans compte ; les suivantes font partie de Premium.",
  );
  lines.push("");
  for (const p of catalogue) {
    const url = `${BASE_URL}/parcours/${p.slug}`;
    lines.push(`### ${p.title} (${url})`);
    lines.push("");
    lines.push(`- Durée : ${p.duration}, ${p.timePerWeek}`);
    lines.push(`- Niveau : ${p.difficulty}`);
    lines.push(`- Pour qui : ${p.persona}`);
    lines.push(`- Objectif : ${p.description}`);
    lines.push(`- Étapes (${p.modules.length}) :`);
    p.modules.forEach((m, i) => {
      const gratuite = m.free ? " (première étape gratuite)" : "";
      lines.push(`  ${i + 1}. ${m.week} : ${m.title}${gratuite}. ${m.detail}`);
    });
    const premiere = p.modules.find((m) => m.free);
    if (premiere) {
      lines.push(`- Lire la première étape gratuite : ${url}#etape-1`);
    }
    lines.push("");
  }
  return lines;
}
