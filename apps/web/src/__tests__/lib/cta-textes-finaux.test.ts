/**
 * Blocs d'appel s21 : copie fidèle du seed et Grep de fin (anciennes chaînes absentes de src/).
 * Les rendus mot pour mot des textes de la concision v5 sont dans `concision-v5-textes.test.tsx`.
 */
import fs from "fs";
import path from "path";
import { PARCOURS_ETAPES } from "@/config/parcours-etapes";
import { PARCOURS_SEED_JSON } from "@/lib/parcours-seed";
import { PREMIUM_PARCOURS } from "@/config/premium";
import type { ParcoursSlug } from "@/lib/entrees-parcours";

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
    // Concision v5 (18/10) : libellés uniques et lignes « Disparaît » (textes-v5-a, b, c).
    // « Tout ouvrir » revient le 19/10 comme porte générique (trajet de conversion s21, arbitrage de
    // Thomas) : il n'est plus interdit ; « Ouvrir les 5 parcours » l'est à sa place (ci-dessous).
    "Voir ce que contient Premium", "Ouvrir toutes les étapes", "Ouvrir les 5 parcours", "Commencer mon parcours",
    "Lire la première étape gratuite de", "Lire la première étape gratuite du parcours", "Voir par où commencer ?",
    "Tu préfères lire d'abord", "Étape 1 sur 2", "Étape 2 : le paiement sécurisé", "S'inscrire avec Google",
    "Tu as 14 jours pour te faire rembourser ton premier paiement", "Tu as 14 jours pour te faire rembourser ce paiement", "Résiliable en ligne quand tu veux", "Rejoins-les",
    "Tu restes muet quand on te chambre ?", "Un petit exercice par jour", "On déroule le tapis rouge",
    "Ton quiz te conseille", "Ton compte est prêt : il ne reste que le paiement", "Deux étapes : ton compte",
    "reste là.", "Le vote est réservé à Premium", "Les listes complètes", "Les 5 parcours en entier",
    "Et si la prochaine vanne qui fait rire la table", "Tu y trouves aussi le filtre", "Voir d'autres vannes",
    "pour le soir où tu en auras besoin", "Pour toi si tu trouves la bonne réponse", "Un abonnement, tout ouvert",
    "Tu annules quand tu veux", "Payé en une fois, renouvelé", "Pas encore sûr ? Lis d'abord une étape",
    "autres situations du mois", "Lis d'abord une étape, elle est offerte", "Tu sais ce qu'est un callback",
    "pas de reconduction surprise", "Pour bien démarrer : ouvre un parcours",
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
  it("« en un clic » / « en 1 clic » ne qualifie plus la résiliation Premium", () => {
    expect(tout).not.toMatch(/résili\w* (en ligne )?en (un|1) clic|en (un|1) clic depuis (le|ton) profil|annules en (un|1) clic/);
  });
  it("libellé payant générique unique : plus de « Ouvrir {P} en entier » ni « Ouvrir {P} et les N autres »", () => {
    expect(tout).not.toMatch(/Ouvrir \$\{PARCOURS_NOMS\[[a-z]+\]\} (en entier|et les)/);
  });
  it("« une étape par semaine » n'est plus présenté comme un fait dans les blocs d'appel", () => {
    expect(tout).not.toContain("AVEC_PREMIUM_FIN");
    const cta = ["config/textes/cta-pages.ts", "config/textes/cta-articles-accueil.ts", "config/textes/offre.ts", "lib/llms-parcours.ts"]
      .map((f) => fs.readFileSync(path.join(__dirname, "..", "..", f), "utf8"))
      .join("\n");
    expect(cta).not.toMatch(/une étape par semaine(?! conseillée)/);
    expect(cta).not.toMatch(/suit une étape par semaine/);
  });
});
