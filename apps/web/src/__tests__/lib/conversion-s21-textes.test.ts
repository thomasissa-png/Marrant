/**
 * Trajet de conversion s21 : textes de /abonnement et des surfaces voisines, mot pour mot
 * (`docs/copy/conversion-s21/textes-trajet-v1.md` et ses « Arbitrages de l'orchestrateur » du 19/10,
 * puis `textes-trajet-v2.md` et ses arbitrages du tour 2, correction @legal comprise),
 * choix de l'accroche selon l'origine du clic, lignes du tableau Gratuit / Premium, plafond de mots.
 */
import {
  ABONNEMENT_ACHAT,
  ABONNEMENT_HAUT,
  ATTENTE_PAIEMENT,
  BIENVENUE_PREMIUM,
  CARNET_VENTE,
  FORMULES,
  lignesTableau,
  PAS_ENCORE_SUR_SANS_COMPTE,
  PHRASE_OBJET_CONNECTE,
  TABLEAU,
} from "@/config/textes/abonnement-vente";
import { AVANTAGE_LETTRE, avantagesPremium } from "@/config/textes/avantages-premium";
import { ABONNEMENT_CTA } from "@/config/textes/cta-pages";
import { CARNET_EXTRAIT_TITRE } from "@/config/textes/carnet-extrait";
import { ANNUEL_MOIS_OFFERTS_LABEL, prixLabel, rappelFormule, REASSURANCE_UNIQUE } from "@/config/textes/offre";
import { PREMIUM_ANNUAL_EQUIVALENT_LABEL } from "@/config/premium";
import { LETTRE_HEBDO_PROMESSE } from "@/config/lettre-hebdo-promesse-temporaire";
import { origineAbonnement } from "@/lib/abonnement-accroche";

const t = (s: string) => s.replace(/\s/g, " ");
const mots = (...textes: string[]) =>
  textes
    .join(" ")
    .split(/[ \n]+/)
    .filter((m) => /[\p{L}\p{N}]/u.test(m)).length;

