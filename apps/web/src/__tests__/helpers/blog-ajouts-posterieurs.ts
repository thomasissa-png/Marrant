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

/**
 * s27 : title + excerpt réécrits pour le SEO (gains rapides Search Console du 25/11). Seul le
 * couple title/excerpt change (corps, H2, FAQ, liens, chiffres intacts, vérifiés par les empreintes) ;
 * les tests historiques les comparent à leur valeur d'avant.
 */
export const METAS_AVANT_S27: Record<string, { title: string; excerpt: string }> = {
  "autoderision-interactions": {
    title: "Autodérision : définition et exemples",
    excerpt: "L'autodérision, c'est rire de soi sans se rabaisser. Définition, règles d'or et exemples pour être sympathique en 30 secondes sans te démolir.",
  },
  "5-types-humour-lequel-pour-toi": {
    title: "Humour observationnel : les 5 types",
    excerpt: "Il y a l'humour de Roman Frayssinet, celui de Paul Mirabel, celui de Blanche Gardin, et puis le tien : explore les 5 types d'humour pour trouver ton style.",
  },
  "comment-faire-rire-un-homme": {
    title: "Comment faire rire un homme : 6 techniques",
    excerpt: "Faire rire un homme ne demande pas un humour spécial : chambrage léger, réponse décalée, autodérision… 6 techniques sans cliché, qui marchent sur tout le monde.",
  },
  "comment-faire-rire-une-fille": {
    title: "Comment faire rire une fille : 7 techniques",
    excerpt: "Pour faire rire une fille, arrête d'abord de chercher à être drôle. Ça paraît idiot, et pourtant : 7 techniques qui marchent en soirée, en date ou par message.",
  },
  "phrases-droles-conversations": {
    title: "30 phrases drôles prêtes à ressortir",
    excerpt: "Phrases drôles pour la soirée, le date, WhatsApp ou la réunion : 33 répliques à placer, chacune avec le moment où la sortir pour qu'elle fasse rire.",
  },
  "repondre-moqueries-avec-humour": {
    title: "Répondre aux moqueries avec humour",
    excerpt: "Quand on te chambre, ton cerveau fait Ctrl+Alt+Suppr ? Répondre aux moqueries avec humour tient à quelques réflexes : 6 techniques pour ne plus rester muet.",
  },
};

/** L'article tel qu'il était avant ses ajouts postérieurs (copie, l'original n'est pas modifié). */
export function sansAjoutsPosterieurs(article: BlogArticle): BlogArticle {
  const ajout = AJOUTS_POSTERIEURS[article.slug];
  const metas = METAS_AVANT_S27[article.slug];
  if (metas) article = { ...article, ...metas };
  if (!ajout) return article;
  if (article.content.split(ajout.insertion).length - 1 !== 1) {
    throw new Error(`Ajout postérieur introuvable ou dupliqué dans ${article.slug}`);
  }
  return { ...article, content: article.content.replace(ajout.insertion, ""), updatedAt: ajout.updatedAtAvant };
}
