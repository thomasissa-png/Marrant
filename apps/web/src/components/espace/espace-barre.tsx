"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { TEXTES_ESPACE_NAVIGATION as T } from "@/config/textes/espace-navigation";
import { RUBRIQUES, rubriqueActive } from "@/components/espace/rubriques";
import { MenuPlus } from "@/components/espace/menu-plus";
import { CLASSE_ONGLET, CLASSE_SOULIGNEMENT, margeIndice } from "@/components/espace/styles-barre";
import { cn } from "@/lib/utils";

/**
 * Barre de rubriques de l'espace (décision C1, architecture v20 §6.2, maquette
 * `aujourdhui.html`, étalon E5 §0 v5 à v7.1) : sous l'en-tête (`sticky top-16`, 44 px +
 * 2 px de bordures : empilement de 111 px avec l'en-tête, plafond 112), défilante au doigt.
 * - « Aujourd'hui » épinglée à gauche (`sticky left-0`), toujours visible et atteignable ;
 * - rubrique courante en `aria-current="page"`, ramenée à droite de l'épinglée par
 *   affectation directe de `scrollLeft` (jamais animée, donc rien à couper sous
 *   `prefers-reduced-motion`), arrêt sur le bord d'un onglet : jamais coupée en plein mot ;
 * - accroche `scroll-snap` (proximity) sur le bord de l'épinglée, espace final seulement si
 *   les entrées ne tiennent pas (le dernier onglet peut atteindre ce bord) ;
 * - indice de suite : l'entrée coupée au bord droit en montre de 16 à 24 px au repos (marge
 *   des entrées réglée, `styles-barre.ts`), plus fondu de 40 px et chevron, éteints en fin de
 *   course (l'espace final ne compte pas comme une suite) ; à gauche après défilement, fondu de
 *   8 px sur la marge seulement, jamais sur l'entrée courante (revue @design D2) ;
 * - clavier : l'entrée qui reçoit le focus est ramenée dans la vue (Tab), flèches gauche et
 *   droite d'une entrée à l'autre ;
 * - sous 300 px de large (200 % de texte) : barre non épinglée, onglets en 12/16, chevron retiré.
 */
/** Bords d'une entrée dans le repère de la liste (défilement compris), au sous-pixel près. */
function position(liste: HTMLElement, el: HTMLElement): { gauche: number; droite: number } {
  const l = liste.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { gauche: r.left - l.left + liste.scrollLeft, droite: r.right - l.left + liste.scrollLeft };
}

const Soulignement = () => <span aria-hidden="true" className={CLASSE_SOULIGNEMENT} />;

