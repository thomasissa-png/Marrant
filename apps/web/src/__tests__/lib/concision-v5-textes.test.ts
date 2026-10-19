/**
 * Concision du tunnel, textes v5 VALIDÉS à l'aveugle le 18/10/2026 (`docs/copy/cta-s21/concision/`
 * textes-v5-a.md, textes-v5-b.md, textes-v5-c.md) : pour chaque surface, le rendu des gabarits avec
 * les valeurs du jour (5 parcours, 2,99 €, 24,99 €, limites gratuites 10 / 3 / 3, 15 à 20 minutes)
 * est le texte v5 mot pour mot ; puis le budget de mots hors bouton (règles de comptage de
 * textes-v5-a §0) tient pour les surfaces principales.
 *
 * Trajet de conversion s21 (19/10, `docs/copy/conversion-s21/textes-trajet-v1.md` et ses arbitrages) :
 * les textes qu'il remplace sont figés ici à leur nouvelle valeur (porte générique « Tout ouvrir »,
 * verbe d'achat « S'abonner », en-tête court, FAQ prix, profil, retour de paiement). La page
 * /abonnement elle-même est figée dans `conversion-s21-textes.test.ts`.
 */
import { AVANTAGES_PREMIUM } from "@/config/textes/avantages-premium";
import { carnetExtraitSurtitre, CARNET_EXTRAIT_LIEN, CARNET_EXTRAIT_TITRE } from "@/config/textes/carnet-extrait";
import {
  ACCUEIL_HAUT,
  BLOC_FIN,
  CARTE_PREMIUM,
  DEMO_VANNE,
  EN_TETE,
  GRATUIT_ACCUEIL,
  LETTRE_ARTICLE,
  libelleGratuitParcours,
  libelleToutOuvrir,
} from "@/config/textes/cta-articles-accueil";
import {
  A_PROPOS_FIN,
  ABONNEMENT_CTA,
  BLOC_EXERCICE,
  CARNET_PAYWALL,
  FENETRE_PREMIUM,
  FENETRE_PRIX,
  FIN_ETAPE_1,
  GLOSSAIRE_FIN,
  LISTE_PARCOURS_CTA,
  MUR_LISTE,
  PAYWALL_PREMIUM,
  PROFIL_ABONNEMENT_OFFRE,
  QUIZ_HUMOUR_CTA,
  QUIZ_ORIENTATION_CTA,
  REGISTER_CTA,
} from "@/config/textes/cta-pages";
import { TEXTES_PARCOURS_BLOG } from "@/config/textes/encarts-blog-s20";
import { QUIZ_HUMOUR_PARCOURS } from "@/config/textes/entrees-parcours";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { ANNUEL_MOIS_OFFERTS_LABEL, REASSURANCE_UNIQUE, VALIDATION_ETAPE } from "@/config/textes/offre";
import { APERCU_LIEN, progressionVisiteurTexte, QUIZ_FIN_BOUTON, VANNES_ETAPE } from "@/config/textes/parcours";
import { TEXTES_SUCCESS } from "@/config/textes/paiement";
import { TEXTES_PRENOM } from "@/config/textes/compte";
import { FAQ_VENTE, getPremiumFaqs } from "@/lib/faqs";
import { STORYTELLING_PUBLIE } from "@/config/parcours-publication";

/** Espaces insécables ramenés à une espace simple : on compare le texte lu. */
const t = (s: string) => s.replace(/[  ]/g, " ");

/**
 * Comptage de textes-v5-a §0 : mots séparés par une espace ; les signes seuls (« » : ? · ! / ;)
 * ne comptent pas ; un montant (« 2,99 € », « 2,99 €/mois ») et « 1 500+ » = 1 mot (espace
 * insécable dans la config, donc pas de coupure).
 */
const mots = (...textes: string[]) =>
  textes
    .join(" ")
    .split(/[ \n]+/)
    .filter((m) => /[\p{L}\p{N}]/u.test(m)).length;

