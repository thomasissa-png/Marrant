import Link from "next/link";
import { chipClass } from "@/components/ui/chip";
import { Reassurance } from "@/components/ui/reassurance";
import { deCarnetMonth, formatCarnetMonth, type CarnetView } from "@/lib/carnet";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { CARNET_LISTE_VISIBLES, CARNET_PAYWALL, CARNET_RETOUR_SOMMAIRE } from "@/config/textes/cta-pages";
import { CADRE_CARTE_NEUTRE, LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { BOUTON_OFFRE, CARTE_PREMIUM, HaloPremium, OffreApercu, Preuve } from "@/components/espace/apercu/offre-apercu";
import { Verrou } from "@/components/espace/apercu/badge-premium";
import { META, TEXTE, TEXTE_FORT, TITRE_CARTE, TITRE_PAGE } from "@/components/espace/typo";
import { FicheCarnet } from "@/components/espace/carnet/fiche-carnet";
import { RailCarnet } from "@/components/espace/carnet/rail-carnet";

/** Ancre du sommaire du carnet de l'abonné (décision de Thomas du 16/11, « Retour au sommaire »). */
const ANCRE_SOMMAIRE = "carnet-sommaire";
const TITRE_ID = "carnet-titre";

type Props = { view: CarnetView; months: string[]; returnTo: string; src: string; visiteur: boolean };

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
 * Sommaire de l'abonné (s26 tour 3) : sous 768 px, une liste dans une seule carte (filets `divide-y`) ; dès 768, une
 * grille de tuiles. Classes du cadre écrites en entier avec leur préfixe (`max-md:` sur la liste, `md:` sur la tuile) :
 * ce sont celles de `CADRE_CARTE_NEUTRE`, que Tailwind ne peut pas préfixer s'il les reçoit construites.
 */
const SOMMAIRE =
  "max-md:divide-y max-md:divide-border max-md:overflow-hidden max-md:rounded-xl max-md:border max-md:border-border max-md:bg-background-card md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3";
/** Ligne (sous 768 : 44 px pour une ligne de titre, anneau de focus intérieur dans la carte) puis tuile (dès 768). */
const ENTREE_SOMMAIRE = cn(
  "flex min-h-11 items-baseline gap-3 px-4 py-2.5 [overflow-wrap:anywhere] max-md:focus-visible:ring-inset",
  "md:relative md:h-full md:flex-col md:items-stretch md:gap-0 md:overflow-hidden md:rounded-xl md:border md:border-border md:bg-background-card md:p-6",
  "hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
);

/** Sur-titre sans capitales (s26) : « Carnet de novembre 2026, 30 situations » (textes existants, ponctuation seule). */
const surTitre = (view: CarnetView) => `Carnet ${deCarnetMonth(view.mois)}, ${view.totalFiches} situations`;

/**
 * En-tête aligné à gauche : sur-titre `META`, H1 `TITRE_PAGE` (blanc), intro `TEXTE`. s26 tour 2 (C1) : chez le
 * non-abonné (`preuve`), la preuve sort de la carte d'offre et se pose sous l'intro, comme dans `HeroApercu`.
 */
function EnTete({ view, preuve = false }: { view: CarnetView; preuve?: boolean }) {
  return (
    <header className="min-w-0">
      <p className={META}>{surTitre(view)}</p>
      <h1 id={TITRE_ID} className={cn("mt-2", TITRE_PAGE)}>{frTypo(view.titre)}</h1>
      <p className={cn("mt-4 max-w-xl", TEXTE)}>{frTypo(view.intro)}</p>
      {preuve && <Preuve place="hero" />}
    </header>
  );
}

/**
 * `/carnet` et `/carnet/<mois>`, espace OUVERT seulement (s26, `docs/ux/favoris-carnet-s26.md` §2, design §3 et §4).
 * Vue déjà filtrée par `carnetViewForPlan` : le verrouillage ne change pas (non-abonné : la fiche offerte, puis les
 * titres et contextes des autres, rien d'autre dans le HTML). Fermé : `CarnetPage` d'avant, au caractère près.
 */
export function CarnetOuvert(props: Props) {
  return props.view.premium ? <CarnetAbonne {...props} /> : <CarnetVisiteur {...props} />;
}

/**
 * Visiteur et inscrit gratuit : hero 8/4 offre EN HAUT (décision du 16/11), le bloc d'offre des aperçus (`OffreApercu`,
 * son style suivra la refonte des encarts Premium), lien vers `/abonnement` avec la source du carnet. Dessous, la fiche
 * offerte (8) et le programme fermé (4, collant dès 1024 px), puis la fin d'extrait (`CARNET_PAYWALL`, mêmes textes).
 * s26 tour 2 (relectures du tour 1) : C1, la preuve passe sous l'intro (`preuveHors`, comme `HeroApercu`) et, de 768 à
 * 1023, la carte d'offre passe sous le texte, en ligne (E2) : plus de 180 à 230 px vides à gauche. C3, la grille sous le
 * hero reprend sa gouttière (`lg:gap-x-12`) : « Au programme » a les bords de la carte d'offre. C2, la fin d'extrait est
 * le MÊME objet Premium que la carte de fin des aperçus (`CARTE_PREMIUM`, `HaloPremium`, 448 px au plus, centrée sur la
 * page, mêmes paddings, bouton pleine largeur et réassurance dessous), mêmes textes dans le même ordre, sur sa rangée.
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
          <EnTete view={view} preuve />
        </div>
        <div className="min-w-0 lg:col-span-4">
          <OffreApercu href={href} adresse={returnTo} visiteur={visiteur} preuveHors />
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-x-12">
        {restantes > 0 && (
          <section
            aria-labelledby="carnet-reserve"
            className={cn(CADRE_CARTE_NEUTRE, "min-w-0 p-6 lg:sticky lg:top-24 lg:col-span-4 lg:col-start-9 lg:row-start-1")}
            data-carnet-programme
          >
            <h2 id="carnet-reserve" className={TITRE_CARTE}>{CARNET_PAYWALL.listeTitre}</h2>
            <ol className="mt-4">
              {view.apercus.slice(0, CARNET_LISTE_VISIBLES).map((f) => (
                <li key={f.id} className="flex min-h-11 items-center gap-4 border-t border-border py-2 first:border-t-0">
                  <div className="min-w-0 flex-1 opacity-75">
                    <p className={TEXTE_FORT}>{frTypo(f.titre)}</p>
                    <p className={META}>{frTypo(f.contexte)}</p>
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
            <FicheCarnet fiche={offerte} numero={view.numeros[offerte.id]} offerte />
          </div>
        )}
        {restantes > 0 && (
          <div className={cn(CARTE_PREMIUM, "mx-auto w-full min-w-0 max-w-md p-4 text-center md:p-6 lg:col-span-12")} data-carnet-fin>
            <HaloPremium />
            <div className="relative flex flex-col items-center gap-4">
              <div>
                <p className={TITRE_CARTE}>{frTypo(CARNET_PAYWALL.titre(restantes))}</p>
                <p className={cn("mt-2", TEXTE)}>{frTypo(CARNET_PAYWALL.paragraphe)}</p>
              </div>
              <div className="w-full">
                <Link href={href} data-testid="carnet-paywall-bouton" className={cn(BOUTON_OFFRE, "w-full")}>
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

/**
 * Abonné : lieu de référence, sans bouton plein ni aplat violet. Sommaire en tuiles (3, 2 puis 1 colonne), la première
 * fiche marquée d'un filet blanc (aucun suivi « lu » n'existe pour le carnet : jamais simulé). Fiches en 9 colonnes avec
 * un rail collant de 3 dès 1024 px, « Retour au sommaire » sous chacune (16/11), puis les carnets précédents.
 * s26 tour 2 (C4, relecture UX du tour 1) : tuiles du sommaire compactes sous 768 px (`p-4`), 24 px dès 768.
 * s26 tour 3 : sous 768 px, le sommaire devient une LISTE compacte (30 tuiles de 114 px, 4 116 px avant la première
 * fiche à 375) : une ligne par fiche, numéro, titre et contexte, 44 px au moins, filets entre les lignes ; dès 768, les
 * tuiles d'avant. La ligne ou la tuile active garde son filet blanc de 2 px sans décaler son texte (1 px de décalage
 * avant, à toutes les largeurs) : en liste, marge gauche réduite de 2 px ; en tuile, bord de 1 px et filet intérieur.
 */
function CarnetAbonne({ view, months, returnTo }: Props) {
  const autresMois = months.filter((m) => m !== view.mois);
  const lignes = view.fiches.map((f) => ({ id: f.id, numero: view.numeros[f.id], titre: frTypo(f.titre) }));
  return (
    <div className="pb-16" data-carnet="abonne">
      <FilAriane view={view} returnTo={returnTo} />
      <EnTete view={view} />
      <nav id={ANCRE_SOMMAIRE} aria-labelledby={TITRE_ID} className="mt-8 scroll-mt-24" data-carnet-sommaire="">
        <ol className={SOMMAIRE}>
          {view.fiches.map((f, i) => (
            <li key={f.id} className="min-w-0">
              <a
                href={`#fiche-${f.id}`}
                className={cn(
                  ENTREE_SOMMAIRE,
                  // Filet blanc de 2 px. En liste : bord de 2 px, marge gauche réduite de 2 px (`pl-3.5`). En tuile : bord de
                  // 1 px comme les voisines, blanc, doublé d'un filet intérieur de 1 px (`before:`) ; les classes `md:` du
                  // cadre l'emportant sur celles sans préfixe, le fond est répété en `md:`.
                  i === 0 &&
                    "border-l-2 border-l-text-primary bg-background-elevated pl-3.5 md:border-l md:border-l-text-primary md:bg-background-elevated md:before:absolute md:before:inset-y-0 md:before:left-0 md:before:w-px md:before:bg-text-primary",
                )}
                data-carnet-tuile={f.id}
              >
                <span className={cn(META, "min-w-6 shrink-0 tabular-nums")}>{view.numeros[f.id]}</span>
                <span className={cn("min-w-0 max-md:flex-1 md:mt-2", TEXTE_FORT)}>{frTypo(f.titre)}</span>
                <span className={cn("shrink-0 md:mt-2", META)}>{frTypo(f.contexte)}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-6">
        <div className="hidden lg:sticky lg:top-24 lg:col-span-3 lg:block lg:self-start">
          <RailCarnet lignes={lignes} titreId={TITRE_ID} />
        </div>
        <div className="min-w-0 space-y-6 lg:col-span-9">
          {view.fiches.map((f) => (
            <div key={f.id}>
              <FicheCarnet fiche={f} numero={view.numeros[f.id]} offerte={false} />
              <a href={`#${ANCRE_SOMMAIRE}`} className={cn(LIEN_NEUTRE, "mt-4")} data-carnet-retour-sommaire="">
                {CARNET_RETOUR_SOMMAIRE}
              </a>
            </div>
          ))}
        </div>
      </div>
      {autresMois.length > 0 && (
        <section aria-labelledby="carnet-archives" className="mt-12">
          <h2 id="carnet-archives" className={TITRE_CARTE}>Les carnets précédents</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {autresMois.map((m) => (
              <li key={m}>
                <Link href={`/carnet/${m}`} className={chipClass()}>
                  {formatCarnetMonth(m)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
