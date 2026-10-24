import { QUIZ_HUMOUR_CTA } from "@/config/textes/cta-pages";
import { QUIZ_HUMOUR_PARCOURS } from "@/config/textes/entrees-parcours";
import { QUIZ_PROFILES, type HumorProfileType } from "@/components/quiz/quiz-data";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import { buildAbonnementUrl } from "@/lib/premium-return";

/** Textes et liens du résultat du quiz d'humour pour un profil, calculés côté serveur. */
export interface TexteResultatQuiz {
  intro: string;
  titre: string;
  raison: string;
  bouton: string;
  boutonHref: string;
  sansCompte: string;
  lien: string;
  lienHref: string;
}

export type TextesResultatQuiz = Record<HumorProfileType, TexteResultatQuiz>;

/**
 * s21 (QA m3, budget JS) : les textes validés du résultat (cta-pages.ts, entrees-parcours.ts)
 * sont calculés par la page serveur pour les 5 profils, puis passés au quiz. Le composant client
 * n'embarque pas ces modules. Concision v5 (textes-v5-b §4) : le résultat, un plein gratuit
 * `GRATUIT_P`, « Sans compte. », un lien `OUVRIR`.
 */
export function textesResultatQuiz(): TextesResultatQuiz {
  const entrees = (Object.keys(QUIZ_PROFILES) as HumorProfileType[]).map((type) => {
    const slug = QUIZ_PROFILES[type].recommendedParcours;
    const texte: TexteResultatQuiz = {
      intro: QUIZ_HUMOUR_PARCOURS.intro,
      titre: QUIZ_HUMOUR_PARCOURS.titre(slug),
      raison: QUIZ_HUMOUR_PARCOURS.raison[type],
      bouton: QUIZ_HUMOUR_CTA.bouton(slug),
      boutonHref: parcoursEtape1Href(slug, "quiz"),
      sansCompte: QUIZ_HUMOUR_CTA.sansCompte,
      lien: QUIZ_HUMOUR_CTA.lien(slug),
      lienHref: buildAbonnementUrl(`/parcours/${slug}`, "monthly", "quiz"),
    };
    return [type, texte] as const;
  });
  return Object.fromEntries(entrees) as TextesResultatQuiz;
}
