import Link from "next/link";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { REASSURANCE_AVEC_LIEN, REASSURANCE_UNIQUE } from "@/config/textes/offre";
import { LIBELLE_RENONCER_CONTRAT } from "@/config/textes/paiement";

/**
 * Réassurance unique (`REASSURANCE_UNIQUE`), rendue de la même façon sous chaque plein qui porte
 * un prix (trajet de conversion s21, tour 2, revue visuelle : « gris minuscule » refusé par la
 * grille §11). Blanc cassé (≈ 13:1 sur la carte #1F1F1F, AA largement), 14 px, centrée.
 *
 * `lienRetractation` (s26, allègement du tunnel du 22/11) : variante avec le lien « Renoncer au
 * contrat ici » vers /retractation, réservée à /abonnement et /register. Lien dans la phrase
 * (cible en ligne, exception WCAG 2.5.8), souligné en permanence.
 */
export function Reassurance({
  className,
  testId,
  lienRetractation = false,
  lienTestId,
  lienClassName,
}: {
  className?: string;
  testId?: string;
  lienRetractation?: boolean;
  lienTestId?: string;
  lienClassName?: string;
}) {
  return (
    <p className={cn("mt-2 text-center text-sm leading-snug text-text-primary/90", className)} data-testid={testId} data-reassurance="">
      {lienRetractation ? (
        <>
          {frTypo(REASSURANCE_AVEC_LIEN.avant)}
          <Link
            href="/retractation"
            className={cn("underline underline-offset-2", lienClassName)}
            data-testid={lienTestId}
          >
            {LIBELLE_RENONCER_CONTRAT}
          </Link>
          {frTypo(REASSURANCE_AVEC_LIEN.apres)}
        </>
      ) : (
        frTypo(REASSURANCE_UNIQUE)
      )}
    </p>
  );
}
