import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TEXTES_API } from "@/config/textes/compte";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";

/**
 * « Mon profil », état d'erreur (s24, lot D10, espace ouvert seulement) : le compte n'a pas pu être lu.
 * Fermé, le profil garde son comportement d'aujourd'hui (squelette). Textes déjà validés, aucun neuf :
 * message `TEXTES_API.erreurServeur` (étalon 4 b, s16), bouton « Réessayer » (lot D6).
 */
export function ErreurProfil({ onReessayer }: { onReessayer: () => void }) {
  return (
    <Card data-testid="profil-erreur">
      <CardContent className="flex flex-col items-start gap-3 py-8">
        <p role="alert" className="text-sm text-text-primary">
          {TEXTES_API.erreurServeur}
        </p>
        <Button variant="outline" size="sm" className="min-h-11" onClick={onReessayer}>
          {TEXTES_QUOI_REPONDRE.reessayer}
        </Button>
      </CardContent>
    </Card>
  );
}
