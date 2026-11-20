import Link from "next/link";
import type { Metadata } from "next";
import { TEXTES_APERCU, type RubriqueApercu } from "@/config/textes/espace-apercu";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { buildLoginUrl } from "@/lib/auth-links";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";
import { BOUTON_PRINCIPAL, CADRE_CARTE, CADRE_CARTE_PRINCIPALE, LIEN } from "@/components/espace/carte/styles";
import { ADRESSES_APERCU } from "@/components/espace/apercu/acces";
import { ExempleFiche, ExempleQuestions, ExempleRepliques } from "@/components/espace/apercu/exemple";
import { categoriesQuoiRepondre, ficheApercu } from "@/components/espace/apercu/exemples";
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

/** s26 : Favoris est passé à `ApercuVerrouille` (`apercu-favoris.tsx`) ; cet aperçu ne le rend plus. */
type RubriqueAncienApercu = Exclude<RubriqueApercu, "favoris">;

function Exemple({ rubrique }: { rubrique: RubriqueAncienApercu }) {
  if (rubrique === "mesQuestions") return <ExempleQuestions />;
  if (rubrique === "mesRepliques") return <ExempleRepliques fiche={ficheApercu("mesRepliques")} />;
  return <ExempleFiche fiche={ficheApercu(rubrique)} />;
}

/**
 * v6 tour 3 (arbitrage 6) : sous l'exemple de « Quoi répondre », le catalogue en lecture seule, comme la liste de
 * l'abonné le titre (« Coloc (4) ») : libellés et effectifs existants, aucun lien ni bouton, aucun texte nouveau.
 */
function CatalogueQuoiRepondre() {
  const groupes = categoriesQuoiRepondre();
  if (groupes.length === 0) return null;
  return (
    <div className={`${CADRE_CARTE} p-5 md:p-6`} data-apercu-catalogue>
      <ul aria-label={TEXTES_APERCU.titres.quoiRepondre} className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {groupes.map((g) => (
          <li key={g.cle} className="text-base font-semibold text-text-primary">
            {frEspace(g.titre)} <span className="font-normal text-text-secondary">({g.nombre})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Page d'aperçu d'une rubrique Premium (nav v6 §2, maquette D `page=apercu`) pour le visiteur et l'inscrit
 * gratuit, à l'adresse de la rubrique : titre, sous-titre validé, UNE fiche réelle lisible en entier, puis le
 * bloc d'offre (bouton de l'en-tête, prix de la config ; « Connexion » pour le visiteur, un abonné peut ne pas
 * être connecté). Jamais un mur, jamais une redirection, aucune fenêtre ni second appel à l'action.
 * Rendu serveur, sans appel à l'API de l'espace (rien ne s'enregistre depuis un aperçu).
 *
 * v6 tour 2 (arbitrage 1, Thomas 15/11) : plus de deux colonnes (colonne d'offre vide à 1280+). À toutes les
 * largeurs, une colonne centrée `mx-auto max-w-3xl` : titre et sous-titre centrés (langue de l'accueil), l'exemple,
 * puis la carte d'offre pleine largeur de la colonne, contenu centré ; plus de `sticky`. Mes questions : le titre
 * puis la carte des exemples, sans carte autour (ce sont déjà des cartes : un seul filet).
 */
export function ApercuRubrique({
  rubrique,
  visiteur,
}: {
  rubrique: RubriqueAncienApercu;
  visiteur: boolean;
}) {
  const adresse = ADRESSES_APERCU[rubrique];
  // Déjà des cartes (exemples de Mes questions) : pas de carte autour, un seul filet.
  const sansCadre = rubrique === "mesQuestions";
  return (
    <div className="mx-auto max-w-3xl" data-apercu={rubrique}>
      {/* Nav v6 : ni retour ni place réservée au-dessus du titre (la bande est le repère), comme les rubriques. */}
      <header className="text-center">
        <h1 id="apercu-titre" className="font-display text-3xl font-bold leading-tight text-text-primary md:text-4xl">
          {TEXTES_APERCU.titres[rubrique]}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-text-secondary md:text-lg md:leading-8">{frEspace(TEXTES_APERCU.sousTitre)}</p>
      </header>
      <div className="mt-6 flex flex-col gap-6">
        <article
          aria-labelledby="apercu-exemple"
          className={sansCadre ? "min-w-0" : `${CADRE_CARTE} min-w-0 space-y-4 p-5 [overflow-wrap:anywhere] md:p-6`}
        >
          <Exemple rubrique={rubrique} />
        </article>
        {rubrique === "quoiRepondre" && <CatalogueQuoiRepondre />}
        {/* s26 finition avant lancement (point 4) : la carte d'offre est la carte principale de l'aperçu (filet violet). */}
        <div className={`${CADRE_CARTE_PRINCIPALE} flex flex-wrap items-center justify-center gap-x-6 gap-y-2 p-5 md:p-6`} data-apercu-offre>
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
