import Link from "next/link";
import { Reassurance } from "@/components/ui/reassurance";
import { Badge } from "@/components/ui/badge";
import { formatCarnetMonth, type CarnetView } from "@/lib/carnet";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { CARNET_LISTE_VISIBLES, CARNET_PAYWALL } from "@/config/textes/cta-pages";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { BOUTON_OFFRE_FIN, CARTE_PREMIUM, HaloPremium, OffreApercu } from "@/components/espace/apercu/offre-apercu";
import { PastillesDa } from "@/components/espace/da-espace";
import { Verrou } from "@/components/espace/apercu/badge-premium";
import { META, TEXTE, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { FicheCarnet } from "@/components/espace/carnet/fiche-carnet";
import { EnTeteCarnet } from "@/components/espace/carnet/en-tete-carnet";
import { PanneauCarnet } from "@/components/espace/carnet/panneau-carnet";
import { EMOJIS_RUBRIQUES } from "@/components/espace/emojis";

type Props = {
  view: CarnetView;
  months: string[];
  returnTo: string;
  src: string;
  visiteur: boolean;
  /** `?contexte=` de l'adresse (filtre de la liste de l'abonné). */
  contexte?: string | string[];
};

/** Fil d'Ariane : retiré sur /carnet (premier niveau, nav v6), gardé sur /carnet/<mois>. Classes d'avant. */
function FilAriane({ view, returnTo }: Pick<Props, "view" | "returnTo">) {
  if (returnTo === "/carnet") return null;
  return (
    <nav aria-label="Fil d’Ariane" className="mb-4 text-sm text-text-muted">
      <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
      <span className="mx-2">/</span>
      <Link href="/carnet" className="hover:text-text-primary max-md:py-3.5">Carnet</Link>
      <span className="mx-2">/</span>
      <span className="text-text-secondary">{formatCarnetMonth(view.mois)}</span>
    </nav>
  );
}

/**
 * `/carnet` et `/carnet/<mois>`, espace OUVERT seulement. Vue déjà filtrée par `carnetViewForPlan` : le verrouillage ne
 * change pas (non-abonné : la fiche offerte, puis les titres et contextes des autres, rien d'autre dans le HTML). Fermé :
 * `CarnetPage` d'avant, au caractère près.
 * s26 carnet liste et détail (`docs/ux/carnet-audit-s26.md` §3) : l'abonné reçoit ici le seul PANNEAU (n° 1 du filtre) ;
 * l'en-tête et la liste sont dans le layout de `/carnet` (`CarnetListeDetail`), montés d'une fiche à l'autre.
 */
export function CarnetOuvert(props: Props) {
  if (!props.view.premium) return <CarnetVisiteur {...props} />;
  const { view, months, contexte } = props;
  return <PanneauCarnet mois={view.mois} courant={view.mois === months[0]} fiches={view.fiches} numero={null} contexteBrut={contexte} />;
}

/**
 * Visiteur et inscrit gratuit, même modèle que l'aperçu de Quoi répondre : hero 8/4 offre EN HAUT (décision du 16/11),
 * le bloc d'offre des aperçus (`OffreApercu`), lien vers `/abonnement` avec la source du carnet. Dessous, la fiche
 * offerte (8, carte de l'accueil, « Situation n sur N, offerte ») et le programme fermé (4, collant dès 1024 px : titres,
 * contexte en pastille neutre, verrou), puis la fin d'extrait (`CARNET_PAYWALL`, mêmes textes). 48 px entre la fiche
 * offerte et la carte de fin ; bouton de la carte de fin en contour sur fenêtre d'au moins 960 px de haut
 * (`BOUTON_OFFRE_FIN`) : un seul bouton plein à l'écran, celui de la carte d'offre.
 * s26 carnet liste et détail : en-tête de l'audit (usage, mois et année) ; pas de liste + détail ici (aucune fiche à
 * ouvrir à part l'offerte, audit §3).
 */
function CarnetVisiteur({ view, returnTo, src, visiteur }: Props) {
  const href = buildAbonnementUrl(returnTo, "monthly", src);
  const offerte = view.fiches[0];
  const restantes = view.apercus.length;
  return (
    <div className="pb-16" data-carnet="visiteur">
      <FilAriane view={view} returnTo={returnTo} />
      <div className="grid gap-4 md:gap-6 lg:grid-cols-12 lg:gap-12" data-carnet-hero>
        <div className="min-w-0 lg:col-span-8">
          {/* s26 contrôle d'ensemble, aperçus (décision de Thomas du 19/11, qui prime sur le « gardé exprès ») : plus de preuve
              « 1 500+ » dans les aperçus de l'espace, Carnet compris. */}
          <EnTeteCarnet mois={view.mois} libelle={formatCarnetMonth(view.mois)} titre={view.titre} intro={view.intro} />
        </div>
        <div className="min-w-0 lg:col-span-4">
          {/* s26 liste et détail : la carte d'offre partagée ne porte plus de preuve (ni l'intro du Carnet, s26 contrôle d'ensemble). */}
          <OffreApercu href={href} adresse={returnTo} visiteur={visiteur} />
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-x-12">
        {restantes > 0 && (
          <section
            aria-labelledby="carnet-reserve"
            className={cn(CADRE_CARTE_NEUTRE, "min-w-0 p-6 lg:sticky lg:top-36 lg:col-span-4 lg:col-start-9 lg:row-start-1")}
            data-carnet-programme
          >
            {/* s26 contrôle d'ensemble, aperçus : DA de l'accueil (bandeau, émoji et pastille violette de la fiche du Carnet). */}
            <PastillesDa as="h2" id="carnet-reserve" emoji={EMOJIS_RUBRIQUES.carnet} pastille={CARNET_PAYWALL.listeTitre} />
            <ol className="mt-4">
              {view.apercus.slice(0, CARNET_LISTE_VISIBLES).map((f) => (
                <li key={f.id} className="flex min-h-11 items-center gap-4 border-t border-border py-2 first:border-t-0">
                  <div className="min-w-0 flex-1 opacity-75">
                    <p className={TEXTE_FORT}>{frTypo(f.titre)}</p>
                    <Badge variant="default" className="mt-1">{frTypo(f.contexte)}</Badge>
                  </div>
                  <Verrou />
                </li>
              ))}
            </ol>
            {restantes > CARNET_LISTE_VISIBLES && <p className={cn("mt-4", META)}>{CARNET_PAYWALL.listeReste(restantes - CARNET_LISTE_VISIBLES)}</p>}
          </section>
        )}
        {offerte && (
          <div className="min-w-0 lg:col-span-8 lg:col-start-1 lg:row-start-1">
            <FicheCarnet fiche={offerte} numero={view.numeros[offerte.id]} total={view.totalFiches} offerte />
          </div>
        )}
        {restantes > 0 && (
          <div className={cn(CARTE_PREMIUM, "mx-auto mt-6 w-full min-w-0 max-w-md p-4 text-center md:p-6 lg:col-span-12")} data-carnet-fin>
            <HaloPremium />
            <div className="relative flex flex-col items-center gap-4">
              <div>
                <p className={TITRE_CARTE}>{frTypo(CARNET_PAYWALL.titre(restantes))}</p>
                <p className={cn("mt-2", TEXTE)}>{frTypo(CARNET_PAYWALL.paragraphe)}</p>
              </div>
              <div className="w-full">
                <Link href={href} data-testid="carnet-paywall-bouton" className={cn(BOUTON_OFFRE_FIN, "w-full")}>
                  {frTypo(CARNET_PAYWALL.bouton)}
                </Link>
                <Reassurance className={cn("mt-2 md:mt-4", META)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
