"use client";

import Link from "next/link";
import { frTypo } from "@/lib/fr-typo";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { chipClass } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { buildRegisterUrl } from "@/lib/auth-links";
import { trackUmami } from "@/lib/umami";
import { PREMIUM_PRICE_LABEL } from "@/config/premium";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import { ACCUEIL_LIEN_ETAPE_1 } from "@/config/textes/entrees-parcours";
import { ReprendreParcoursBloc } from "@/components/home/reprendre-parcours";
import { useParcoursAReprendre } from "@/hooks/use-parcours-a-reprendre";

/** Pastilles du hero : libellés existants, chacune mène à l'étape 1 du parcours qu'elle nomme
 *  (T02 ; s17 : `?src=accueil`, data-analyst §5.3).
 *  Ordre aligné sur le reste du site, le plus court d'abord (audit forme s14 P2-4, tranché par Thomas). */
const HERO_PARCOURS_LINKS = [
  { label: "Briller à la machine à café", href: parcoursEtape1Href("machine-a-cafe", "accueil") },
  { label: "Avoir de la répartie", href: parcoursEtape1Href("repartie", "accueil") },
  { label: "Reprendre confiance en toi", href: parcoursEtape1Href("confiance", "accueil") },
] as const;

/** Lien secondaire visiteur (UX-08, s17) : l'étape 1 du parcours le plus court, en lecture libre. */
const HERO_ETAPE_1_HREF = parcoursEtape1Href("machine-a-cafe", "accueil");

const HERO_EXTRA_TAGS = ["Un petit exercice par jour", "Vannes prêtes à ressortir"] as const;

export function HeroSection() {
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
        {frTypo(
          "Tu restes muet quand on te chambre ? Tu galères à faire rire à la machine à café ? Tu voudrais retrouver ta légèreté ? On a les vannes, les techniques et les exercices. Toi, tu ramènes ta motivation.",
        )}
      </p>

      {/* Social proof — chiffre fixe validé fondateur 29/09/2026 */}
      <p className="mt-6 text-sm font-medium text-accent-link">
        1&nbsp;500+ membres bossent leur humour. Rejoins-les.
      </p>

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
            className={cn(
              buttonVariants({ variant: aReprendre ? "outline" : "primary", size: "lg" }),
              aReprendre && "border-accent-primary hover:border-accent-primary hover:bg-accent-primary/10",
              "w-full sm:w-auto",
            )}
          >
            Explorer les vannes
          </Link>
          <Link
            href="/conseils"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
          >
            Voir les conseils
          </Link>
        </div>
        </>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-1">
          {/* Étalon 1.2 validé par Thomas (s15) : le parcours d'abord, le prix en note */}
          <Link
            href={buildRegisterUrl({ src: "accueil-hero" })}
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full sm:w-auto")}
            onClick={() => trackUmami("abonnement-clic", { formule: "mensuel", src: "accueil-hero", statut: "visiteur" })}
          >
            Accéder aux parcours complets
          </Link>
          <p className="max-w-md text-balance text-sm text-text-muted">
            {PREMIUM_PRICE_LABEL}, sans engagement. La première étape de chaque parcours reste en lecture libre.
          </p>
          {/* Seul ce lien secondaire change en s17 (UX-08) ; l'étalon 1.2 au-dessus reste intact.
              s17 tour 1 (UXV-1-08, DES-1-13) : texte principal, soulignement violet, cible 44 px. */}
          <Link
            href={HERO_ETAPE_1_HREF}
            className="inline-flex min-h-[44px] items-center px-3 py-2 text-base font-semibold text-text-primary underline decoration-accent-link decoration-2 underline-offset-4 hover:text-accent-link"
          >
            {ACCUEIL_LIEN_ETAPE_1}
          </Link>
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

      {/* Atouts : texte informatif, NON cliquable (ni fond ni bordure), masqué en mobile : arbitrage Thomas s12, forme audit s14 P0-1 */}
      <ul className="mx-auto mt-4 hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-muted sm:flex">
        {HERO_EXTRA_TAGS.map((label) => (
          <li key={label} className="flex items-center gap-2">
            <span className="text-success" aria-hidden="true">✓</span>
            {label}
          </li>
        ))}
      </ul>

    </section>
  );
}
