"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, useSelectedLayoutSegments } from "next/navigation";
import { contexteValide, hrefFicheCarnet, hrefListeCarnet, numeroDe, type CarnetListe } from "@/lib/espace/carnet-liste";
import { ListeCarnet } from "@/components/espace/carnet/liste-carnet";
import { EnTeteCarnet } from "@/components/espace/carnet/en-tete-carnet";
import { demanderFocusFicheCarnet } from "@/components/espace/carnet/focus-fiche-carnet";
import { LienRetour } from "@/components/espace/lien-retour";
import { CELLULE_LISTE_COLLANTE, GRILLE_LISTE_DETAIL, HAUT_COLLE_LISTE } from "@/components/espace/liste-detail/styles";
import { cn } from "@/lib/utils";

const LARGE = "(min-width: 1024px)";
const large = () => window.matchMedia?.(LARGE).matches ?? false;
// `useLayoutEffect` au navigateur (position avant l'image), rien au serveur.
const useAvantImage = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * s26 carnet liste et détail (`docs/ux/carnet-audit-s26.md` §3), abonné, espace ouvert : posé par le layout de
 * `/carnet`, il reste MONTÉ d'une fiche à l'autre. Lit l'adresse (`[]` = mois courant, `[mois]`, `[mois, n]`) et le
 * filtre `?contexte=`. En-tête (titre, intro, usage, mois et année) puis, dès 1024, liste collante à gauche et fiche à
 * droite (n° 1 du filtre par défaut, jamais vide) ; sous 1024, la page liste OU la fiche plein écran avec « Retour :
 * Carnet » (`router.back()` si elle vient de la liste, sinon lien vers la liste filtrée) et la position de la liste
 * rendue au retour. Mois ou numéro inconnu : la page seule (sa 404).
 */
export function CarnetListeDetail({ carnets, children }: { carnets: CarnetListe[]; children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const parametres = useSearchParams();
  const [moisSeg, numeroSeg] = segments;
  const carnet = moisSeg ? (carnets.find((c) => c.mois === moisSeg) ?? null) : (carnets[0] ?? null);
  const numero = carnet && numeroSeg !== undefined ? numeroDe(numeroSeg, carnet.lignes.length) : null;
  const contexte = carnet ? contexteValide(parametres.get("contexte"), carnet.lignes) : null;
  const cleListe = carnet ? `${carnet.mois}:${contexte ?? ""}` : "";

  const panneau = useRef<HTMLDivElement>(null);
  const ouvertureListe = useRef(false);
  const positionListe = useRef<{ cle: string; y: number } | null>(null);
  const avant = useRef<number | null | undefined>(undefined);
  const [depuisListe, setDepuisListe] = useState(false);

  // Clic sur une ligne : position de la page liste gardée (sous 1024), « Retour » par l'historique.
  const surOuverture = () => {
    ouvertureListe.current = true;
    demanderFocusFicheCarnet();
    if (!large()) positionListe.current = { cle: cleListe, y: window.scrollY };
  };

  // Changement de fiche dans la page : dès 1024, le haut du panneau revient sous l'en-tête collant s'il est passé
  // au-dessus (la liste garde son `scrollTop`) ; sous 1024, la fiche commence en haut de l'écran. Retour à la liste sous
  // 1024 : la position quittée est rendue.
  useAvantImage(() => {
    const precedent = avant.current;
    avant.current = numero;
    if (precedent === undefined || precedent === numero) return;
    if (numero !== null) {
      setDepuisListe(ouvertureListe.current);
      if (!ouvertureListe.current) demanderFocusFicheCarnet();
      ouvertureListe.current = false;
      if (large()) {
        const haut = panneau.current?.getBoundingClientRect().top ?? 0;
        if (haut < HAUT_COLLE_LISTE) window.scrollTo({ top: Math.max(0, window.scrollY + haut - HAUT_COLLE_LISTE), behavior: "instant" });
      } else window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    if (large()) return;
    const garde = positionListe.current;
    const y = garde && garde.cle === cleListe ? garde.y : 0;
    window.scrollTo({ top: y, behavior: "instant" });
    // Le navigateur peut encore poser sa propre position après l'image (retour de l'historique) : la nôtre prime.
    requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
  }, [numero, cleListe]);

  // Ancien lien `#fiche-<id>` (sommaire d'avant, encart des articles) : la fiche à sa nouvelle adresse.
  useEffect(() => {
    if (!carnet || numero !== null) return;
    const id = /^#fiche-(.+)$/.exec(window.location.hash)?.[1];
    const ligne = id ? carnet.lignes.find((l) => l.id === decodeURIComponent(id)) : undefined;
    if (ligne) router.replace(hrefFicheCarnet(carnet.mois, ligne.numero, contexte), { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!carnet || (numeroSeg !== undefined && numero === null) || segments.length > 2) return <>{children}</>;
  const ouverte = numero !== null;
  const courant = carnet.mois === carnets[0]?.mois;

  return (
    <div className="pb-[calc(4rem+env(safe-area-inset-bottom))]" data-carnet="abonne" data-carnet-mode={ouverte ? "fiche" : "liste"}>
      {ouverte && (
        <div className="mb-4 lg:hidden">
          <LienRetour
            href={hrefListeCarnet(carnet.mois, courant, contexte)}
            label="Carnet"
            onClick={(e) => {
              if (!depuisListe) return;
              e.preventDefault();
              router.back();
            }}
          />
        </div>
      )}
      {/* s26 contrôle d'ensemble, abonné : fil d'Ariane gardé sur la page de détail (nav v6 : retiré au premier niveau,
          /carnet), dès 1024 comme sur le détail d'un parcours ; dessous, « Retour : Carnet ». Classes de `FilAriane`. */}
      {ouverte && (
        <nav aria-label="Fil d’Ariane" className="mb-4 text-sm text-text-muted max-lg:hidden">
          <Link href="/" className="hover:text-text-primary">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <Link href={hrefListeCarnet(carnet.mois, courant, contexte)} className="hover:text-text-primary">
            Carnet
          </Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">{carnet.libelle}</span>
        </nav>
      )}
      {/* s27 D8 : fiche ouverte sous 1024, l'en-tête reste masqué à l'œil mais son h1 est gardé pour les lecteurs d'écran
          (avant : aucun h1, le titre de la fiche est un h2 sous ce h1). */}
      <EnTeteCarnet mois={carnet.mois} libelle={carnet.libelle} titre={carnet.titre} intro={carnet.intro} className={cn("mb-8", ouverte && "max-lg:mb-0 max-lg:[&>:not(h1)]:hidden max-lg:[&>h1]:sr-only")} />
      <div className={GRILLE_LISTE_DETAIL} data-liste-detail>
        <div className={cn(CELLULE_LISTE_COLLANTE, ouverte && "max-lg:hidden")} data-zone="liste">
          <ListeCarnet carnets={carnets} carnet={carnet} numero={numero} contexte={contexte} surOuverture={surOuverture} />
        </div>
        <div ref={panneau} className={cn("min-w-0", !ouverte && "max-lg:hidden")} data-zone="panneau">
          {children}
        </div>
      </div>
    </div>
  );
}
