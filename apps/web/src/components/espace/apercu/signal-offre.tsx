"use client";

import { useEffect, useRef } from "react";

/**
 * Durée du contour posé sur la carte d'offre (spec UX §1). s26 liste et détail, tour 4 (relectures à l'aveugle : le clic
 * sur une tuile fermée « ne produisait rien », les 600 ms du tour 1 tombaient entre deux captures) : 1,5 s, au-delà des
 * 1,2 s demandées.
 */
export const DUREE_SIGNAL_MS = 1500;
/** Plafond d'attente de la fin du défilement doux avant de poser le contour et le focus. */
const ARRIVEE_MAX_MS = 1000;
/**
 * Parties fermées de l'extrait : tuiles (la situation comprise : elle porte un verrou, tour 4) et répliques fermées.
 * Ordre de recherche : la réplique d'abord (la plus petite, c'est elle que le survol marque), puis la tuile.
 */
const REPLIQUES = "[data-replique-fermee]";
const TUILES = "[data-tuile-fermee]";
/** Bouton d'offre du hero, focalisé après le signal (seul élément focusable visé, hors de l'extrait). */
const BOUTON = "a[data-position='haut']";

/** Élément fermé sous le pointeur (réplique, sinon tuile), `null` hors des parties fermées. */
function fermeSous(extrait: HTMLElement, x: number, y: number): HTMLElement | null {
  const dedans = (el: HTMLElement) => {
    if (el.offsetParent === null) return false;
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };
  for (const selecteur of [REPLIQUES, TUILES]) {
    const el = Array.from(extrait.querySelectorAll<HTMLElement>(selecteur)).find(dedans);
    if (el) return el;
  }
  return null;
}

/**
 * s26 liste et détail, tour 1 (`docs/ux/liste-detail-quoi-repondre-s26.md` §1 ; mesures §7 : un clic sur une tuile fermée
 * ne faisait rien, page morte). Posé DANS l'extrait (inerte, `aria-hidden`, sans élément focusable : ce repère vide n'en
 * ajoute aucun), il écoute le conteneur de l'extrait, seul élément touché par le pointeur (l'extrait est `inert` et sans
 * pointeur). Parties fermées trouvées par la position du pointeur. Aucune navigation, aucun texte ; clavier et lecteurs
 * d'écran inchangés.
 * s26 liste et détail, tour 4 (relectures à l'aveugle D1 et F3 : captures avant et après le clic identiques) :
 * - survol d'une partie fermée : curseur main et bord éclairci (`data-survol`, la réplique ou la tuile sous le pointeur),
 *   comme une carte cliquable ; rien hors des parties fermées ;
 * - clic : si la carte d'offre n'est pas entièrement à l'écran, défilement doux jusqu'à elle (instantané si le mouvement
 *   est réduit) ; à l'arrivée, contour violet de 2 px tenu 1,5 s PUIS focus sur son bouton, avec un anneau de focus
 *   visible (`data-focus-signal`, retiré à la perte du focus : un focus posé par script après un clic de souris ne
 *   montre pas toujours `:focus-visible`).
 */
export function SignalOffre() {
  const repere = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const extrait = repere.current?.closest<HTMLElement>("[data-apercu-extrait]");
    if (!extrait) return;
    const minuteries: number[] = [];
    let survole: HTMLElement | null = null;

    const marquer = (el: HTMLElement | null) => {
      if (el === survole) return;
      survole?.removeAttribute("data-survol");
      el?.setAttribute("data-survol", "");
      extrait.style.cursor = el ? "pointer" : "";
      survole = el;
    };

    const signal = (carte: HTMLElement) => {
      carte.setAttribute("data-signal", "");
      minuteries.push(window.setTimeout(() => carte.removeAttribute("data-signal"), DUREE_SIGNAL_MS));
      const bouton = carte.querySelector<HTMLElement>(BOUTON);
      if (!bouton) return;
      bouton.setAttribute("data-focus-signal", "");
      bouton.addEventListener("blur", () => bouton.removeAttribute("data-focus-signal"), { once: true });
      bouton.focus({ preventScroll: true });
    };

    const surMouvement = (e: MouseEvent) => marquer(e.target === extrait ? fermeSous(extrait, e.clientX, e.clientY) : null);
    const surSortie = () => marquer(null);

    const surClic = (e: MouseEvent) => {
      if (e.target !== extrait) return; // Légende, carte de fin et son bouton : leur propre comportement.
      const carte = document.querySelector<HTMLElement>("[data-apercu-hero] [data-apercu-offre]");
      if (!fermeSous(extrait, e.clientX, e.clientY) || !carte) return;
      const r = carte.getBoundingClientRect();
      const enTete = Math.max(0, document.querySelector("header")?.getBoundingClientRect().bottom ?? 0);
      if (r.top >= enTete && r.bottom <= window.innerHeight) {
        signal(carte);
        return;
      }
      const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - enTete - 24), behavior: reduit ? "auto" : "smooth" });
      if (reduit) {
        signal(carte);
        return;
      }
      // Contour et focus à l'arrivée : fin du défilement, ou au plus tard 1 s après le clic.
      let fait = false;
      const arrivee = () => {
        if (fait) return;
        fait = true;
        window.removeEventListener("scrollend", arrivee);
        signal(carte);
      };
      window.addEventListener("scrollend", arrivee, { once: true });
      minuteries.push(window.setTimeout(arrivee, ARRIVEE_MAX_MS));
    };

    extrait.addEventListener("click", surClic);
    extrait.addEventListener("mousemove", surMouvement);
    extrait.addEventListener("mouseleave", surSortie);
    return () => {
      extrait.removeEventListener("click", surClic);
      extrait.removeEventListener("mousemove", surMouvement);
      extrait.removeEventListener("mouseleave", surSortie);
      marquer(null);
      minuteries.forEach((m) => window.clearTimeout(m));
    };
  }, []);

  return <span ref={repere} hidden data-signal-offre />;
}
