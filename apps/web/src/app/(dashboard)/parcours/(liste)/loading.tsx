import { Card, CardContent } from "@/components/ui/card";
import { PAGES_ETAT } from "@/config/textes/parcours";

/**
 * Chargement de la LISTE /parcours (FS-13 a) : squelette, annoncé une fois au lecteur d'écran.
 * Volontairement dans le groupe (liste) : placé dans parcours/, il enveloppait aussi
 * [slug] dans un Suspense, la page détail streamait en 200 avant notFound() et un slug
 * inconnu ne renvoyait plus 404 (régression s17, QA-11).
 */
export default function ParcoursLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-4" aria-busy="true">
      <p className="sr-only" role="status">{PAGES_ETAT.chargement}</p>
      <div className="h-9 w-2/3 animate-pulse rounded bg-background-elevated" />
      <div className="h-4 w-full animate-pulse rounded bg-background-elevated" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="py-8">
            <div className="h-6 w-2/3 rounded bg-background-elevated" />
            <div className="mt-3 h-4 w-full rounded bg-background-elevated" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