const REASS = "Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.";
/** Porte générique (arbitrage du 19/10) et verbe d'achat (étalon A), trajet de conversion s21. */
const OUVRIR = "Tout ouvrir · 2,99 €/mois";
const SABONNER = "S’abonner · 2,99 €/mois";
const OBJET = "Premium ouvre tout : le catalogue, les 5 parcours, un carnet de répartie par mois.";

describe("§0 conventions : REASS, OUVRIR, GRATUIT_ACCUEIL, GRATUIT_P", () => {
  it("libellés uniques et réassurance unique, mot pour mot", () => {
    expect(t(REASSURANCE_UNIQUE)).toBe(REASS);
    expect(mots(REASSURANCE_UNIQUE)).toBe(11);
    expect(t(libelleToutOuvrir())).toBe(OUVRIR);
    expect(t(libelleToutOuvrir("24,99 €/an"))).toBe("Tout ouvrir · 24,99 €/an");
    expect(GRATUIT_ACCUEIL).toBe("Tester mes premières répliques, gratuit");
    expect(libelleGratuitParcours("machine-a-cafe")).toBe("Tester l’étape 1 de Machine à Café, gratuite");
  });
});

describe("partie A : accueil, en-tête, articles", () => {
  it("§1 haut de l’accueil", () => {
    expect(ACCUEIL_HAUT.intro).toBe("Des vannes et des exercices pour répondre quand on te chambre.");
    expect(t(ACCUEIL_HAUT.preuve)).toBe("1 500+ inscrits bossent leur humour.");
    expect(ACCUEIL_HAUT.bouton).toBe("Tester mes premières répliques, gratuit");
    expect(ACCUEIL_HAUT.note).toBe("Sans compte.");
    expect([mots(ACCUEIL_HAUT.intro), mots(ACCUEIL_HAUT.preuve), mots(ACCUEIL_HAUT.note)]).toEqual([11, 5, 2]);
  });

  it("§2 en-tête", () => {
    expect(t(EN_TETE.bouton)).toBe("Premium · 2,99 €/mois");
    expect(mots(EN_TETE.bouton)).toBe(2);
    // Trajet de conversion s21 §2 : un prix sans objet n'est pas un libellé ; le nom accessible
    // commence par le texte visible (WCAG 2.5.3).
    // Repli « Premium » (textes-trajet-v1 §2) : « Premium · 2,99 € » ne tenait pas à 320, 360 et 375 px.
    expect(EN_TETE.boutonCourt).toBe("Premium");
    expect(t(EN_TETE.nomAccessible)).toBe("Premium, 2,99 € par mois : voir l’offre");
  });

  it("§3 fin d’article n°1 et déclinaisons par parcours", () => {
    const a1 = BLOC_FIN.parArticle["meilleures-blagues-droles-2026"]!;
    expect(a1).toEqual({ titre: "La vanne dans ta bouche, pas dans ton téléphone", texte: "La placer à voix haute, ça s’entraîne.", bouton: GRATUIT_ACCUEIL });
    // QA v4 m-2 : GRATUIT_ACCUEIL = article n°1 et fin d'article sans parcours connu ; Répartie connu = GRATUIT_P.
    expect(BLOC_FIN.boutonSansParcours).toBe(GRATUIT_ACCUEIL);
    expect(BLOC_FIN).not.toHaveProperty("boutonEtape1");
    expect(BLOC_FIN.noteSansCompte).toBe("Sans compte.");
    expect(t(BLOC_FIN.lienAbonnement)).toBe(OUVRIR);
    expect(mots(a1.titre!, a1.texte!, BLOC_FIN.noteSansCompte)).toBe(18);
    const attendu = {
      repartie: ["Ces techniques, rode-les avant la prochaine pique", "Quand on te chambre, tu as une seconde, et ça s’entraîne.", "Tester l’étape 1 de Répartie, gratuite", 20],
      "machine-a-cafe": ["Sois drôle au bureau sans avoir l’air d’essayer", "Des vannes courtes, et le bon moment pour les placer.", "Tester l’étape 1 de Machine à Café, gratuite", 20],
      confiance: ["Ta place dans un groupe qui rit", "Personne ne te pousse sur scène : ça se joue entre amis.", "Tester l’étape 1 de Confiance, gratuite", 20],
      storytelling: ["Une anecdote, travaillée jusqu’à ce qu’on te la redemande", "Ton histoire vraie, resserrée étape après étape.", "Tester l’étape 1 de Storytelling, gratuite", 18],
      boulot: ["Ta vanne du lundi, sans te griller", "De la salle de réunion au pot de départ.", "Tester l’étape 1 de Boulot, gratuite", 18],
    } as const;
    for (const [slug, [titre, texte, bouton, total]] of Object.entries(attendu)) {
      const d = TEXTES_PARCOURS_BLOG[slug as keyof typeof TEXTES_PARCOURS_BLOG];
      expect([d.finTitre, d.finTexte, d.finBoutonEtape1]).toEqual([titre, texte, bouton]);
      expect(mots(d.finTitre, d.finTexte, BLOC_FIN.noteSansCompte)).toBe(total);
    }
  });

  it("§4 et §5 carte Premium de l’accueil (visiteur et compte connecté)", () => {
    expect(CARTE_PREMIUM.titre).toBe("Et si ton « j’aurais dû dire » devenait un « j’ai dit » ?");
    expect(CARTE_PREMIUM.phrase).toBe("De la coloc à l’afterwork, de quoi répondre partout.");
    expect(t(CARTE_PREMIUM.bouton)).toBe(OUVRIR);
    // Compte connecté sans abonnement : paiement direct, il paie sans avoir lu l'offre.
    expect(t(CARTE_PREMIUM.boutonConnecte)).toBe(SABONNER);
    expect(t(CARTE_PREMIUM.phraseConnecte)).toBe(OBJET);
    expect(CARTE_PREMIUM.contour).toBe(GRATUIT_ACCUEIL);
    expect([mots(CARTE_PREMIUM.titre), mots(CARTE_PREMIUM.phrase)]).toEqual([10, 9]);
  });

  it("§6 encart du milieu des articles", () => {
    expect(DEMO_VANNE.surtitre).toBe("Situation offerte ce mois-ci");
    expect(DEMO_VANNE.situation("Au dîner", "Tu manges quoi ?")).toBe("Au dîner, et on te lance : « Tu manges quoi ? »");
    expect(DEMO_VANNE.question).toBe("Tu réponds quoi ?");
    expect(DEMO_VANNE.bouton).toBe("Voir la réplique");
    expect(mots(DEMO_VANNE.surtitre, DEMO_VANNE.question)).toBe(7);
  });

  it("§7 lettre en bas d’article", () => {
    expect(LETTRE_ARTICLE).toEqual({ titre: "Une vanne décryptée, chaque mois", phrase: ["Gratuite, par e-mail, avec un exercice."] });
    expect(TEXTES_LETTRE.formulaire.bouton).toBe("Envoie-moi la lettre");
    expect(mots(LETTRE_ARTICLE.titre, ...LETTRE_ARTICLE.phrase)).toBe(11);
  });
});

