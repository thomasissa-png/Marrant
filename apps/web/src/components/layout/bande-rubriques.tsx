"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { RUBRIQUES, estPremium, rubriqueAllumee, type EtatLecteur, type Rubrique } from "@/components/espace/rubriques";
import { fondus, placementBande, type Boite } from "@/components/layout/placement-bande";
import { TEXTES_ESPACE_NAVIGATION as N } from "@/config/textes/espace-navigation";
import { cn } from "@/lib/utils";

/**
 * Bande des rubriques (navigation v6, `docs/ux/navigation-v6-menu-rubriques.md`, maquette D validée le 15/11,
 * `docs/espace-client/etalons/nav-v6/maquette.html?variante=d`) : sous la rangée de l'en-tête, dans le même bloc
 * collant, pour les 3 états, à toutes les largeurs, interrupteur `ESPACE_CLIENT_PUBLIE` ouvert seulement.
 * Enveloppe `rounded-xl` à peine plus claire que le fond, sans bordure ; 3 groupes séparés par 1 px ; rubrique active
 * en blanc sur pastille `background-elevated` avec soulignement violet de 3 px (lisible sans la teinte) ; cadenas de
 * 14 px pour le non-abonné sur les rubriques Premium (nom « {rubrique}, rubrique Premium ») ; « … » fixe à droite,
 * hors défilement (nom « Plus »), liste ancrée 8 px sous le filet, bord droit sur celui de la bande.
 * Chaque rubrique est un vrai lien dans le HTML serveur (celui du visiteur). Défilement au doigt, à la molette et au
 * clavier quand la bande déborde ; placement d'arrivée par `placement-bande.ts` (avant le premier affichage, puis
 * animé entre deux pages sauf mouvement réduit) ; fondus de 16 px à gauche si défilée, 32 px à droite s'il reste du
 * contenu, allongés jusqu'au libellé coupé par le bord (48 et 64 px au plus) ; aucune accroche (`scroll-snap`), séparateurs jamais masqués.
 */
/** `useLayoutEffect` dans le navigateur (placement avant affichage), `useEffect` au rendu serveur (sans avertissement). */
const useAvantAffichage = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const groupe = (g: Rubrique["groupe"]) => RUBRIQUES.filter((r) => r.groupe === g);
const GROUPES = [groupe(1), groupe(2), groupe(3)];
const PLUS = groupe("plus");

/** Pastille de 36 px dans une zone de 44 px (avant-plan `::before`), soulignement de 3 px (`::after`). */
const ZONE =
  "relative isolate flex h-11 flex-none items-center rounded-lg text-sm font-medium transition-colors before:absolute before:inset-x-0 before:inset-y-1 before:-z-10 before:rounded-lg before:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-link motion-reduce:transition-none";
const REPOS = "text-text-secondary hover:text-text-primary hover:before:bg-white/5";
const ACTIF =
  "text-text-primary before:bg-background-elevated after:absolute after:inset-x-3 after:bottom-1 after:h-[3px] after:rounded-t-sm after:bg-accent-primary";

const Cadenas = () => (
  <svg aria-hidden="true" className="h-3.5 w-3.5 flex-none text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 118 0v4" />
  </svg>
);

/** Boîtes des rubriques, relatives au début du contenu défilant. */
function boites(el: HTMLElement): Boite[] {
  const base = el.getBoundingClientRect().left - el.scrollLeft;
  return Array.from(el.querySelectorAll<HTMLElement>("[data-rubrique]")).map((c) => {
    const r = c.getBoundingClientRect();
    return { gauche: r.left - base, largeur: r.width };
  });
}

/** Fondus (16 px à gauche si défilée, 32 px à droite s'il reste du contenu, allongés jusqu'au libellé coupé). */
function masque(el: HTMLElement) {
  const { gauche: g, droit: d } = fondus(boites(el), el.scrollLeft, el.clientWidth, el.scrollWidth);
  const m = `linear-gradient(to right,${g ? `transparent 0,black ${g}px` : "black 0"},${d ? `black calc(100% - ${d}px),transparent 100%` : "black 100%"})`;
  el.style.maskImage = g || d ? m : "none";
  el.style.setProperty("-webkit-mask-image", g || d ? m : "none");
  el.dataset.fondus = `${Math.round(g)} ${Math.round(d)}`;
}

