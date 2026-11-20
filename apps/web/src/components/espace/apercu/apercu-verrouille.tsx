import { TEXTES_APERCU, type RubriqueApercu } from "@/config/textes/espace-apercu";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { ADRESSES_APERCU } from "@/components/espace/apercu/acces";
import { sourceApercu } from "@/components/espace/apercu/apercu-rubrique";
import { HeroApercu } from "@/components/espace/apercu/hero-apercu";
import { ExtraitCoupe } from "@/components/espace/apercu/extrait-coupe";

/**
 * Aperçu verrouillé d'une rubrique Premium (refonte s25, spec UX §2, design §3) : le motif qui remplacera
 * `ApercuRubrique` rubrique par rubrique (« Aujourd'hui », puis en s26 « Quoi répondre », « Bibliothèque » et
 * « S'entraîner », puis Favoris, et Mes questions et Mes répliques au dernier lot s26 : plus aucune page sur l'ancien
 * aperçu ; `ApercuRubrique` ne reste importé que par ses tests d'origine, `sourceApercu` et `metadonneesApercu` y vivent).
 * Hero (A, B) puis légende (E, en tête de l'extrait depuis le v7 tour 10), extrait coupé (C) et fin d'extrait (D). Une seule action : l'offre, deux boutons
 * identiques (hero, fin d'extrait) vers le même lien, source de mesure de la rubrique (`data-position` haut / fin).
 * Rendu serveur statique, sans appel à l'espace (rien ne s'enregistre depuis un aperçu). Squelette constant ;
 * variables : promesse, pastilles, contenu de l'extrait (blocs enveloppés de `TuileFermee`).
 * v7 tour 3 (piste) : la page finit sur sa légende, une ligne de texte : marge basse réduite (environ 100 px de noir
 * avant le pied au tour 2), le pied suit à l'espacement de la coque. v7 tour 10 : la page finit sur le bouton de fin.
 */
export function ApercuVerrouille({
  rubrique,
  visiteur,
  promesse,
  pastilles,
  children,
}: {
  rubrique: RubriqueApercu;
  visiteur: boolean;
  promesse: string;
  pastilles: readonly string[];
  /** L'extrait réel de la rubrique (zone C). */
  children: React.ReactNode;
}) {
  const adresse = ADRESSES_APERCU[rubrique];
  const href = buildAbonnementUrl(adresse, "monthly", sourceApercu(rubrique));
  return (
    <div className="halo-page pb-4 md:pb-6" data-apercu={rubrique} data-apercu-verrouille>
      {/* s26 liste et détail, tour 8 : rythme du hero régularisé dans « Quoi répondre » (`HeroApercu`) ; s26 bibliothèque
          liste et détail : la Bibliothèque suit le même modèle. */}
      <HeroApercu
        titre={TEXTES_APERCU.titres[rubrique]}
        promesse={promesse}
        pastilles={pastilles}
        offre={{ href, adresse, visiteur }}
        rythmeRegulier={rubrique === "quoiRepondre" || rubrique === "bibliotheque"}
      />
      <ExtraitCoupe href={href} rubrique={rubrique}>
        {children}
      </ExtraitCoupe>
    </div>
  );
}
