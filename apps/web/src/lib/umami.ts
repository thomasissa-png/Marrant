/**
 * Événement personnalisé Umami, côté client. Même mécanique que le partage de
 * vanne (`window.umami.track`, script chargé dans app/layout.tsx) : no-op côté
 * serveur, si le script est bloqué ou pas encore chargé, et sous l'aperçu
 * admin `/blog/apercu` (relectures et captures ne faussent pas les stats).
 */
import { isBlogPreviewPath } from "@/config/blog-preview";

type UmamiData = Record<string, string | number>;

interface UmamiWindow {
  umami?: { track?: (name: string, data?: UmamiData) => void };
}

export function trackUmami(name: string, data?: UmamiData): void {
  if (typeof window === "undefined") return;
  if (isBlogPreviewPath(window.location.pathname)) return;
  (window as unknown as UmamiWindow).umami?.track?.(name, data);
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