export function BandeRubriques({ etat, pathname }: { etat: EtatLecteur; pathname: string | null }) {
  const allume = rubriqueAllumee(pathname);
  const verrou = etat !== "abonne";
  const plusAllume = PLUS.some((r) => r.cle === allume);
  const [ouvert, setOuvert] = useState(false);
  const defile = useRef<HTMLDivElement>(null);
  const bouton = useRef<HTMLButtonElement>(null);
  const liste = useRef<HTMLUListElement>(null);
  const premierPlacement = useRef(true);

  const placer = useCallback((anime: boolean) => {
    const el = defile.current;
    if (!el) return;
    masque(el);
    if (el.scrollWidth - el.clientWidth < 1) return;
    const t = placementBande({
      boites: boites(el),
      actif: Array.from(el.querySelectorAll("[data-rubrique]")).findIndex((c) => c.hasAttribute("aria-current")),
      largeurVue: el.clientWidth,
      largeurTotale: el.scrollWidth,
    });
    const reduit = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? true;
    el.scrollTo({ left: t, behavior: anime && !reduit ? "smooth" : "auto" });
    masque(el);
  }, []);

  // Avant le premier affichage : placement immédiat ; entre deux pages : animé. Cadenas (état connu) : immédiat.
  useAvantAffichage(() => {
    placer(!premierPlacement.current);
    premierPlacement.current = false;
    setOuvert(false);
  }, [pathname, placer]);
  useAvantAffichage(() => placer(false), [verrou, placer]);
  useEffect(() => {
    // Largeur seulement : sur téléphone, la barre d'adresse change la hauteur à chaque défilement de la page, et le
    // défilement de la bande choisi par le lecteur doit tenir.
    let largeur = window.innerWidth;
    const surRedim = () => {
      if (window.innerWidth === largeur) return;
      largeur = window.innerWidth;
      placer(false);
    };
    window.addEventListener("resize", surRedim);
    void document.fonts?.ready.then(() => placer(false));
    return () => window.removeEventListener("resize", surRedim);
  }, [placer]);

  // « … » : Échap ferme et rend le focus ; clic dehors ferme.
  useEffect(() => {
    if (!ouvert) return;
    const touche = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      e.preventDefault();
      setOuvert(false);
      bouton.current?.focus();
    };
    const dehors = (e: PointerEvent) => {
      const cible = e.target as Node;
      if (!liste.current?.contains(cible) && !bouton.current?.contains(cible)) setOuvert(false);
    };
    document.addEventListener("keydown", touche);
    document.addEventListener("pointerdown", dehors);
    return () => {
      document.removeEventListener("keydown", touche);
      document.removeEventListener("pointerdown", dehors);
    };
  }, [ouvert]);

  // Flèches haut et bas (Début, Fin) entre les lignes ; flèche bas sur « … » ouvre et va à la première ligne.
  const lignes = () => Array.from(liste.current?.querySelectorAll<HTMLElement>("a") ?? []);
  const surToucheListe = (e: React.KeyboardEvent) => {
    const l = lignes();
    const i = l.indexOf(document.activeElement as HTMLElement);
    const n = { ArrowDown: (i + 1) % l.length, ArrowUp: (i - 1 + l.length) % l.length, Home: 0, End: l.length - 1 }[e.key];
    if (n === undefined || !l[n]) return;
    e.preventDefault();
    l[n].focus();
  };

  const nom = (r: Rubrique) => (verrou && estPremium(r) ? N.bande.premium(r.label) : undefined);

  return (
    <div className="pb-2 md:pb-3" data-bande-rubriques>
      <nav aria-label={N.bande.nom} className="mx-auto max-w-7xl px-4 md:px-6 xl:px-8">
        <div className="relative flex w-full items-center rounded-xl bg-background-light px-1">
          <div
            ref={defile}
            onScroll={(e) => masque(e.currentTarget)}
            data-defilement
            className="flex min-w-0 flex-1 items-center overflow-x-auto overscroll-x-contain pr-2 [scrollbar-width:none] max-xl:[mask-image:linear-gradient(to_right,black_calc(100%-32px),transparent)] [&::-webkit-scrollbar]:hidden"
          >
            {GROUPES.map((g, i) => (
              <Fragment key={i}>
                {i > 0 && <span aria-hidden="true" data-separateur className="mx-1.5 h-5 w-px flex-none bg-border-hover" />}
                {g.map((r) => (
                  <Link
                    key={r.cle}
                    href={r.href}
                    data-rubrique={r.cle}
                    aria-current={allume === r.cle ? "page" : undefined}
                    aria-label={nom(r)}
                    className={cn(ZONE, "gap-[5px] whitespace-nowrap px-3", allume === r.cle ? ACTIF : REPOS)}
                  >
                    {r.label}
                    {verrou && estPremium(r) && <Cadenas />}
                  </Link>
                ))}
              </Fragment>
            ))}
          </div>
          <button
            ref={bouton}
            type="button"
            aria-label={N.bande.plus}
            aria-expanded={ouvert}
            aria-controls="liste-plus"
            aria-current={plusAllume ? "true" : undefined}
            onClick={() => setOuvert(!ouvert)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowDown") return;
              e.preventDefault();
              setOuvert(true);
              requestAnimationFrame(() => lignes()[0]?.focus());
            }}
            className={cn(ZONE, "ml-1 w-11 justify-center", plusAllume ? ACTIF : REPOS, "after:inset-x-2.5")}
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="19" cy="12" r="1.8" />
            </svg>
          </button>
          {/* 8 px sous le filet de l'en-tête : marge basse de la bande (8, puis 12 dès 768 px) + filet de 1 px + 8. */}
          <ul
            ref={liste}
            id="liste-plus"
            aria-label={N.bande.listePlus}
            hidden={!ouvert}
            onKeyDown={surToucheListe}
            className="absolute right-0 top-full z-[60] mt-[17px] min-w-[200px] overflow-hidden rounded-xl border border-border bg-background-card p-1 pt-2 shadow-xl shadow-black/60 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-accent-primary-hover before:to-accent-secondary-hover md:mt-[21px]"
          >
            {PLUS.map((r) => (
              <li key={r.cle}>
                <Link
                  href={r.href}
                  onClick={() => setOuvert(false)}
                  aria-current={allume === r.cle ? "page" : undefined}
                  aria-label={nom(r)}
                  className={cn(
                    "flex h-11 items-center justify-between gap-3 rounded-md px-3 text-sm font-medium transition-colors hover:bg-background-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-link",
                    allume === r.cle ? "bg-background-elevated text-text-primary" : "text-text-secondary",
                  )}
                >
                  {r.label}
                  {verrou && <Cadenas />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
