import type { BlogArticle } from "@/lib/blog-articles";
import { NBSP } from "@/lib/fr-typo";

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

/**
 * s27 (25/11/2026, décision de Thomas « Je suis tes recos. Avance maximale ») : paragraphes de tête
 * de 4 articles, copiés au caractère près de la section « FONT FOI » de
 * `docs/copy/paragraphes-tete-s27-final.md` (relectures `docs/reviews/paragraphes-tete-s27-review*.md`).
 * Le texte de `5-types-humour-lequel-pour-toi` porte 5 espaces insécables (guillemets, « ? »).
 */
export const PARAGRAPHES_TETE_S27: Record<string, string> = {
  "comment-devenir-drole":
    "Si tu restes muet quand tes potes se chambrent, en rentrant, note dans ton téléphone la phrase qui a fait rire le plus fort, et pourquoi elle marche. Au bout de quelques soirées, tu vois venir les moments où ta réplique a sa place, et tu arrêtes de regarder passer les vannes.",
  "comment-avoir-de-la-repartie":
    "Si on te balance une pique devant tout le monde et que tu réponds par un rire gêné, en rentrant, note la pique, et en face la réplique que tu aurais voulu sortir. Au bout de quelques soirées, tu remarques que les piques se ressemblent, et quand la suivante arrive, ta réponse est déjà prête.",
  "autoderision-interactions":
    "L'autodérision, c'est rire d'un de tes petits défauts, pour que les autres soient à l'aise au lieu d'être gênés pour toi. La prochaine fois que tu te plantes devant du monde (tu te trompes de salle, tu oublies un prénom), sors la vanne avant les autres, et tu verras les épaules se détendre.",
  "5-types-humour-lequel-pour-toi":
    `L'humour observationnel, c'est dire à voix haute un truc que tout le monde a vécu sans jamais le formuler. La prochaine fois que tu te dis dans le métro «${NBSP}mais pourquoi ils font tous ça${NBSP}?${NBSP}», dis-le tel quel à un pote, et s'il te répond «${NBSP}c'est tellement vrai${NBSP}», tu tiens peut-être ton type d'humour.`,
};

/** s27, même décision : 2 phrases de lien ajoutées à la suite d'une phrase existante de l'article blagues (même paragraphe). */
export const LIENS_BLAGUES_S27: { apres: string; phrase: string; href: string }[] = [
  {
    // Texte 5 (R2), section « Comment placer tes vannes ».
    apres: "**Adapte, n'apprends pas par cœur.** Change les prénoms, adapte les situations à ta vie.",
    phrase:
      "Et si on te chambre en retour, voici comment [avoir de la répartie](/blog/comment-avoir-de-la-repartie) au lieu de rester sans voix.",
    href: "/blog/comment-avoir-de-la-repartie",
  },
  {
    // Texte 6 (E2), section « Les vannes entre potes ».
    apres: "C'est là que tout commence : faire rire sa bande avant de faire rire un public.",
    phrase:
      "Et si tu veux que ça tombe juste plus souvent, il y a [des exercices pour développer ton humour](/blog/exercices-developper-humour) à faire entre deux soirées.",
    href: "/blog/exercices-developper-humour",
  },
];

/**
 * s27 (25/11/2026, décision de Thomas « Aligne puis met en ligne ») : encadré « En bref » de
 * `comment-devenir-drole` remplacé, au caractère près, par la section « FAIT FOI » de
 * `docs/copy/en-bref-devenir-drole-s27.md` (concordance vérifiée par blog-en-bref-devenir-drole-s27.test.ts).
 * `avant` = l'encadré des étalons s15 et des audits, `apres` = le texte en ligne.
 */
export const EN_BREF_DEVENIR_DROLE_S27 = {
  slug: "comment-devenir-drole",
  avant:
    "> **En bref :** Pour devenir drôle, note chaque jour une situation absurde, reformule-la en 3 versions, teste la meilleure sur un proche, puis réutilise ce qui a fait sourire. 5 à 10 minutes par jour pendant 30 jours suffisent à la plupart des gens pour sentir la différence : l'humour est une compétence, pas un talent inné.",
  apres:
    "> **En bref :** Pour devenir drôle, prends le réflexe de noter ce qui fait rire, puis travaille 5 piliers : observation, surprise, timing, autodérision et pratique. Ensuite, suis un plan sur 30 jours en quatre étapes (observer, reformuler, tester auprès d'un ami, élargir aux réunions et aux soirées), 5 à 10 minutes par jour.",
};

/** Remet l'ancien texte à la place de chaque remplacement (présent une seule fois, sinon erreur). */
export function sansRemplacements(slug: string, content: string): string {
  for (const { avant, apres } of AJOUTS_POSTERIEURS[slug]?.remplacements ?? []) {
    if (content.split(apres).length - 1 !== 1) {
      throw new Error(`Remplacement postérieur introuvable ou dupliqué dans ${slug}`);
    }
    content = content.replace(apres, avant);
  }
  return content;
}

interface AjoutPosterieur {
  /** Textes insérés, chacun avec son séparateur (ligne vide ou espace), présents une seule fois. */
  insertions: string[];
  /** Textes remplacés (ancien → nouveau, présent une seule fois), remis à l'ancien avant comparaison. */
  remplacements?: { avant: string; apres: string }[];
  /** Date de mise à jour avant l'ajout (référence des audits). */
  updatedAtAvant: string;
  /** Date de mise à jour posée par l'ajout (égale à l'avant si l'ajout ne la change pas). */
  updatedAtApres: string;
}

/** s27 : updatedAt inchangé (code commité, non déployé ; la date se pose à la mise en ligne si Thomas le décide). */
const AVANT_S27 = { updatedAtAvant: "2026-10-12", updatedAtApres: "2026-10-12" };

export const AJOUTS_POSTERIEURS: Record<string, AjoutPosterieur> = {
  // s23 (05/11/2026), demande de Thomas : mention éditoriale après l'habitude 6.
  "humour-quotidien-8-habitudes": {
    insertions: [`\n\n${PARAGRAPHE_FLORINE_S23}`],
    updatedAtAvant: "2026-10-12",
    updatedAtApres: "2026-11-05",
  },
  // s27 (25/11/2026) : paragraphe de tête, premier paragraphe du corps, suivi de sa ligne vide.
  ...Object.fromEntries(
    Object.entries(PARAGRAPHES_TETE_S27).map(([slug, texte]) => [slug, { insertions: [`${texte}\n\n`], ...AVANT_S27 }]),
  ),
  // s27 (25/11/2026) : 2 phrases de lien, chacune précédée d'une espace, dans le paragraphe existant.
  "meilleures-blagues-droles-2026": { insertions: LIENS_BLAGUES_S27.map((l) => ` ${l.phrase}`), ...AVANT_S27 },
};
// s27 (25/11/2026) : encadré « En bref » remplacé (même date, updatedAt inchangé).
AJOUTS_POSTERIEURS[EN_BREF_DEVENIR_DROLE_S27.slug].remplacements = [
  { avant: EN_BREF_DEVENIR_DROLE_S27.avant, apres: EN_BREF_DEVENIR_DROLE_S27.apres },
];

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
  let content = sansRemplacements(article.slug, article.content);
  for (const insertion of ajout.insertions) {
    if (content.split(insertion).length - 1 !== 1) {
      throw new Error(`Ajout postérieur introuvable ou dupliqué dans ${article.slug}`);
    }
    content = content.replace(insertion, "");
  }
  return { ...article, content, updatedAt: ajout.updatedAtAvant };
}
