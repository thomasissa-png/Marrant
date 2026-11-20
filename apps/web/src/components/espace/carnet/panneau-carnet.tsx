import Link from "next/link";
import type { CarnetFiche } from "@/lib/carnet";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { CARNET_RETOUR_SOMMAIRE } from "@/config/textes/cta-pages";
import {
  ID_TITRE_FICHE_CARNET,
  contexteValide,
  filtrerLignes,
  hrefFicheCarnet,
  hrefListeCarnet,
  suivanteDe,
  type LigneCarnet,
} from "@/lib/espace/carnet-liste";
import { FicheCarnet } from "@/components/espace/carnet/fiche-carnet";
import { FocusFicheCarnet } from "@/components/espace/carnet/focus-fiche-carnet";
import { BOUTON_SECONDAIRE, LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

/** Même gabarit que « Situation suivante » de Quoi répondre (14 px, 48 px de haut, `px-6`), en contour. */
const GABARIT_SUIVANTE = "min-h-12 w-full whitespace-normal px-6 sm:w-auto sm:self-start";

/**
 * s26 carnet liste et détail : le panneau de l'abonné (fiche à droite dès 1024, plein écran dessous). La fiche
 * `numero` (sinon la première du filtre), puis « Situation suivante » (texte de Quoi répondre, À VALIDER) vers la
 * suivante de la liste filtrée, en CONTOUR : l'abonné n'a aucun bouton plein (rien après la dernière du filtre) ; sous
 * 1024, « Retour au sommaire » (16/11). Server Component : seule la fiche ouverte est dans le HTML du panneau.
 */
export function PanneauCarnet({
  mois,
  courant,
  fiches,
  numero,
  contexteBrut,
}: {
  mois: string;
  /** Mois courant : la liste est à `/carnet`. */
  courant: boolean;
  /** Toutes les fiches du mois, dans l'ordre du fichier (abonné). */
  fiches: readonly CarnetFiche[];
  numero: number | null;
  contexteBrut: string | string[] | undefined;
}) {
  const lignes: LigneCarnet[] = fiches.map((f, i) => ({ id: f.id, numero: i + 1, titre: f.titre, contexte: f.contexte }));
  const contexte = contexteValide(contexteBrut, lignes);
  const ordre = filtrerLignes(lignes, contexte);
  const n = numero ?? ordre[0]?.numero ?? 1;
  const fiche = fiches[n - 1];
  if (!fiche) return null;
  const suivante = suivanteDe(ordre, n);
  return (
    <div className="flex min-w-0 flex-col gap-6" data-carnet-panneau={n}>
      <FicheCarnet fiche={fiche} numero={n} total={fiches.length} offerte={false} titreId={ID_TITRE_FICHE_CARNET} />
      {suivante && (
        <Link href={hrefFicheCarnet(mois, suivante.numero, contexte)} scroll={false} prefetch={false} className={cn(BOUTON_SECONDAIRE, GABARIT_SUIVANTE)} data-situation-suivante={suivante.numero}>
          {frTypo(TEXTES_QUOI_REPONDRE.situationSuivante)}
        </Link>
      )}
      {/* Décision du 16/11 (« Retour au sommaire » après la fiche) gardée sous 1024 ; dès 1024 la liste est à gauche
          (audit §3). Vers la liste filtrée, dont la position quittée est rendue. */}
      <Link href={hrefListeCarnet(mois, courant, contexte)} scroll={false} className={cn(LIEN_NEUTRE, "-mt-2 self-start lg:hidden")} data-carnet-retour-sommaire="">
        {CARNET_RETOUR_SOMMAIRE}
      </Link>
      <FocusFicheCarnet numero={n} />
    </div>
  );
}
