/**
 * Lot 2 s21 (boutons, /abonnement) : libellés validés à l'aveugle, mot pour mot,
 * et corrections objectives du §6.7 (docs/copy/lot2-boutons-abonnement-s21.md).
 */
import fs from "fs";
import path from "path";
import {
  ABONNEMENT_HAUT_VISITEUR,
  ANNUEL_LIGNE_MENSUEL,
  MUR_PREMIUM_BOUTON,
  MUR_PREMIUM_LIEN,
  VALIDATION_ETAPE,
} from "@/config/textes/offre";
import { etape1GratuiteBouton } from "@/config/textes/entrees-parcours";
import { TEXTES_PARCOURS_BLOG } from "@/config/textes/encarts-blog-s20";
import { PARCOURS_SLUGS } from "@/lib/entrees-parcours";

const SRC = path.join(__dirname, "..", "..");
const lire = (rel: string) => fs.readFileSync(path.join(SRC, rel), "utf8");
/** Espaces insécables des prix ramenés à une espace simple pour comparer le texte. */
const texte = (s: string) => s.replace(/ /g, " ");

describe("E4, le mur (duel 1, tour 1, 3/3)", () => {
  it("forme longue sur les boutons, forme courte sur les liens et les cartes", () => {
    expect(MUR_PREMIUM_BOUTON).toBe("Voir ce que contient Premium");
    expect(MUR_PREMIUM_LIEN).toBe("Voir Premium");
    expect(VALIDATION_ETAPE.bouton).toBe("Voir ce que contient Premium");
  });

  it.each([
    "components/favoris/favoris-list.tsx",
  ])("%s : bouton du mur au libellé E4, plus d'ancien libellé", (rel) => {
    const src = lire(rel);
    expect(src).toContain("{MUR_PREMIUM_BOUTON}");
    expect(src).not.toMatch(/>\s*Voir Premium\s*</);
    expect(src).not.toContain("Voir l&apos;offre");
    expect(src).not.toContain("couvrir l&apos;offre Premium");
    expect(src).not.toContain(">Débloquer<");
  });

  // s21 B7 : les listes passent au bloc de bas de liste (textes dans config/textes/cta-pages.ts).
  it.each([
    "components/vannes/vannes-list.tsx",
    "components/conseils/conseils-list.tsx",
    "components/videos/videos-grid.tsx",
  ])("%s : bloc MurListe et lien court des cartes verrouillées", (rel) => {
    const src = lire(rel);
    expect(src).toContain("<MurListe ");
    expect(src).toContain("{MUR_CARTE_LIEN}");
    expect(src).not.toMatch(/>\s*Voir Premium\s*</);
    expect(src).not.toContain(">Débloquer<");
  });

  it("fiches conseil et vidéo : vrai bouton primaire (s21 : bloc BlocExercice), plus de classes faites à la main", () => {
    for (const rel of ["app/(dashboard)/conseils/[slug]/page.tsx", "app/(dashboard)/videos/[slug]/page.tsx"]) {
      const src = lire(rel);
      expect(src).toContain("<BlocExercice");
      expect(src).not.toContain("rounded-lg bg-accent-secondary-hover px-4 py-2");
    }
    expect(lire("components/premium/bloc-exercice.tsx")).toContain('buttonVariants({ variant: "primary", size: "lg" })');
  });
});

describe("E5, l'étape 1 gratuite nommée (duel 2, tour 1, 3/3)", () => {
  it("« Lire la première étape gratuite de {parcours} »", () => {
    expect(etape1GratuiteBouton("repartie")).toBe("Lire la première étape gratuite de Répartie");
    expect(etape1GratuiteBouton("machine-a-cafe")).toBe("Lire la première étape gratuite de Machine à Café");
    expect(etape1GratuiteBouton("boulot")).toBe("Lire la première étape gratuite de Boulot");
  });

  // Fusion s21 : l'ancien encart au fil du texte (encartMilieu, ENCARTS_ARTICLE_1) est
  // supprimé, remplacé par DemoVanne (partie A) ; reste le bouton du bloc de fin.
  it("tous les boutons du bloc de fin d'article", () => {
    for (const slug of PARCOURS_SLUGS) {
      expect(TEXTES_PARCOURS_BLOG[slug]).not.toHaveProperty("encartMilieu");
      expect(TEXTES_PARCOURS_BLOG[slug].finBoutonEtape1).toBe(etape1GratuiteBouton(slug));
    }
    expect(lire("config/textes/encarts-blog-s20.ts")).not.toContain("ENCARTS_ARTICLE_1");
    expect(lire("config/textes/encarts-blog-s20.ts")).not.toContain('"Étape 1 gratuite :');
  });
});

describe("Haut de /abonnement (tour 3, 3/3 au niveau)", () => {
  it("surtitre, H1 et sous-titre visiteur mot pour mot", () => {
    expect(ABONNEMENT_HAUT_VISITEUR.titre).toBe("Ta réplique pendant la soirée, pas dans le bus du retour");
    expect(ABONNEMENT_HAUT_VISITEUR.surtitre).toBe("C'est pour toi si tu restes muet quand on te chambre.");
    expect(ABONNEMENT_HAUT_VISITEUR.sousTitre).toBe(
      "5 parcours pour t'entraîner, une étape par semaine conseillée, 15 à 20 minutes selon le parcours. La première étape de chacun reste en lecture libre.",
    );
  });

  it("ligne annuelle de l'état mensuel, calculée, sans « plus de 3 mois offerts »", () => {
    expect(texte(ANNUEL_LIGNE_MENSUEL)).toBe("Ou 24,99 €/an, soit 2,08 € par mois et 10,89 € économisés par an.");
    expect(ANNUEL_LIGNE_MENSUEL).not.toContain("mois offerts");
  });

  it("plus de « Sans engagement, annulable à tout moment » dans la carte", () => {
    expect(lire("components/premium/plan-selector.tsx")).not.toMatch(/>\s*Sans engagement, annulable/);
    expect(lire("components/premium/abonnement-view.tsx")).not.toContain("Sans engagement, annulable &agrave;");
  });
});

describe("Libellés existants réutilisés (E2, E3) et corrections du §6.7", () => {
  it("carnet et profil : libellés E1 et E4 du 18/10 lus dans config/textes (plus de « Commencer à », ni « Active mon accès »)", () => {
    expect(lire("components/carnet/carnet-page.tsx")).toContain("CARNET_PAYWALL.bouton(restantes)");
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
