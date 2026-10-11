import type { UserProgress } from "@/components/parcours/parcours-types";

/**
 * s17 tour 2 : dernière progression d'un abonné reçue du serveur, gardée dans le
 * navigateur (stale-while-revalidate). Le HTML ISR est partagé, il ne connaît pas la
 * progression : sans ce cache, la page affichait « 0/N » et un faux verrou tant que
 * /api/parcours/by-slug n'avait pas répondu. Liée au compte : jamais celle d'un autre.
 */
const cle = (slug: string) => `parcours-progression:${slug}`;

export function lireProgressionCache(slug: string, userId: string | undefined): UserProgress | null {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(cle(slug));
    if (!raw) return null;
    const data = JSON.parse(raw) as { userId?: string; progress?: UserProgress };
    if (data.userId !== userId || !Array.isArray(data.progress?.completedSteps)) return null;
    return data.progress;
  } catch {
    return null;
  }
}

export function ecrireProgressionCache(slug: string, userId: string | undefined, progress: UserProgress | null) {
  if (!userId) return;
  try {
    if (progress) localStorage.setItem(cle(slug), JSON.stringify({ userId, progress }));
    else localStorage.removeItem(cle(slug));
  } catch {
    // Stockage indisponible : la progression arrivera simplement avec le serveur.
  }
}
