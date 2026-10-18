/**
 * Textes finaux VALIDÉS des blocs d'appel s21 (18/10/2026) : gabarits et variables.
 * Source : docs/copy/cta-s21/textes-finaux-valides.md (B3 et B12 du tour 17, B10 du tour 21). Les rendus attendus sont recopiés
 * mot pour mot du fichier (valeurs d'aujourd'hui : 5 parcours, 2,99 €, 24,99 €).
 */
import fs from "fs";
import path from "path";
import { PARCOURS_ETAPES } from "@/config/parcours-etapes";
import { PARCOURS_COUNT, PREMIUM_PARCOURS } from "@/config/premium";
import { PARCOURS_SEED_JSON } from "@/lib/parcours-seed";
import {
  ABONNEMENT_CTA,
  ABONNEMENT_HAUT_PAR_PARCOURS,
  BLOC_EXERCICE,
  FENETRE_PREMIUM,
  fenetreLienEtape1,
  LISTE_PARCOURS_CTA,
  phraseProfil,
  QUIZ_HUMOUR_CTA,
  QUIZ_ORIENTATION_CTA,
} from "@/config/textes/cta-pages";
import type { ParcoursSlug } from "@/lib/entrees-parcours";
import { QUIZ_PROFILES } from "@/components/quiz/quiz-data";

const nb = (t: string) => t.replace(/ /g, " ");
const GARANTIE = "Tu résilies depuis ton profil quand tu veux, et tu as 14 jours pour te faire rembourser ton premier paiement.";
const PRIX_A = "2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois).";

describe("parcours-etapes.ts : copie fidèle du seed publié", () => {
  it("titres d'étapes (moduleTitle) et ligne de carte identiques à docs/content", () => {
    for (const seed of PARCOURS_SEED_JSON) {
      const copie = PARCOURS_ETAPES[seed.slug as ParcoursSlug];
      expect(copie.titres).toEqual(seed.steps.map((s) => s.moduleTitle));
      expect(copie.personaTagline).toBe(seed.personaTagline);
    }
  });
  it("nombre d'étapes = weeks de PREMIUM_PARCOURS", () => {
    for (const p of PREMIUM_PARCOURS) expect(PARCOURS_ETAPES[p.slug as ParcoursSlug].titres).toHaveLength(p.weeks);
  });
});

describe("B12 : ligne Premium selon le profil", () => {
  const rendu = (profil: Parameters<typeof phraseProfil>[0], slug: ParcoursSlug) => {
    const l = QUIZ_HUMOUR_CTA.premium(profil, slug, true);
    return nb([l.profil, l.suite].filter(Boolean).join(" "));
  };
  it("les cinq rendus validés, mot pour mot", () => {
    expect(PARCOURS_COUNT).toBe(5);
    expect(rendu("OBSERVATEUR", "confiance")).toBe(
      `Ce que tu remarques et que personne ne voit a son étape : « L'œil de l'observateur », la 3e de Confiance. Premium ouvre d'un coup les 6 étapes (20 minutes chacune) et les 4 autres parcours : ${PRIX_A} ${GARANTIE}`,
    );
    expect(rendu("STORYTELLER", "storytelling")).toBe(
      `Les autres attendent la suite, et ta chute a son étape : « Une chute qui se lit de deux façons », la 4e de Storytelling. Premium ouvre d'un coup les 6 étapes (20 minutes chacune) et les 4 autres parcours : ${PRIX_A} ${GARANTIE}`,
    );
    expect(rendu("ABSURDE", "machine-a-cafe")).toBe(
      `Tes idées, personne ne les voit venir. Le moment de les lancer a son étape : « Sentir le bon moment », la 2e de Machine à Café, où tu écoutes un groupe comme un morceau pour repérer où il y a de la place pour toi. Premium ouvre d'un coup les 3 étapes (15 minutes chacune) et les 4 autres parcours : ${PRIX_A} ${GARANTIE}`,
    );
    expect(rendu("PUNCHLINEUR", "repartie")).toBe(
      `La seconde où la table se tait avant de rire a son étape : « Le rythme et les silences », la 2e de Répartie. Premium ouvre d'un coup les 4 étapes (20 minutes chacune) et les 4 autres parcours : ${PRIX_A} ${GARANTIE}`,
    );
    expect(rendu("TAQUIN", "repartie")).toBe(
      `Les balles que tu renvoies ont leur étape : « Retourner les piques avec le sourire », la 3e de Répartie. Premium ouvre d'un coup les 4 étapes (20 minutes chacune) et les 4 autres parcours : ${PRIX_A} ${GARANTIE}`,
    );
  });
  it("sources des phrases de profil : si la donnée change, ce test casse et la phrase se relit", () => {
    // L'Absurde : la fin reprend le texte public de l'étape 2 de Machine à Café.
    const mac = PARCOURS_SEED_JSON.find((p) => p.slug === "machine-a-cafe")!;
    expect(mac.steps[1].moduleDetail).toContain("Écouter un groupe comme on écoute un morceau");
    expect(mac.steps[1].moduleDetail).toContain("où il y a de la place pour toi");
    // Punchlineur et L'Absurde : le début reprend la description publique du profil.
    expect(QUIZ_PROFILES.PUNCHLINEUR.description).toMatch(/la table se tait/);
    expect(QUIZ_PROFILES.ABSURDE.description).toContain("Les autres ne savent jamais où tu vas");
  });
  it("repli sans phrase de profil (Storyteller conseillé vers Machine à Café) et sans annuel", () => {
    expect(phraseProfil("STORYTELLER", "machine-a-cafe")).toBeNull();
    expect(rendu("STORYTELLER", "machine-a-cafe")).toBe(
      `Premium ouvre d'un coup les 3 étapes de Machine à Café (15 minutes chacune) et les 4 autres parcours : ${PRIX_A} ${GARANTIE}`,
    );
    expect(nb(QUIZ_HUMOUR_CTA.premium("TAQUIN", "repartie", false).suite)).toBe(
      `Premium ouvre d'un coup les 4 étapes (20 minutes chacune) et les 4 autres parcours : 2,99 € TTC par mois. ${GARANTIE}`,
    );
  });
  it("phrase d'étape 1, bouton et lien OUVRIR_P", () => {
    expect(QUIZ_HUMOUR_CTA.phrase("confiance")).toBe(
      "Ta force, tu viens de la lire. Reste à t'en servir : l'étape 1 de Confiance, « Redécouvrir ce qui te fait rire », se lit tout de suite, sans compte. Dedans, un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz.",
    );
    expect(QUIZ_HUMOUR_CTA.bouton("machine-a-cafe")).toBe("Commencer mon parcours Machine à Café, étape 1 gratuite");
    expect(nb(QUIZ_HUMOUR_CTA.lien("storytelling"))).toBe("Ouvrir Storytelling en entier · 2,99 €/mois");
  });
});

