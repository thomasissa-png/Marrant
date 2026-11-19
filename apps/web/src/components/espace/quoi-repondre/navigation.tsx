"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { CLE_DEPUIS_LISTE, CLE_FICHE_QUITTEE } from "@/lib/espace/quoi-repondre-liste";
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
  const lien = useRef<HTMLAnchorElement>(null);
  const avant = useRef(fait);
  // s26 liste et détail, tour 1 (mesures §3 : après « Fait », le seul plein était sous le pli à 768 et 1280) : au passage
  // à « Fait », le bouton est ramené dans l'écran s'il n'y est pas, en douceur (`nearest` : le moins de défilement
  // possible ; instantané si le mouvement est réduit). Jamais au montage (fiche déjà faite : rien ne bouge).
  useEffect(() => {
    const el = lien.current;
    if (fait && !avant.current && el) {
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) {
        const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ block: "nearest", behavior: reduit ? "auto" : "smooth" });
      }
    }
    avant.current = fait;
  }, [fait]);
  return (
    <Link
      ref={lien}
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

/** Haut collé de la liste et du panneau dès 1024 (`top-36`, spec design §1) : sous l'en-tête collant du site. */
const HAUT_PANNEAU = 144;

/**
 * Ouverture d'une fiche depuis la liste ou « Situation suivante » : focus au H1 (sans défilement) et, si le haut du
 * panneau est passé au-dessus de l'écran, retour à ce haut (la fiche commence à son titre) ; sinon la page garde son
 * `scrollY`. À froid (adresse ouverte directement), rien n'est déplacé.
 * s26 liste et détail, tour 2 (mesures A2 étape 5 : à 1280, fiche ouverte à `scrollY` 63, haut du H1 SOUS l'en-tête
 * collant) : dès 1024, le seuil est le haut collé de la liste (144 px), plus le haut de l'écran ; le panneau y est
 * ramené en douceur (`scroll-behavior: smooth` du site, instantané si `prefers-reduced-motion`, `globals.css`), son
 * haut aligné sur celui de la liste. La liste, dans son propre conteneur, garde son `scrollTop`. Sous 1024 (fiche
 * plein écran), rien ne change.
 */
export function OuvertureFiche() {
  const faits = useFaitsQuoiRepondre();
  const repere = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!faits) return;
    const large = window.matchMedia?.("(min-width: 1024px)").matches ?? false;
    if (faits.consommerFocus()) {
      const titre = document.getElementById("fiche-titre");
      const haut = repere.current?.getBoundingClientRect().top ?? 0;
      if (haut < (large ? HAUT_PANNEAU : 0)) window.scrollTo({ top: Math.max(0, window.scrollY + haut - HAUT_PANNEAU) });
      titre?.focus({ preventScroll: true });
      return;
    }
    // s26 liste et détail, tour 3 (mesures N1 : retour navigateur dès 1024, panneau rendu à la position quittée, haut
    // du H1 à 37 px à 1024 et 115 à 1280, sous l'en-tête de 121 px) : la fiche montée par un retour du navigateur
    // revient comme à l'ouverture, son haut à 144 px s'il est passé au-dessus. Le focus n'est pas déplacé (retour).
    if (!faits.consommerRetour() || !large) return;
    requestAnimationFrame(() => {
      const haut = repere.current?.getBoundingClientRect().top;
      if (haut !== undefined && haut < HAUT_PANNEAU) window.scrollTo({ top: Math.max(0, window.scrollY + haut - HAUT_PANNEAU) });
    });
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
  // s26 liste et détail, tour 4 : en quittant la fiche (« Retour », retour du navigateur, autre lien), son adresse est
  // notée ; la page liste montée dans la foulée se recale sur sa ligne (`MemoireDefilementPage`).
  useEffect(() => () => ecrire(CLE_FICHE_QUITTEE, JSON.stringify({ chemin, t: Date.now() })), [chemin]);
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

/** Liens affichés de la page liste vers une même adresse (la prochaine action et sa ligne peuvent la partager). */
const liensVisibles = (racine: Document, href: string) =>
  Array.from(racine.querySelectorAll<HTMLAnchorElement>("[data-mode='page'] a[href]")).filter((a) => a.getAttribute("href") === href && a.offsetParent !== null);

/** Bas de l'en-tête collant du site (0 s'il ne colle pas : fenêtre de moins de 500 px de haut). */
const basEnTete = (racine: Document) =>
  Math.max(0, ...Array.from(racine.querySelectorAll<HTMLElement>("header")).filter((h) => getComputedStyle(h).position === "sticky" && h.offsetParent !== null).map((h) => h.offsetHeight));

/**
 * s26 liste et détail, tour 3 (mesures N3 : à 768, retour à `scrollY` 206, « Voir » à y 108, à moitié sous l'en-tête de
 * 121 px) : position de retour `top` corrigée pour qu'aucun lien ni bouton de la page liste ne soit coupé par le bas de
 * l'en-tête. Le plus petit des deux déplacements : le montrer entier, 8 px sous l'en-tête, ou le passer entier dessous.
 * Au plus une demi-ligne : la ligne cliquée reste dans l'écran.
 */
function sansLigneCoupee(racine: Document, top: number) {
  const bord = basEnTete(racine);
  if (bord === 0) return top;
  const coupe = Array.from(racine.querySelectorAll<HTMLElement>("[data-mode='page'] a[href], [data-mode='page'] button, [data-mode='page'] summary"))
    .filter((e) => e.offsetParent !== null)
    .map((e) => {
      const r = e.getBoundingClientRect();
      return { haut: r.top + window.scrollY - top, bas: r.bottom + window.scrollY - top };
    })
    .find((e) => e.haut < bord && e.bas > bord);
  if (!coupe) return top;
  const montrer = top + coupe.haut - bord - 8;
  const cacher = top + coupe.bas - bord;
  const max = racine.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, top - montrer < cacher - top || cacher > max ? montrer : cacher);
}

