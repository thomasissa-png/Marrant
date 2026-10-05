/**
 * Événement personnalisé Umami, côté client. Même mécanique que le partage de
 * vanne (`window.umami.track`, script chargé dans app/layout.tsx) : no-op côté
 * serveur, si le script est bloqué ou pas encore chargé.
 */
type UmamiData = Record<string, string | number>;

interface UmamiWindow {
  umami?: { track?: (name: string, data?: UmamiData) => void };
}

export function trackUmami(name: string, data?: UmamiData): void {
  if (typeof window === "undefined") return;
  (window as unknown as UmamiWindow).umami?.track?.(name, data);
}
