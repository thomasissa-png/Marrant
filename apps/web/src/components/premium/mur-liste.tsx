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
import { CARTE_A_FILET, FILET_MASQUE, FiletCarte } from "@/components/ui/card";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";

interface MurListeProps {
  liste: ListeMur;
  /**
   * s26 (/vannes, espace ouvert seulement ; règle de Thomas : un seul aplat violet par écran, l'en-tête collant porte
   * déjà le plein d'offre) : bouton d'offre en contour (`CONTOUR_OFFRE`), même libellé, même lien, même gabarit.
   * s26 tour 2 (P4) : aussi le filet violet du bloc masqué et le lien « Tester l'étape 1 » en blanc souligné (plus de
   * second accent violet). Sans effet interrupteur fermé.
   */
  sansViolet?: boolean;
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
/**
 * s26 tour 3 (point 5, /vannes ouvert seulement, `sansViolet`) : dès 1024 px, texte à gauche (limite, titre, réassurance,
 * lien gratuit) et bouton d'offre à droite, centré en hauteur (au tour 2, tout était empilé à gauche, environ 600 px
 * vides à droite à 1280). Classes seules, aucun élément ajouté : grille de 12, texte en 8, bouton en 4 calé à droite.
 */
const MUR_EN_LIGNE =
  "lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:[&>*]:col-span-8 lg:[&>div:has(>[data-mur-cta=premium])]:col-span-4 lg:[&>div:has(>[data-mur-cta=premium])]:col-start-9 lg:[&>div:has(>[data-mur-cta=premium])]:row-span-4 lg:[&>div:has(>[data-mur-cta=premium])]:row-start-1 lg:[&>div:has(>[data-mur-cta=premium])]:mt-0 lg:[&>div:has(>[data-mur-cta=premium])]:justify-self-end";

export function MurListe({ liste, sansViolet = false }: MurListeProps) {
  const neutre = ESPACE_CLIENT_PUBLIE && sansViolet;
  const t = MUR_LISTE[liste];
  return (
    <section
      aria-labelledby={`mur-liste-${liste}-titre`}
      className={cn("mt-6", BLOC_APPEL, ESPACE_CLIENT_PUBLIE && CARTE_A_FILET, neutre && FILET_MASQUE, neutre && MUR_EN_LIGNE)}
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
          className={cn(buttonVariants({ variant: "primary", size: "lg" }), BOUTON_BLOC_APPEL, neutre && CONTOUR_OFFRE)}
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
          className={cn(LIEN_L2, neutre && "text-text-primary hover:text-text-secondary")}
          data-mur-cta="etape-1"
        >
          {frTypo(t.contour(MUR_PARCOURS))}
        </Link>
      </div>
    </section>
  );
}
