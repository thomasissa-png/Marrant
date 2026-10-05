/**
 * Calendrier social (s15) : valeurs business partagées par le Worker (reprise,
 * couverture, garde des relais) et les scripts de lot.
 * Sources : `docs/social/strategie-relance-v5.md` (heures de Paris, grille §1,
 * silences §3, exclusions §1) et `docs/social/plan-execution-s15.md` v2
 * (§5 tranches et règle de prêt à J-14, §8 alertes) puis v3 (§2 vagues V1 à V4,
 * §8 démarrages de session, §9 jalons et relevé du lundi).
 */
export type ReseauSocial = "TWITTER" | "INSTAGRAM" | "LINKEDIN";

/** Heure de Paris de chaque réseau (v5 §1, Instagram 19:30 depuis le 05/10). */
export const HEURE_PARIS: Record<ReseauSocial, { h: number; m: number }> = {
  TWITTER: { h: 12, m: 30 },
  INSTAGRAM: { h: 19, m: 30 },
  LINKEDIN: { h: 8, m: 15 },
};

/** Jours de la grille v5 (1 = lundi … 5 = vendredi) : X 5, Instagram 5, LinkedIn 2. */
export const JOURS_GRILLE: Record<ReseauSocial, number[]> = {
  TWITTER: [1, 2, 3, 4, 5],
  INSTAGRAM: [1, 2, 3, 4, 5],
  LINKEDIN: [2, 4],
};
/** LinkedIn du jeudi 24/12 déplacé au mercredi 23/12 (v5 §3, S11). */
export const LI_DEPLACE: Record<string, string> = { "2026-12-24": "2026-12-23" };

/** Jours de silence (v5 §3) : 11/11 et Black Friday 27/11. Aucun post, aucune reprogrammation. */
export const SILENCES_SOCIAL = new Set(["2026-11-11", "2026-11-27"]);

/**
 * Tranches du plan v2 (§5), dates de Paris incluses : lancement (e-mail du Worker),
 * prêt (inséré APPROVED ; J-14 sauf 1a et 1b, relance décidée le 05/10).
 */
export interface TrancheSociale { id: string; debut: string; fin: string; lancement: string; pret: string }
export const TRANCHES_SOCIALES: TrancheSociale[] = [
  { id: "1a", debut: "2026-10-12", fin: "2026-10-18", lancement: "2026-10-05", pret: "2026-10-09" },
  { id: "1b", debut: "2026-10-19", fin: "2026-11-15", lancement: "2026-10-05", pret: "2026-10-14" },
  { id: "2a", debut: "2026-11-16", fin: "2026-12-06", lancement: "2026-10-19", pret: "2026-11-02" },
  { id: "2b", debut: "2026-12-07", fin: "2027-01-03", lancement: "2026-11-02", pret: "2026-11-23" },
  { id: "3a", debut: "2027-01-04", fin: "2027-01-17", lancement: "2026-11-30", pret: "2026-12-21" },
  { id: "3b", debut: "2027-01-18", fin: "2027-01-31", lancement: "2026-12-14", pret: "2027-01-04" },
  { id: "4", debut: "2027-02-01", fin: "2027-02-28", lancement: "2027-01-04", pret: "2027-01-18" },
  { id: "5", debut: "2027-03-01", fin: "2027-03-28", lancement: "2027-02-01", pret: "2027-02-15" },
  { id: "6", debut: "2027-03-29", fin: "2027-05-02", lancement: "2027-03-01", pret: "2027-03-15" },
];

/** File basse : alerte si la file APPROVED d'un réseau actif couvre moins de N jours (§5, §8). */
export const COUVERTURE_MIN_JOURS = 10;
/** Rappel de lancement : file d'un réseau actif sous N jours et tranche suivante incomplète (§8). */
export const COUVERTURE_LANCEMENT_JOURS = 21;
/**
 * Vagues de vannes neuves (plan v3 §2) : démarrage de la production (e-mail de démarrage,
 * §8) et livraison (e-mail de rappel : pool strict à mettre à jour, `social-pool.ts`).
 */
export const VAGUES_VANNES: Array<{ id: string; cible: number; tranche: string; demarrage: string; livraison: string; pret: string }> = [
  { id: "V1", cible: 34, tranche: "2a", demarrage: "2026-10-12", livraison: "2026-10-26", pret: "2026-11-02" },
  { id: "V2", cible: 48, tranche: "2b", demarrage: "2026-10-27", livraison: "2026-11-13", pret: "2026-11-23" },
  { id: "V3", cible: 20, tranche: "3a", demarrage: "2026-11-16", livraison: "2026-12-11", pret: "2026-12-21" },
  { id: "V4", cible: 20, tranche: "4 et 5", demarrage: "2026-12-14", livraison: "2027-01-08", pret: "2027-01-18" },
];

