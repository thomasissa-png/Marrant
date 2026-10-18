/**
 * Mécanique des encarts d'articles (audit conversion s20, lot 1). Textes : config/textes/encarts-blog-s20.ts.
 *
 * - PARCOURS_PAR_ARTICLE : parcours d'un article, prioritaire sur le cluster
 *   (lib/blog-parcours.ts). Table définitive à recevoir de @copywriter.
 * - ENCARTS_IMPOSES : encart au fil du texte placé après une section nommée
 *   (intitulé H2 exact, tel qu'écrit dans le Markdown). Article absent = un seul
 *   encart placé automatiquement (lib/blog-encarts.ts).
 * - s21 : plus de BLOC_FIN_AVANT_FAQ, la FAQ est en dernier sur tous les articles
 *   (spec cta-forme-place §3.1).
 */
import { FORTE_FRAPPE_PARCOURS } from "@/config/blog-forte-frappe";
import type { CleEncartArticle1 } from "@/config/textes/encarts-blog-s20";
import type { ParcoursSlug } from "@/lib/entrees-parcours";

export const PARCOURS_PAR_ARTICLE: Readonly<Partial<Record<string, ParcoursSlug>>> = {
  // Articles à forte frappe (s14) : choix déjà documentés dans config/blog-forte-frappe.ts.
  ...FORTE_FRAPPE_PARCOURS,
  // Audit conversion s20 (docs/copy/encarts-montrer-offre-s20.md §D) : blagues, phrases à
  // ressortir, chambrage et blanc → Répartie ; drague, timidité → Confiance ; anecdote → Storytelling ;
  // réputation pro → Boulot ; pause café → Machine à Café. Les clusters fort-volume et
  // humour-contexte sont remappés dans lib/blog-parcours.ts.
  "repartie-soiree-anti-malaise": "repartie",
  "blague-courte-arme-secrete-humour": "repartie",
  "citation-drole": "repartie",
  "repondre-moqueries-avec-humour": "repartie",
  "jamais-quoi-repondre-techniques": "repartie",
  "rester-muet-en-groupe": "repartie",
  // Couple : le CTA de l'article (étalon 3.2c validé) nomme Répartie ; la carte suit.
  "blagues-de-couple-drole": "repartie",
  "comment-faire-rire-une-fille": "confiance",
  "comment-faire-rire-un-homme": "confiance",
  "autoderision-interactions": "confiance",
  "timidite-et-humour": "confiance",
  "comment-raconter-une-blague-sans-la-rater": "storytelling",
  "storytelling-drole-5-structures": "storytelling",
  "se-presenter-avec-humour": "boulot",
  "mot-de-depart-collegue-drole": "boulot",
  "conversation-machine-a-cafe": "machine-a-cafe",
  "voeux-drole-nouvelle-annee": "machine-a-cafe",
};

export interface EncartImpose {
  /** Intitulé exact du H2 après la section duquel l'encart est placé. */
  apresSection: string;
  parcours: ParcoursSlug;
  /** Clé des textes (ENCARTS_ARTICLE_1) ; absente = textes génériques du parcours. */
  texte?: CleEncartArticle1;
}

export const ENCARTS_IMPOSES: Readonly<Partial<Record<string, readonly EncartImpose[]>>> = {
  "meilleures-blagues-droles-2026": [
    {
      apresSection: "Quelles blagues sortir en soirée ? (celles qui marchent à partir de 22h)",
      parcours: "repartie",
      texte: "repartie",
    },
    // s21 (spec cta-forme-place §2.5, D1c de l'audit) : plus d'encart d'offre en milieu-2
    // (16 % de vues, 0 clic). Un seul encart démonstration par article.
  ],
};

/** Encart automatique : nombre minimal de H2 et cible (part de l'article lue avant l'encart). */
export const ENCART_AUTO_MIN_H2 = 3;
export const ENCART_AUTO_CIBLE = 0.4;
export const ENCART_AUTO_FENETRE: readonly [number, number] = [0.35, 0.45];