export function EspaceBarre({ pathname }: { pathname: string | null }) {
  const liste = useRef<HTMLDivElement>(null);
  const fonduGauche = useRef<HTMLDivElement>(null);
  const fonduDroite = useRef<HTMLDivElement>(null);
  const espaceFinal = useRef<HTMLSpanElement>(null);
  const [plusOuvert, setPlusOuvert] = useState(false);
  const active = rubriqueActive(pathname);

  const onglets = useCallback(
    () => Array.from(liste.current?.querySelectorAll<HTMLElement>("[data-onglet]") ?? []),
    [],
  );

  /** Fondus, espace final et marge d'accroche (maquette v6 et v7.1). */
  const fondus = useCallback(() => {
    const l = liste.current;
    const tous = onglets();
    if (!l || tous.length === 0) return;
    const p = tous[0].offsetWidth;
    const naturel = tous.reduce((s, t) => s + t.offsetWidth, 0);
    const sp = naturel <= l.clientWidth ? 0 : Math.max(0, l.clientWidth - p - tous[tous.length - 1].offsetWidth);
    if (espaceFinal.current) espaceFinal.current.style.width = `${sp}px`;
    l.style.scrollPaddingLeft = `${p}px`;
    if (fonduGauche.current) {
      fonduGauche.current.style.left = `${p}px`;
      // Revue @design D2 : 8 px au plus (la marge des entrées, jamais leur texte) et jamais sur
      // l'entrée courante quand elle touche l'épinglée.
      const courante = tous.find((t) => t.getAttribute("aria-current") === "page");
      const bordCourante = courante && courante !== tous[0] ? courante.getBoundingClientRect().left - l.getBoundingClientRect().left : Infinity;
      fonduGauche.current.classList.toggle("opacity-0", l.scrollLeft < 2 || bordCourante < p + 10);
    }
    fonduDroite.current?.classList.toggle("opacity-0", l.scrollLeft + l.clientWidth >= l.scrollWidth - sp - 2);
  }, [onglets]);

  /**
   * Indice de suite (6.2 règle c) : marge des entrées réglée pour que l'entrée coupée au bord
   * droit, barre au repos, en montre de 16 à 24 px (`margeIndice`). Mesurée sans réglage.
   */
  const ajuster = useCallback(() => {
    const l = liste.current;
    const tous = onglets();
    if (!l || tous.length === 0) return;
    l.style.removeProperty("--app-onglet-pad");
    const base = parseFloat(getComputedStyle(tous[0]).paddingLeft) || 0;
    const x = margeIndice(
      tous.map((t) => t.getBoundingClientRect().width),
      l.clientWidth,
      base,
      tous.findIndex((t) => t.getAttribute("aria-current") === "page"),
    );
    if (x !== 0) l.style.setProperty("--app-onglet-pad", `${base + x}px`);
  }, [onglets]);

  /** Rubrique courante ramenée dans la vue, à droite de l'épinglée, sans animation. */
  const ramener = useCallback(() => {
    const l = liste.current;
    const tous = onglets();
    if (!l || tous.length === 0) return;
    ajuster();
    const a = tous.find((t) => t.getAttribute("aria-current") === "page");
    if (a && a !== tous[0]) {
      fondus();
      // Positions au sous-pixel près (largeurs de texte fractionnaires), dans le repère de la liste.
      const p = tous[0].getBoundingClientRect().width;
      const bornes = [0, ...tous.slice(1).map((t) => position(l, t).gauche - p)];
      const { gauche, droite } = position(l, a);
      const bas = droite - l.clientWidth;
      const haut = gauche - p;
      l.scrollLeft = Math.round(bornes.find((b) => b >= bas - 0.5 && b <= haut + 0.5) ?? haut);
    } else {
      l.scrollLeft = 0;
    }
    fondus();
  }, [ajuster, fondus, onglets]);

  useLayoutEffect(() => {
    ramener();
  }, [ramener, pathname]);

  /**
   * Ancres (revue D2, point e) : les cibles des pages calent leur marge sur l'en-tête seul
   * (`scroll-mt-20`, 80 px, sous 111 px d'en-tête plus barre). Tant que la barre est montée, la page
   * réserve sa hauteur en haut (`scroll-padding-top`, qui s'ajoute à la marge de chaque cible) ;
   * retirée au démontage. Sous 300 px, barre non épinglée : rien à réserver.
   */
  useEffect(() => {
    const racine = document.documentElement;
    const barre = racine.querySelector<HTMLElement>("[data-espace-barre]");
    if (!barre) return;
    const avant = racine.style.scrollPaddingTop;
    const poser = () => {
      racine.style.scrollPaddingTop = getComputedStyle(barre).position === "sticky" ? `${barre.offsetHeight}px` : avant;
    };
    poser();
    window.addEventListener("resize", poser);
    return () => {
      window.removeEventListener("resize", poser);
      racine.style.scrollPaddingTop = avant;
    };
  }, []);

  useEffect(() => {
    const l = liste.current;
    if (!l) return;
    const observateur = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => ramener());
    observateur?.observe(l);
    window.addEventListener("resize", ramener);
    void document.fonts?.ready.then(ramener);
    return () => {
      observateur?.disconnect();
      window.removeEventListener("resize", ramener);
    };
  }, [ramener]);

  const surDefilement = () => {
    fondus();
    setPlusOuvert(false);
  };

  /** Focus clavier toujours ramené dans la vue (l'épinglée l'est déjà). */
  const surFocus = (e: FocusEvent<HTMLDivElement>) => {
    const l = liste.current;
    const tous = onglets();
    const t = e.target as HTMLElement;
    if (!l || tous.length === 0 || t === tous[0] || !t.hasAttribute("data-onglet")) return;
    const p = tous[0].getBoundingClientRect().width;
    const { gauche: g, droite: d } = position(l, t);
    const gauche = Math.floor(g - p - 8);
    const droite = Math.ceil(d + 8 - l.clientWidth);
    if (gauche < l.scrollLeft) l.scrollLeft = Math.max(0, gauche);
    else if (droite > l.scrollLeft) l.scrollLeft = droite;
  };

  const surTouche = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const tous = onglets();
    const i = tous.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const j = e.key === "ArrowRight" ? Math.min(tous.length - 1, i + 1) : Math.max(0, i - 1);
    if (j === i) return;
    e.preventDefault();
    tous[j].focus();
  };

  return (
    <div className="sticky top-16 z-40 border-b border-border bg-background pt-px max-e300:static" data-espace-barre>
      <nav aria-label={T.monEspace} className="mx-auto max-w-7xl px-3 e360:px-4 md:px-6 xl:px-8">
        <div className="relative -ml-3 min-w-0 max-e300:-mr-3">
          <div
            ref={liste}
            data-liste-rubriques
            onScroll={surDefilement}
            onFocus={surFocus}
            onKeyDown={surTouche}
            className="relative flex h-11 snap-x snap-proximity overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {RUBRIQUES.map((r, i) => {
              const courante = active === r.cle;
              return (
                <Link
                  key={r.cle}
                  href={r.href}
                  data-onglet
                  aria-current={courante ? "page" : undefined}
                  className={cn(CLASSE_ONGLET, i === 0 && "sticky left-0 z-10 snap-align-none bg-background")}
                >
                  {r.label}
                  {courante && <Soulignement />}
                </Link>
              );
            })}
            <MenuPlus actif={active === "plus"} ouvert={plusOuvert} onOuvertChange={setPlusOuvert} classeOnglet={CLASSE_ONGLET} />
            <span ref={espaceFinal} aria-hidden="true" className="flex-none" />
          </div>
          <div
            ref={fonduGauche}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-2 bg-gradient-to-r from-background to-transparent opacity-0 transition-opacity"
          />
          <div
            ref={fonduDroite}
            aria-hidden="true"
            data-indice-suite
            className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-end opacity-0 bg-gradient-to-l from-background/90 from-10% to-transparent text-text-secondary transition-opacity max-e300:hidden"
          >
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </nav>
    </div>
  );
}
