import Link from "next/link";
import type { Metadata } from "next";
import { TEXTES_APERCU, type RubriqueApercu } from "@/config/textes/espace-apercu";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { buildLoginUrl } from "@/lib/auth-links";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";
import { BOUTON_PRINCIPAL, CADRE_CARTE, LIEN } from "@/components/espace/carte/styles";
import { ADRESSES_APERCU } from "@/components/espace/apercu/acces";
import { ExempleFavoris, ExempleFiche, ExempleQuestions, ExempleRepliques } from "@/components/espace/apercu/exemple";
import { ficheApercu } from "@/components/espace/apercu/exemples";
import type { ExemplesFavoris } from "@/components/espace/apercu/exemples-favoris";
import { frEspace } from "@/lib/fr-typo";

/** Source du clic d'offre (mesure du tunnel `/abonnement?src=`), une par rubrique : `apercu-{adresse}`. */
export function sourceApercu(rubrique: RubriqueApercu): string {
  const fin = ADRESSES_APERCU[rubrique].split("/").filter(Boolean).pop();
  return fin === "mon-espace" ? "apercu-aujourdhui" : `apercu-${fin}`;
}

/** Tête d'un aperçu : titre de la rubrique, `noindex, follow` (spec v6 §2, contenu fin copié du payant). */
export function metadonneesApercu(rubrique: RubriqueApercu): Metadata {
  return { title: TEXTES_APERCU.titres[rubrique], ...NOINDEX_FOLLOW_ROBOTS };
}

function Exemple({ rubrique, favoris }: { rubrique: RubriqueApercu; favoris: ExemplesFavoris | null }) {
  if (rubrique === "mesQuestions") return <ExempleQuestions />;
  if (rubrique === "mesRepliques") return <ExempleRepliques fiche={ficheApercu("mesRepliques")} />;
  if (rubrique === "favoris") return <ExempleFavoris exemples={favoris} />;
  return <ExempleFiche fiche={ficheApercu(rubrique)} />;
}

/**
 * Page d'aperçu d'une rubrique Premium (nav v6 §2, maquette D `page=apercu`) pour le visiteur et l'inscrit
 * gratuit, à l'adresse de la rubrique : titre, sous-titre validé, UNE fiche réelle lisible en entier, puis le
 * bloc d'offre (bouton de l'en-tête, prix de la config ; « Connexion » pour le visiteur, un abonné peut ne pas
 * être connecté). Jamais un mur, jamais une redirection, aucune fenêtre ni second appel à l'action.
 * Rendu serveur, sans appel à l'API de l'espace (rien ne s'enregistre depuis un aperçu).
 *
 * v6 tour 1 (arbitrage 2) : dès `lg`, deux colonnes dans la coque, l'exemple à gauche (7/12), le bloc d'offre
 * existant à droite (5/12) dans une carte à filet, collante ; titre et sous-titre au-dessus, alignés sur la coque.
 * Sous `lg`, une colonne : l'exemple puis l'offre. Favoris (arbitrage 3) : deux contenus réels en lecture seule,
 * présentés comme des favoris (pas de carte autour : ce sont déjà des cartes).
 */
export function ApercuRubrique({
  rubrique,
  visiteur,
  favoris = null,
}: {
  rubrique: RubriqueApercu;
  visiteur: boolean;
  /** Favoris seulement : la première vanne et le premier conseil gratuits du catalogue (lus par `FavorisOuvert`). */
  favoris?: ExemplesFavoris | null;
}) {
  const adresse = ADRESSES_APERCU[rubrique];
  const favorisReels = rubrique === "favoris" && favoris !== null;
  return (
    <div data-apercu={rubrique}>
      {/* Nav v6 : ni retour ni place réservée au-dessus du titre (la bande est le repère), comme les rubriques. */}
      <header>
        <h1 id="apercu-titre" className="font-display text-3xl font-bold leading-tight text-text-primary md:text-4xl">
          {TEXTES_APERCU.titres[rubrique]}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary md:text-lg md:leading-8">{frEspace(TEXTES_APERCU.sousTitre)}</p>
      </header>
      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <article
          aria-labelledby={favorisReels ? "apercu-titre" : "apercu-exemple"}
          className={
            favorisReels
              ? "min-w-0 lg:col-span-7"
              : `${CADRE_CARTE} min-w-0 space-y-4 p-5 [overflow-wrap:anywhere] md:p-6 lg:col-span-7`
          }
        >
          <Exemple rubrique={rubrique} favoris={favoris} />
        </article>
        <div
          className={`${CADRE_CARTE} flex flex-wrap items-center gap-x-6 gap-y-2 p-5 md:p-6 lg:sticky lg:top-32 lg:col-span-5`}
          data-apercu-offre
        >
          <Link
            href={buildAbonnementUrl(adresse, "monthly", sourceApercu(rubrique))}
            aria-label={TEXTES_APERCU.offre.nomAccessible}
            className={BOUTON_PRINCIPAL}
          >
            {TEXTES_APERCU.offre.bouton}
          </Link>
          {visiteur && (
            <Link href={buildLoginUrl({ callbackUrl: adresse })} className={`${LIEN} min-w-11`}>
              {TEXTES_APERCU.connexion}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
