import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { TABLEAU, type LigneTableau, type LigneTableauCle } from "@/config/textes/abonnement-vente";

/**
 * B3 de /abonnement (trajet de conversion s21, @ux §5 et §6) : vrai `<table>` 3 colonnes, `<th scope>`,
 * ✓ doublé d'un texte masqué « inclus », « Non » écrit (jamais la couleur seule). Colonne Premium
 * sur fond accent léger. La ligne qui répond à l'origine du clic est mise en avant (mur, fiche,
 * carnet, favoris, aperçu d'étape). Sans état : rendu serveur ou client indifféremment.
 */
export function TableauGratuitPremium({
  lignes,
  ligneMiseEnAvant = null,
}: {
  lignes: readonly LigneTableau[];
  ligneMiseEnAvant?: LigneTableauCle | null;
}) {
  return (
    <section aria-labelledby="abonnement-tableau-titre" className="mt-10 md:mt-14" data-testid="abonnement-tableau">
      {/* v2 A10 : titre gardé pour les lecteurs d'écran, masqué à l'écran. */}
      <h2 id="abonnement-tableau-titre" className="sr-only">
        {frTypo(TABLEAU.titre)}
      </h2>
      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">{frTypo(TABLEAU.titre)}</caption>
        <colgroup>
          <col className="w-[44%]" />
          <col className="w-[24%]" />
          <col className="w-[32%]" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="pb-2 text-left">
              <span className="sr-only">{TABLEAU.colonneLibelle}</span>
            </th>
            <th scope="col" className="pb-2 text-center font-semibold text-text-secondary">
              {TABLEAU.colonneGratuit}
            </th>
            <th scope="col" className="rounded-t-lg border-x-2 border-t-2 border-accent-primary bg-accent-primary/10 py-2 text-center font-semibold text-text-primary">
              {TABLEAU.colonnePremium}
            </th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne, i) => {
            const enAvant = ligne.cle === ligneMiseEnAvant;
            const derniere = i === lignes.length - 1;
            return (
              <tr
                key={ligne.cle}
                data-ligne={ligne.cle}
                data-en-avant={enAvant ? "oui" : undefined}
                className={cn("border-t border-border", enAvant && "bg-background-elevated")}
              >
                <th scope="row" className={cn("py-3 pr-2 text-left align-middle font-medium leading-snug text-text-primary", enAvant && "font-semibold")}>
                  {frTypo(ligne.libelle)}
                </th>
                <td className="px-1 py-3 text-center align-middle leading-snug text-text-secondary">
                  <Cellule valeur={ligne.gratuit} />
                </td>
                <td
                  className={cn(
                    "border-x-2 border-accent-primary bg-accent-primary/10 px-1 py-3 text-center align-middle font-medium leading-snug text-text-primary",
                    derniere && "rounded-b-lg border-b-2",
                  )}
                >
                  <Cellule valeur={ligne.premium} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function Cellule({ valeur }: { valeur: string | boolean }) {
  if (valeur === true) {
    return (
      <>
        <span aria-hidden="true" className="text-base text-success">✓</span>
        <span className="sr-only">{TABLEAU.inclus}</span>
      </>
    );
  }
  if (valeur === false) return <span className="text-text-muted">{TABLEAU.non}</span>;
  return <>{frTypo(valeur)}</>;
}
