/**
 * Signal « contenu réservé réellement affiché » (s24, lot 0, §5.2 du brief espace client), partagé
 * par le navigateur (envoi) et la route `POST /api/mesure/acces` (détail enregistré). Sans zod :
 * module chargé côté navigateur.
 *
 * Envoi : `fetch` en `keepalive`, sans attente ni retour visible, une seule fois par signal et par
 * chargement de page. Le serveur relit la session et le plan en base : un compte non Premium
 * n'écrit jamais rien. Aucun texte libre : liste fermée de champs.
 */
export const MESURE_ACCES_API = "/api/mesure/acces";

/** Corps du signal (validé côté serveur par `CORPS_SIGNAL_ACCES` de la route, liste fermée). */
export type SignalAcces =
  | { type: "etape"; parcours: string; etape: number }
  | { type: "liste"; liste: "vannes" | "conseils" | "videos" }
  | { type: "exercice"; fiche: "conseil" | "video" | "vanne" };

/** Détail fermé enregistré pour un signal (`etape:<n>`, `liste-vannes`, `exercice-conseil`…). */
export function detailSignal(signal: SignalAcces): string {
  if (signal.type === "etape") return `etape:${signal.etape}`;
  if (signal.type === "liste") return `liste-${signal.liste}`;
  return `exercice-${signal.fiche}`;
}

const envoyes = new Set<string>();

/** Envoie le signal une fois par chargement de page. Jamais d'exception, jamais d'attente. */
export function signalerAcces(signal: SignalAcces): void {
  const corps = JSON.stringify(signal);
  if (envoyes.has(corps)) return;
  envoyes.add(corps);
  try {
    void fetch(MESURE_ACCES_API, {
      method: "POST",
      keepalive: true,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: corps,
    }).catch(() => undefined);
  } catch {
    // Navigateur sans fetch : rien n'est mesuré.
  }
}

/** Remise à zéro des envois déjà faits (tests). */
export function oublierSignaux(): void {
  envoyes.clear();
}
