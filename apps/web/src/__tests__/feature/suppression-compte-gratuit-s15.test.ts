/**
 * Suppression du compte gratuit (s15, docs/product/suppression-compte-gratuit-s15.md) :
 * invariants. Un visiteur garde EXACTEMENT ses accès (10/3/3, étape 1 lisible,
 * carnet 1 fiche, recherche 3) ; plus aucun texte « compte gratuit » côté
 * utilisateur ; blocs de fin des 11 articles à forte frappe (v3), prix et « 1 500+ » intacts.
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

  it("valider une étape = Premium uniquement (s15 §1.1)", () => {
    expect(canValidateParcoursStep(null)).toBe(false);
    expect(canValidateParcoursStep("FREE")).toBe(false);
    expect(canValidateParcoursStep("PREMIUM")).toBe(true);
  });

  it("carnet : 1 fiche ; recherche : 3 résultats sans abonnement (code non modifié)", () => {
    expect(CARNET_FREE_FICHES).toBe(1);
    expect(read("app/api/search/route.ts")).toMatch(/const resultLimit = isPremium \? 5 : 3;/);
  });

  // « /onboarding sans session ne mène plus à /register » : joué sur une vraie requête depuis
  // s21 (QA v3 m-1), voir lib/middleware-abonnement-src-s21.test.ts.
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
      "L’inscription est ouverte à toute personne de 15 ans et plus. L’accès à l’ensemble du contenu nécessite un abonnement actif.",
    );
  });
});

describe("11 blocs de fin d’article (config/blog-cta.ts) : v3 validée (correction C1 de la revue v3)", () => {
  // Textes de docs/copy/cta-s21/concision/fins-articles-v3.md, mot pour mot.
  const V3: Record<string, [titre: string, phrase: string]> = {
    "message-anniversaire-drole-par-situation": ["Au moment du gâteau, tout le monde t’écoute", "Mieux vaut avoir de quoi enchaîner après la chanson."],
    "voeux-drole-nouvelle-annee": ["En janvier, les vœux se disent en face.", "Toute la tournée des bises, sans rester sec."],
    "premier-message-drole-appli-de-rencontre": ["On te répond. Tu écris quoi, maintenant ?", "C’est au deuxième message que ça se joue."],
    "blagues-de-couple-drole": ["Chez vous, qui a le dernier mot ?", "Du tac au tac, même pour la télécommande."],
    "blagues-poisson-d-avril-adultes": ["Le 1er avril, tu peux aussi être la cible.", "Une riposte, ça se prépare avant."],
    "blagues-de-gamer-jeux-video": ["En vocal, la team ne laisse rien passer.", "Prochaine partie, à toi de chambrer."],
    "refuser-une-invitation-avec-humour": ["Après ton non, il y a le « t’es sûr ? »", "Répondre sans dix excuses, ça se travaille."],
    "mot-de-depart-collegue-drole": ["Au pot, il faudra bien dire un mot.", "Autour du buffet, ta carte ne parlera pas pour toi."],
    "message-drole-fete-des-meres": ["À table, impossible de copier-coller.", "Il faudra tes propres mots."],
    "message-drole-fete-des-peres": ["Le SMS, c’est fait. Reste le repas.", "Garde une vanne pour le dessert."],
    "blagues-vacances-ete-entre-amis": ["Cet été, la blague culte peut être la tienne.", "Celle qu’on se répète encore à la rentrée."],
  };

  it("11 articles, titre et phrase v3 mot pour mot ; l’article n°1 n’a plus d’entrée (bloc v5)", () => {
    expect(Object.keys(BLOG_CTA_BY_SLUG).sort()).toEqual(Object.keys(V3).sort());
    expect(BLOG_CTA_BY_SLUG).not.toHaveProperty("meilleures-blagues-droles-2026");
    for (const [slug, [titre, phrase]] of Object.entries(V3)) {
      expect([slug, BLOG_CTA_BY_SLUG[slug].title, BLOG_CTA_BY_SLUG[slug].text]).toEqual([slug, titre, phrase]);
    }
  });

  it("plus aucun libellé de bouton dans les données, ni ancien libellé, ni « gratuit », ni tiret cadratin", () => {
    for (const cta of Object.values(BLOG_CTA_BY_SLUG)) {
      expect(Object.keys(cta).filter((k) => !["title", "text", "parcoursHref"].includes(k))).toEqual([]);
      const all = Object.values(cta).join(" ");
      expect(all).not.toMatch(/Passer à Premium|Commencer le parcours|Lire l'étape 1|parcours complets|gratuit|sans carte/i);
      expect(all).not.toContain("—");
    }
  });
});

describe("prix et « 1 500+ » intacts", () => {
  it("2,99 €/mois et 24,99 €/an", () => {
    expect(PREMIUM_PRICE_LABEL).toBe("2,99\u00A0€/mois");
    expect(PREMIUM_ANNUAL_PRICE_LABEL).toBe("24,99\u00A0€/an");
  });

  it("formulations 1 500+ validées par Thomas", () => {
    // Concision v5 : « 1 500+ inscrits » sous le titre de l'accueil et en fin de /a-propos, plus
    // dans la carte Premium ni dans le corps de /a-propos.
    expect(read("config/textes/cta-articles-accueil.ts")).toContain("preuve: `1${ESPACE_INSECABLE}500+ inscrits bossent leur humour.`");
    expect(read("config/textes/cta-pages.ts")).toContain("preuve: `Déjà 1${ESPACE_INSECABLE}500+ inscrits.`");
    expect(read("app/(dashboard)/a-propos/page.tsx")).toContain("frTypo(A_PROPOS_FIN.preuve)");
    expect(read("app/(dashboard)/a-propos/page.tsx")).not.toContain("membres mettent en pratique");
    expect(read("components/home/hero-section.tsx")).not.toContain("Rejoins-les");
  });
});
