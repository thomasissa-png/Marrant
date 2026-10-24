"use client";

import Link from "next/link";
import { frTypo } from "@/lib/fr-typo";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { chipClass } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import { ReprendreParcoursBloc } from "@/components/home/reprendre-parcours";
import { useParcoursAReprendre } from "@/hooks/use-parcours-a-reprendre";
import { CORPS_APPEL_MOBILE } from "@/components/layout/gabarit";

/** Pastilles du hero : libellés existants, chacune mène à l'étape 1 du parcours qu'elle nomme
 *  (T02 ; s17 : `?src=accueil`, data-analyst §5.3).
 *  Ordre aligné sur le reste du site, le plus court d'abord (audit forme s14 P2-4, tranché par Thomas). */
const HERO_PARCOURS_LINKS = [
  { label: "Briller à la machine à café", href: parcoursEtape1Href("machine-a-cafe", "accueil") },
  { label: "Avoir de la répartie", href: parcoursEtape1Href("repartie", "accueil") },
  { label: "Reprendre confiance en toi", href: parcoursEtape1Href("confiance", "accueil") },
] as const;

/** s21 (B3) : le plein visiteur ouvre l'étape 1 de Répartie, en lecture libre (froid). */
const HERO_ETAPE_1_HREF = parcoursEtape1Href("repartie", "accueil");

/** Textes validés du haut d'accueil (concision v5 : phrase, preuve, plein, note), passés par la page serveur. */
export interface TextesAccueilHaut {
  intro: string;
  preuve: string;
  bouton: string;
  note: string;
}

/** s21 (QA m3, budget JS) : `textes` = `ACCUEIL_HAUT`, lu côté serveur (le module n'est plus dans le JS client). */
export function HeroSection({ textes }: { textes: TextesAccueilHaut }) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const aReprendre = useParcoursAReprendre();

  return (
    <section className="py-12 text-center md:py-20">
      {/* Une phrase par ligne (demande fondateur : 2 lignes). Taille mobile calée
          pour que « Tu parles et personne rit. » tienne sur 358 px (passe s12, T01). */}
      <h1 className="font-display text-[1.75rem] font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
        <span className="block">
          Tu parles et <span className="whitespace-nowrap text-gradient">personne rit</span>.
        </span>
        <span className="block">On va arranger ça.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary md:text-xl">
        {frTypo(textes.intro)}
      </p>

      {/* Preuve sociale : chiffre fixe validé fondateur 29/09/2026 (texte : ACCUEIL_HAUT.preuve). */}
      <p className="mt-6 text-sm font-medium text-accent-link">{frTypo(textes.preuve)}</p>

      {/* CTA : connectés vers le catalogue ; anonymes vers l'abonnement (étape 1
          sur 2 : le compte, puis le paiement), lecture libre visible dessous (T03) */}
      {isAuthenticated ? (
        <>
        {/* Abonné avec un parcours en cours : « Reprendre ton parcours » d'abord (reco 5, s17). */}
        <ReprendreParcoursBloc src="accueil" className="mx-auto mt-8 max-w-xl" aReprendre={aReprendre} />
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/vannes"
            // s17 tour 2 (DES-2-08) : un seul bouton plein ; avec « Reprendre » affiché, celui-ci passe en contour.
            // Revue visuelle s21 : variante niveau 2 du design system (`outline-accent`), plus de bordure surchargée.
            className={cn(buttonVariants({ variant: aReprendre ? "outline-accent" : "primary", size: "lg" }), "w-full sm:w-auto")}
          >
            Explorer les vannes
          </Link>
          <Link
            href="/conseils"
            // Revue visuelle s21 : même rôle (entrée gratuite dans le produit) = même variante que son voisin.
            className={cn(buttonVariants({ variant: "outline-accent", size: "lg" }), "w-full sm:w-auto")}
          >
            Voir les conseils
          </Link>
        </div>
        </>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-1">
          {/* s21 (B3, spec cta-forme-place §4) : visiteur froid. Plein = étape 1 de Répartie ;
              note en petit. Textes : cta-articles-accueil.ts. */}
          <Link
            href={HERO_ETAPE_1_HREF}
            data-accueil-cta="etape-1"
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "h-auto min-h-12 w-full whitespace-normal px-4 py-2 text-center [text-wrap:balance] sm:w-auto",
              CORPS_APPEL_MOBILE,
            )}
          >
            {frTypo(textes.bouton)}
          </Link>
          {/* s21 concision (18/10) : plus de lien payant souligné ici, le bouton de prix de l'en-tête
              porte le payant (source `header`). Source `accueil-hero` retirée avec le lien. */}
          <p className="mt-2 max-w-md text-balance text-xs text-text-muted">{frTypo(textes.note)}</p>
        </div>
      )}

      {/* Situations concrètes : 3 liens-pastilles (bordé = cliquable), sous le CTA (spec UX §2.8) */}
      <ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {HERO_PARCOURS_LINKS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={chipClass()}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

    </section>
  );
}
