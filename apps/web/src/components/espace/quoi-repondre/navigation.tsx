"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { CLE_DEPUIS_LISTE } from "@/lib/espace/quoi-repondre-liste";
import { useFaitsQuoiRepondre } from "@/components/espace/quoi-repondre/faits-contexte";
import { LienRetour } from "@/components/espace/lien-retour";
import { BOUTON_SECONDAIRE } from "@/components/espace/carte/styles";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";

const T = frEspaceProfond(TEXTES_QUOI_REPONDRE);

const lire = (cle: string) => {
  try {
    return window.sessionStorage.getItem(cle);
  } catch {
    return null;
  }
};
const ecrire = (cle: string, valeur: string | null) => {
  try {
    if (valeur === null) window.sessionStorage.removeItem(cle);
    else window.sessionStorage.setItem(cle, valeur);
  } catch {
    // Stockage refusé : la position n'est pas gardée, rien d'autre ne change.
  }
};

/**
 * « Situation suivante » (texte À VALIDER, s26), dernier élément du panneau : contour tant que la fiche n'est pas
 * « Fait », plein après (le geste perd alors son aplat : un seul plein à l'écran). Une entrée d'historique (`push`) ;
 * dès 1024 la page garde son défilement et le focus passe au titre de la fiche suivante.
 */
export function SituationSuivante({ ficheId, href, faitInitial }: { ficheId: string; href: string; faitInitial: boolean }) {
  const faits = useFaitsQuoiRepondre();
  const fait = faits?.faitDe(ficheId) ?? faitInitial;
  return (
    <Link
      href={href}
      prefetch={false}
      onClick={() => faits?.demanderFocus()}
      className={cn(fait ? buttonVariants({ variant: "primary", size: "lg" }) : cn(BOUTON_SECONDAIRE, "min-h-12"), "w-full whitespace-normal sm:w-auto sm:self-start")}
      data-situation-suivante
      data-plein={fait ? "" : undefined}
    >
      {T.situationSuivante}
    </Link>
  );
}

/**
 * Ouverture d'une fiche depuis la liste ou « Situation suivante » : focus au H1 (sans défilement) et, si le haut du
 * panneau est passé au-dessus de l'écran, retour à ce haut (la fiche commence à son titre) ; sinon la page garde son
 * `scrollY`. À froid (adresse ouverte directement), rien n'est déplacé.
 */
export function OuvertureFiche() {
  const faits = useFaitsQuoiRepondre();
  const repere = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!faits?.consommerFocus()) return;
    const titre = document.getElementById("fiche-titre");
    const haut = repere.current?.getBoundingClientRect().top ?? 0;
    if (haut < 0) window.scrollTo({ top: window.scrollY + haut - 144 });
    titre?.focus({ preventScroll: true });
  }, [faits]);
  return <span ref={repere} aria-hidden="true" className="block h-0" />;
}

/**
 * « Retour » de la fiche plein écran (< 1024 ; masqué dès 1024, la liste est à gauche) : `router.back()` quand la fiche
 * a été ouverte depuis la page liste (la liste retrouve sa position, ses filtres), sinon un lien vers la liste AVEC
 * `?ou=&pour=`. Même place et même aspect que le « Retour » des autres fiches (`LienRetour`).
 */
export function RetourListe({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  const chemin = usePathname();
  const [depuisListe, setDepuisListe] = useState(false);
  useEffect(() => setDepuisListe(lire(CLE_DEPUIS_LISTE) === chemin), [chemin]);
  return (
    <LienRetour
      href={href}
      label={label}
      onClick={(e) => {
        if (!depuisListe) return;
        e.preventDefault();
        ecrire(CLE_DEPUIS_LISTE, null);
        router.back();
      }}
    />
  );
}

/**
 * Page liste (< 1024) : au clic sur une fiche, `scrollY` et l'adresse de la liste sont gardés (`sessionStorage`, clé
 * rubrique + filtres) avec l'adresse de la fiche ouverte (« Retour » = `router.back()`) ; au retour sur cette même
 * adresse de liste (bouton « Retour » ou navigateur), la position est restaurée (le document a rétréci pendant la
 * fiche : le navigateur ne le fait pas seul).
 */
export function MemoireDefilementPage({ cle, children }: { cle: string; children: React.ReactNode }) {
  useEffect(() => {
    const memoire = lire(cle);
    if (!memoire) return;
    const { y, adresse } = JSON.parse(memoire) as { y: number; adresse: string };
    if (adresse !== `${window.location.pathname}${window.location.search}`) return;
    window.scrollTo({ top: y });
    ecrire(cle, null);
  }, [cle]);
  return (
    <div
      onClickCapture={(e) => {
        const lien = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="/mon-espace/quoi-repondre/"]');
        if (!lien) return;
        ecrire(cle, JSON.stringify({ y: window.scrollY, adresse: `${window.location.pathname}${window.location.search}` }));
        ecrire(CLE_DEPUIS_LISTE, new URL(lien.href).pathname);
      }}
    >
      {children}
    </div>
  );
}
