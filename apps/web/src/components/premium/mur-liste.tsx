import Link from "next/link";
import { frTypo } from "@/lib/fr-typo";
import { buttonVariants } from "@/components/ui/button";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import { cn } from "@/lib/utils";
import { LIEN_L2 } from "@/components/ui/liens";
import { BLOC_APPEL, BOUTON_BLOC_APPEL, TITRE_BLOC_APPEL } from "@/components/layout/gabarit";
import { MUR_LISTE, MUR_PARCOURS, type ListeMur } from "@/config/textes/cta-pages";
import { REASSURANCE_UNIQUE } from "@/config/textes/offre";

interface MurListeProps {
  liste: ListeMur;
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
export function MurListe({ liste }: MurListeProps) {
  const t = MUR_LISTE[liste];
  return (
    <section
      aria-labelledby={`mur-liste-${liste}-titre`}
      className={cn("mt-6", BLOC_APPEL)}
      data-mur-liste={liste}
    >
      <MurListeLimite liste={liste} />
      <h2 id={`mur-liste-${liste}-titre`} className={cn("mt-2", TITRE_BLOC_APPEL)}>
        {frTypo(t.titre)}
      </h2>
      <div className="mt-4">
        <Link
          href={murAbonnementHref(liste)}
          className={cn(buttonVariants({ variant: "primary", size: "lg" }), BOUTON_BLOC_APPEL)}
          data-mur-cta="premium"
        >
          {t.bouton}
        </Link>
      </div>
      <p className="mt-2 text-xs text-text-muted">{frTypo(REASSURANCE_UNIQUE)}</p>
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
