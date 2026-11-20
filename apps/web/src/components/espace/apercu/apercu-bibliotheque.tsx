import vocabulaire from "@/data/espace/vocabulaire.json";
import formules from "@/data/espace/formules.json";
import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { TEXTES_BIBLIOTHEQUE, TEXTES_FICHE } from "@/config/textes/espace-bibliotheque";
import { validerFichier } from "@/lib/espace/fiches-schema";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { ficheApercu } from "@/components/espace/apercu/exemples";
import { ApercuVerrouille } from "@/components/espace/apercu/apercu-verrouille";
import { SuiteCoupee } from "@/components/espace/apercu/extrait-coupe";
import { BlocsFermes, TitreFerme } from "@/components/espace/apercu/blocs-fermes";
import { TuileFermee } from "@/components/espace/apercu/tuile-fermee";
import { PastillesDa } from "@/components/espace/da-espace";
import { Chevron, PASTILLE, TITRE_TUILE, TUILE } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, META_FORT, TEXTE } from "@/components/espace/typo";
import { SignalOffre } from "@/components/espace/apercu/signal-offre";

import { Badge } from "@/components/ui/badge";
import { EMOJI_CONTENU, RANGEE_PASTILLES } from "@/components/home/da-site";
import { EMOJIS_RUBRIQUES } from "@/components/espace/emojis";

const B = frEspaceProfond(TEXTES_BIBLIOTHEQUE);
const F = frEspaceProfond(TEXTES_FICHE);

/** Spec s26 §2.1 : cinq pastilles, reprises des constantes (pas « Humour noir, fait bien » : coin vide, rien d'inventé). */
export const PASTILLES_BIBLIOTHEQUE = [B.blocVannes, B.themesNom, B.prefixes.construction, B.prefixes.vocabulaire, B.prefixes.formule] as const;

/**
 * Les quatre blocs fermés de la construction, par leur LIBELLÉ seulement. [ARBITRAGE] spec §2.1 : le schéma en une ligne
 * est montré ; si Thomas juge que c'est trop, il passe ici (`F.schema` en tête de liste) et sort de `constructionEnClair`.
 */
const BLOCS_FERMES_CONSTRUCTION = [F.exemple, F.commentCestFait, F.essais, F.regle] as const;

/**
 * Ce qui sort de la fiche désignée (`le-faux-secret`) : le titre et le schéma en une ligne, rien d'autre. Jamais
 * `exemple`, `commentCestFait`, `essais`, `regle`, `erreur` ni `geste` (test Jest `apercus-s26-verrou`).
 */
function constructionEnClair() {
  const fiche = ficheApercu("bibliotheque");
  if (fiche.type !== "construction") throw new Error("Aperçu Bibliothèque : la fiche désignée doit être une construction");
  return { titre: fiche.titre, schema: fiche.contenu.schemaEnUneLigne };
}