/** Chemin d'une adresse de fiche (sans les filtres). */
const cheminDe = (href: string) => href.split(/[?#]/)[0];

/** Fiche quittée il y a moins de 5 s (`RetourListe`), sinon `null`. */
function lireQuittee(): string | null {
  try {
    const { chemin, t } = JSON.parse(lire(CLE_FICHE_QUITTEE) ?? "null") as { chemin: string; t: number };
    return Date.now() - t < 5000 ? chemin : null;
  } catch {
    return null;
  }
}

/**
 * s26 liste et détail, tour 4 : `scrollY` qui centre la ligne de la fiche dans la zone sous l'en-tête collant (la ligne
 * de la liste, pas la prochaine action en tête de page) ; `null` si elle n'est pas affichée (dès 1024, autre filtre).
 */
function topLigneCentree(racine: Document, chemin: string): number | null {
  const ligne = Array.from(racine.querySelectorAll<HTMLAnchorElement>("[data-mode='page'] [data-etat='liste'] a[href]")).find((a) => cheminDe(a.getAttribute("href") ?? "") === chemin && a.offsetParent !== null);
  if (!ligne) return null;
  const bord = basEnTete(racine);
  const r = ligne.getBoundingClientRect();
  const max = racine.documentElement.scrollHeight - window.innerHeight;
  return Math.min(max, Math.max(0, window.scrollY + r.top - bord - (window.innerHeight - bord - r.height) / 2));
}

/**
 * Page liste (< 1024) : au clic sur une fiche, `scrollY` et l'adresse de la liste sont gardés (`sessionStorage`, clé
 * rubrique + filtres) avec l'adresse de la fiche ouverte (« Retour » = `router.back()`) ; au retour sur cette même
 * adresse de liste (bouton « Retour » ou navigateur), la position est restaurée (le document a rétréci pendant la
 * fiche : le navigateur ne le fait pas seul).
 */
export function MemoireDefilementPage({ cle, children }: { cle: string; children: React.ReactNode }) {
  useEffect(() => {
    // s26 liste et détail, tour 4 (relecture UX : « la liste revient en haut au lieu de la ligne courante », séquence
    // ligne 3, « Fait », « Situation suivante », « Retour ») : la fiche quittée il y a moins de 5 s fait foi. Si ce n'est
    // pas celle qu'on avait ouverte depuis la liste (ou si rien n'était gardé), la page se recale sur SA ligne, centrée
    // sous l'en-tête ; sinon, la position gardée est rendue comme avant.
    const quittee = lireQuittee();
    ecrire(CLE_FICHE_QUITTEE, null);
    const memoire = lire(cle);
    const garde = memoire ? (JSON.parse(memoire) as { y: number; adresse: string; href?: string; rang?: number; haut?: number }) : null;
    const ici = `${window.location.pathname}${window.location.search}`;
    const valable = garde && garde.adresse === ici ? garde : null;
    if (quittee && (!valable?.href || cheminDe(valable.href) !== quittee)) {
      const top = topLigneCentree(document, quittee);
      if (top !== null) {
        window.scrollTo({ top: sansLigneCoupee(document, top) });
        if (valable) ecrire(cle, null);
        return;
      }
    }
    if (!valable) return;
    const { y, href, rang, haut } = valable;
    // s26 liste et détail, tour 1 (mesures §2 : 1194 -> 1247 à 375, 587 -> 575 à 768) : la position est rendue par le
    // lien cliqué, remis à la même hauteur dans l'écran (le contenu au-dessus peut avoir changé de hauteur entre-temps :
    // repli des filtres, prochaine action) ; `scrollY` brut seulement si le lien n'est plus affiché.
    const memes = href ? liensVisibles(document, href) : [];
    const cible = memes[Math.min(rang ?? 0, memes.length - 1)];
    const top = cible && haut !== undefined ? window.scrollY + cible.getBoundingClientRect().top - haut : y;
    window.scrollTo({ top: sansLigneCoupee(document, top) });
    ecrire(cle, null);
  }, [cle]);
  return (
    <div
      onClickCapture={(e) => {
        const lien = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="/mon-espace/quoi-repondre/"]');
        if (!lien) return;
        const href = lien.getAttribute("href") ?? "";
        const memoire = { y: window.scrollY, adresse: `${window.location.pathname}${window.location.search}`, href, rang: liensVisibles(document, href).indexOf(lien), haut: lien.getBoundingClientRect().top };
        ecrire(cle, JSON.stringify(memoire));
        ecrire(CLE_DEPUIS_LISTE, new URL(lien.href).pathname);
      }}
    >
      {children}
    </div>
  );
}