describe("B13 : trois paragraphes par parcours", () => {
  const p = (slug: ParcoursSlug) => QUIZ_ORIENTATION_CTA.paragraphes(slug).map(nb);
  it("programme lu dans la donnée, « Ensuite » ou « Ensuite, entre autres »", () => {
    expect(p("repartie")[0]).toBe(
      "Ton quiz te conseille Répartie : pour toi si on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre. L'étape 1 est offerte. Ensuite : le rythme et les silences, retourner les piques avec le sourire, improviser sur l'inattendu.",
    );
    expect(p("machine-a-cafe")[0]).toContain("Ensuite : sentir le bon moment, raconter une anecdote qu'on écoute jusqu'au bout.");
    expect(p("machine-a-cafe")[1]).toBe(
      "Avec Premium, les étapes 2 et 3 sont ouvertes tout de suite, 15 minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les 5 parcours, pas seulement Machine à Café.",
    );
    expect(p("confiance")[0]).toContain("Ensuite, entre autres : rire de toi sans te rabaisser, l'œil de l'observateur, être à l'aise en groupe.");
    expect(p("storytelling")[0]).toContain(
      "Ensuite, entre autres : des personnages qu'on entend, une chute qui se lit de deux façons, un détour qui ne perd personne.",
    );
    expect(p("boulot")[0]).toBe(
      "Ton quiz te conseille Boulot : pour toi si tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu. L'étape 1 est offerte. Ensuite, entre autres : un PS drôle sans finir en capture d'écran, le couloir en quinze secondes, un toast de soixante secondes.",
    );
    expect(p("boulot")[2]).toBe("Ton compte est prêt : il ne reste que le paiement.");
    expect(QUIZ_ORIENTATION_CTA.paragraphes("boulot", false)).toHaveLength(2);
    expect(nb(QUIZ_ORIENTATION_CTA.bouton("repartie"))).toBe("Ouvrir Répartie en entier · 2,99 €/mois");
  });
});

