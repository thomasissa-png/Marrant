/**
 * Attribution réseau social → site (stratégie de relance v5, §2.3 et §2.5).
 *
 * À l'arrivée, `utm_source` et `utm_content` sont lus dans l'URL, filtrés par
 * liste blanche et gardés en sessionStorage ; les événements Umami du tunnel
 * reçoivent alors `origine` (= utm_source) et `contenu` (= utm_content), `src`
 * inchangé. La bascule « Ouvrir dans mon navigateur » transporte ces valeurs
 * dans `/register?…&origine=…&contenu=…` : relues à l'arrivée dans le nouveau
 * navigateur, l'UTM d'arrivée reste prioritaire.
 * Limite écrite : attribution = session d'arrivée (onglet), jamais de donnée
 * personnelle, jamais de valeur libre.
 */

export const ORIGINES = ["x", "instagram", "linkedin"] as const;
export type Origine = (typeof ORIGINES)[number];

/** `utm_content` du tableau v5 §2 (X, LinkedIn, blocs de `/liens`). */
export const CONTENUS = [
  "lundi",
  "jeudi",
  "quiz",
  "saison",
  "relais",
  "bio-article",
  "bio-quiz",
  "bio-vanne",
  "bio-parcours",
  "bio-vannes",
  "bio-conseils",
] as const;
export type Contenu = (typeof CONTENUS)[number];

export interface Attribution {
  origine: Origine | null;
  contenu: Contenu | null;
}

export const EMPTY_ATTRIBUTION: Attribution = { origine: null, contenu: null };

const STORAGE_ORIGINE = "marrant-origine";
const STORAGE_CONTENU = "marrant-contenu";

export function sanitizeOrigine(raw: string | null | undefined): Origine | null {
  return typeof raw === "string" && (ORIGINES as readonly string[]).includes(raw) ? (raw as Origine) : null;
}

export function sanitizeContenu(raw: string | null | undefined): Contenu | null {
  return typeof raw === "string" && (CONTENUS as readonly string[]).includes(raw) ? (raw as Contenu) : null;
}

/**
 * Attribution à retenir après lecture d'une URL (fonction pure).
 * - `utm_source` présent : nouvelle arrivée, elle remplace tout (une source
 *   hors liste blanche efface l'attribution sociale) ;
 * - sinon `origine` (bascule depuis une application) : retenu seulement si
 *   rien n'est déjà gardé (UTM d'arrivée prioritaire) ;
 * - sinon : attribution gardée inchangée.
 */
export function resolveAttribution(search: string, stored: Attribution): Attribution {
  const params = new URLSearchParams(search);
  if (params.has("utm_source")) {
    const origine = sanitizeOrigine(params.get("utm_source"));
    return origine ? { origine, contenu: sanitizeContenu(params.get("utm_content")) } : EMPTY_ATTRIBUTION;
  }
  const origine = sanitizeOrigine(params.get("origine"));
  if (origine && !stored.origine) {
    return { origine, contenu: sanitizeContenu(params.get("contenu")) };
  }
  return stored;
}

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    // Stockage bloqué (navigation privée stricte, iframe) : pas d'attribution.
    return null;
  }
}

export function readStoredAttribution(): Attribution {
  const s = storage();
  if (!s) return EMPTY_ATTRIBUTION;
  try {
    return {
      origine: sanitizeOrigine(s.getItem(STORAGE_ORIGINE)),
      contenu: sanitizeContenu(s.getItem(STORAGE_CONTENU)),
    };
  } catch {
    return EMPTY_ATTRIBUTION;
  }
}

function writeStoredAttribution({ origine, contenu }: Attribution): void {
  const s = storage();
  if (!s) return;
  try {
    if (origine) s.setItem(STORAGE_ORIGINE, origine);
    else s.removeItem(STORAGE_ORIGINE);
    if (contenu) s.setItem(STORAGE_CONTENU, contenu);
    else s.removeItem(STORAGE_CONTENU);
  } catch {
    // Quota ou stockage refusé : on ignore, la mesure n'est jamais bloquante.
  }
}

/** Lit l'URL courante et met à jour l'attribution gardée (idempotent). */
export function captureAttribution(search: string = typeof window === "undefined" ? "" : window.location.search): Attribution {
  const stored = readStoredAttribution();
  const next = resolveAttribution(search, stored);
  if (next.origine !== stored.origine || next.contenu !== stored.contenu) writeStoredAttribution(next);
  return next;
}

/** Propriétés Umami : `{ origine, contenu }` présents seulement s'ils sont connus. */
export function attributionProps({ origine, contenu }: Attribution): Partial<Record<"origine" | "contenu", string>> {
  const props: Partial<Record<"origine" | "contenu", string>> = {};
  if (origine) props.origine = origine;
  if (origine && contenu) props.contenu = contenu;
  return props;
}