describe("partie B : murs, fiches, fenêtre, quiz, parcours", () => {
  it("§1 murs de liste", () => {
    expect([MUR_LISTE.vannes.titre, MUR_LISTE.vannes.limite, t(MUR_LISTE.vannes.bouton)]).toEqual([
      "Encore des vannes à ressortir",
      "Les 10 gratuites, c’est fait.",
      "Voir la suite des vannes · 2,99 €/mois",
    ]);
    expect([MUR_LISTE.conseils.titre, MUR_LISTE.conseils.limite, t(MUR_LISTE.conseils.bouton)]).toEqual([
      "Pour la prochaine fois qu’on te chambre",
      "3 conseils gratuits, c’est fait.",
      "Voir la suite des conseils · 2,99 €/mois",
    ]);
    expect([MUR_LISTE.videos.titre, MUR_LISTE.videos.limite, t(MUR_LISTE.videos.bouton)]).toEqual([
      "Tu regardes pour rire. Et pour faire rire ?",
      "3 vidéos gratuites, c’est fait.",
      "Voir la suite des vidéos · 2,99 €/mois",
    ]);
    for (const l of ["vannes", "conseils", "videos"] as const) expect(MUR_LISTE[l].contour("repartie")).toBe("Tester l’étape 1 de Répartie, gratuite");
    expect([mots(MUR_LISTE.vannes.titre, MUR_LISTE.vannes.limite), mots(MUR_LISTE.conseils.titre, MUR_LISTE.conseils.limite), mots(MUR_LISTE.videos.titre, MUR_LISTE.videos.limite)]).toEqual([10, 12, 13]);
    // La v5 annonce 9 pour /vannes, mais ses propres colonnes donnent 5 + 5 = 10 (coquille d'addition, texte inchangé).
  });

  it("§2 fiches vanne, conseil, vidéo", () => {
    const attendu = {
      vanne: ["Demain, c’est peut-être la tienne qu’on répète", "Une consigne, un exemple, et c’est à toi.", "Écrire la mienne · 2,99 €/mois", 15],
      conseil: ["Essaie-le avant le soir où il te servira", "À froid, rater est sans risque : l’exercice sert à ça.", "Essayer ce conseil · 2,99 €/mois", 18],
      video: ["L’humoriste a sa salle. Toi, une table suffit", "Les points clés, et un exercice pour t’en servir.", "Décrypter cette vidéo · 2,99 €/mois", 17],
    } as const;
    for (const [type, [titre, texte, bouton, total]] of Object.entries(attendu)) {
      const b = BLOC_EXERCICE[type as keyof typeof BLOC_EXERCICE];
      expect([b.titre, b.texte, t(b.bouton), b.contour("confiance")]).toEqual([titre, texte, bouton, "Tester l’étape 1 de Confiance, gratuite"]);
      expect(mots(b.titre, b.texte)).toBe(total);
    }
  });

  it("§3 fenêtre Premium, chaque geste (titre, prix, plein, REASS)", () => {
    expect(t(`${FENETRE_PRIX.montant} ${FENETRE_PRIX.suffixe}`)).toBe("2,99 € TTC / mois");
    const attendu: [string, string, string, string, number][] = [
      ["favori", "vanne", "Mets-la de côté", "Je m’abonne et je la garde", 6],
      ["favori", "conseil", "Garde-le sous le coude", "Je m’abonne et je le garde", 7],
      ["favori", "video", "Garde-la pour la revoir", "Je m’abonne et je la garde", 7],
      ["vote", "vanne", "Voter, et tout le reste : Premium", "Je m’abonne et je vote", 9],
      ["vote", "video", "Voter, et tout le reste : Premium", "Je m’abonne et je vote", 9],
      // La v5 compte 7 + 3 = 10 ; le titre fait 8 mots (coquille de comptage, texte inchangé).
      ["carte", "conseil", "Le reste de la liste est juste derrière", "Je m’abonne et j’ouvre toute la liste", 11],
    ];
    for (const [geste, type, titre, bouton, total] of attendu) {
      const f = FENETRE_PREMIUM[geste as "favori"][type as "vanne"];
      expect([f.titre, f.bouton]).toEqual([titre, bouton]);
      expect(Object.keys(f).sort()).toEqual(["bouton", "titre"]);
      expect(mots(f.titre, FENETRE_PRIX.montant, FENETRE_PRIX.suffixe)).toBe(total);
    }
  });

  it("§4 résultat du quiz d’humour", () => {
    expect(QUIZ_HUMOUR_PARCOURS.intro).toBe("Ton point de départ :");
    expect(QUIZ_HUMOUR_PARCOURS.titre("machine-a-cafe")).toBe("Parcours Machine à Café");
    expect(QUIZ_HUMOUR_PARCOURS.raison).toEqual({
      OBSERVATEUR: "Tu vois ce que les autres ne remarquent pas : ce parcours part de là.",
      STORYTELLER: STORYTELLING_PUBLIE
        ? "Tu tiens une table avec tes histoires : ce parcours t’apprend à couper ce qui traîne."
        : "Tu tiens une table avec une histoire : ce parcours t’apprend à la raconter jusqu’au bout.",
      ABSURDE: "Tes idées surprennent : ici, tu apprends à les placer au bon moment.",
      PUNCHLINEUR: "Tu vises le mot juste : ce parcours travaille le rythme et les silences.",
      TAQUIN: "Tu renvoies chaque balle : ce parcours t’apprend à viser sans blesser.",
    });
    expect(QUIZ_HUMOUR_CTA.sansCompte).toBe("Sans compte.");
    expect(QUIZ_HUMOUR_CTA.bouton("repartie")).toBe("Tester l’étape 1 de Répartie, gratuite");
    expect(t(QUIZ_HUMOUR_CTA.lien("repartie"))).toBe(OUVRIR);
    // Maximum : Machine à Café avec la raison la plus longue (4 + 4 + 15 + 2), budget 25.
    const max = Math.max(
      ...Object.values(QUIZ_HUMOUR_PARCOURS.raison).map((r) =>
        mots(QUIZ_HUMOUR_PARCOURS.intro, QUIZ_HUMOUR_PARCOURS.titre("machine-a-cafe"), r, QUIZ_HUMOUR_CTA.sansCompte),
      ),
    );
    expect(max).toBe(25);
  });

  it("§5 résultat du quiz d’orientation (titre, phrase, plein, REASS, liens)", () => {
    const attendu = {
      repartie: ["Ton parcours : Répartie", "Pour toi si on te chambre et que tu cherches encore quoi répondre.", 16],
      "machine-a-cafe": ["Ton parcours : Machine à Café", "Pour toi si tu veux faire rire à la pause.", 15],
      confiance: ["Ton parcours : Confiance", "Pour toi si tu aimerais rire plus souvent avec les autres.", 14],
      storytelling: ["Ton parcours : Storytelling", "Pour toi si ta chute arrive quand tout le monde est passé au dessert.", 17],
      boulot: ["Ton parcours : Boulot", "Pour toi si, le lundi à 9 h, tu prends un ton de compte rendu.", 18],
    } as const;
    for (const [slug, [titre, phrase, total]] of Object.entries(attendu)) {
      const s = slug as keyof typeof attendu;
      expect([QUIZ_ORIENTATION_CTA.titre(s), QUIZ_ORIENTATION_CTA.phrase(s)]).toEqual([titre, phrase]);
      expect(mots(titre, phrase)).toBe(total);
    }
    // Deux destinations, deux libellés : compte connecté vers Stripe, visiteur vers /abonnement.
    expect(t(QUIZ_ORIENTATION_CTA.bouton("confiance"))).toBe(SABONNER);
    expect(QUIZ_ORIENTATION_CTA.objetConnecte).toBe("Premium ouvre ce parcours et tout le reste.");
    expect(t(QUIZ_ORIENTATION_CTA.boutonVisiteur("confiance"))).toBe(OUVRIR);
    expect(QUIZ_ORIENTATION_CTA.refaire).toBe("Refaire le quiz");
    expect(QUIZ_ORIENTATION_CTA.commencer("confiance")).toBe("Tester l’étape 1 de Confiance, gratuite");
  });

  it("§6 fin de l’étape 1 (visiteur) et variante quiz en cours", () => {
    expect(FIN_ETAPE_1.titre).toBe("Bien joué !");
    expect(FIN_ETAPE_1.phrase).toBe("Premium ouvre la suite et les autres parcours d’un coup.");
    expect(t(FIN_ETAPE_1.bouton)).toBe("Passer à l’étape 2 · 2,99 €/mois");
    expect(FIN_ETAPE_1.lettre.ligne).toBe("Lettre gratuite : une vanne décryptée par mois.");
    expect(TEXTES_LETTRE.formulaire.placeholder).toBe("toi@exemple.fr");
    expect(FIN_ETAPE_1.carteSurtitre("repartie")).toBe("Étape 2 sur 4");
    expect(FIN_ETAPE_1.carteSurtitre("storytelling")).toBe("Étape 2 sur 6");
    expect(VALIDATION_ETAPE.texte).toBe("Les étapes suivantes s’ouvrent avec Premium.");
    expect(t(VALIDATION_ETAPE.bouton)).toBe("Passer à l’étape 2 · 2,99 €/mois");
    expect(mots(FIN_ETAPE_1.titre, FIN_ETAPE_1.phrase, FIN_ETAPE_1.lettre.ligne)).toBe(19);
    expect(mots(VALIDATION_ETAPE.texte)).toBe(6);
  });

  it("§7 et §8 cartes de /parcours et aperçus des étapes 2 et suivantes", () => {
    expect(LISTE_PARCOURS_CTA.bouton("boulot")).toBe("Tester l’étape 1 de Boulot, gratuite");
    expect(LISTE_PARCOURS_CTA.frontiere("boulot")).toBe("Sans compte. La suite : Premium.");
    expect(mots(LISTE_PARCOURS_CTA.frontiere("boulot"))).toBe(5);
    expect(progressionVisiteurTexte()).toBe("Étape 1 gratuite, la suite avec Premium");
    expect(VANNES_ETAPE.apercuVisiteur(5)).toBe("5 vannes dans cette étape.");
    expect(t(APERCU_LIEN)).toBe(OUVRIR);
    expect(QUIZ_FIN_BOUTON.visiteur).toBe("Refaire le quiz");
    expect(mots(progressionVisiteurTexte(), VANNES_ETAPE.apercuVisiteur(5))).toBe(12);
  });
});