describe("/abonnement : textes v2 mot pour mot (étalon A inchangé)", () => {
  it("haut de page (v2 A01 : « Deviens Marrant » rendu comme le logo, texte inchangé)", () => {
    expect(ABONNEMENT_HAUT.titre).toBe("Premium ouvre tout Deviens Marrant");
    expect(`${ABONNEMENT_HAUT.titreAvantNom} ${ABONNEMENT_HAUT.titreNom}`).toBe(ABONNEMENT_HAUT.titre);
    expect(ABONNEMENT_HAUT.sousTitre).toBe("Les listes ne s’arrêtent plus à la dixième vanne, les parcours vont au bout.");
    expect(t(ABONNEMENT_HAUT.preuve)).toBe("1 500+ inscrits bossent leur humour.");
  });

  it("avantages : 3 sans la lettre, 4 avec (formulation @legal)", () => {
    expect(avantagesPremium(false)).toEqual([
      "Tout le catalogue : vannes, conseils, vidéos",
      "Les 5 parcours, de la première à la dernière étape",
      "Un nouveau carnet de répartie chaque mois",
    ]);
    expect(avantagesPremium(true)).toHaveLength(4);
    expect(AVANTAGE_LETTRE).toBe("Une lettre par e-mail chaque semaine, si tu la veux.");
  });

  it("formules, bouton, suite, « Déjà un compte ? »", () => {
    expect([FORMULES.mensuel, FORMULES.suffixeMensuel, FORMULES.annuel, FORMULES.suffixeAnnuel]).toEqual(["Mensuel", "TTC / mois", "Annuel", "TTC / an"]);
    expect(t(PREMIUM_ANNUAL_EQUIVALENT_LABEL)).toBe("soit 2,08 € par mois");
    expect(ANNUEL_MOIS_OFFERTS_LABEL).toBe("plus de 3 mois offerts");
    expect(t(ABONNEMENT_ACHAT.bouton("monthly"))).toBe("S’abonner · 2,99 €/mois");
    expect(t(ABONNEMENT_ACHAT.bouton("annual"))).toBe("S’abonner · 24,99 €/an");
    expect(ABONNEMENT_ACHAT.chargement).toBe("On t’emmène au paiement…");
    expect(ABONNEMENT_ACHAT.suiteVisiteur).toBe("Tu crées ton compte, puis tu paies par carte sur Stripe.");
    // v2 A04 : renouvellement de l'annuel (affiché seulement en annuel).
    expect(FORMULES.renouvelAnnuel).toBe("Renouvelé chaque année, sauf résiliation.");
    expect(ABONNEMENT_ACHAT.suiteConnecte).toBe("Paiement sécurisé par Stripe");
    expect(`${ABONNEMENT_ACHAT.dejaCompte} ${ABONNEMENT_ACHAT.connecteToi}`).toBe("Déjà un compte ? Connecte-toi");
    expect(REASSURANCE_UNIQUE).toBe("Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.");
  });

  it("tableau : 7 lignes sans la lettre, 8 avec, faits lus à la source (v2 A10 à A13)", () => {
    expect([TABLEAU.titre, TABLEAU.colonneGratuit, TABLEAU.colonnePremium, TABLEAU.colonneLibelle, TABLEAU.inclus, TABLEAU.non]).toEqual([
      "Gratuit et Premium, côte à côte",
      "Gratuit",
      "Premium",
      "Ce qui change",
      "inclus",
      "Non",
    ]);
    const v0 = lignesTableau({ carnet: true, carnetGratuit: 1, lettre: false });
    expect(v0.map((l) => [l.libelle, l.gratuit, l.premium])).toEqual([
      ["Tout le catalogue", "10 vannes, 3 conseils, 3 vidéos dans les listes", "Sans limite"],
      ["Parcours", "Étape 1 de chacun", "Les 5, en entier"],
      ["Carnet de répartie", "1 situation par carnet", "Toutes les situations"],
      ["Exercices des fiches", false, true],
      ["Progression et série", false, true],
      ["Favoris", false, true],
      ["Quiz et vanne du jour", true, true],
    ]);
    const v1 = lignesTableau({ carnet: true, carnetGratuit: 1, lettre: true });
    expect(v1).toHaveLength(8);
    expect(v1[3]).toMatchObject({ cle: "lettre", libelle: "Lettre par e-mail", gratuit: "1 par mois", premium: "Chaque semaine, si tu la veux" });
    // Carnet du mois absent : sa ligne disparaît.
    expect(lignesTableau({ carnet: false, carnetGratuit: 1, lettre: false }).map((l) => l.cle)).not.toContain("carnet");
  });

  it("carnet, « Pas encore sûr ? », attente (v2 A06, A16 à A18 mot pour mot), bienvenue", () => {
    expect(CARNET_EXTRAIT_TITRE).toBe("Le carnet, en vrai");
    expect(CARNET_VENTE.chapeau("d’octobre")).toBe("La situation offerte d’octobre, et la réplique qui va avec.");
    expect(CARNET_VENTE.chapeau("de novembre")).toBe("La situation offerte de novembre, et la réplique qui va avec.");
    expect(CARNET_VENTE.reste(14)).toBe("Il en reste 14, toutes ouvertes avec Premium.");
    expect(PAS_ENCORE_SUR_SANS_COMPTE).toBe("Sans compte.");
    expect([ATTENTE_PAIEMENT.titre, ATTENTE_PAIEMENT.texte]).toEqual(["Ton compte est prêt.", "On t’emmène au paiement sécurisé par Stripe…"]);
    expect(t(ATTENTE_PAIEMENT.formule("monthly"))).toBe("Premium, 2,99 €/mois.");
    // Consigne de Thomas (19/10) : la correction @legal « sauf résiliation » ne vaut que pour /register.
    expect(t(ATTENTE_PAIEMENT.formule("annual"))).toBe("Premium, 24,99 €/an, renouvelé chaque année.");
    expect(t(rappelFormule("annual", { saufResiliation: true }))).toBe("Premium, 24,99 €/an, renouvelé chaque année, sauf résiliation.");
    // @legal (tour 2) : jamais « au même prix ».
    expect(rappelFormule("annual", { saufResiliation: true })).not.toMatch(/même prix/);
    // Prix TTC partout, « TTC » écrit seulement sur les cartes de formule (consigne de Thomas).
    expect(ATTENTE_PAIEMENT.formule("annual")).not.toMatch(/TTC/);
    // Prix hors cartes de formule : sans « TTC » (v2 W04, G02, A18).
    expect([t(prixLabel("monthly")), t(prixLabel("annual"))]).toEqual(["2,99 €/mois", "24,99 €/an"]);
    expect(BIENVENUE_PREMIUM.texte).toBe("Tout est ouvert : les listes, les parcours, le carnet du mois. Reprends là où tu t’étais arrêté.");
    expect(BIENVENUE_PREMIUM.lettre).toBe("Ta lettre de chaque semaine s’active depuis ton profil.");
    expect(PHRASE_OBJET_CONNECTE).toBe("Premium ouvre tout : le catalogue, les 5 parcours, un carnet de répartie par mois.");
  });

  it("la promesse de la lettre reste fermée sur cette branche (drapeau temporaire)", () => {
    expect(LETTRE_HEBDO_PROMESSE).toBe(false);
  });
});

