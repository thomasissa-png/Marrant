import Link from "next/link";
import { frTypo } from "@/lib/fr-typo";
import { buttonVariants } from "@/components/ui/button";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import { cn } from "@/lib/utils";
import { LIEN_L2 } from "@/components/ui/liens";
import { BLOC_APPEL, BOUTON_BLOC_APPEL, CONTOUR_OFFRE, TITRE_BLOC_APPEL } from "@/components/layout/gabarit";
import { MUR_LISTE, MUR_PARCOURS, type ListeMur } from "@/config/textes/cta-pages";
import { Reassurance } from "@/components/ui/reassurance";
import { CARTE_A_FILET, FiletCarte } from "@/components/ui/card";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";

interface MurListeProps {
  liste: ListeMur;
  /**
   * s26 (/vannes, espace ouvert seulement ; règle de Thomas : un seul aplat violet par écran, l'en-tête collant porte
   * déjà le plein d'offre) : bouton d'offre en contour (`CONTOUR_OFFRE`), même libellé, même lien, même gabarit.
   * Sans effet interrupteur fermé.
   */
  boutonContour?: boolean;
}

/** Destination unique des murs de liste (B7) : /abonnement, retour à la liste. */
export function murAbonnementHref(liste: ListeMur): string {
  return buildAbonnementUrl(`/${liste}`, "monthly", `mur-${liste}`);
}

/**
 * Annonce de la limite (concision v5 : une ligne, « Les 10 gratuites, c'est fait. »), en tête
 * du bloc de bas de liste : revue visuelle s21, la phrase ne flotte plus seule sous la liste.
 */
export function MurListeLimite({ liste }: { liste: ListeMur }) {
  return (
    <p className="text-sm text-text-secondary" data-mur-liste-limite={liste}>
      {frTypo(MUR_LISTE[liste].limite)}
    </p>
  );
}

/**
 * Bloc de bas de liste (concision v5, textes-v5-b §1) : la limite, le titre, un plein payant,
 * la REASS dessous, puis le lien gratuit `GRATUIT_P` vers l'étape 1.
 * Revue visuelle s21 : pleine largeur de la colonne de la liste (plus de carte centrée, plus
 * étroite et décalée), même cadre que les autres blocs d'appel (`BLOC_APPEL`).
 */
export function MurListe({ liste, boutonContour = false }: MurListeProps) {
  const t = MUR_LISTE[liste];
  return (
    <section
      aria-labelledby={`mur-liste-${liste}-titre`}
      className={cn("mt-6", BLOC_APPEL, ESPACE_CLIENT_PUBLIE && CARTE_A_FILET)}
      data-mur-liste={liste}
    >
      {/* v6 tour 1 (arbitrage 1, point 9), interrupteur ouvert : carte à filet de l'accueil, réassurance à gauche
          comme le titre et le bouton du bloc. Fermé : inchangé. */}
      {ESPACE_CLIENT_PUBLIE && <FiletCarte />}
      <MurListeLimite liste={liste} />
      <h2 id={`mur-liste-${liste}-titre`} className={cn("mt-2", TITRE_BLOC_APPEL)}>
        {frTypo(t.titre)}
      </h2>
      <div className="mt-4">
        <Link
          href={murAbonnementHref(liste)}
          className={cn(buttonVariants({ variant: "primary", size: "lg" }), BOUTON_BLOC_APPEL, ESPACE_CLIENT_PUBLIE && boutonContour && CONTOUR_OFFRE)}
          data-mur-cta="premium"
        >
          {t.bouton}
        </Link>
      </div>
      <Reassurance className={ESPACE_CLIENT_PUBLIE ? "text-left" : undefined} />
      {/* s21 concision (18/10) : un seul bouton plein par bloc, le gratuit devient un lien texte (L2). */}
      <div className="-mb-3 mt-1">
        <Link
          href={parcoursEtape1Href(MUR_PARCOURS, `mur-${liste}`)}
          className={LIEN_L2}
          data-mur-cta="etape-1"
        >
          {frTypo(t.contour(MUR_PARCOURS))}
        </Link>
      </div>
    </section>
  );
}