describe("partie C : /abonnement, /register, carnet, profil, fins de page", () => {
  it("§1 /abonnement : ce qui reste de la v5 (le reste : conversion-s21-textes.test.ts)", () => {
    expect(ANNUEL_MOIS_OFFERTS_LABEL).toBe("plus de 3 mois offerts");
    expect(`${ABONNEMENT_CTA.pasEncoreSur} ${ABONNEMENT_CTA.lienEtape1("repartie")}`).toBe(
      "Pas encore sûr ? Tester l’étape 1 de Répartie, gratuite",
    );
    expect(t(carnetExtraitSurtitre("de novembre", 15))).toBe("Carnet de novembre · Situation 15, offerte");
    expect([CARNET_EXTRAIT_TITRE, CARNET_EXTRAIT_LIEN]).toEqual(["Le carnet, en vrai", "Lire la fiche en entier"]);
  });

  it("§2 les avantages : étalon A, 3 lignes sans la lettre (trajet de conversion s21)", () => {
    expect(AVANTAGES_PREMIUM).toEqual([
      "Tout le catalogue : vannes, conseils, vidéos",
      "Les 5 parcours, de la première à la dernière étape",
      "Un nouveau carnet de répartie chaque mois",
    ]);
    expect(mots(...AVANTAGES_PREMIUM)).toBe(23);
  });

  it("§3 FAQ de vente : 4 questions, réponse prix mensuelle et annuelle", () => {
    expect(FAQ_VENTE.map((f) => t(f.question))).toEqual([
      "Est-ce que je peux vraiment apprendre à être drôle ?",
      "Comment devenir drôle quand on est timide ou introverti ?",
      "2,99 €/mois, c’est vraiment tout ? Pas de frais cachés ?",
      "C’est quoi la différence avec juste regarder des vidéos YouTube ?",
    ]);
    // Trajet de conversion s21 §1.5 (GO de Thomas du 19/10) : + la réassurance unique, mot pour mot.
    expect(FAQ_VENTE[2].answer).toBe(`C’est le prix, point. Ça se renouvelle chaque mois, tant que tu ne résilies pas. ${REASS}`);
    expect(getPremiumFaqs(true)[2].answer).toBe(`C’est le prix, point. Ça se renouvelle chaque mois ou chaque année, tant que tu ne résilies pas. ${REASS}`);
    expect([mots(FAQ_VENTE[2].answer), mots(getPremiumFaqs(true)[2].answer)]).toEqual([26, 29]);
  });

  it("§4 /register", () => {
    expect(REGISTER_CTA.titre).toBe("Ton compte");
    expect(t(REGISTER_CTA.planReminder("monthly"))).toBe("Premium, 2,99 € TTC par mois.");
    expect(t(REGISTER_CTA.planReminder("annual"))).toBe("Premium, 24,99 € TTC par an.");
    // Trajet de conversion s21 §4 : depuis la fin d'étape 1, l'étape 2 promise est redite.
    expect(t(REGISTER_CTA.planReminder("monthly", "repartie"))).toBe(
      "Premium, 2,99 € TTC par mois. Après le paiement, l’étape 2 de Répartie s’ouvre.",
    );
    expect(t(REGISTER_CTA.planReminder("monthly", null))).toBe("Premium, 2,99 € TTC par mois.");
    expect(REGISTER_CTA.bouton).toBe("Créer mon compte et passer au paiement");
    expect(REGISTER_CTA.google).toBe("Continuer avec Google");
    expect(`${REGISTER_CTA.dejaCompte} ${REGISTER_CTA.connecteToi}`).toBe("Déjà un compte ? Connecte-toi");
    expect(REGISTER_CTA.lienEtape1("repartie")).toBe("Tester l’étape 1 de Répartie, gratuite");
  });

  it("§5 page de retour après paiement", () => {
    expect([TEXTES_SUCCESS.pretTitre, TEXTES_SUCCESS.pretTexte, TEXTES_SUCCESS.pretBouton]).toEqual([
      "Paiement reçu !",
      "Merci. Ton accès s’active…",
      "Continuer",
    ]);
  });

  it("§6 /carnet, paywall", () => {
    expect(t(CARNET_PAYWALL.titre(14))).toBe("Ça, c’était la réplique offerte. Il en reste 14.");
    expect(CARNET_PAYWALL.paragraphe).toBe("Un nouveau carnet arrive chaque mois.");
    expect(t(CARNET_PAYWALL.bouton)).toBe("Voir tout le carnet · 2,99 €/mois");
    expect(CARNET_PAYWALL.listeTitre).toBe("Au programme");
    expect(CARNET_PAYWALL.listeReste(11)).toBe("Et 11 autres répliques");
    expect(mots(CARNET_PAYWALL.titre(14), CARNET_PAYWALL.paragraphe, CARNET_PAYWALL.listeTitre, CARNET_PAYWALL.listeReste(11))).toBe(21);
  });

  it("§7 /profil, compte sans abonnement ; carte « Ton prénom »", () => {
    expect(PROFIL_ABONNEMENT_OFFRE.phrase).toBe(OBJET);
    expect(t(PROFIL_ABONNEMENT_OFFRE.bouton)).toBe(SABONNER);
    expect(mots(PROFIL_ABONNEMENT_OFFRE.phrase)).toBe(14);
    expect([TEXTES_PRENOM.titre, TEXTES_PRENOM.bouton, TEXTES_PRENOM.succes, TEXTES_PRENOM.erreur]).toEqual([
      "Ton prénom",
      "Enregistrer",
      "C’est noté.",
      "Ça n’a pas marché, réessaie.",
    ]);
  });

  it("§8 fins de page /glossaire et /a-propos", () => {
    expect([GLOSSAIRE_FIN.titre, GLOSSAIRE_FIN.paragraphe]).toEqual([
      "Le vocabulaire, c’est fait. Reste à s’en servir.",
      "Placer un callback au dîner de samedi, c’est autre chose : ça se travaille.",
    ]);
    expect([A_PROPOS_FIN.paragraphe, t(A_PROPOS_FIN.preuve)]).toEqual(["Observer d’abord, roder ensuite : voilà le programme.", "Déjà 1 500+ inscrits."]);
    for (const f of [GLOSSAIRE_FIN, A_PROPOS_FIN]) {
      expect(t(f.bouton)).toBe(OUVRIR);
      expect(f.lienEtape1).toBe("Tester l’étape 1 de Répartie, gratuite");
    }
    expect(mots(GLOSSAIRE_FIN.titre, GLOSSAIRE_FIN.paragraphe)).toBe(21);
    expect(mots(A_PROPOS_FIN.paragraphe, A_PROPOS_FIN.preuve)).toBe(10);
  });

  it("§9 paywall : titre, texte de valeur, plein", () => {
    expect(PAYWALL_PREMIUM.titre).toBe("Le reste, avec Premium");
    expect(PAYWALL_PREMIUM.valeur).toBe("Le carnet du mois, tes favoris, tout le catalogue.");
    // Paiement direct (trajet de conversion s21 §2.1) : verbe d'achat.
    expect(t(PAYWALL_PREMIUM.bouton)).toBe(SABONNER);
  });
});