describe("accroche selon l'origine du clic (textes-trajet-v1 §1.1, v2 A02 : portes génériques sans accroche)", () => {
  it.each([
    ["mur-vannes", null, "Pour la suite des vannes", "listes"],
    ["mur-conseils", null, "Pour la suite des conseils", "listes"],
    ["mur-videos", null, "Pour la suite des vidéos", "listes"],
    ["exercice-vanne", null, "Pour écrire ta vanne", "exercices"],
    ["exercice-conseil", null, "Pour essayer ce conseil", "exercices"],
    ["exercice-video", null, "Pour décrypter cette vidéo", "exercices"],
    ["favoris", null, "Pour garder tes favoris", "favoris"],
    ["recherche", null, "Pour tout voir", null],
    ["blog-demo-milieu-3", "/carnet", "Pour tout le carnet", "carnet"],
    ["carnet", "/carnet", "Pour tout le carnet", "carnet"],
    ["parcours-apercu", "/parcours/repartie", "Pour la suite de Répartie", "parcours"],
    ["onboarding", "/parcours/confiance", "Pour ton parcours : Confiance", null],
    ["accueil-premium", null, null, null],
    ["blog-comment-avoir-de-la-repartie", null, null, null],
    ["glossaire", null, null, null],
    ["a-propos", null, null, null],
    ["quiz", null, null, null],
    ["onboarding", null, null, null],
    ["parcours-apercu", null, null, null],
    ["header", null, null, null],
    ["parcours-liste", null, null, null],
    ["onboarding-visiteur", null, null, null],
    [null, null, null, null],
    ["Inconnu!", null, null, null],
  ])("src=%s returnTo=%s → %s", (src, returnTo, accroche, ligne) => {
    expect(origineAbonnement(src, returnTo)).toEqual({ accroche, ligneMiseEnAvant: ligne });
  });
});

describe("plafond de mots de /abonnement (230, validé par Thomas le 19/10 ; v2 §4.1)", () => {
  // v2 : chapeau, titre, ligne du reste ; plus d'amorce, de surtitre ni de lien (le texte des deux bulles est hors compte).
  const carnet = [CARNET_EXTRAIT_TITRE, CARNET_VENTE.chapeau("d’octobre"), CARNET_VENTE.reste(14)];
  // v2 A10 : le titre du tableau est `sr-only`, il ne compte plus.
  const tableau = (lettre: boolean) => [
    TABLEAU.colonneGratuit,
    TABLEAU.colonnePremium,
    ...lignesTableau({ carnet: true, carnetGratuit: 1, lettre }).flatMap((l) =>
      [l.libelle, l.gratuit, l.premium].map((c) => (c === true ? "" : c === false ? TABLEAU.non : c)),
    ),
  ];
  const page = (lettre: boolean, annuel = false) =>
    mots(
      ...(annuel ? [FORMULES.renouvelAnnuel] : []),
      ABONNEMENT_HAUT.titre,
      ABONNEMENT_HAUT.sousTitre,
      ABONNEMENT_HAUT.preuve,
      ...avantagesPremium(lettre),
      FORMULES.mensuel,
      "2,99 € TTC / mois",
      FORMULES.annuel,
      "24,99 € TTC / an",
      PREMIUM_ANNUAL_EQUIVALENT_LABEL,
      ANNUEL_MOIS_OFFERTS_LABEL,
      ABONNEMENT_ACHAT.bouton("monthly"),
      ABONNEMENT_ACHAT.suiteVisiteur,
      REASSURANCE_UNIQUE,
      ABONNEMENT_ACHAT.dejaCompte,
      ABONNEMENT_ACHAT.connecteToi,
      ...tableau(lettre),
      ...carnet,
      ABONNEMENT_CTA.pasEncoreSur,
      ABONNEMENT_CTA.lienEtape1("repartie"),
      PAS_ENCORE_SUR_SANS_COMPTE,
      ABONNEMENT_ACHAT.bouton("monthly"),
      ABONNEMENT_ACHAT.suiteVisiteur,
      REASSURANCE_UNIQUE,
    );
  it("sans la lettre et avec, mensuel et annuel : ≤ 230 mots hors FAQ, hors accroche et hors texte de la fiche", () => {
    const [v0, v1] = [page(false), page(true)];
    expect(v0).toBeLessThan(v1);
    expect(v1).toBeLessThanOrEqual(230);
    expect(page(true, true)).toBe(v1 + 5);
    expect(page(true, true)).toBeLessThanOrEqual(230);
  });
});
