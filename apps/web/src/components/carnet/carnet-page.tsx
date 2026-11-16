import Link from "next/link";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { buttonVariants } from "@/components/ui/button";
import { chipClass } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { BLOC_APPEL, BOUTON_BLOC_APPEL, TITRE_BLOC_APPEL } from "@/components/layout/gabarit";
import { CarnetFicheCard, CarnetFicheLocked } from "@/components/carnet/carnet-fiche-card";
import { deCarnetMonth, formatCarnetMonth, type CarnetView } from "@/lib/carnet";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { frTypo } from "@/lib/fr-typo";
import { CARNET_LISTE_VISIBLES, CARNET_PAYWALL, CARNET_RETOUR_SOMMAIRE } from "@/config/textes/cta-pages";
import { Reassurance } from "@/components/ui/reassurance";
import { CARTE_A_FILET, FiletCarte } from "@/components/ui/card";
import { sanitizeSignupSrc } from "@/lib/auth-links";

/** Ancre du sommaire du carnet de l'abonné (décision de Thomas du 16/11, « Retour au sommaire »). */
const ANCRE_SOMMAIRE = "carnet-sommaire";

/** Source de mesure du bouton E1 quand on arrive sur le carnet sans `?src=` (QA v2 MJ-1). */
export const CARNET_SRC = "carnet";

/**
 * Source du bouton E1, même convention que la QA M1 (la source d'entrée suit le visiteur
 * jusqu'au paiement) : la `src` d'arrivée sur /carnet si elle est valide (ex.
 * `blog-demo-milieu-1`, encart B1 d'un article), sinon `carnet`.
 */
export function carnetSrc(raw: string | string[] | undefined): string {
  return sanitizeSignupSrc(typeof raw === "string" ? raw : null) ?? CARNET_SRC;
}

/**
 * Rendu d'un carnet (Server Component). Reçoit une vue DÉJÀ filtrée par
 * `carnetViewForPlan` : pour un non-abonné, seules la fiche offerte (champ `offerte`, sinon la première) et les
 * titres/contextes des autres existent dans les props, donc dans le HTML.
 */