describe("budget de mots hors bouton (≤ budget de la v5), surfaces principales", () => {
  const cas: [string, number, number][] = [
    ["haut de l’accueil", mots(ACCUEIL_HAUT.intro, ACCUEIL_HAUT.preuve, ACCUEIL_HAUT.note), 40],
    ["carte Premium de l’accueil (REASS comprise)", mots(CARTE_PREMIUM.titre, CARTE_PREMIUM.phrase, REASSURANCE_UNIQUE), 40],
    ...(Object.entries(TEXTES_PARCOURS_BLOG).map(([slug, d]) => [`fin d’article, ${slug}`, mots(d.finTitre, d.finTexte, BLOC_FIN.noteSansCompte), 25]) as [string, number, number][]),
    ["fin d’article n°1", mots(BLOC_FIN.parArticle["meilleures-blagues-droles-2026"]!.titre!, BLOC_FIN.parArticle["meilleures-blagues-droles-2026"]!.texte!, BLOC_FIN.noteSansCompte), 25],
    ["encart du milieu d’article", mots(DEMO_VANNE.surtitre, DEMO_VANNE.question), 25],
    ["lettre en bas d’article", mots(LETTRE_ARTICLE.titre, ...LETTRE_ARTICLE.phrase), 25],
    ["quiz d’humour (maximum)", mots(QUIZ_HUMOUR_PARCOURS.intro, QUIZ_HUMOUR_PARCOURS.titre("machine-a-cafe"), QUIZ_HUMOUR_PARCOURS.raison.STORYTELLER, QUIZ_HUMOUR_CTA.sansCompte), 25],
    ["fin de l’étape 1", mots(FIN_ETAPE_1.titre, FIN_ETAPE_1.phrase, FIN_ETAPE_1.lettre.ligne), 25],
    ["aperçu d’une étape 2+", mots(progressionVisiteurTexte(), VANNES_ETAPE.apercuVisiteur(5)), 25],
    ["paywall du carnet", mots(CARNET_PAYWALL.titre(29), CARNET_PAYWALL.paragraphe, CARNET_PAYWALL.listeTitre, CARNET_PAYWALL.listeReste(26)), 25],
    ["profil", mots(PROFIL_ABONNEMENT_OFFRE.phrase), 25],
    ["/glossaire", mots(GLOSSAIRE_FIN.titre, GLOSSAIRE_FIN.paragraphe), 25],
    ["/a-propos", mots(A_PROPOS_FIN.paragraphe, A_PROPOS_FIN.preuve), 25],
    [
      "/register",
      mots(REGISTER_CTA.titre, REGISTER_CTA.planReminder("monthly"), REGISTER_CTA.dejaCompte, REGISTER_CTA.connecteToi, REGISTER_CTA.lienEtape1("machine-a-cafe")),
      25,
    ],
  ];
  it.each(cas)("%s : %i mots ≤ %i", (_surface, n, budget) => {
    expect(n).toBeLessThanOrEqual(budget);
  });

  // Budget de /abonnement : trajet de conversion s21, plafond 230 mots (conversion-s21-textes.test.ts).
});
