import type { Metadata } from "next";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { garderEspace } from "@/lib/espace/garde";
import { NOINDEX_ROBOTS } from "@/lib/seo-meta";

/**
 * Coque de l'espace client (s24, lot D0). Rendu : dynamique à chaque requête, jamais
 * prérendu ni ISR (`force-dynamic`) : la route n'entre pas dans le prerender-manifest,
 * donc ni le cache R2 d'OpenNext ni son interception (`enableCacheInterception`) ne la
 * servent ; Next pose `Cache-Control: private, no-cache, no-store, max-age=0,
 * must-revalidate` sur toute réponse dynamique (contrôlé au build et en Playwright).
 *
 * Interrupteur fermé : `notFound()` avant toute lecture, la vraie 404 du site
 * (`app/not-found.tsx`), et aucune métadonnée propre (head de la 404 inchangé).
 * Ouvert : `noindex, nofollow`, puis garde (session, plan relu en base, `/abonnement`
 * pour tout compte sans abonnement actif). Chaque page appelle aussi la garde.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return ESPACE_CLIENT_PUBLIE ? { ...NOINDEX_ROBOTS } : {};
}

export default async function MonEspaceLayout({ children }: { children: React.ReactNode }) {
  await garderEspace();
  return <>{children}</>;
}
