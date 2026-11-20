"use client";

import { useEffect } from "react";
import { ecrire, lire, type ClesRetour } from "@/components/espace/liste-detail/navigation";

/**
 * s26 bibliothèque liste et détail : mémoire de défilement de la page liste (< 1024), reprise de
 * `MemoireDefilementPage` (Quoi répondre, inchangée) avec l'adresse des fiches et les clés en paramètres. Au clic sur
 * une fiche, `scrollY`, l'adresse de la liste et le lien cliqué sont gardés ; au retour (« Retour » ou navigateur), la
 * position est rendue (lien cliqué remis à la même hauteur) et la ligne de la fiche quittée est repérée 1,5 s.
 */

/** Liens affichés de la page liste vers une même adresse. */
const liensVisibles = (href: string) =>
  Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-mode='page'] a[href]")).filter((a) => a.getAttribute("href") === href && a.offsetParent !== null);

/** Bas de l'en-tête collant du site (0 s'il ne colle pas). */
const basEnTete = () =>
  Math.max(0, ...Array.from(document.querySelectorAll<HTMLElement>("header")).filter((h) => getComputedStyle(h).position === "sticky" && h.offsetParent !== null).map((h) => h.offsetHeight));

/** Position corrigée pour qu'aucun lien ni bouton de la page liste ne soit coupé par le bas de l'en-tête. */
function sansLigneCoupee(top: number) {
  const bord = basEnTete();
  if (bord === 0) return top;
  const coupe = Array.from(document.querySelectorAll<HTMLElement>("[data-mode='page'] a[href], [data-mode='page'] button, [data-mode='page'] summary"))
    .filter((e) => e.offsetParent !== null)
    .map((e) => {
      const r = e.getBoundingClientRect();
      return { haut: r.top + window.scrollY - top, bas: r.bottom + window.scrollY - top };
    })
    .find((e) => e.haut < bord && e.bas > bord);
  if (!coupe) return top;
  const montrer = top + coupe.haut - bord - 8;
  const cacher = top + coupe.bas - bord;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, top - montrer < cacher - top || cacher > max ? montrer : cacher);
}

const cheminDe = (href: string) => href.split(/[?#]/)[0];

function lireQuittee(cle: string): string | null {
  try {
    const { chemin, t } = JSON.parse(lire(cle) ?? "null") as { chemin: string; t: number };
    return Date.now() - t < 5000 ? chemin : null;
  } catch {
    return null;
  }
}

const ligneDe = (chemin: string) =>
  Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-mode='page'] [data-etat='liste'] a[href]")).find((a) => cheminDe(a.getAttribute("href") ?? "") === chemin && a.offsetParent !== null) ?? null;

const DUREE_REPERE_MS = 1500;
const REPERE_LIGNE =
  "[&_[data-ligne-reperee]]:!outline [&_[data-ligne-reperee]]:!outline-2 [&_[data-ligne-reperee]]:!outline-offset-4 [&_[data-ligne-reperee]]:!outline-text-muted";

function repererLigne(chemin: string | null): () => void {
  const ligne = chemin ? ligneDe(chemin) : null;
  if (!ligne) return () => undefined;
  ligne.setAttribute("data-ligne-reperee", "");
  const minuterie = window.setTimeout(() => ligne.removeAttribute("data-ligne-reperee"), DUREE_REPERE_MS);
  return () => {
    window.clearTimeout(minuterie);
    ligne.removeAttribute("data-ligne-reperee");
  };
}

function topLigneCentree(chemin: string): number | null {
  const ligne = ligneDe(chemin);
  if (!ligne) return null;
  const bord = basEnTete();
  const r = ligne.getBoundingClientRect();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min(max, Math.max(0, window.scrollY + r.top - bord - (window.innerHeight - bord - r.height) / 2));
}

export function MemoireDefilementListe({ cle, prefixeFiches, cles, children }: { cle: string; prefixeFiches: string; cles: ClesRetour; children: React.ReactNode }) {
  useEffect(() => {
    const quittee = lireQuittee(cles.ficheQuittee);
    ecrire(cles.ficheQuittee, null);
    const memoire = lire(cle);
    const garde = memoire ? (JSON.parse(memoire) as { y: number; adresse: string; href?: string; rang?: number; haut?: number }) : null;
    const ici = `${window.location.pathname}${window.location.search}`;
    const valable = garde && garde.adresse === ici ? garde : null;
    const reperee = quittee ?? (valable?.href ? cheminDe(valable.href) : null);
    if (quittee && (!valable?.href || cheminDe(valable.href) !== quittee)) {
      const top = topLigneCentree(quittee);
      if (top !== null) {
        window.scrollTo({ top: sansLigneCoupee(top) });
        if (valable) ecrire(cle, null);
        return repererLigne(reperee);
      }
    }
    if (!valable) return repererLigne(reperee);
    const { y, href, rang, haut } = valable;
    const memes = href ? liensVisibles(href) : [];
    const cible = memes[Math.min(rang ?? 0, memes.length - 1)];
    const top = cible && haut !== undefined ? window.scrollY + cible.getBoundingClientRect().top - haut : y;
    window.scrollTo({ top: sansLigneCoupee(top) });
    ecrire(cle, null);
    return repererLigne(reperee);
  }, [cle, cles.ficheQuittee]);
  return (
    <div
      className={REPERE_LIGNE}
      onClickCapture={(e) => {
        const lien = (e.target as HTMLElement).closest<HTMLAnchorElement>(`a[href^="${prefixeFiches}"]`);
        if (!lien) return;
        const href = lien.getAttribute("href") ?? "";
        const memoire = { y: window.scrollY, adresse: `${window.location.pathname}${window.location.search}`, href, rang: liensVisibles(href).indexOf(lien), haut: lien.getBoundingClientRect().top };
        ecrire(cle, JSON.stringify(memoire));
        ecrire(cles.depuisListe, new URL(lien.href).pathname);
      }}
    >
      {children}
    </div>
  );
}
