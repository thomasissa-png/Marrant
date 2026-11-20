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
import { CARNET_LISTE_VISIBLES, CARNET_PAYWALL } from "@/config/textes/cta-pages";
import { Reassurance } from "@/components/ui/reassurance";
import { sanitizeSignupSrc } from "@/lib/auth-links";
import { CarnetOuvert } from "@/components/espace/carnet/carnet-ouvert";
import { CADRE_CARTE_NEUTRE, LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { TEXTE, TEXTE_FORT } from "@/components/espace/typo";

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

const A_VENIR = {
  titre: "Le carnet du mois arrive",
  texte: "Les situations de ce mois sont encore en préparation. En attendant, entraîne ta répartie avec les parcours.",
  lien: "Voir les parcours",
} as const;

/**
 * Mois sans carnet (`/carnet`). s26 (`docs/design/favoris-carnet-s26.md` §4), espace ouvert : tuile pleine largeur
 * alignée à gauche, textes existants. Fermé : le rendu d'avant (sortie de `app/(dashboard)/carnet/page.tsx` sans retouche).
 */
export function CarnetAVenir() {
  if (ESPACE_CLIENT_PUBLIE) {
    return (
      <div className={cn(CADRE_CARTE_NEUTRE, "p-6")} data-carnet-a-venir>
        <h1 className={TEXTE_FORT}>{A_VENIR.titre}</h1>
        <p className={cn("mt-2 max-w-xl", TEXTE)}>{A_VENIR.texte}</p>
        <Link href="/parcours" className={cn(LIEN_NEUTRE, "mt-4")}>
          {A_VENIR.lien}
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl py-12 text-center">
      <h1 className="font-display text-3xl font-bold">{A_VENIR.titre}</h1>
      <p className="mt-3 text-text-secondary">
        Les situations de ce mois sont encore en préparation. En attendant, entraîne ta répartie
        avec les parcours.
      </p>
      <Link href="/parcours" className="mt-4 inline-block text-accent-link hover:underline">
        {A_VENIR.lien}
      </Link>
    </div>
  );
}

/**
 * Rendu d'un carnet (Server Component). Reçoit une vue DÉJÀ filtrée par
 * `carnetViewForPlan` : pour un non-abonné, seules la fiche offerte (champ `offerte`, sinon la première) et les
 * titres/contextes des autres existent dans les props, donc dans le HTML.
 * s26 : espace ouvert, `CarnetOuvert` (hero 8/4 offre en haut pour le non-abonné ; pour l'abonné, le panneau de la liste
 * et détail du layout, s26 carnet liste et détail). Fermé : le rendu ci-dessous, inchangé au caractère près (les branches « ouvert » d'avant y sont retirées).
 */
export function CarnetPage({
  view,
  months,
  returnTo,
  src,
  visiteur = true,
  contexte,
}: {
  view: CarnetView;
  months: string[];
  returnTo: string;
  /** Source de mesure du bouton E1 (`carnetSrc`) : `?src=` d'arrivée sur /carnet, sinon `carnet`. */
  src: string;
  /** Espace ouvert seulement : non connecté (« Connexion » dans le bloc d'offre) ; inscrit gratuit sinon. */
  visiteur?: boolean;
  /** Espace ouvert seulement (s26 carnet liste et détail) : `?contexte=`, filtre de la liste de l'abonné. */
  contexte?: string | string[];
}) {
  if (ESPACE_CLIENT_PUBLIE) return <CarnetOuvert view={view} months={months} returnTo={returnTo} src={src} visiteur={visiteur} contexte={contexte} />;
  const autresMois = months.filter((m) => m !== view.mois);

  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label="Fil d’Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/carnet" className="hover:text-text-primary max-md:py-3.5">Carnet</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">{formatCarnetMonth(view.mois)}</span>
      </nav>

      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-link">
          Carnet {deCarnetMonth(view.mois)} · {view.totalFiches} situations
        </p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">{frTypo(view.titre)}</h1>
        <p className="text-text-secondary">{frTypo(view.intro)}</p>
      </header>

      <div className="space-y-6">
        {view.fiches.map((fiche) => (
          <CarnetFicheCard
            key={fiche.id}
            fiche={fiche}
            numero={view.numeros[fiche.id]}
            offerte={!view.premium}
          />
        ))}
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
    <div className={BLOC_APPEL}>
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
      <Reassurance />
    </div>
  );
}
