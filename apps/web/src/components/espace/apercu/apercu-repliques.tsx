import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { TEXTES_FICHE_LIGNE } from "@/config/textes/espace-bibliotheque";
import { TEXTES_GESTE } from "@/config/textes/espace-cartes";
import { TEXTES_REPLIQUES } from "@/config/textes/espace-repliques";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { ficheApercu } from "@/components/espace/apercu/exemples";
import { ApercuVerrouille } from "@/components/espace/apercu/apercu-verrouille";
import { SuiteCoupee } from "@/components/espace/apercu/extrait-coupe";
import { BarresFermees, BlocsFermes } from "@/components/espace/apercu/blocs-fermes";
import { Verrou } from "@/components/espace/apercu/badge-premium";
import { TuileFermee } from "@/components/espace/apercu/tuile-fermee";
import { TUILE } from "@/components/espace/aujourdhui/tableau";
import { Bandeau, EMOJIS_ACCUEIL, PastillesDa } from "@/components/espace/da-espace";
import { ETIQUETTE, META, TEXTE, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";

const G = frEspaceProfond(TEXTES_GESTE);
const L = frEspaceProfond(TEXTES_FICHE_LIGNE);
const R = frEspaceProfond(TEXTES_REPLIQUES);
const N = frEspaceProfond(TEXTES_ESPACE_NAVIGATION);

/** Spec s26 §2.1 : les gestes réels de la page (écrire, modifier, supprimer), inertes, aucun effectif inventé. */
export const PASTILLES_REPLIQUES: readonly string[] = [G.note.label, R.modifier, R.supprimer];

/**
 * Ce qui sort de la fiche désignée (`ficheApercu("mesRepliques")`, validée le 15/11) : titre, durée et consigne « À
 * toi » seulement. Les répliques, le pourquoi et la suite de la fiche ne quittent pas cette fonction.
 */
function ficheEnClair() {
  const fiche = ficheApercu("mesRepliques");
  return { id: fiche.id, titre: fiche.titre, minutes: fiche.dureeMinutes, consigne: fiche.geste?.consigne ?? null };
}

/** Trois répliques FERMÉES : verrou et barres, aucun texte (il n'y a pas de réplique d'abonné dans un aperçu). */
function RepliquesSansTexte() {
  return (
    <ul className="grid grid-cols-1 gap-4" data-repliques-sans-texte>
      {[0, 1, 2].map((i) => (
        <li key={i} className="min-w-0 rounded-xl border border-border p-4">
          <Verrou className="ml-auto" />
          <BarresFermees />
        </li>
      ))}
    </ul>
  );
}

/**
 * Extrait de « Mes répliques » (`docs/ux/questions-repliques-lettre-profil-s26.md` §2.1, design §4) : à gauche (8)
 * l'endroit où une réplique s'écrit, EN CLAIR (titre et durée de la fiche, consigne « À toi », le champ « Ma réplique à
 * moi » dessiné, sans élément de formulaire : 0 focusable) ; à droite (4) les répliques fermées. Sous le fondu,
 * « Modifier » et « Supprimer » en blocs fermés. Grille 8/4 du hero (décision de Thomas du 18/11).
 */
function ExtraitRepliques() {
  const f = ficheEnClair();
  return (
    <div data-apercu-fiche={f.id}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-12" data-apercu-rangee="1">
        <TuileFermee nette verrouDansLaMarge className="md:col-span-2 lg:col-span-8">
          {/* s26 contrôle d'ensemble, aperçus : la carte d'écriture de l'abonné (bandeau, émoji, pastille « Quoi répondre »),
              la durée à côté de la pastille. */}
          <div className={TUILE} data-apercu-ecrire>
            <Bandeau />
            <PastillesDa emoji={EMOJIS_ACCUEIL.quoiRepondre} pastille={N.index.quoiRepondre} suite={<span className={META}>{L.minutes(f.minutes)}</span>} />
            <h2 className={cn("mt-2", TITRE_CARTE)}>{frEspace(f.titre)}</h2>
            {f.consigne && (
              <>
                <p className={cn("mt-4", ETIQUETTE)}>{G.aToi}</p>
                <p className={cn("mt-2 whitespace-pre-line", TEXTE)}>{frEspace(f.consigne)}</p>
              </>
            )}
            <p className={cn("mt-4", TEXTE_FORT)}>{G.note.label}</p>
            <div className={cn("mt-2 min-h-32 rounded-xl border border-border-input bg-background-elevated p-4", TEXTE)} data-champ-inerte>
              {G.note.placeholder}
            </div>
          </div>
        </TuileFermee>
        <TuileFermee verrouDansLaMarge className="md:col-span-2 lg:col-span-4">
          <div className={TUILE} data-apercu-repliques-fermees>
            <Bandeau />
            <PastillesDa className="mb-4" emoji={EMOJIS_ACCUEIL.quoiRepondre} pastille={N.index.quoiRepondre} />
            <RepliquesSansTexte />
          </div>
        </TuileFermee>
      </div>
      <SuiteCoupee entiere>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-12" data-apercu-rangee="2">
          <TuileFermee verrouDansLaMarge className="md:col-span-2 lg:col-span-12">
            <div className={TUILE} data-apercu-gestes-fermes>
              <Bandeau />
              <BlocsFermes libelles={[R.modifier, R.supprimer]} className="mt-0 md:grid-cols-2" enPastilles />
            </div>
          </TuileFermee>
        </div>
      </SuiteCoupee>
    </div>
  );
}

/**
 * Aperçu VERROUILLÉ de « Mes répliques » (s26), visiteur et inscrit gratuit : hero 8/4 et offre en haut, puis
 * l'extrait. Rendu serveur, sans lecture des répliques : aucune réplique d'abonné ne peut y entrer (test Jest).
 */
export function ApercuRepliques({ visiteur }: { visiteur: boolean }) {
  return (
    <ApercuVerrouille
      rubrique="mesRepliques"
      visiteur={visiteur}
      promesse={frEspace(TEXTES_APERCU_VERROUILLE.promesseRepliques)}
      pastilles={PASTILLES_REPLIQUES}
    >
      <ExtraitRepliques />
    </ApercuVerrouille>
  );
}
