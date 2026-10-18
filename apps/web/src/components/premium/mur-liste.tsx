import Link from "next/link";
import { frTypo } from "@/lib/fr-typo";
import { buttonVariants } from "@/components/ui/button";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import { cn } from "@/lib/utils";
import {
  lignePrixGarantie,
  MUR_LISTE,
  MUR_PARCOURS,
  type ListeMur,
} from "@/config/textes/cta-pages";

/** Lien fort L1 (cta-forme-place-s21 §1.3) : le payant en niveau 3 sous le plein (accueil, fin d'article, quiz). */
export const LIEN_L1 =
  "inline-flex min-h-11 items-center text-base font-semibold text-text-primary underline decoration-accent-link decoration-2 underline-offset-4 hover:text-accent-link";

/** Lien discret L2 (cta-forme-place-s21 §1.3). */
export const LIEN_L2 = "inline-flex min-h-11 items-center text-sm text-accent-link underline underline-offset-2";

interface MurListeProps {
  liste: ListeMur;
  /** Offre annuelle disponible (lue côté serveur, `isAnnualPlanAvailable()`). */
  annuel: boolean;
}

/** Destination unique des murs de liste (B7) : /abonnement, retour à la liste. */
export function murAbonnementHref(liste: ListeMur): string {
  return buildAbonnementUrl(`/${liste}`, "monthly", `mur-${liste}`);
}

/**
 * Annonce de la limite, placée après la dernière carte gratuite (B7 a et b) :
 * plus de bandeau en haut de liste.
 */
export function MurListeLimite({ liste }: { liste: ListeMur }) {
  const t = MUR_LISTE[liste];
  return (
    <div className="mt-6" data-mur-liste-limite={liste}>
      <p className="text-sm text-text-secondary">{t.limite}</p>
      <Link href={murAbonnementHref(liste)} className={LIEN_L2}>
        {t.filtres}
      </Link>
    </div>
  );
}

/**
 * Bloc de bas de liste (B7 d) : tiède, un plein Premium, un contour vers
 * l'étape 1 gratuite, puis prix et garantie.
 */
export function MurListe({ liste, annuel }: MurListeProps) {
  const t = MUR_LISTE[liste];
  return (
    <section
      aria-labelledby={`mur-liste-${liste}-titre`}
      className="mx-auto mt-8 max-w-xl rounded-lg border border-border bg-background-card p-5 sm:p-6"
      data-mur-liste={liste}
    >
      <h2 id={`mur-liste-${liste}-titre`} className="font-display text-lg font-bold text-text-primary">
        {frTypo(t.titre)}
      </h2>
      <p className="mt-2 text-sm text-text-secondary">{frTypo(t.texte)}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={murAbonnementHref(liste)}
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "h-auto min-h-12 w-full whitespace-normal py-2 text-center sm:w-auto",
          )}
          data-mur-cta="premium"
        >
          {t.bouton}
        </Link>
      </div>
      <p className="mt-2 text-xs text-text-muted">{frTypo(lignePrixGarantie(annuel))}</p>
      <Link
        href={parcoursEtape1Href(MUR_PARCOURS, "fiche")}
        className={cn(
          buttonVariants({ variant: "outline-accent", size: "lg" }),
          "mt-3 h-auto min-h-12 w-full whitespace-normal py-2 text-center sm:w-auto",
        )}
        data-mur-cta="etape-1"
      >
        {frTypo(t.contour(MUR_PARCOURS))}
      </Link>
    </section>
  );
}
