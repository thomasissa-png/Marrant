import Link from "next/link";
import type { Metadata } from "next";
import { TEXTES_APERCU, type RubriqueApercu } from "@/config/textes/espace-apercu";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { buildLoginUrl } from "@/lib/auth-links";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";
import { BOUTON_PRINCIPAL, LIEN } from "@/components/espace/carte/styles";
import { ADRESSES_APERCU } from "@/components/espace/apercu/acces";
import { ExempleFavoris, ExempleFiche, ExempleQuestions, ExempleRepliques } from "@/components/espace/apercu/exemple";
import { ficheApercu } from "@/components/espace/apercu/exemples";
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

function Exemple({ rubrique }: { rubrique: RubriqueApercu }) {
  if (rubrique === "mesQuestions") return <ExempleQuestions />;
  if (rubrique === "mesRepliques") return <ExempleRepliques fiche={ficheApercu("mesRepliques")} />;
  if (rubrique === "favoris") return <ExempleFavoris />;
  return <ExempleFiche fiche={ficheApercu(rubrique)} />;
}

/**
 * Page d'aperçu d'une rubrique Premium (nav v6 §2, maquette D `page=apercu`) pour le visiteur et l'inscrit
 * gratuit, à l'adresse de la rubrique : titre, sous-titre validé, UNE fiche réelle lisible en entier, puis le
 * bloc d'offre (bouton de l'en-tête, prix de la config ; « Connexion » pour le visiteur, un abonné peut ne pas
 * être connecté). Jamais un mur, jamais une redirection, aucune fenêtre ni second appel à l'action.
 * Rendu serveur, sans appel à l'API de l'espace (rien ne s'enregistre depuis un aperçu).
 */
export function ApercuRubrique({ rubrique, visiteur }: { rubrique: RubriqueApercu; visiteur: boolean }) {
  const adresse = ADRESSES_APERCU[rubrique];
  return (
    <div data-apercu={rubrique}>
      {/* Nav v6 : ni retour ni place réservée au-dessus du titre (la bande est le repère), comme les rubriques. */}
      <header>
        <h1 className="font-display text-3xl font-bold leading-tight text-text-primary md:text-4xl">{TEXTES_APERCU.titres[rubrique]}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary md:text-lg md:leading-8">{frEspace(TEXTES_APERCU.sousTitre)}</p>
      </header>
      <article
        aria-labelledby="apercu-exemple"
        className="relative mt-6 max-w-3xl space-y-4 overflow-hidden rounded-xl border border-border bg-background-card p-5 [overflow-wrap:anywhere] md:p-6"
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-primary-hover to-accent-secondary-hover" />
        <Exemple rubrique={rubrique} />
        <div className="!mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-5" data-apercu-offre>
          <Link
            href={buildAbonnementUrl(adresse, "monthly", sourceApercu(rubrique))}
            aria-label={TEXTES_APERCU.offre.nomAccessible}
            className={BOUTON_PRINCIPAL}
          >
            {TEXTES_APERCU.offre.bouton}
          </Link>
          {visiteur && (
            <Link href={buildLoginUrl({ callbackUrl: adresse })} className={LIEN}>
              {TEXTES_APERCU.connexion}
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
