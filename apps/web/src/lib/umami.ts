/**
 * Événement personnalisé Umami, côté client. Même mécanique que le partage de
 * vanne (`window.umami.track`, script chargé dans app/layout.tsx) : no-op côté
 * serveur, si le script est bloqué ou pas encore chargé, et sous l'aperçu
 * admin `/blog/apercu` (relectures et captures ne faussent pas les stats).
 */
import { isBlogPreviewPath } from "@/config/blog-preview";
import { attributionProps, captureAttribution } from "@/lib/attribution";

type UmamiData = Record<string, string | number>;

interface UmamiWindow {
  umami?: { track?: (name: string, data?: UmamiData) => void };
}

/**
 * Événements du tunnel qui reçoivent `origine` et `contenu` (attribution
 * réseau social, v5 §2.3). Propriétés existantes jamais écrasées ; sans
 * arrivée sociale, l'événement part tel quel.
 */
export const ATTRIBUTED_EVENTS: ReadonlySet<string> = new Set([
  "quiz-termine",
  "parcours-etape",
  "inscription-envoi",
  "inscription-reussie",
  "onboarding-termine",
  "blog-cta-clic",
  // Chemin visiteur → Premium (plus de compte gratuit, s15) : le jugement porte
  // sur ces trois-là, attribués comme le reste du tunnel.
  "abonnement-clic",
  "abonnement-reussi",
  "abonnement-annule",
  // Audit parcours s16 (reco 17) : marches amont et échecs du tunnel.
  "mur-vu",
  "abonnement-vu",
  "inscription-echec",
  // Audit parcours d'apprentissage s17 (data-analyst §5.2) : ouverture et fin d'un parcours.
  "parcours-ouvert",
  "parcours-termine",
]);

function withAttribution(name: string, data?: UmamiData): UmamiData | undefined {
  if (!ATTRIBUTED_EVENTS.has(name)) return data;
  const props = attributionProps(captureAttribution());
  if (Object.keys(props).length === 0) return data;
  return { ...props, ...data };
}

export function trackUmami(name: string, data?: UmamiData): void {
  if (typeof window === "undefined") return;
  if (isBlogPreviewPath(window.location.pathname)) return;
  (window as unknown as UmamiWindow).umami?.track?.(name, withAttribution(name, data));
}

/**
 * Variante pour les événements émis au chargement d'une page (retour Google,
 * retour Stripe) : le tracker est chargé en `defer` et peut ne pas encore
 * exister. On réessaie toutes les 250 ms pendant 10 s au plus, puis on abandonne
 * (jamais d'erreur visible).
 */
export function trackUmamiWhenReady(name: string, data?: UmamiData, timeoutMs = 10_000): void {
  if (typeof window === "undefined") return;
  const started = Date.now();
  const attempt = () => {
    const track = (window as unknown as UmamiWindow).umami?.track;
    if (track) {
      trackUmami(name, data);
      return;
    }
    if (Date.now() - started < timeoutMs) window.setTimeout(attempt, 250);
  };
  attempt();
}