describe("B10, B11, B15, B16", () => {
  it("B10 : [S15] validé (tour 21), mot pour mot", () => {
    expect(BLOC_EXERCICE.video.texte).toBe(
      "Et ça s'entraîne, à petites doses. Avec Premium, l'abonnement du site, tu as les points clés de cette vidéo et son exercice : de quoi la revoir pour faire rire, plus seulement pour rire. Les 5 parcours s'ouvrent aussi en entier, de la coloc à l'afterwork : 15 à 20 minutes par semaine, un défi à chaque étape.",
    );
  });
  it("B11 : chaque [S27] tient en 90 caractères, [S28] nomme le parcours", () => {
    for (const geste of Object.values(FENETRE_PREMIUM))
      for (const t of Object.values(geste)) expect(t.avantage.length).toBeLessThanOrEqual(90);
    expect(fenetreLienEtape1("repartie")).toBe("Ou lire d'abord l'étape 1 du parcours Répartie (gratuite, sans compte)");
    expect(FENETRE_PREMIUM.favori.vanne.intro).toBe(
      "Deux étapes : ton compte, puis le paiement sécurisé. Et si tu fermes, la vanne reste là.",
    );
  });
  it("B15 : bouton et ligne frontière", () => {
    expect(LISTE_PARCOURS_CTA.bouton("boulot")).toBe("Commencer Boulot, étape 1 gratuite");
    expect(LISTE_PARCOURS_CTA.frontiere("machine-a-cafe")).toBe(
      "Sans compte ni abonnement, quiz compris. Les étapes 2 et 3 sont dans Premium.",
    );
  });
  it("B16 : le bouton suit la formule et nomme le parcours d'origine", () => {
    expect(nb(ABONNEMENT_CTA.bouton("monthly"))).toBe("Ouvrir les 5 parcours · 2,99 €/mois");
    expect(nb(ABONNEMENT_CTA.bouton("annual"))).toBe("Ouvrir les 5 parcours · 24,99 €/an");
    expect(nb(ABONNEMENT_CTA.bouton("monthly", "confiance"))).toBe("Ouvrir Confiance et les 4 autres · 2,99 €/mois");
    expect(nb(ABONNEMENT_CTA.bouton("annual", "machine-a-cafe"))).toBe("Ouvrir Machine à Café et les 4 autres · 24,99 €/an");
    expect(ABONNEMENT_HAUT_PAR_PARCOURS.confiance.titre).toBe("Retrouver le rire à table, 20 minutes par semaine, sans te forcer");
    expect(ABONNEMENT_HAUT_PAR_PARCOURS.storytelling.titre).toBe("Ton histoire jusqu'à la chute, avant qu'on te dise « et donc ? »");
  });
});

describe("Grep de fin : anciennes chaînes absentes de src/ (hors tests)", () => {
  const INTERDITES = [
    "si tu vois loin", "Débloquer", "s'ouvrent ensuite",
    "Essayer gratuitement l'étape 1 du parcours",
    // « Choisis ton parcours » : reste un lien dans le corps d'un article (lib/blog-articles.ts), hors blocs d'appel. "Voir les 5 parcours en entier avec Premium",
    "Je m'abonne et je garde mes favoris", "Voter sur les nouveautés, c'est dans Premium", "démontée, comme celle-ci",
    "au rythme conseillé d'une par semaine", "Retrouver ta légèreté, 20 minutes", "Dedans : un conseil",
    "Une seule par mois, mais", "Tu reçois aussi une lecture à suivre", "Choisis par où tu commences",
    "Les favoris font partie de Premium", "Il ouvre ton vote", "ta page reste là", "Reste à t'y mettre",
    "Le conseil, tu l'as lu", "pour en écrire une", "exemple à l'appui", "Ensuite, au programme",
    "on te conseille d'en faire une par semaine", "Suivre Répartie en entier", "t'y aide", "Cet exercice est dans Premium",
    "se teste mieux ici", "Tu commences par celui qui te ressemble", "Étape 1 du parcours Répartie, sans compte",
    "l'un des 5 parcours", "un abonnement résiliable en ligne", "C'est le rôle de l'exercice", "Mieux vaut tester ce conseil",
    "Avec, en plus,", "Tu résilies en ligne quand tu veux, et tu as 14 jours", "La suite et les 4 autres parcours, c'est Premium",
    "tombent mieux au bon moment", "l'étape 1 de Répartie (un défi à tenter", "son exercice et tes favoris sont dans Premium",
    "La suite, dont « Retourner les piques avec le sourire »", "(un défi, 5 vannes, 2 vidéos, un quiz)",
    "Tes idées que personne n'attendait", "Et tes favoris te gardent cette vidéo sous la main",
    // Nouveaux au tour 17 (« pour repérer où il y a de la place pour toi » retiré de la liste : la fin de L'Absurde le contient).
    "du parcours Répartie (défi,", "Les silences que tu sais utiliser", "Les autres ne savent jamais où vont tes idées",
    "encore faut-il les placer", "où il y a de la place pour elles",
    "Avec le même abonnement, tes favoris te gardent cette vidéo sous la main",
    "l'abonnement du site : de quoi la revoir pour faire rire",
  ];
  const fichiers: string[] = [];
  const parcourir = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== "__tests__") parcourir(p);
      } else if (/\.(ts|tsx)$/.test(e.name)) fichiers.push(p);
    }
  };
  parcourir(path.join(__dirname, "..", ".."));
  const tout = fichiers.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  it.each(INTERDITES)("« %s » absent", (chaine) => {
    expect(tout).not.toContain(chaine);
  });
  it("« Voir toutes / tous les » absent des blocs d'appel (restent les liens de navigation, hors blocs)", () => {
    const cta = ["config/textes/cta-pages.ts", "config/textes/cta-articles-accueil.ts", "components/premium/bloc-exercice.tsx"]
      .map((f) => fs.readFileSync(path.join(__dirname, "..", "..", f), "utf8"))
      .join("\n");
    expect(cta).not.toMatch(/Voir tou(te)?s les/);
  });
  it("« en un clic » ne qualifie plus la résiliation Premium", () => {
    expect(tout).not.toMatch(/résili\w* (en ligne )?en un clic|en un clic depuis le profil/);
  });
});
