/**
 * Vérifie la RÈGLE FREEMIUM des pages individuelles /vannes/[slug],
 * /conseils/[slug], /videos/[slug] introduites en s11-lot5, revue s11.
 *
 * Règle retenue (alignée sur le catalogue existant, PAS une règle nouvelle) :
 *   - Pages individuelles indexables : contenu SEO visible sans login
 *     (vanne + chute + "Pourquoi ça marche" ; conseil + exemple ; vidéo + description + technique).
 *   - Le paywall existant sur les listes reste en place (10 vannes / 3 conseils / 3 vidéos).
 *   - Ce qui reste réservé côté "à toi de jouer" :
 *       - Vannes  : "À toi de jouer" (howToApply) — même barrière que le catalogue
 *                   (session requise), CTA compte gratuit + passerelle parcours Premium
 *       - Conseils: exercice concret d'application → CTA compte gratuit
 *       - Vidéos  : learnings pédagogiques + exercice → CTA compte gratuit
 *   - "Pourquoi ça marche" (comedyTechnique + techniqueExplanation) est PUBLIC :
 *     valeur SEO + preuve d'expertise pour les crawlers et visiteurs non connectés.
 *   - Aucune page pour les contenus inactifs (isActive=false) : redirection
 *     permanente vers la liste (lot S2 s14) ; slug inexistant → 404.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../../app/(dashboard)");

function readPage(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

describe("freemium — pages individuelles catalogue (s11-lot5)", () => {
  describe("vannes/[slug]/page.tsx", () => {
    const src = readPage("vannes/[slug]/page.tsx");

    it("filtre les contenus inactifs (isActive:true)", () => {
      expect(src).toMatch(/isActive:\s*true/);
      // Lot S2 (s14) : fiche retirée → 308 vers la liste (plus de 404).
      expect(src).toMatch(/permanentRedirect\("\/(vannes|conseils|videos)"\)/);
    });

    it("affiche la vanne (content) et la chute (punchline) — indexable SEO", () => {
      expect(src).toMatch(/joke\.content/);
      expect(src).toMatch(/joke\.punchline/);
    });

    it("garde le CTA Premium (parcours) pour l'application concrète", () => {
      expect(src).toMatch(/Comment la ressortir/);
      expect(src).toMatch(/parcours/);
    });

    it("expose le décryptage pédagogique 'Pourquoi ça marche' publiquement (comedyTechnique + techniqueExplanation)", () => {
      expect(src).toMatch(/comedyTechnique/);
      expect(src).toMatch(/techniqueExplanation/);
      expect(src).toMatch(/Pourquoi ça marche/);
    });

    it("gate 'À toi de jouer' (howToApply) derrière la session — côté client, page restée en ISR", () => {
      expect(src).toMatch(/howToApply/);
      expect(src).toMatch(/<HowToApplyGate howToApply=\{joke\.howToApply\}/);
      // Lire la session côté serveur dans une page ISR = DYNAMIC_SERVER_USAGE (erreur 500)
      expect(src).not.toMatch(/getServerSession/);
      expect(src).not.toMatch(/cookies\(\)|headers\(\)/);
      const gate = fs.readFileSync(
        path.join(process.cwd(), "src/components/vannes/how-to-apply-gate.tsx"),
        "utf8",
      );
      expect(gate).toMatch(/useSession\(\)/);
      expect(gate).toMatch(/status === "authenticated"/);
      expect(gate).toMatch(/Crée ton compte gratuit/);
    });

    it("ne mentionne pas l'IA dans les metadata ni le JSON-LD (règle fondateur)", () => {
      expect(src).not.toMatch(/\bIA\b/);
      expect(src).not.toMatch(/intelligence artificielle/i);
      expect(src).not.toMatch(/générée? par IA/i);
    });

    it("retourne notFound() si joke absent", () => {
      expect(src).toMatch(/notFound\(\)/);
    });
  });

  describe("conseils/[slug]/page.tsx", () => {
    const src = readPage("conseils/[slug]/page.tsx");

    it("filtre les contenus inactifs (isActive:true)", () => {
      expect(src).toMatch(/isActive:\s*true/);
      // Lot S2 (s14) : fiche retirée → 308 vers la liste (plus de 404).
      expect(src).toMatch(/permanentRedirect\("\/(vannes|conseils|videos)"\)/);
    });

    it("affiche titre, contenu théorique et exemple — indexable SEO", () => {
      expect(src).toMatch(/tip\.title/);
      expect(src).toMatch(/tip\.content/);
      expect(src).toMatch(/tip\.example/);
    });

    it("garde le CTA compte gratuit pour l'exercice complet", () => {
      expect(src).toMatch(/À toi de jouer/);
      expect(src).toMatch(/buildRegisterUrl\(\{ callbackUrl: `\/(conseils|videos)\/\$\{canonicalSlug\}`/);
    });

    it("retourne notFound() si tip absent", () => {
      expect(src).toMatch(/notFound\(\)/);
    });
  });

  describe("videos/[slug]/page.tsx", () => {
    const src = readPage("videos/[slug]/page.tsx");

    it("filtre les contenus inactifs (isActive:true)", () => {
      expect(src).toMatch(/isActive:\s*true/);
      // Lot S2 (s14) : fiche retirée → 308 vers la liste (plus de 404).
      expect(src).toMatch(/permanentRedirect\("\/(vannes|conseils|videos)"\)/);
    });

    it("affiche titre, description, technique et embed YouTube — indexable SEO", () => {
      expect(src).toMatch(/video\.title/);
      expect(src).toMatch(/video\.description/);
      expect(src).toMatch(/video\.technique/);
      expect(src).toMatch(/youtube-nocookie\.com\/embed/);
    });

    it("garde le CTA compte gratuit pour learnings + exercice", () => {
      expect(src).toMatch(/Analyse pédagogique complète/);
      expect(src).toMatch(/buildRegisterUrl\(\{ callbackUrl: `\/(conseils|videos)\/\$\{canonicalSlug\}`/);
    });

    it("retourne notFound() si vidéo absente", () => {
      expect(src).toMatch(/notFound\(\)/);
    });
  });
});
