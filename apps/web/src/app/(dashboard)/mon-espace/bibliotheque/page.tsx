import type { Metadata } from "next";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { lireLecteurApercu } from "@/components/espace/apercu/acces";
import { metadonneesApercu } from "@/components/espace/apercu/apercu-rubrique";
import { ApercuBibliotheque } from "@/components/espace/apercu/apercu-bibliotheque";
import { ligneDeFiche } from "@/lib/espace/lignes-fiches";
import { ficheParDefaut } from "@/lib/espace/quoi-repondre-liste";
import { ADRESSE_LISTE_BIBLIOTHEQUE, CLES_BIBLIOTHEQUE } from "@/lib/espace/bibliotheque-liste";
import { TEXTES_BIBLIOTHEQUE } from "@/config/textes/espace-bibliotheque";
import { BlocBibliotheque, BlocVannes } from "@/components/espace/bloc-bibliotheque";
import { CoinHumourNoir } from "@/components/espace/coin-humour-noir";
import { ListeFiches, compteFaits } from "@/components/espace/liste-fiches";
import { PanneauTechnique, chargerBibliotheque, donneesPanneauBibliotheque, lettreDeTechnique } from "@/components/espace/bibliotheque/panneau";
import { MemoireDefilementListe } from "@/components/espace/liste-detail/memoire-defilement";

import { TITRE_PAGE } from "@/components/espace/typo";
import { frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_BIBLIOTHEQUE);

/**
 * Bibliothèque (s24, lot D6 ; architecture v20 6.2, 6.3, 3.12, 3.13 ; maquette `bibliotheque.html`) : « Vannes,
 * conseils, vidéos » (thèmes publics, « Écouter, repérer », bonus des caps 2 à 4 ouverts), les techniques par famille
 * (bonus du cap 5 avec les formules) et le coin « Humour noir, fait bien », rendu seulement quand son lot existe. Rendu :
 * SSR dynamique (cap, « Fait » et témoin du coin propres à l'abonné, jamais en cache). Garde EN PREMIER.
 *
 * s26 bibliothèque liste et détail (modèle : Quoi répondre) : la liste de gauche est dans le layout dès 1024. Cette page
 * rend deux choses, une seule visible à chaque largeur : sous 1024, la page liste (H1, une carte par famille à bandeau
 * violet, le coin), liens de fiche vers `/mon-espace/bibliotheque/[id]`, position gardée au retour ; dès 1024, le panneau
 * n'est jamais vide : la première technique sans « Fait » (sinon la première), sans redirection ni changement d'adresse.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  if (!ESPACE_CLIENT_PUBLIE) return METADONNEES_404;
  // Nav v6 (lot B) : visiteur et inscrit gratuit, l'aperçu (`noindex, follow`) ; sinon la tête d'avant.
  return (await lireLecteurApercu()) ? metadonneesApercu("bibliotheque") : { title: T.titre };
}

export default async function BibliothequePage() {
  // Nav v6 (lot B) : 404 interrupteur fermé (avant toute lecture) ; visiteur et inscrit gratuit, l'aperçu à cette
  // adresse, sans redirection ; sinon la garde d'avant (abonné actif : la rubrique ; ancien abonné : /abonnement).
  const lecteur = await lireLecteurApercu();
  if (lecteur) return <ApercuBibliotheque visiteur={lecteur === "visiteur"} />;
  const { userId } = await garderEspace(ADRESSE_LISTE_BIBLIOTHEQUE);
  const { lignes, coin, faits, entre, ordre } = await chargerBibliotheque(userId);
  const ouverte = ficheParDefaut(ordre, faits);
  const lettre = ouverte ? await lettreDeTechnique(ouverte) : null;
  const panneau = ouverte && lettre !== undefined ? await donneesPanneauBibliotheque({ userId, fiche: ouverte, lettre, ordre, faits }) : null;
  const deFamille = (f: string) => lignes.filter((l) => l.famille === f);

  return (
    <>
      <MemoireDefilementListe cle={CLES_BIBLIOTHEQUE.page} prefixeFiches={`${ADRESSE_LISTE_BIBLIOTHEQUE}/`} cles={CLES_BIBLIOTHEQUE}>
        <div className="lg:hidden" data-mode="page">
          {/* s26 (spec UX §2.2) : en-tête aligné à gauche, comme « Aujourd'hui ». */}
          <header>
            <h1 className={TITRE_PAGE}>{T.titre}</h1>
          </header>
          {/* Sous 1024 : une colonne, deux dès 768 (colonnes CSS, chaque carte à la hauteur de son contenu) ; à 375,
              « Comment c'est construit » en premier. Cartes à bandeau violet de l'accueil (DA du site, 20/11). */}
          <div className="mt-8 gap-6 max-md:flex max-md:flex-col max-md:[&>*]:mb-0 md:columns-2 [&>*]:mb-6 [&>*]:break-inside-avoid" data-bibliotheque-grille data-etat="liste">
            <BlocVannes ecouter={deFamille("ecouter")} />
            {coin.length > 0 && <CoinHumourNoir lignesInitiales={entre ? coin.map((x) => ligneDeFiche(x, faits)) : null} />}
            {(["construction", "vocabulaire", "formule"] as const).map((type) => {
              const groupe = deFamille(type);
              if (groupe.length === 0) return null;
              return (
                <BlocBibliotheque key={type} id={`groupe-${type}`} titre={T.prefixes[type]} compte={compteFaits(groupe)} className={cn(type === "construction" && "max-md:order-first")}>
                  <div className="mt-4">
                    <ListeFiches lignes={groupe} labelledBy={`groupe-${type}`} groupe={T.prefixes[type]} marquerProchaine />
                  </div>
                </BlocBibliotheque>
              );
            })}
          </div>
        </div>
      </MemoireDefilementListe>
      <div className="hidden lg:block" data-mode="panneau">
        {panneau && <PanneauTechnique {...panneau} />}
      </div>
    </>
  );
}