export function CarnetPage({
  view,
  months,
  returnTo,
  src,
}: {
  view: CarnetView;
  months: string[];
  returnTo: string;
  /** Source de mesure du bouton E1 (`carnetSrc`) : `?src=` d'arrivée sur /carnet, sinon `carnet`. */
  src: string;
}) {
  const autresMois = months.filter((m) => m !== view.mois);
  // v6 tour 1, point 11 : sommaire en tête, interrupteur ouvert et carnet de l'abonné seulement. v6 tour 3, point 9 :
  // « Les carnets précédents » descend après les fiches (fin de page), il ne coiffe plus les fiches du mois.
  const sommaire = ESPACE_CLIENT_PUBLIE && view.premium;
  const kicker = (
    <p className="text-xs font-semibold uppercase tracking-wider text-accent-link">
      Carnet {deCarnetMonth(view.mois)} · {view.totalFiches} situations
    </p>
  );

  return (
    <div className="mx-auto max-w-3xl">
      {/* Navigation v6 : fil d'Ariane visible retiré sur /carnet (premier niveau), gardé sur /carnet/<mois>. */}
      {!(ESPACE_CLIENT_PUBLIE && returnTo === "/carnet") && (
        <nav aria-label="Fil d’Ariane" className="mb-4 text-sm text-text-muted">
          <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/carnet" className="hover:text-text-primary max-md:py-3.5">Carnet</Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">{formatCarnetMonth(view.mois)}</span>
        </nav>
      )}

      {/* v6 tour 3 (points 1 et 9), interrupteur ouvert : en-tête centré comme le hero de l'accueil, sur-titre
          AU-DESSUS du H1 pour tous les comptes (le tour 2 le passait sous le titre chez l'abonné). Fermé : inchangé. */}
      <header className={ESPACE_CLIENT_PUBLIE ? "mb-8 space-y-3 text-center" : "mb-8 space-y-3"}>
        {kicker}
        <h1 id={sommaire ? "carnet-titre" : undefined} className="font-display text-3xl font-bold md:text-4xl">{frTypo(view.titre)}</h1>
        <p className={ESPACE_CLIENT_PUBLIE ? "mx-auto max-w-2xl text-text-secondary" : "text-text-secondary"}>{frTypo(view.intro)}</p>
      </header>

      {/* v6 tour 1, point 11 (interrupteur ouvert, abonné) : sommaire des fiches en tête (ancres `fiche-<id>`
          existantes, titres des fiches, aucun texte nouveau). Tour 3, point 9 : liens soulignés en permanence
          (signal de clic visible sans survol), 2 colonnes dès `sm`, cible 44 px. */}
      {sommaire && (
        // Décision de Thomas du 16/11 : ancre `carnet-sommaire`, visée par « Retour au sommaire » sous chaque fiche
        // (`scroll-mt-24` : sous l'en-tête collant, comme les fiches).
        <nav id={ANCRE_SOMMAIRE} aria-labelledby="carnet-titre" className="mb-8 scroll-mt-24" data-carnet-sommaire="">
          <ol className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {view.fiches.map((fiche) => (
              <li key={fiche.id} className="flex min-w-0 gap-2 text-sm text-text-muted">
                {/* v6 tour 4, point 8 : numéro en largeur fixe, aligné à droite (titres 1 à 30 sur une même verticale). */}
                <span aria-hidden="true" className="inline-flex min-h-11 min-w-[2.5ch] shrink-0 items-center justify-end text-right tabular-nums">
                  {view.numeros[fiche.id]}.
                </span>
                <a
                  href={`#fiche-${fiche.id}`}
                  className="inline-flex min-h-11 min-w-0 items-center text-text-secondary underline decoration-text-muted underline-offset-4 [overflow-wrap:anywhere] hover:text-text-primary hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
                >
                  {frTypo(fiche.titre)}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="space-y-6">
        {view.fiches.map((fiche) =>
          sommaire ? (
            // Décision de Thomas du 16/11 (ouvert, abonné) : après chaque fiche, retour au sommaire, cible de 44 px.
            <div key={fiche.id}>
              <CarnetFicheCard fiche={fiche} numero={view.numeros[fiche.id]} offerte={!view.premium} />
              <p className="mt-2 text-right">
                <a
                  href={`#${ANCRE_SOMMAIRE}`}
                  className="inline-flex min-h-11 items-center text-sm text-text-secondary underline decoration-text-muted underline-offset-4 hover:text-text-primary hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
                  data-carnet-retour-sommaire=""
                >
                  {CARNET_RETOUR_SOMMAIRE}
                </a>
              </p>
            </div>
          ) : (
            <CarnetFicheCard
              key={fiche.id}
              fiche={fiche}
              numero={view.numeros[fiche.id]}
              offerte={!view.premium}
            />
          ),
        )}
      </div>

      {/* Concision v5 (textes-v5-c §6) : le bloc d'achat juste après la fiche offerte, puis
          « Au programme » : 3 titres de fiches et « Et N autres répliques ». */}
      {!view.premium && view.apercus.length > 0 && (
        <>
          <div className="mt-8">
            <CarnetPaywall returnTo={returnTo} src={src} restantes={view.apercus.length} />
          </div>
          <section aria-labelledby="carnet-reserve" className="mt-10 space-y-4">
            <h2 id="carnet-reserve" className="font-display text-xl font-bold">
              {CARNET_PAYWALL.listeTitre}
            </h2>
            <ol className="space-y-3">
              {view.apercus.slice(0, CARNET_LISTE_VISIBLES).map((fiche) => (
                <CarnetFicheLocked key={fiche.id} fiche={fiche} numero={view.numeros[fiche.id]} />
              ))}
            </ol>
            {view.apercus.length > CARNET_LISTE_VISIBLES && (
              <p className="text-sm text-text-secondary">
                {CARNET_PAYWALL.listeReste(view.apercus.length - CARNET_LISTE_VISIBLES)}
              </p>
            )}
          </section>
        </>
      )}

      {view.premium && autresMois.length > 0 && <CarnetsPrecedents mois={autresMois} className="mt-10" />}
    </div>
  );
}

function CarnetsPrecedents({ mois, className }: { mois: string[]; className: string }) {
  return (
    <section aria-labelledby="carnet-archives" className={className}>
      <h2 id="carnet-archives" className="mb-3 font-display text-xl font-bold">
        Les carnets précédents
      </h2>
      <ul className="flex flex-wrap gap-2">
        {mois.map((m) => (
          <li key={m}>
            <Link
              href={`/carnet/${m}`}
              className={chipClass()}
            >
              {formatCarnetMonth(m)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Appel à l'abonnement : même destination que les étapes verrouillées des parcours.
 * Textes de la concision v5 (`CARNET_PAYWALL`, config/textes/cta-pages.ts) ; `restantes` = `view.apercus.length`.
 * s21 (QA v2 MJ-1) : `src` relayé par /abonnement jusqu'à `checkout-ouvert` / `checkout-echec`.
 */
function CarnetPaywall({ returnTo, src, restantes }: { returnTo: string; src: string; restantes: number }) {
  return (
    // Revue visuelle s21 : même bloc d'appel que les murs des listes et les fiches (cadre, titre, bouton, REASS).
    // v6 tour 1 (arbitrage 1, point 9), interrupteur ouvert : carte à filet, réassurance à gauche comme le bloc.
    <div className={ESPACE_CLIENT_PUBLIE ? cn(BLOC_APPEL, CARTE_A_FILET) : BLOC_APPEL}>
      {ESPACE_CLIENT_PUBLIE && <FiletCarte />}
      <h3 className={TITRE_BLOC_APPEL}>{frTypo(CARNET_PAYWALL.titre(restantes))}</h3>
      <p className="mt-2 text-sm text-text-secondary">{frTypo(CARNET_PAYWALL.paragraphe)}</p>
      {/* s21 concision (18/10, étalon 4) : plus de liste d'avantages ici, elle vit sur /abonnement. */}
      <div className="mt-4">
        <Link
          href={buildAbonnementUrl(returnTo, "monthly", src)}
          data-testid="carnet-paywall-bouton"
          className={cn(buttonVariants({ variant: "primary", size: "lg" }), BOUTON_BLOC_APPEL)}
        >
          {frTypo(CARNET_PAYWALL.bouton)}
        </Link>
      </div>
      <Reassurance className={ESPACE_CLIENT_PUBLIE ? "text-left" : undefined} />
    </div>
  );
}
