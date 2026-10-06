/**
 * Suppression du compte gratuit (s15, docs/product/suppression-compte-gratuit-s15.md) :
 * invariants. Un visiteur garde EXACTEMENT ses accès (10/3/3, étape 1 lisible,
 * carnet 1 fiche, recherche 3) ; plus aucun texte « compte gratuit » côté
 * utilisateur ; titres des 12 CTA d'articles inchangés, prix et « 1 500+ » intacts.
 */
import fs from "fs";
import path from "path";
import {
  FREE_CATALOGUE_LIMITS_LABEL,
  FREE_JOKE_LIMIT,
  FREE_TIP_LIMIT,
  FREE_VIDEO_LIMIT,
  PREMIUM_PRICE_LABEL,
  PREMIUM_ANNUAL_PRICE_LABEL,
} from "@/config/premium";
import { BLOG_CTA_BY_SLUG } from "@/config/blog-cta";
import {
  canAccessParcoursStep,
  canValidateParcoursStep,
  LAST_FREE_PARCOURS_STEP,
} from "@/lib/parcours-access";
import { CARNET_FREE_FICHES } from "@/lib/carnet";

const SRC = path.join(process.cwd(), "src");
const read = (rel: string) => fs.readFileSync(path.join(SRC, rel), "utf8");

describe("visiteur : accès strictement inchangés", () => {
  it("limites des listes 10 / 3 / 3 et libellé", () => {
    expect([FREE_JOKE_LIMIT, FREE_TIP_LIMIT, FREE_VIDEO_LIMIT]).toEqual([10, 3, 3]);
    expect(FREE_CATALOGUE_LIMITS_LABEL).toBe("10 vannes, 3 conseils, 3 vidéos");
  });

  it("étape 1 lisible par tous, étapes 2+ pour les abonnés (lecture inchangée)", () => {
    expect(LAST_FREE_PARCOURS_STEP).toBe(1);
    expect(canAccessParcoursStep(1, null)).toBe(true);
    expect(canAccessParcoursStep(1, "FREE")).toBe(true);
    expect(canAccessParcoursStep(2, null)).toBe(false);
    expect(canAccessParcoursStep(2, "PREMIUM")).toBe(true);
  });

  it("valider une étape = accès complet uniquement (s15 §1.1)", () => {
    expect(canValidateParcoursStep(null)).toBe(false);
    expect(canValidateParcoursStep("FREE")).toBe(false);
    expect(canValidateParcoursStep("PREMIUM")).toBe(true);
  });

  it("carnet : 1 fiche ; recherche : 3 résultats sans abonnement (code non modifié)", () => {
    expect(CARNET_FREE_FICHES).toBe(1);
    expect(read("app/api/search/route.ts")).toMatch(/const resultLimit = isPremium \? 5 : 3;/);
  });

  it("/onboarding sans session ne mène plus à /register", () => {
    const mw = read("middleware.ts");
    expect(mw).toMatch(/path\.startsWith\("\/onboarding"\) && !token[\s\S]{0,120}new URL\("\/abonnement"/);
  });
});

describe("textes : plus de compte gratuit côté utilisateur", () => {
  /** Toutes les sources hors tests ; une occurrence n'est tolérée que dans un commentaire. */
  function sourceFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return entry.name === "__tests__" ? [] : sourceFiles(full);
      return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
    });
  }

  it("« compte gratuit » n'apparaît que dans des commentaires de code", () => {
    const offenders = sourceFiles(SRC).flatMap((file) =>
      fs
        .readFileSync(file, "utf8")
        .split("\n")
        .map((line, i) => ({ line: line.trim(), at: `${path.relative(SRC, file)}:${i + 1}` }))
        .filter(({ line }) => /compte gratuit|comptes gratuits|crée ton compte gratuit|essaie gratuitement/i.test(line))
        .filter(({ line }) => !/^(\/\/|\*|\/\*|\{\/\*)/.test(line))
        .map(({ at }) => at),
    );
    expect(offenders).toEqual([]);
  });

  it("CGU : seule la phrase « Un compte gratuit donne accès à une partie du contenu » est retirée", () => {
    const cgu = read("app/(dashboard)/cgu/page.tsx");
    expect(cgu).not.toMatch(/compte gratuit/i);
    expect(cgu).toContain(
      "L&apos;inscription est ouverte à toute personne de plus de 15 ans. L&apos;accès à l&apos;ensemble du contenu nécessite un abonnement actif.",
    );
  });
});

