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
import { ENCARTS_ARTICLE_1, TEXTES_PARCOURS_BLOG } from "@/config/textes/encarts-blog-s20";
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
    "app/(dashboard)/vannes/[slug]/page.tsx",
    "app/(dashboard)/conseils/[slug]/page.tsx",
    "app/(dashboard)/videos/[slug]/page.tsx",
    "components/vannes/vannes-list.tsx",
    "components/conseils/conseils-list.tsx",
    "components/videos/videos-grid.tsx",
    "components/favoris/favoris-list.tsx",
  ])("%s : bouton du mur au libellé E4, plus d'ancien libellé", (rel) => {
    const src = lire(rel);
    expect(src).toContain("{MUR_PREMIUM_BOUTON}");
    expect(src).not.toMatch(/>\s*Voir Premium\s*</);
    expect(src).not.toContain("Voir l&apos;offre");
    expect(src).not.toContain("couvrir l&apos;offre Premium");
    expect(src).not.toContain(">Débloquer<");
  });

  it("fiches conseil et vidéo : vrai bouton primaire de 44 px, plus de classes faites à la main", () => {
    for (const rel of ["app/(dashboard)/conseils/[slug]/page.tsx", "app/(dashboard)/videos/[slug]/page.tsx"]) {
      const src = lire(rel);
      expect(src).toContain('buttonVariants({ variant: "primary" }), "h-auto min-h-11');
      expect(src).not.toContain("rounded-lg bg-accent-secondary-hover px-4 py-2");
    }
  });
});

describe("E5, l'étape 1 gratuite nommée (duel 2, tour 1, 3/3)", () => {
  it("« Lire la première étape gratuite de {parcours} »", () => {
    expect(etape1GratuiteBouton("repartie")).toBe("Lire la première étape gratuite de Répartie");
    expect(etape1GratuiteBouton("machine-a-cafe")).toBe("Lire la première étape gratuite de Machine à Café");
    expect(etape1GratuiteBouton("boulot")).toBe("Lire la première étape gratuite de Boulot");
  });

  it("tous les boutons des encarts d'articles et du bloc de fin", () => {
    for (const slug of PARCOURS_SLUGS) {
      expect(TEXTES_PARCOURS_BLOG[slug].encartMilieu.bouton).toBe(etape1GratuiteBouton(slug));
      expect(TEXTES_PARCOURS_BLOG[slug].finBoutonEtape1).toBe(etape1GratuiteBouton(slug));
    }
    expect(ENCARTS_ARTICLE_1.repartie.bouton).toBe("Lire la première étape gratuite de Répartie");
    expect(ENCARTS_ARTICLE_1.boulot.bouton).toBe("Lire la première étape gratuite de Boulot");
    expect(lire("config/textes/encarts-blog-s20.ts")).not.toContain('"Étape 1 gratuite :');
  });
});

describe("Haut de /abonnement (tour 3, 3/3 au niveau)", () => {
  it("surtitre et sous-titre visiteur mot pour mot", () => {
    expect(ABONNEMENT_HAUT_VISITEUR.surtitre).toBe("C'est pour toi si tu restes muet quand on te chambre.");
    expect(ABONNEMENT_HAUT_VISITEUR.sousTitre).toBe(
      "5 parcours pour t'entraîner, une étape par semaine, 15 à 20 minutes selon le parcours. La première étape de chacun reste en lecture libre.",
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
  it("carnet : « Commencer à {prix} » ; profil : « Active mon accès · {prix} »", () => {
    expect(lire("components/carnet/carnet-page.tsx")).toContain("Commencer à {PREMIUM_PRICE_LABEL}");
    expect(lire("components/carnet/carnet-page.tsx")).not.toContain("S&apos;abonner ·");
    expect(lire("components/profil/abonnement-card.tsx")).toContain("`Active mon accès · ${PREMIUM_PRICE_LABEL}`");
  });

  it("« pour 2,99 €/mois », jamais « dès » (l'annuel revient à 2,08 €/mois)", () => {
    for (const rel of ["components/vannes/vannes-list.tsx", "components/conseils/conseils-list.tsx", "components/videos/videos-grid.tsx"]) {
      expect(lire(rel)).toContain("Accède à tout le catalogue pour {PREMIUM_PRICE_LABEL}");
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
