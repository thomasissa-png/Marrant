/**
 * Page de résiliation maison (s23). Décision de Thomas du 06/11/2026 : la raison est
 * demandée AVANT que la résiliation soit effective, sur notre propre écran de
 * confirmation (question facultative, bouton toujours actif). Specs :
 * `docs/ux/page-resiliation-s23-spec.md` (v3), `docs/design/page-resiliation-s23-design.md`,
 * `docs/copy/page-resiliation-s23-textes.md`, cadre `docs/legal/resiliation-onboarding-cadre-s23.md`.
 *
 * Interrupteur `RESILIATION_PAGE_OUVERTE` : FERMÉ par défaut. Fermé, le parcours actuel est
 * inchangé (pied de page et carte abonnement vers le portail Stripe), `/resiliation` et
 * `/resiliation/confirmee` répondent 404 et l'API répond 404. À ouvrir seulement sur go
 * écrit de Thomas (textes validés, avis avocat sur les points de la spec §6).
 */
export const RESILIATION_PAGE_OUVERTE: boolean = false;

export const RESILIATION_HREF = "/resiliation";
export const RESILIATION_CONFIRMEE_HREF = "/resiliation/confirmee";
export const RESILIATION_API = "/api/user/subscription/resiliation";

/** Mémoire de l'onglet pour la page finale (merci, ligne d'aide) : jamais dans l'URL. */
export const CLE_REPONSE_SESSION = "resiliation-reponse";

/** Retour « Garder mon abonnement » (sans confirmation). */
export const RESILIATION_GARDER_HREF = "/profil#abonnement";

/** Longueur maximale du champ libre (caractères). */
export const RESILIATION_COMMENTAIRE_MAX = 500;

/**
 * Les 7 raisons, ordre fixe (spec §2, textes §1). Les codes sont stockés en base
 * (`CancellationFeedback.reasons`) : ne jamais renommer un code existant.
 */
export const RESILIATION_RAISONS = [
  { code: "essai", libelle: "Je voulais juste essayer" },
  { code: "introuvable", libelle: "Je n’ai pas trouvé ce que je cherchais" },
  { code: "depart", libelle: "Je ne savais pas par où commencer" },
  { code: "temps", libelle: "Pas le temps en ce moment" },
  { code: "prix", libelle: "Trop cher pour moi" },
  { code: "inadapte", libelle: "Ça ne me correspond pas" },
  { code: "autre", libelle: "Autre" },
] as const;

export type RaisonResiliation = (typeof RESILIATION_RAISONS)[number]["code"];

export const RESILIATION_CODES: readonly RaisonResiliation[] = RESILIATION_RAISONS.map((r) => r.code);

/** Limite de débit par compte (anti-abus, jamais affichée). */
export const RESILIATION_LIMITE = { maxRequests: 6, windowMs: 10 * 60_000 } as const;

/** Délai après lequel l'écran affiche « Toujours en cours, ne ferme pas la page. » */
export const RESILIATION_DELAI_LENT_MS = 3000;

/** Délai maximal accordé à l'appel Stripe (règle : 10 s sur Stripe). */
export const RESILIATION_TIMEOUT_STRIPE_MS = 10_000;