describe("12 CTA de fin d'article (config/blog-cta.ts) : étalons 3.1 et 3.2c déclinés", () => {
  const TITRES_INCHANGES: Record<string, string> = {
    "meilleures-blagues-droles-2026": "Tu les as lues. Reste à les sortir pour de vrai.",
    "message-anniversaire-drole-par-situation": "Le message, c'est fait. Reste le moment du gâteau.",
    "voeux-drole-nouvelle-annee": "Ton message est choisi. Le reste de l'année, c'est toi qui écris.",
    "premier-message-drole-appli-de-rencontre": "Ton premier message est prêt. La suite s'entraîne.",
    "blagues-de-couple-drole": "Tu as les vannes. Et quand l'autre te les renvoie ?",
    "blagues-poisson-d-avril-adultes": "Le canular est prêt. Et la riposte ?",
    "blagues-de-gamer-jeux-video": "Tu as les vannes. Reste à les sortir en vocal.",
    "refuser-une-invitation-avec-humour": "Le refus est parti. Reste la relance en face.",
    "mot-de-depart-collegue-drole": "Le mot est écrit. Reste le pot.",
    "message-drole-fete-des-meres": "Le message est choisi. Le reste de la journée s'improvise.",
    "message-drole-fete-des-peres": "Le message est prêt. Reste à le dire en face.",
    "blagues-vacances-ete-entre-amis": "Les vannes sont prêtes. Reste à oser les sortir.",
  };

  it("mêmes 12 articles, titres propres à chaque article inchangés", () => {
    expect(Object.keys(BLOG_CTA_BY_SLUG).sort()).toEqual(Object.keys(TITRES_INCHANGES).sort());
    for (const [slug, title] of Object.entries(TITRES_INCHANGES)) expect(BLOG_CTA_BY_SLUG[slug].title).toBe(title);
  });

  it("aucun « gratuit », « sans carte », « compte gratuit » ni tiret cadratin ; prix au tarif en vigueur", () => {
    for (const cta of Object.values(BLOG_CTA_BY_SLUG)) {
      const all = Object.values(cta).join(" ");
      expect(all).not.toMatch(/gratuit|sans carte|compte ou pas/i);
      expect(all).not.toContain("—");
      expect(cta.note).toContain(PREMIUM_PRICE_LABEL);
    }
  });

  it("cas « couple » : étalon 3.2c exact", () => {
    expect(BLOG_CTA_BY_SLUG["blagues-de-couple-drole"]).toEqual({
      title: "Tu as les vannes. Et quand l'autre te les renvoie ?",
      text: "Le parcours Répartie t'entraîne à renvoyer la balle quand l'autre te répond du tac au tac, étape après étape.",
      primaryLabel: "Commencer le parcours Répartie",
      note: "Accès complet à 2,99 €/mois, sans engagement. La première étape se lit sans compte.",
      secondaryLabel: "Lire l'étape 1 de Répartie",
      parcoursHref: "/parcours/repartie",
    });
  });
});

describe("prix et « 1 500+ » intacts", () => {
  it("2,99 €/mois et 24,99 €/an", () => {
    expect(PREMIUM_PRICE_LABEL).toBe("2,99 €/mois");
    expect(PREMIUM_ANNUAL_PRICE_LABEL).toBe("24,99 €/an");
  });

  it("formulations 1 500+ validées par Thomas", () => {
    expect(read("components/home/hero-section.tsx")).toContain("1&nbsp;500+ membres bossent leur humour. Rejoins-les.");
    expect(read("components/home/premium-cta.tsx")).toContain("Déjà 1&nbsp;500+ inscrits, et toi&nbsp;?");
    expect(read("app/(dashboard)/a-propos/page.tsx")).toContain("Rejoins les 1&nbsp;500+ membres qui s&apos;entraînent un peu chaque jour.");
  });
});
