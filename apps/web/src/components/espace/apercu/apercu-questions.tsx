import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { ApercuVerrouille } from "@/components/espace/apercu/apercu-verrouille";
import { SuiteCoupee } from "@/components/espace/apercu/extrait-coupe";
import { BlocsFermes } from "@/components/espace/apercu/blocs-fermes";
import { TuileFermee } from "@/components/espace/apercu/tuile-fermee";
import { TUILE } from "@/components/espace/aujourdhui/tableau";
import { EtatVideQuestions } from "@/components/espace/questions/etat-vide";
import { PastillesDa } from "@/components/espace/da-espace";

const Q = frEspaceProfond(TEXTES_QUESTIONS);

/** Spec s26 §1.1 : les trois types réels du formulaire (`TEXTES_QUESTIONS.types`), inertes. */
export const PASTILLES_QUESTIONS: readonly string[] = [Q.types.PROBLEME.nom, Q.types.SITUATION.nom, Q.types.QUESTION.nom];

/**
 * Extrait de « Mes questions » (`docs/ux/questions-repliques-lettre-profil-s26.md` §1.1, décision du 15/11) : l'état
 * « Mes envois » SANS envoi, en clair (un exemple par type, le délai de réponse : textes validés de l'état vide), et
 * jamais une question ni une réponse d'abonné. À droite, l'historique FERMÉ : un bloc par type, verrou et barres, sans
 * aucune chaîne de question. Sous le fondu, le fil d'une réponse fermé (« Ton message », la signature de l'équipe :
 * libellés seuls, barres à la place du texte). Les statuts envoyé / répondu n'existent qu'en phrases datées
 * (`envoyeLe`, `reponduLe`) : pas de pastille de statut, aucun texte neuf.
 * Grille 8/4 du hero, gouttière de 48 px dès 1024 (décision de Thomas du 18/11, comme « Quoi répondre »).
 */
function ExtraitQuestions() {
  return (
    <div data-apercu-fiche="questions-exemples">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-12" data-apercu-rangee="1">
        {/* s26 contrôle d'ensemble, aperçus : DA de l'accueil (bandeau, pastille violette), comme les cartes de l'abonné.
            « Mes envois » à la hauteur de son contenu (`h-auto self-start`) : plus de carte étirée à la hauteur de
            l'historique voisin (71 px vides mesurés à 1280). */}
        <TuileFermee nette verrouDansLaMarge className="h-auto self-start md:col-span-2 lg:col-span-8">
          <div className={TUILE} data-apercu-envois>
            <PastillesDa as="h2" pastille={Q.envois.titre} />
            <EtatVideQuestions className="mt-4" />
          </div>
        </TuileFermee>
        <TuileFermee verrouDansLaMarge className="md:col-span-2 lg:col-span-4">
          <div className={TUILE} data-apercu-historique>
            <BlocsFermes libelles={PASTILLES_QUESTIONS} className="mt-0" enPastilles />
          </div>
        </TuileFermee>
      </div>
      <SuiteCoupee entiere>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-12" data-apercu-rangee="2">
          <TuileFermee verrouDansLaMarge className="md:col-span-2 lg:col-span-12">
            <div className={TUILE} data-apercu-fil-ferme>
              <BlocsFermes libelles={[Q.envois.tonMessage, Q.envois.signature]} className="mt-0 md:grid-cols-2" enPastilles />
            </div>
          </TuileFermee>
        </div>
      </SuiteCoupee>
    </div>
  );
}

/**
 * Aperçu VERROUILLÉ de « Mes questions » (s26), visiteur et inscrit gratuit, à l'adresse de la rubrique : hero 8/4 et
 * offre en haut (`ApercuVerrouille`, `offre-en-haut.ts`), puis l'extrait. Rendu serveur, sans lecture des fils ni
 * appel à l'espace : aucune question ni réponse d'abonné ne peut y entrer (test `apercus-questions-repliques-s26`).
 */
export function ApercuQuestions({ visiteur }: { visiteur: boolean }) {
  return (
    <ApercuVerrouille
      rubrique="mesQuestions"
      visiteur={visiteur}
      promesse={frEspace(TEXTES_APERCU_VERROUILLE.promesseQuestions)}
      pastilles={PASTILLES_QUESTIONS}
    >
      <ExtraitQuestions />
    </ApercuVerrouille>
  );
}
