/**
 * @jest-environment node
 *
 * s21, blocs d'appel partie A : « sans engagement » est faux pour la formule annuelle.
 * Il disparaît des textes client de la partie A (articles, accueil, lettre, carnet, profil,
 * llms.txt), remplacé par « résiliable en ligne ». À la fusion A + B (s21) : aussi le mur
 * d'étape, l'aperçu verrouillé des parcours et la description de /abonnement. Seule
 * exception : les CGU (description juridique de la formule mensuelle).
 */
import fs from "fs";
import path from "path";

const SRC = path.join(__dirname, "..", "..");
const lire = (fichier: string) => fs.readFileSync(path.join(SRC, fichier), "utf8");

const PARTIE_A = [
  "config/blog-cta.ts",
  "config/textes/encarts-blog-s20.ts",
  "config/textes/cta-articles-accueil.ts",
  "lib/llms-content.ts",
  "lib/blog-articles.ts",
  "data/lettre/numeros.json",
  "components/carnet/carnet-page.tsx",
  "components/home/hero-section.tsx",
  "components/home/premium-cta.tsx",
  "components/profil/abonnement-card.tsx",
  "app/(dashboard)/a-propos/page.tsx",
  // Fusion A + B (s21)
  "config/textes/offre.ts",
  "config/textes/parcours.ts",
  "app/(dashboard)/abonnement/layout.tsx",
];

describe("« sans engagement » retiré (partie A)", () => {
  it.each(PARTIE_A)("%s", (fichier) => {
    expect(lire(fichier)).not.toMatch(/sans engagement/i);
  });

  it("numéros de la lettre : « résiliable en ligne » dans les 6 mentions de Premium", () => {
    const numeros = JSON.parse(lire("data/lettre/numeros.json")) as { numeros?: { corps: string }[] } | { corps: string }[];
    const liste = Array.isArray(numeros) ? numeros : (numeros.numeros ?? []);
    expect(liste).toHaveLength(6);
    for (const n of liste) expect(n.corps).toContain("résiliable en ligne");
  });

  it("agent marketing : la consigne interdit « sans engagement »", () => {
    const consigne = lire("lib/ai/agents/marketing-agent.ts");
    expect(consigne).toContain("résiliable en ligne. N'écris JAMAIS « sans engagement »");
    expect(consigne).not.toContain("2,99 €/mois, sans engagement");
  });
});
