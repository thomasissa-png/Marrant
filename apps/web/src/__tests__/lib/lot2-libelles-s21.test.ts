/**
 * Lot 2 s21 (boutons, /abonnement) : libellés validés à l'aveugle, mot pour mot,
 * et corrections objectives du §6.7 (docs/copy/lot2-boutons-abonnement-s21.md).
 */
import fs from "fs";
import path from "path";
import { ANNUEL_MOIS_OFFERTS_LABEL, VALIDATION_ETAPE } from "@/config/textes/offre";
import { libelleGratuitParcours, libelleToutOuvrir } from "@/config/textes/cta-articles-accueil";
import { ABONNEMENT_HAUT } from "@/config/textes/abonnement-vente";
import { PREMIUM_ANNUAL_EQUIVALENT_LABEL } from "@/config/premium";
import { TEXTES_PARCOURS_BLOG } from "@/config/textes/encarts-blog-s20";
import { PARCOURS_SLUGS } from "@/lib/entrees-parcours";

const SRC = path.join(__dirname, "..", "..");
const lire = (rel: string) => fs.readFileSync(path.join(SRC, rel), "utf8");
/** Espaces insécables des prix ramenés à une espace simple pour comparer le texte. */
const texte = (s: string) => s.replace(/ /g, " ");

describe("Libellés uniques (concision v5, textes-v5-a §0)", () => {
  it("« Tout ouvrir » partout pour la porte générique (mur des favoris compris), GRATUIT_P pour l'étape 1", () => {
    expect(texte(libelleToutOuvrir())).toBe("Tout ouvrir · 2,99 €/mois");
    expect(texte(VALIDATION_ETAPE.bouton)).toBe("Passer à l’étape 2 · 2,99 €/mois");
    expect(lire("components/favoris/favoris-list.tsx")).toContain("{libelleToutOuvrir()}");
    expect(libelleGratuitParcours("repartie")).toBe("Tester l’étape 1 de Répartie, gratuite");
    expect(libelleGratuitParcours("machine-a-cafe")).toBe("Tester l’étape 1 de Machine à Café, gratuite");
  });

  // Les listes passent au bloc de bas de liste (textes dans config/textes/cta-pages.ts) ;
  // concision v5 : une seule carte floutée, sans libellé visible.
  it.each([
    "components/vannes/vannes-list.tsx",
    "components/conseils/conseils-list.tsx",
    "components/videos/videos-grid.tsx",
  ])("%s : bloc MurListe, une carte verrouillée sans libellé", (rel) => {
    const src = lire(rel);
    expect(src).toContain("<MurListe ");
    expect(src).not.toContain("MUR_CARTE_LIEN");
    expect(src).toMatch(/Array\.from\(\{ length: Math\.min\(1, /);
    expect(src).not.toMatch(/>\s*Voir Premium\s*</);
    expect(src).not.toContain(">Débloquer<");
  });

  it("fiches conseil et vidéo : vrai bouton primaire (bloc BlocExercice), plus de classes faites à la main", () => {
    for (const rel of ["app/(dashboard)/conseils/[slug]/page.tsx", "app/(dashboard)/videos/[slug]/page.tsx"]) {
      const src = lire(rel);
      expect(src).toContain("<BlocExercice");
      expect(src).not.toContain("rounded-lg bg-accent-secondary-hover px-4 py-2");
    }
    expect(lire("components/premium/bloc-exercice.tsx")).toContain('buttonVariants({ variant: "primary", size: "lg" })');
  });

  it("bloc de fin d'article : GRATUIT_P par parcours, sans encart au fil du texte", () => {
    for (const slug of PARCOURS_SLUGS) {
      expect(TEXTES_PARCOURS_BLOG[slug]).not.toHaveProperty("encartMilieu");
      expect(TEXTES_PARCOURS_BLOG[slug].finBoutonEtape1).toBe(libelleGratuitParcours(slug));
    }
    expect(lire("config/textes/encarts-blog-s20.ts")).not.toContain("ENCARTS_ARTICLE_1");
  });
});

describe("Haut de /abonnement (trajet de conversion s21, étalon A)", () => {
  it("titre unique et sous-titre mot pour mot", () => {
    expect(ABONNEMENT_HAUT.titre).toBe("Premium ouvre tout Deviens Marrant");
    expect(ABONNEMENT_HAUT.sousTitre).toBe("Les listes ne s’arrêtent plus à la dixième vanne, les parcours vont au bout.");
  });

  it("carte annuelle calculée : « soit 2,08 € par mois » (arbitrage du 19/10), sans « économisés »", () => {
    expect(texte(PREMIUM_ANNUAL_EQUIVALENT_LABEL)).toBe("soit 2,08 € par mois");
    expect(ANNUEL_MOIS_OFFERTS_LABEL).toBe("plus de 3 mois offerts");
    expect(lire("components/premium/formule-cartes.tsx")).not.toContain("ANNUEL_ECONOMIE_LABEL");
  });

  it("plus de « Sans engagement, annulable à tout moment » dans la carte", () => {
    expect(lire("components/premium/formule-cartes.tsx")).not.toMatch(/>\s*Sans engagement, annulable/);
    expect(lire("components/premium/abonnement-view.tsx")).not.toContain("Sans engagement, annulable &agrave;");
  });
});

describe("Libellés existants réutilisés (E2, E3) et corrections du §6.7", () => {
  it("carnet et profil : libellés E1 et E4 du 18/10 lus dans config/textes (plus de « Commencer à », ni « Active mon accès »)", () => {
    expect(lire("components/carnet/carnet-page.tsx")).toContain("CARNET_PAYWALL.bouton");
    expect(lire("components/carnet/carnet-page.tsx")).not.toContain("Commencer à");
    expect(lire("components/carnet/carnet-page.tsx")).not.toContain("S&apos;abonner ·");
    expect(lire("components/profil/abonnement-card.tsx")).toContain("frTypo(OFFRE.bouton)");
    expect(lire("components/profil/abonnement-card.tsx")).not.toContain("Active mon accès");
  });

  it("« pour 2,99 €/mois », jamais « dès » (l'annuel revient à 2,08 €/mois)", () => {
    for (const rel of ["components/vannes/vannes-list.tsx", "components/conseils/conseils-list.tsx", "components/videos/videos-grid.tsx"]) {
      // s21 B7 : le bas de liste est le bloc MurListe (textes dans config/textes/cta-pages.ts).
      expect(lire(rel)).toContain("<MurListe ");
      expect(lire(rel)).not.toContain("dès {PREMIUM_PRICE_LABEL}");
    }
    expect(lire("app/(auth)/register/layout.tsx")).toContain("carnet, pour ${PREMIUM_PRICE_LABEL}");
  });

  it("« N … supplémentaires avec Premium », plus « avec l'abonnement »", () => {
    for (const rel of ["app/api/jokes/route.ts", "app/api/tips/route.ts", "app/api/videos/route.ts"]) {
      const src = lire(rel);
      expect(src).toContain("supplémentaires avec ${OFFRE_NOM}");
      expect(src).not.toContain("supplémentaires avec l'abonnement");
    }
  });
});
