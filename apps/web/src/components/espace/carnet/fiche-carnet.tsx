import type { CarnetFiche } from "@/lib/carnet";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CADRE_CARTE, CADRE_CARTE_PRINCIPALE } from "@/components/espace/carte/styles";
import { META, TEXTE, TEXTE_FORT } from "@/components/espace/typo";
import { TEXTES_CARNET_LISTE } from "@/config/textes/carnet-liste-s26";
import { EMOJIS_RUBRIQUES } from "@/components/espace/emojis";

/** Échange de la fiche : « On te dit » sur fond élevé neutre, « Tu réponds » (le cœur) en teinte violette de l'accueil. */
const BULLE = "rounded-xl bg-background-elevated p-4";
const BULLE_REPONSE = "rounded-xl bg-accent-primary/10 p-4";
const ETIQUETTE_BULLE = "text-sm font-semibold text-text-secondary";

function Bloc({ titre, children }: { titre: string; children: string }) {
  return (
    <div>
      <h3 className={TEXTE_FORT}>{titre}</h3>
      <p className={cn("mt-2", TEXTE)}>{children}</p>
    </div>
  );
}

/**
 * Fiche du carnet, espace ouvert. s26 carnet liste et détail (`docs/ux/carnet-audit-s26.md`, DA de l'accueil décidée
 * par Thomas le 20/11) : carte à bandeau violet de l'accueil (`CADRE_CARTE`, comme les cartes du « Contenu du jour »),
 * émoji, pastille violette « Carnet » et pastille neutre du `contexte` ; « Situation n sur N » (« , offerte » pour le
 * non-abonné) ; grand titre. Intérieur en deux colonnes dès 768 px : la situation, « On te dit », « Tu réponds » ; puis
 * « Pourquoi ça marche », « Si ça se tend », « À toi de jouer ». Server Component : aucune donnée dans le JS client.
 * Ancre `fiche-<id>` gardée (lien de l'encart des articles vers la fiche offerte). Fermé : `CarnetFicheCard`, inchangé.
 */
export function FicheCarnet({
  fiche,
  numero,
  total,
  offerte,
  titreId,
}: {
  fiche: CarnetFiche;
  numero: number;
  total: number;
  offerte: boolean;
  /** Fiche du panneau (abonné) : titre ciblé par le focus à l'ouverture. */
  titreId?: string;
}) {
  return (
    <article id={`fiche-${fiche.id}`} className={cn(offerte ? CADRE_CARTE : CADRE_CARTE_PRINCIPALE, "min-w-0 scroll-mt-24 p-6 [overflow-wrap:anywhere]")} data-carnet-fiche={fiche.id}>
      <header>
        <div className="flex flex-wrap items-center gap-2" data-carnet-pastilles>
          <span className="text-2xl" aria-hidden="true">{EMOJIS_RUBRIQUES.carnet}</span>
          <Badge variant="primary">Carnet</Badge>
          <Badge variant="default">{frTypo(fiche.contexte)}</Badge>
        </div>
        <p className={cn("mt-4", META)} data-carnet-numero>
          {TEXTES_CARNET_LISTE.situationSur(numero, total)}
          {offerte ? ", offerte" : ""}
        </p>
        <h2 id={titreId} tabIndex={titreId ? -1 : undefined} className="mt-2 font-display text-2xl font-bold text-text-primary focus:outline-none lg:text-3xl [text-wrap:balance]">
          {frTypo(fiche.titre)}
        </h2>
      </header>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="min-w-0 space-y-6">
          <p className={TEXTE}>{frTypo(fiche.situation)}</p>
          <div className={BULLE}>
            <p className={ETIQUETTE_BULLE}>On te dit</p>
            <p className={cn("mt-2 italic", TEXTE)}>{frTypo(fiche.onTeDit)}</p>
          </div>
          <div className={BULLE_REPONSE}>
            <p className="text-sm font-semibold text-accent-link">Tu réponds</p>
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
