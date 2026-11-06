import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";
import { HAUTEUR_MIN_PAGE } from "@/components/resiliation/carte-app-store";
import { cn } from "@/lib/utils";

/**
 * s23, UX C4 : squelette pendant la lecture du compte (connexion lente). H1, une carte de ~270 px,
 * 3 lignes, aucun bouton. Même colonne que `page.tsx` (et même hauteur minimale, design O5).
 * Servi seulement interrupteur ouvert : `layout.tsx` renvoie 404 avant ce Suspense.
 */
export default function ResiliationLoading() {
  return (
    <div className={cn("mx-auto max-w-xl", HAUTEUR_MIN_PAGE)} aria-busy="true">
      <h1 className="font-display text-3xl font-bold md:text-4xl">{T.titre}</h1>
      <div className="mt-6 h-[270px] animate-pulse rounded-lg border border-border bg-background-card p-5 md:p-6" aria-hidden="true">
        <div className="h-4 w-1/3 rounded bg-background-elevated" />
        <div className="mt-6 h-4 w-full rounded bg-background-elevated" />
        <div className="mt-4 h-4 w-2/3 rounded bg-background-elevated" />
      </div>
    </div>
  );
}
