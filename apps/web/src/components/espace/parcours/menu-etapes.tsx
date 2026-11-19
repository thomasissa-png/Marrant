"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { ETAPE_LIBRE_BADGE } from "@/config/textes/offre";
import { buttonVariants } from "@/components/ui/button";
import { CADRE_CARTE_NEUTRE, SOMMAIRE_REPLIABLE } from "@/components/espace/carte/styles";
import { ChevronRepli } from "@/components/espace/carte/chevron-repli";
import { Coche } from "@/components/espace/aujourdhui/tableau";
import { META, META_FORT, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { trackUmami } from "@/lib/umami";
import { cn } from "@/lib/utils";
import { frEspaceProfond, frTypoParcours, frTypoTexte } from "@/lib/fr-typo";

const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

/** Carte collante (même gabarit que la liste de Quoi répondre) : haut à 144 px, 24 px libres en bas, hauteur utile minimale. */
const HAUT_COLLE = 144;
const BAS_LIBRE = 24;
const HAUTEUR_MIN = 240;

/** Ligne du menu : classes de la liste de Quoi répondre (`colonne-liste.tsx`), filet blanc de 2 px sur la ligne active. */
const LIGNE =
  "relative flex min-h-11 items-center gap-3 px-6 py-2 hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary before:absolute before:inset-y-0 before:left-0 before:w-0.5";

export interface EtapeMenu {
  order: number;
  titre: string;
  /** Étape lisible sans abonnement (visiteur et compte gratuit) : pastille « Lecture libre ». */
  libre?: boolean;
}

/**
 * s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §1 et §2), espace ouvert seulement : menu d'étapes de
 * /parcours/[slug], pour les 4 comptes. Dès 1024 px, cellule de gauche (`lg:h-0 lg:min-h-full`) et carte collante à
 * `top-36`, en-tête fixe (titre du parcours, « n sur N étapes »), corps à défilement propre (une ligne par étape, ligne
 * active `aria-current="step"`, sous-étapes sous la ligne active), pied fixe de l'abonné (« Reprendre » ou « Commencer »,
 * seul plein de l'écran). Sous 1024 px, replié derrière un résumé (`SOMMAIRE_REPLIABLE`, même texte que l'en-tête) : la
 * liste et son « Reprendre » sont en `display: none` tant qu'il est replié (un seul « Reprendre » visible à 375). Rendu
 * identique serveur et navigateur (ISR) : l'ouverture sous 1024 est un état, l'affichage dès 1024 du CSS seul.
 */
export function MenuEtapes({
  slug,
  titre,
  avancee,
  etapes,
  faites,
  active,
  onChoisir,
  sousEtapes,
  reprendre,
  details,
}: {
  slug: string;
  titre: string;
  /** Texte existant de l'avancée : « n sur N étapes » (abonné) ou la ligne d'offre (visiteur, gratuit). */
  avancee: ReactNode;
  etapes: readonly EtapeMenu[];
  faites: readonly number[];
  active: number | null;
  onChoisir: (order: number) => void;
  /** Sous-étapes de l'étape active (abonné : fiches de l'étape). */
  sousEtapes?: ReactNode;
  /** Abonné : étape du pied (« Reprendre », « Commencer ») ; absent : aucun bouton (visiteur, gratuit, parcours fini). */
  reprendre?: { order: number; libelle: string } | null;
  /** Lignes de l'en-tête sous l'avancée (XP, rythme) ; abonné seulement. */
  details?: ReactNode;
}) {
  const [ouvert, setOuvert] = useState(false);
  const cellule = useRef<HTMLDivElement>(null);
  const carte = useRef<HTMLElement>(null);
  const corps = useRef<HTMLDivElement>(null);

  // Hauteur de la carte collante : place réelle entre son haut (144 px, ou le haut de la cellule avant collage) et le bas
  // de la cellule, plafonnée à la fenêtre (même calcul que la liste de Quoi répondre) ; sous 1024, rien.
  useEffect(() => {
    const el = carte.current;
    const c = cellule.current;
    if (!el || !c) return;
    let image = 0;
    const ajuster = () => {
      image = 0;
      if (typeof window.matchMedia === "function" && !window.matchMedia("(min-width: 1024px)").matches) {
        el.style.maxHeight = "";
        return;
      }
      const r = c.getBoundingClientRect();
      if (r.height === 0) return;
      const plafond = window.innerHeight - HAUT_COLLE - BAS_LIBRE;
      const dispo = r.bottom - Math.max(HAUT_COLLE, r.top);
      el.style.maxHeight = `${Math.round(Math.max(HAUTEUR_MIN, Math.min(plafond, dispo)))}px`;
    };
    const demander = () => {
      if (!image) image = window.requestAnimationFrame(ajuster);
    };
    ajuster();
    window.addEventListener("scroll", demander, { passive: true });
    window.addEventListener("resize", demander);
    const observateur = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(demander);
    observateur?.observe(c);
    return () => {
      window.removeEventListener("scroll", demander);
      window.removeEventListener("resize", demander);
      observateur?.disconnect();
      if (image) window.cancelAnimationFrame(image);
    };
  }, []);

  // Ligne active gardée visible dans le corps du menu, sans bouger la page.
  useEffect(() => {
    const el = corps.current;
    const ligne = active !== null ? el?.querySelector<HTMLElement>(`[data-ligne-etape="${active}"]`) : null;
    if (!el || !ligne) return;
    const haut = ligne.offsetTop - el.offsetTop;
    if (haut < el.scrollTop) el.scrollTop = haut;
    else if (haut + ligne.offsetHeight > el.scrollTop + el.clientHeight) el.scrollTop = haut + ligne.offsetHeight - el.clientHeight;
  }, [active]);

  const choisir = (order: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackUmami("lien-etape-clic", { parcours: slug, etape: order });
    onChoisir(order);
  };

  return (
    <div ref={cellule} className="lg:h-0 lg:min-h-full" data-testid="sommaire-parcours">
      <button
        type="button"
        aria-expanded={ouvert}
        aria-controls="menu-etapes"
        onClick={() => setOuvert((o) => !o)}
        className={cn(SOMMAIRE_REPLIABLE, "w-full justify-between lg:hidden")}
        data-menu-bascule=""
        data-ouvert={ouvert || undefined}
      >
        <span className="min-w-0 text-left [overflow-wrap:anywhere]">{avancee}</span>
        <span className={cn("flex-none transition-transform motion-reduce:transition-none", ouvert && "rotate-180")}>
          <ChevronRepli />
        </span>
      </button>
      <nav
        ref={carte}
        id="menu-etapes"
        aria-labelledby="menu-etapes-titre"
        className={cn(CADRE_CARTE_NEUTRE, "flex flex-col max-lg:mt-4 lg:sticky lg:top-36 lg:max-h-[calc(100dvh-10.5rem)]", !ouvert && "max-lg:hidden")}
        data-menu-etapes=""
      >
        <div className="flex-none p-6 pb-4">
          <p id="menu-etapes-titre" className={TITRE_CARTE}>
            {frTypoTexte(titre)}
          </p>
          <p className={cn(META_FORT, "mt-2 tabular-nums")}>{avancee}</p>
          {details}
        </div>
        <div ref={corps} className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border py-2" data-menu-corps="">
          <ol>
            {etapes.map((e) => {
              const fait = faites.includes(e.order);
              const estActive = e.order === active;
              return (
                <li key={e.order}>
                  <a
                    href={`#etape-${e.order}`}
                    onClick={choisir(e.order)}
                    aria-current={estActive ? "step" : undefined}
                    data-ligne-etape={e.order}
                    className={cn(LIGNE, estActive && "bg-background-elevated before:bg-text-primary")}
                  >
                    <span className={cn(TEXTE_FORT, "w-5 flex-none tabular-nums text-text-secondary")} aria-hidden="true">
                      {e.order}
                    </span>
                    <span className={cn("min-w-0 flex-1 [overflow-wrap:anywhere]", estActive ? META_FORT : cn(META, "text-text-primary"))}>
                      <span className="sr-only">{`${e.order}. `}</span>
                      {frTypoParcours(e.titre)}
                    </span>
                    {fait ? (
                      <span className={cn("inline-flex flex-none items-center gap-2", META)} data-statut="fait">
                        <Coche className="h-4 w-4 text-success" />
                        {P.sommaire.fait}
                      </span>
                    ) : e.libre ? (
                      <span className={cn("flex-none rounded-xl border border-border px-2", META)}>{ETAPE_LIBRE_BADGE}</span>
                    ) : null}
                  </a>
                  {estActive && sousEtapes}
                </li>
              );
            })}
          </ol>
        </div>
        {reprendre && (
          // Dès 1024, masqué quand l'étape affichée est déjà celle à reprendre (il ne ferait rien, et « Valider » de l'étape
          // est alors le plein de l'écran) ; sous 1024, gardé dans le menu déplié. Arbitrage de l'orchestrateur (s26 v2) :
          // bouton de navigation, donc en CONTOUR, pour qu'il ne fasse jamais un second aplat à côté de « Valider ».
          <div className={cn("flex-none border-t border-border", reprendre.order === active && "lg:hidden")}>
            <button
              type="button"
              id="sommaire-reprendre"
              onClick={() => onChoisir(reprendre.order)}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "m-6 mt-4 h-auto min-h-12 w-auto whitespace-normal py-2")}
            >
              {reprendre.libelle}
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