/** J0 des réseaux (plan v3 §7, `[HYPOTHÈSE]` 12/10 pour les trois) : à décaler ici si un réseau glisse (§9). */
export const J0_SOCIAL = "2026-10-12";
/** Jalons de mesure (plan v3 §9, `mesure.md` §2) : fiche d'une page préparée le dimanche d'avant. */
export const JALONS_JOURS = [14, 28, 56, 84, 112];

/** Stock éligible : alerte sous N vannes du pool strict libres à 90 jours, par réseau (§2, §8). */
export const STOCK_MIN_VANNES = 14;
export const ANTI_REPETITION_JOURS = 90;
/** Pause automatique d'un réseau après N échecs consécutifs (FAILED). */
export const ECHECS_AVANT_PAUSE = 2;
/** Reprise : un post en retard de plus de N heures n'est jamais reprogrammé (REJECTED). */
export const RETARD_MAX_REPRISE_HEURES = 24;

/** Déjà connues sous 8 à l'aveugle (v5 §1) et perdants des duels du cycle 5 : hors tirage et hors stock. */
export const SOUS_HUIT = [
  "cs14jkefbc9f40abb6f8a2ca", "cs14jke4221e9a31a33b0395", "cs14jk9cc844b92fde69e845", "cmmnsqn14004sth63rnutrbwi", "cs14jk0aa83dd779a1c72b43",
  "cs14jk5ce9195f000dfa330f", "cs14jk10c844a13d108646fd", "cs14jk1a722c352c691f600e", "cs14jk0d9dfe9b5c26db5f8d",
  "cs14jk1e07f8547b752601b8", "cs14jk44dcd2dbf3ec29324d", "cs14jk812483721e0a4d4228",
];
/** Réservées à Noël : hors tirage et hors stock avant le 24/12 (v5 §1). */
export const RESERVEES_NOEL = ["cs14jkee5c537f7286c1da98", "cs14jk4fe660e7238281ce47", "cs14jkc4a2c545e132b38a92", "cs14jkffeab1620070f2263e"];
export const NOEL_DES = "2026-12-24";
/** Motif « pain » : au plus un par fenêtre de 30 jours (v5 §1) ; hors stock courant. */
export const PAIN_IDS = ["cs14jk02047ed5635bab6a52", "cs14jke956e7ca02641e25c5", "cs14jkffeab1620070f2263e"];

/** Consigne jointe aux alertes de file basse, de lot en retard, de stock et de lancement (recette du plan v2 §5). */
export const CONSIGNE_RELANCE_LOT =
  "Prépare la tranche sociale indiquée selon docs/social/plan-execution-s15.md (§5, recette d'un lot, étapes 1 à 8) : " +
  "dry-run de prepare-social-month.ts --lot <id> --debut <date> --fin <date> --pool <fichier>, 0 erreur bloquante, " +
  "relecture à l'aveugle, contrôles @reviewer et @qa, puis --insert --driver=neon-http (posts insérés = dry-run par réseau et par semaine), " +
  "commit et ligne REPLIT_ACTIONS.md.";

/** Consigne de l'e-mail de vague (démarrage ou livraison). */
export const CONSIGNE_VAGUE =
  "Vague de vannes neuves selon docs/social/plan-execution-s15.md (§2) : candidats = cible / rendement mesuré, " +
  "relecture à l'aveugle (au niveau = 8,5 et plus chez les 2), échantillon de 10 à Thomas (D7), puis ajout des " +
  "identifiants validés à apps/web/src/config/social-pool.ts (pool strict, ordre par note), commit et déploiement.";
/** Consigne de l'e-mail de jalon (fiche d'une page, le dimanche). */
export const CONSIGNE_JALON =
  "Fiche de jalon d'une page selon docs/social/plan-execution-s15.md (§9) et docs/social/mesure.md : seuils par réseau, " +
  "note moyenne des posts de la période (lecture du stock), visites par lundi avec article ; Thomas répond « ok » ou choisit.";
/** Consigne du relevé du lundi (ajoutée à l'e-mail du lundi). */
export const CONSIGNE_RELEVE =
  "Relevé du lundi (docs/social/plan-execution-s15.md §9) : écrire docs/social/releves/AAAA-MM-JJ.md avec prévu/publié et statut " +
  "Buffer, FAILED, couverture en jours, stock éligible par réseau, visites Umami par utm_source, entonnoir par origine, référents " +
  "t.co, l.instagram.com, lnkd.in ; Thomas colle ses chiffres natifs (D6). Deux semaines de suite prévu ≠ publié = pause du réseau.";
