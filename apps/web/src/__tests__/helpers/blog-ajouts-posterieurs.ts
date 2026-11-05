import type { BlogArticle } from "@/lib/blog-articles";

/**
 * Ajouts éditoriaux postérieurs aux audits figés (baseline tirets cadratins, audit s20).
 * Chaque ajout est vérifié mot pour mot par son propre test ; les tests historiques
 * comparent l'article SANS l'ajout à leur référence, pour que leur garde-fou reste
 * entier sur tout le reste du texte.
 */
export const URL_FLORINE =
  "https://www.florinecoach.fr/post/les-bienfaits-du-rire-au-quotidien-une-cl%C3%A9-inattendue-du-d%C3%A9veloppement-personnel";

export const PARAGRAPHE_FLORINE_S23 =
  `Sur ce point, Florine Bosch Duchatelet, conseillère en image et praticienne en PNL, le dit très bien dans son article [Les bienfaits du rire au quotidien](${URL_FLORINE}) : savoir rire de soi, avec tendresse, sans ironie destructrice, c’est un acte de bienveillance envers soi-même.`;

interface AjoutPosterieur {
  /** Texte inséré, précédé de la ligne vide qui le sépare du paragraphe précédent. */
  insertion: string;
  /** Date de mise à jour avant l'ajout (référence des audits). */
  updatedAtAvant: string;
  /** Date de mise à jour posée par l'ajout. */
  updatedAtApres: string;
}

export const AJOUTS_POSTERIEURS: Record<string, AjoutPosterieur> = {
  // s23 (05/11/2026), demande de Thomas : mention éditoriale après l'habitude 6.
  "humour-quotidien-8-habitudes": {
    insertion: `\n\n${PARAGRAPHE_FLORINE_S23}`,
    updatedAtAvant: "2026-10-12",
    updatedAtApres: "2026-11-05",
  },
};

/** L'article tel qu'il était avant ses ajouts postérieurs (copie, l'original n'est pas modifié). */
export function sansAjoutsPosterieurs(article: BlogArticle): BlogArticle {
  const ajout = AJOUTS_POSTERIEURS[article.slug];
  if (!ajout) return article;
  if (article.content.split(ajout.insertion).length - 1 !== 1) {
    throw new Error(`Ajout postérieur introuvable ou dupliqué dans ${article.slug}`);
  }
  return { ...article, content: article.content.replace(ajout.insertion, ""), updatedAt: ajout.updatedAtAvant };
}
