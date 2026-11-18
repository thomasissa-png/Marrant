import type { CarnetFiche } from "@/lib/carnet";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { ETIQUETTE, META, TEXTE, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";

/** Échange de la fiche (« On te dit », « Tu réponds ») : fond élevé neutre, plus de teinte violette (un seul aplat). */
const BULLE = "rounded-xl bg-background-elevated p-4";

function Bloc({ titre, children }: { titre: string; children: string }) {
  return (
    <div>
      <h3 className={TEXTE_FORT}>{titre}</h3>
      <p className={cn("mt-2", TEXTE)}>{children}</p>
    </div>
  );
}

/**
 * Fiche du carnet, espace ouvert (s26, `docs/design/favoris-carnet-s26.md` §3 et §4) : cadre neutre (plus de filet ni
 * de kicker en capitales), étiquette « Situation n » (« , offerte » pour le non-abonné), titre en `TITRE_CARTE`, contexte
 * en `META`. Intérieur en deux colonnes dès 768 px : à gauche la situation, « On te dit », « Tu réponds » (le cœur) ; à
 * droite « Pourquoi ça marche », « Si ça se tend », « À toi de jouer ». Sous 768 px, une colonne, dans cet ordre.
 * Server Component : aucune donnée ne part dans le JS client. Ancre `fiche-<id>` inchangée, sous l'en-tête collant.
 * Fermé : `CarnetFicheCard` (`components/carnet/carnet-fiche-card.tsx`), inchangé.
 */
export function FicheCarnet({ fiche, numero, offerte }: { fiche: CarnetFiche; numero: number; offerte: boolean }) {
  return (
    <article id={`fiche-${fiche.id}`} className={cn(CADRE_CARTE_NEUTRE, "min-w-0 scroll-mt-24 p-6 [overflow-wrap:anywhere]")} data-carnet-fiche={fiche.id}>
      <header>
        <p className={ETIQUETTE}>
          Situation {numero}
          {offerte ? ", offerte" : ""}
        </p>
        <h2 className={cn("mt-2", TITRE_CARTE)}>{frTypo(fiche.titre)}</h2>
        <p className={cn("mt-2", META)}>{frTypo(fiche.contexte)}</p>
      </header>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="min-w-0 space-y-6">
          <p className={TEXTE}>{frTypo(fiche.situation)}</p>
          <div className={BULLE}>
            <p className={ETIQUETTE}>On te dit</p>
            <p className={cn("mt-2 italic", TEXTE)}>{frTypo(fiche.onTeDit)}</p>
          </div>
          <div className={BULLE}>
            <p className={ETIQUETTE}>Tu réponds</p>
            <p className={cn("mt-2", TEXTE_FORT)}>{frTypo(fiche.reponse)}</p>
          </div>
        </div>
        <div className="min-w-0 space-y-6">
          <Bloc titre="Pourquoi ça marche">{frTypo(fiche.pourquoi)}</Bloc>
          <Bloc titre="Si ça se tend">{frTypo(fiche.siTendu)}</Bloc>
          <Bloc titre="À toi de jouer">{frTypo(fiche.exercice)}</Bloc>
        </div>
      </div>
    </article>
  );
}
