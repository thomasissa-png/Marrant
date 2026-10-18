/**
 * Bloc de fin des 11 articles « à forte frappe » (correction C1 de la revue v3,
 * docs/copy/cta-s21/concision/fins-articles-v3.md) : rendu du bloc par article, avec le même
 * calcul que blog-article-view (parcours de l'article, libellé du plein, titre et phrase).
 * - plein unique : « Tester l'étape 1 de {P}, gratuite » si l'entrée a un parcoursHref (P = ce
 *   parcours), sinon « Tester mes premières répliques, gratuit » ; « Sans compte. » ; lien OUVRIR ;
 * - aucun ancien libellé ;
 * - titre sans point final, sauf « ? » et « » » (règle unique du composant, tous les blocs) ;
 * - budget : titre + phrase + « Sans compte. » ≤ 25 mots (comptage textes-v5-a §0).
 */
import { render } from "@testing-library/react";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
}));
jest.mock("@/hooks/use-parcours-a-reprendre", () => ({ useParcoursAReprendre: () => null }));

import { ArticleCta, titreBlocFin } from "@/components/blog/article-cta";
import { BLOG_CTA_BY_SLUG, boutonEtape1Article, boutonFinArticle } from "@/config/blog-cta";
import { BLOC_FIN, GRATUIT_ACCUEIL, libelleGratuitParcours } from "@/config/textes/cta-articles-accueil";
import { TEXTES_PARCOURS_BLOG } from "@/config/textes/encarts-blog-s20";
import { resolveArticleParcours } from "@/lib/blog-parcours";
import { normalise } from "../helpers/texte-normalise";

const mots = (...textes: string[]) =>
  textes
    .join(" ")
    .split(/[\s  ]+/)
    .filter((m) => /[\p{L}\p{N}]/u.test(m)).length;

/**
 * Total de la v3 (titre + phrase + « Sans compte. »). Coquille de comptage relevée : fête des
 * mères 12 et non 14 (« Il faudra tes propres mots. », 5 mots, remplace une phrase plus longue ;
 * le total de la v3 n'a pas suivi). Textes inchangés.
 */
const TOTAUX_V3: Record<string, number> = {
  "message-anniversaire-drole-par-situation": 19,
  "voeux-drole-nouvelle-annee": 18,
  "premier-message-drole-appli-de-rencontre": 17,
  "blagues-de-couple-drole": 17,
  "blagues-poisson-d-avril-adultes": 17,
  "blagues-de-gamer-jeux-video": 16,
  "refuser-une-invitation-avec-humour": 18,
  "mot-de-depart-collegue-drole": 20,
  "message-drole-fete-des-meres": 12,
  "message-drole-fete-des-peres": 15,
  "blagues-vacances-ete-entre-amis": 19,
};

const ANCIENS = /Passer à Premium|Commencer le parcours|Lire l'étape 1|parcours complets/i;

describe("fins d'articles v3 : 11 blocs rendus", () => {
  it.each(Object.keys(TOTAUX_V3))("%s : textes, plein unique, budget ≤ 25 mots", (slug) => {
    const copy = BLOG_CTA_BY_SLUG[slug];
    const parcours = resolveArticleParcours(slug);
    if (copy.parcoursHref) expect(copy.parcoursHref).toBe(`/parcours/${parcours}`);
    const attendu = copy.parcoursHref ? libelleGratuitParcours(parcours) : GRATUIT_ACCUEIL;
    expect(boutonEtape1Article(slug, parcours)).toBe(attendu);

    const { container } = render(
      <ArticleCta
        parcours={parcours}
        src={`blog-${slug}`}
        title={copy.title}
        text={copy.text}
        boutonEtape1={boutonEtape1Article(slug, parcours)}
      />,
    );
    const bloc = container.querySelector("[data-blog-bloc-fin]")!;
    const [titre, phrase, note] = [...bloc.querySelectorAll("p")].map((p) => normalise(p.textContent ?? ""));
    expect(titre).toBe(normalise(titreBlocFin(copy.title)));
    expect(titre).not.toMatch(/\.$/);
    expect(phrase).toBe(normalise(copy.text));
    expect(note).toBe("Sans compte.");
    expect(normalise(bloc.querySelector('a[data-blog-cta="etape-1"]')!.textContent ?? "")).toBe(normalise(attendu));
    expect(normalise(bloc.querySelector('a[data-blog-cta="abonnement"]')!.textContent ?? "")).toBe(normalise(BLOC_FIN.lienAbonnement));
    expect(bloc.querySelectorAll("a")).toHaveLength(2);
    expect(bloc.textContent).not.toMatch(ANCIENS);

    const total = mots(copy.title, copy.text, BLOC_FIN.noteSansCompte);
    expect(total).toBe(TOTAUX_V3[slug]);
    expect(total).toBeLessThanOrEqual(25);
  });
});

describe("QA v4 m-2 : libellé unique du plein gratuit de fin d'article", () => {
  it("parcours connu (Répartie compris) = GRATUIT_P ; article n°1 et parcours inconnu = GRATUIT_ACCUEIL", () => {
    const repartie = resolveArticleParcours("jamais-quoi-repondre-techniques", "TECHNIQUE");
    expect(repartie).toBe("repartie");
    // undefined : le composant prend « Tester l'étape 1 de Répartie, gratuite » (TEXTES_PARCOURS_BLOG).
    expect(boutonFinArticle("jamais-quoi-repondre-techniques", repartie, "TECHNIQUE")).toBeUndefined();
    const { container } = render(<ArticleCta parcours={repartie} />);
    expect(normalise(container.querySelector('a[data-blog-cta="etape-1"]')!.textContent ?? "")).toBe(
      normalise("Tester l'étape 1 de Répartie, gratuite"),
    );
    expect(boutonFinArticle("meilleures-blagues-droles-2026", resolveArticleParcours("meilleures-blagues-droles-2026"))).toBe(
      GRATUIT_ACCUEIL,
    );
    expect(boutonFinArticle("article-sans-cluster-connu", "repartie")).toBe(GRATUIT_ACCUEIL);
  });
});

describe("ponctuation des titres du bloc de fin : règle unique", () => {
  it("point final retiré, « ? » et « » » gardés", () => {
    expect(titreBlocFin("En janvier, les vœux se disent en face.")).toBe("En janvier, les vœux se disent en face");
    expect(titreBlocFin("Le SMS, c'est fait. Reste le repas.")).toBe("Le SMS, c'est fait. Reste le repas");
    expect(titreBlocFin("Chez vous, qui a le dernier mot ?")).toBe("Chez vous, qui a le dernier mot ?");
    expect(titreBlocFin("Après ton non, il y a le « t'es sûr ? »")).toBe("Après ton non, il y a le « t'es sûr ? »");
  });

  it("aucun titre du bloc de fin (articles, article n°1, parcours) ne se termine par un point une fois rendu", () => {
    const titres = [
      ...Object.values(BLOG_CTA_BY_SLUG).map((c) => c.title),
      ...Object.values(BLOC_FIN.parArticle).map((c) => c?.titre ?? ""),
      ...Object.values(TEXTES_PARCOURS_BLOG).map((d) => d.finTitre),
    ];
    for (const titre of titres) expect(titreBlocFin(titre)).toMatch(/[^.]$/);
  });
});