function ExtraitBibliotheque() {
  const c = constructionEnClair();
  // Effectifs réels des fichiers validés (lecture triviale, sans base), comme la liste de l'abonné les sert.
  const nbVocabulaire = validerFichier("vocabulaire", vocabulaire).length;
  const nbFormules = validerFichier("formule", formules).length;
  return (
    <div data-apercu-fiche="le-faux-secret">
      {/* s26 bibliothèque liste et détail (modèle de Quoi répondre) : clic sur une partie fermée, contour sur la carte d'offre. */}
      <SignalOffre />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-12" data-apercu-rangee="1">
        <TuileFermee nette className="md:col-span-2 lg:col-span-8">
          {/* s26 bibliothèque liste et détail (DA du site, 20/11) : même famille que la fiche de l'abonné (filet violet,
              émoji 💡 des techniques, pastille violette de la rubrique, pastille neutre de la famille), texte inchangé. */}
          <div className={TUILE} data-apercu-construction>
            <p className={cn("pr-8", RANGEE_PASTILLES)}>
              <span className={EMOJI_CONTENU} aria-hidden="true">
                {EMOJIS_RUBRIQUES.bibliotheque}
              </span>
              <Badge variant="primary">{B.titre}</Badge>
              <Badge variant="default">{B.prefixes.construction}</Badge>
            </p>
            <h2 className={cn("mt-4 pr-8", TITRE_TUILE)}>{frEspace(c.titre)}</h2>
            <p className={cn("mt-4", ETIQUETTE)}>{F.schema}</p>
            <p className={cn("mt-2", TEXTE)}>{frEspace(c.schema)}</p>
            <BlocsFermes libelles={BLOCS_FERMES_CONSTRUCTION} className="md:grid-cols-2" />
          </div>
        </TuileFermee>
        {/* s26 tour 3 (B1) : une seule grille pour tout l'extrait (8/4 depuis la décision de Thomas du 18/11, celle
            du hero). Colonne de droite : « Vannes, conseils, vidéos » puis « Vocabulaire » fermé, empilés à la hauteur
            de leur contenu (`h-auto`) : plus de tuile étirée creuse. */}
        <div className="flex min-w-0 flex-col gap-6 md:col-span-2 lg:col-span-4" data-apercu-pile>
          <TuileFermee className="h-auto">
            {/* s26 contrôle d'ensemble, aperçus : bandeau et pastille violette de l'accueil (émoji de la vanne du jour). */}
            <div className={TUILE} data-apercu-catalogue>
              <PastillesDa className="pr-8" emoji={EMOJIS_RUBRIQUES.vanne} pastille={B.blocVannes} />
              <p className={cn("mt-4", META_FORT)}>{B.themesNom}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {B.themes.map((t) => (
                  <li key={t.slug} className={PASTILLE}>
                    {t.label}
                  </li>
                ))}
              </ul>
              <ul className={cn("mt-6 flex flex-wrap gap-x-6 gap-y-2", META_FORT)}>
                {B.catalogue.map((l) => (
                  <li key={l.href} className="inline-flex items-center gap-1">
                    {l.label}
                    <Chevron />
                  </li>
                ))}
              </ul>
            </div>
          </TuileFermee>
          <TuileFermee className="h-auto">
            <div className={TUILE}>
              <TitreFerme emoji={EMOJIS_RUBRIQUES.bibliotheque} titre={B.prefixes.vocabulaire} effectif={nbVocabulaire} />
            </div>
          </TuileFermee>
        </div>
      </div>
      {/* s26 tour 2 : tuiles entières seulement (`entiere`). s26 tour 3 (B1) : « Formules à détourner » seule en rangée 2,
          sur les 8 colonnes de gauche de la même grille (bords de la construction et du texte du hero). */}
      <SuiteCoupee entiere>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-12" data-apercu-rangee="2">
          <TuileFermee className="md:col-span-2 lg:col-span-8">
            <div className={TUILE}>
              <TitreFerme emoji={EMOJIS_RUBRIQUES.bibliotheque} titre={B.prefixes.formule} effectif={nbFormules} />
            </div>
          </TuileFermee>
        </div>
      </SuiteCoupee>
    </div>
  );
}

/**
 * Aperçu VERROUILLÉ de « Bibliothèque » (s26, `docs/ux/rubriques-premium-s26.md` §2.1), squelette `ApercuVerrouille` :
 * la construction désignée avec son schéma en clair et ses quatre blocs fermés (8), le catalogue en texte inerte puis
 * « Vocabulaire » fermé avec son effectif réel (4) ; sous le fondu, « Formules à détourner » et son effectif (8, même
 * grille, s26 tour 3).
 */
export function ApercuBibliotheque({ visiteur }: { visiteur: boolean }) {
  return (
    <ApercuVerrouille
      rubrique="bibliotheque"
      visiteur={visiteur}
      promesse={frEspace(TEXTES_APERCU_VERROUILLE.promesseBibliotheque)}
      pastilles={PASTILLES_BIBLIOTHEQUE}
    >
      <ExtraitBibliotheque />
    </ApercuVerrouille>
  );
}
