"use client";

import { useEffect, useRef } from "react";

/** Durée du contour posé sur la carte d'offre (spec UX §1). */
export const DUREE_SIGNAL_MS = 600;
/** Parties fermées de l'extrait : tuile fermée entière, réplique fermée, verrou (jamais la partie en clair). */
const FERMES = "[data-tuile-fermee=''], [data-replique-fermee], [data-verrou-ferme]";

/**
 * s26 liste et détail, tour 1 (`docs/ux/liste-detail-quoi-repondre-s26.md` §1 ; mesures §7 : un clic sur une tuile fermée
 * ne faisait rien, page morte). Posé DANS l'extrait (inerte, `aria-hidden`, sans élément focusable : ce repère vide n'en
 * ajoute aucun), il écoute le conteneur de l'extrait, seul élément touché par le clic (l'extrait est `inert` et sans
 * pointeur). Clic sur une partie fermée (tuile, réplique, verrou ; trouvée par la position du pointeur) : la carte d'offre
 * du hero reçoit 600 ms de contour violet de 2 px ; si elle n'est pas entièrement à l'écran, défilement doux jusqu'à
 * elle d'abord (instantané si le mouvement est réduit). Aucune navigation, aucun texte, clavier et lecteurs d'écran
 * inchangés. Clic sur la partie en clair de la situation : rien.
 */
export function SignalOffre() {
  const repere = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const extrait = repere.current?.closest<HTMLElement>("[data-apercu-extrait]");
    if (!extrait) return;
    const minuteries: number[] = [];

    const contour = (carte: HTMLElement) => {
      carte.setAttribute("data-signal", "");
      minuteries.push(window.setTimeout(() => carte.removeAttribute("data-signal"), DUREE_SIGNAL_MS));
    };

    const surClic = (e: MouseEvent) => {
      if (e.target !== extrait) return; // Légende, carte de fin et son bouton : leur propre comportement.
      const ferme = Array.from(extrait.querySelectorAll<HTMLElement>(FERMES)).some((el) => {
        const r = el.getBoundingClientRect();
        return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      });
      const carte = document.querySelector<HTMLElement>("[data-apercu-hero] [data-apercu-offre]");
      if (!ferme || !carte) return;
      const r = carte.getBoundingClientRect();
      const enTete = Math.max(0, document.querySelector("header")?.getBoundingClientRect().bottom ?? 0);
      if (r.top >= enTete && r.bottom <= window.innerHeight) {
        contour(carte);
        return;
      }
      const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - enTete - 24), behavior: reduit ? "auto" : "smooth" });
      if (reduit) {
        contour(carte);
        return;
      }
      // Contour à l'arrivée : fin du défilement, ou au plus tard 600 ms après le clic.
      let fait = false;
      const arrivee = () => {
        if (fait) return;
        fait = true;
        window.removeEventListener("scrollend", arrivee);
        contour(carte);
      };
      window.addEventListener("scrollend", arrivee, { once: true });
      minuteries.push(window.setTimeout(arrivee, DUREE_SIGNAL_MS));
    };

    extrait.addEventListener("click", surClic);
    return () => {
      extrait.removeEventListener("click", surClic);
      minuteries.forEach((m) => window.clearTimeout(m));
    };
  }, []);

  return <span ref={repere} hidden data-signal-offre />;
}
