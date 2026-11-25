/**
 * Page de résiliation maison (s23). Décision de Thomas du 06/11/2026 : la raison est
 * demandée AVANT que la résiliation soit effective, sur notre propre écran de
 * confirmation (question facultative, bouton toujours actif). Specs :
 * `docs/ux/page-resiliation-s23-spec.md` (v3), `docs/design/page-resiliation-s23-design.md`,
 * `docs/copy/page-resiliation-s23-textes.md`, cadre `docs/legal/resiliation-onboarding-cadre-s23.md`.
 *
 * Interrupteur `RESILIATION_PAGE_OUVERTE` : OUVERT en s27 (décision de Thomas du 25/11/2026,
 * « pas besoin d'avocat pour ce sujet, on fait standard please » : textes standard, plus d'avis
 * d'avocat attendu). Ouvert, le pied de page, la carte abonnement et le parcours `resilier` du
 * portail mènent à `/resiliation`. Fermé (retour arrière), le parcours d'avant revient (portail
 * Stripe), `/resiliation` et `/resiliation/confirmee` répondent 404 et l'API répond 404.
 * Ouverture liée à deux gestes hors code (`REPLIT_ACTIONS.md`, s27) : migration 17 jouée AVANT le
 * déploiement, résiliation retirée de la configuration du portail Stripe APRÈS.
 */
export const RESILIATION_PAGE_OUVERTE: boolean = true;

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

/**
 * Validé par Thomas le 07/11/2026 (« ok pour tes recos ») : durée de conservation des réponses à la question de la
 * résiliation (`CancellationFeedback`), en mois. Purge quotidienne (`purgerMotifsResiliation`),
 * mention sous le champ libre et politique de confidentialité lisent cette seule valeur.
 */
export const RESILIATION_CONSERVATION_MOIS = 24;

/**
 * Validé par Thomas le 07/11/2026 (« ok pour tes recos »), engagement à tenir : délai annoncé quand l'équipe résilie à la main (erreur
 * Stripe, accès sans client Stripe, base indisponible). Bandeau d'erreur et e-mail de demande.
 */
export const RESILIATION_DELAI_EQUIPE = "sous un jour ouvré";

/** Saisie gardée dans l'onglet le temps d'une reconnexion (session expirée, UX O3), puis effacée. */
export const CLE_SAISIE_SESSION = "resiliation-saisie";

/** Ancre de la politique de confidentialité (partie 2, réponse à la résiliation). */
export const RESILIATION_CONFIDENTIALITE_ANCRE = "resiliation";

/**
 * Date des ajouts « résiliation » de la politique de confidentialité (« Dernière mise à jour »,
 * prise en compte seulement interrupteur ouvert) : date de l'ouverture (s27). Si le déploiement
 * a lieu un autre jour, mettre ici la date réelle de mise en ligne.
 */
export const RESILIATION_DATE_TEXTES = "25 novembre 2026";
