import { Fragment } from "react";
import Link from "next/link";
import { PREMIUM_PARCOURS } from "@/config/premium";
import { isParcoursSlug } from "@/lib/entrees-parcours";

/**
 * Accueil, maillage S3a (docs/seo/maillage-decouverte-s20.md §4, texte validé
 * par Thomas le 12/10) : « Deux autres parcours : Parcours Storytelling et
 * Parcours Boulot. » sous les 3 cartes personas.
 *
 * Liste = parcours publiés de l'offre (`PREMIUM_PARCOURS`, déjà filtrée par les
 * interrupteurs de publication, source du hub /parcours depuis s19), privée des
 * parcours des cartes. Nombre en lettres qui suit la liste ; liste vide → rien.
 * Liens vers la page du parcours (comme les cartes, sans `?src` : URL propre, arbitrage s20 UX C1).
 */

/** Slugs des 3 cartes « Tu te reconnais ? ». */
export const PARCOURS_CARTES_ACCUEIL = ["machine-a-cafe", "repartie", "confiance"] as const;

const NOMBRES = ["Zéro", "Un", "Deux", "Trois", "Quatre", "Cinq", "Six", "Sept", "Huit", "Neuf", "Dix"];

/** « Un autre parcours » / « Deux autres parcours » (chiffres au-delà de dix). */
export function autresParcoursIntro(n: number): string {
  const nombre = NOMBRES[n] ?? String(n);
  return n === 1 ? `${nombre} autre parcours` : `${nombre} autres parcours`;
}

interface AutresParcoursProps {
  parcours?: readonly { slug: string; name: string }[];
  exclus?: readonly string[];
}

export function AutresParcours({
  parcours = PREMIUM_PARCOURS,
  exclus = PARCOURS_CARTES_ACCUEIL,
}: AutresParcoursProps) {
  const autres = parcours.flatMap((p) =>
    isParcoursSlug(p.slug) && !exclus.includes(p.slug) ? [{ name: p.name, href: `/parcours/${p.slug}` }] : [],
  );
  if (autres.length === 0) return null;

  return (
    <p className="mt-4 text-center text-sm text-text-secondary">
      {autresParcoursIntro(autres.length)}&nbsp;:{" "}
      {autres.map((p, i) => (
        <Fragment key={p.href}>
          {i > 0 && (i === autres.length - 1 ? " et " : ", ")}
          <Link
            href={p.href}
            className="inline-flex min-h-[44px] items-center whitespace-nowrap font-medium text-accent-link underline underline-offset-2"
          >
            Parcours {p.name}
          </Link>
        </Fragment>
      ))}
      .
    </p>
  );
}
