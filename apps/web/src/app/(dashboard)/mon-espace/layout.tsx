import type { Metadata } from "next";
import { headers } from "next/headers";
import { EN_TETE_CHEMIN_ESPACE, ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { garderEspace } from "@/lib/espace/garde";
import { estAdresseApercu, lireLecteurApercu } from "@/components/espace/apercu/acces";
import { noterEvenementEspace } from "@/lib/mesure/evenements-espace";
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
 * Lot D9 : `espace_ouvert` (une fois par jour de Paris, `UsageEvent`), écrit seulement ouvert, awaité,
 * jamais bloquant (rétention J7, J30, J60 de l'architecture 7.6).
 * Lot D11b (Q-1) : la garde du layout reçoit l'adresse demandée (en-tête posé par le middleware) ; sans elle,
 * un visiteur sur `/mon-espace/questions/…` revenait sur « Aujourd'hui » après connexion.
 * Nav v6 (s25, lot B) : ouvert, l'adresse exacte d'une rubrique Premium de la bande (`estAdresseApercu`) ne
 * redirige plus le visiteur ni l'inscrit gratuit ; sa page rend l'aperçu (`ApercuRubrique`). Abonné et ancien
 * abonné : la garde d'avant. Fermé : inchangé.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return ESPACE_CLIENT_PUBLIE ? { ...NOINDEX_ROBOTS } : {};
}

export default async function MonEspaceLayout({ children }: { children: React.ReactNode }) {
  const chemin = ESPACE_CLIENT_PUBLIE ? headers().get(EN_TETE_CHEMIN_ESPACE) : null;
  if (ESPACE_CLIENT_PUBLIE && estAdresseApercu(chemin) && (await lireLecteurApercu())) return <>{children}</>;
  const { userId } = await garderEspace(chemin);
  await noterEvenementEspace({ type: "espace_ouvert" }, userId);
  // Relecture des captures nav s24, tour 2 (reviewer FD-B) : plus de hauteur minimale ici (elle poussait le pied
  // sous l'écran) ; le pied reste en bas grâce à la coque du site (`(dashboard)/layout.tsx`, ouvert seulement).
  return <>{children}</>;
}
