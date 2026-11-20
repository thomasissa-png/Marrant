"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { ETAPE_LIBRE_BADGE } from "@/config/textes/offre";
import { buttonVariants } from "@/components/ui/button";
import { CADRE_CARTE_NEUTRE, SOMMAIRE_REPLIABLE } from "@/components/espace/carte/styles";
import { ChevronRepli } from "@/components/espace/carte/chevron-repli";
import { Coche } from "@/components/espace/aujourdhui/tableau";
import { Cadenas } from "@/components/layout/bande-rubriques";
import { META, META_FORT, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { trackUmami } from "@/lib/umami";
import { cn } from "@/lib/utils";
import { frEspaceProfond, frTypoParcours, frTypoTexte } from "@/lib/fr-typo";

const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

/**
 * Carte collante : 24 px libres en bas, hauteur utile minimale. s26 parcours, tour 5 (D6 de la relecture design v2) : haut
 * collé à 137 px (au lieu de 144), celui d'une étape ou d'une fiche amenée sous l'en-tête (128 + 9) : menu et carte
 * d'étape alignés au pixel à 1280. Classes `lg:top-[8.5625rem]` et `lg:max-h-[calc(100dvh-10.0625rem)]` (137 et 161 px, rem pour la règle « aucune valeur en px » de l'espace).
 */
const HAUT_COLLE = 137;
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
  /** s26 parcours, tour 5 : étape réservée à l'abonnement (visiteur et compte gratuit) : cadenas de la bande de rubriques. */
  verrouillee?: boolean;
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
  retour,
}: {
  slug: string;
  titre: string;
  /** Texte existant de l'avancée : « n sur N étapes » (abonné) ou la ligne d'offre (visiteur, gratuit). */
  avancee: ReactNode;
  etapes: readonly EtapeMenu[];
  faites: readonly number[];
  active: number | null;
  onChoisir: (order: number) => void;
  /**
   * Sous-étapes d'une étape (abonné : fiches de l'étape). s26 parcours, tour 7 (MESURES v4 §2 : au changement d'étape, le
   * menu sautait de +152/-196 px, la liste passant d'une ligne à l'autre) : rendues sous CHAQUE étape, menu figé ; seule
   * l'étape affichée porte une sous-étape active.
   */
  sousEtapes?: (order: number) => ReactNode;
  /** Abonné : étape du pied (« Reprendre », « Commencer ») ; absent : aucun bouton (visiteur, gratuit, parcours fini). */
  reprendre?: { order: number; libelle: string } | null;
  /** Lignes de l'en-tête sous l'avancée (XP, rythme) ; abonné seulement. */
  details?: ReactNode;
  /** s26 parcours, tour 7 : sous 1024 px, « Retour : Parcours » à gauche de la barre collante (le `LienRetour` existant). */
  retour?: ReactNode;
}) {
  const [ouvert, setOuvert] = useState(false);
  const cellule = useRef<HTMLDivElement>(null);
  const carte = useRef<HTMLElement>(null);
  const corps = useRef<HTMLDivElement>(null);
  const barre = useRef<HTMLDivElement>(null);

  // s26 parcours, tour 7 (relecture UX v4, D5 : à 375, arrivée par « Reprendre » sans retour ni menu visibles) : sous
  // 1024 px, barre compacte collée sous l'en-tête (retour et bouton du menu). Son haut suit la hauteur réelle de l'en-tête
  // collant (0 quand il défile avec la page, fenêtre de moins de 500 px de haut), et la réserve de défilement du document
  // (`scroll-padding-top`, 128 px posés par l'en-tête) passe à en-tête + barre : une étape ou une fiche amenée arrive sous
  // la barre, 8 px plus bas (marge de 9 px des blocs comprise). Dès 1024 px : rien, réserve d'origine.
  useEffect(() => {
    const c = cellule.current;
    const b = barre.current;
    if (!c || !b) return;
    const racine = document.documentElement;
    let image = 0;
    const ajuster = () => {
      image = 0;
      const etroit = typeof window.matchMedia === "function" && !window.matchMedia("(min-width: 1024px)").matches;
      if (!etroit) {
        c.style.top = "";
        c.style.position = "";
        racine.style.scrollPaddingTop = "";
        return;
      }
      const entete = document.querySelector<HTMLElement>("header[data-en-tete-universel]");
      // s26 tour 7 ter (arbitrage du 15/11) : sous 500 px de haut, l'en-tête ne colle pas ; la barre compacte non plus
      // (elle défile avec la page) et la réserve des ancres reste à 0, celle du site.
      if (!entete || getComputedStyle(entete).position !== "sticky") {
        c.style.top = "";
        c.style.position = "static";
        racine.style.scrollPaddingTop = "";
        return;
      }
      c.style.position = "";
      const haut = Math.round(entete.getBoundingClientRect().height);
      c.style.top = `${haut}px`;
      racine.style.scrollPaddingTop = `${haut + Math.round(c.getBoundingClientRect().height) - 1}px`;
    };
    const demander = () => {
      if (!image) image = window.requestAnimationFrame(ajuster);
    };
    ajuster();
    window.addEventListener("resize", demander);
    const observateur = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(demander);
    observateur?.observe(c);
    const entete = document.querySelector("header[data-en-tete-universel]");
    if (entete) observateur?.observe(entete);
    return () => {
      window.removeEventListener("resize", demander);
      observateur?.disconnect();
      if (image) window.cancelAnimationFrame(image);
      c.style.top = "";
      c.style.position = "";
      racine.style.scrollPaddingTop = "";
    };
  }, []);

  // Tour 7 : menu déplié sous 1024 px, Échap ou un clic hors de la barre le replie (Échap rend le focus au bouton).
  useEffect(() => {
    if (!ouvert) return;
    const dehors = (e: PointerEvent) => {
      if (e.target instanceof Node && !cellule.current?.contains(e.target)) setOuvert(false);
    };
    const echap = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOuvert(false);
      cellule.current?.querySelector<HTMLElement>("[data-menu-bascule]")?.focus();
    };
    document.addEventListener("pointerdown", dehors);
    document.addEventListener("keydown", echap);
    return () => {
      document.removeEventListener("pointerdown", dehors);
      document.removeEventListener("keydown", echap);
    };
  }, [ouvert]);

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
    // Tour 7 (MESURES v4 §6.2 : à 375, le menu restait ouvert après le choix) : il se replie.
    setOuvert(false);
    onChoisir(order);
  };

  return (
    // Tour 7 : sous 1024 px, la cellule est la barre collante (fond de page, filet bas, pleine largeur de la colonne) ; le
    // menu déplié s'ouvre par-dessus la page, sous la barre (`absolute`), sans rien pousser ; hauteur bornée à l'écran.
    <div
      ref={cellule}
      className="max-lg:sticky max-lg:top-[7.3125rem] max-lg:z-30 max-lg:-mx-4 max-lg:border-b max-lg:border-border max-lg:bg-background max-lg:px-4 max-lg:py-1 md:max-lg:-mx-6 md:max-lg:px-6 lg:h-0 lg:min-h-full"
      data-testid="sommaire-parcours"
    >
      <div ref={barre} className="flex items-center justify-between gap-x-3 lg:hidden [&>div]:mb-0 [&>div]:h-11 [&>div]:flex-none" data-barre-parcours="">
        {retour}
        <button
          type="button"
          aria-expanded={ouvert}
          aria-controls="menu-etapes"
          onClick={() => setOuvert((o) => !o)}
          className={cn(SOMMAIRE_REPLIABLE, "min-w-0 justify-between")}
          data-menu-bascule=""
          data-ouvert={ouvert || undefined}
        >
          <span className="min-w-0 text-left [overflow-wrap:anywhere]">{avancee}</span>
          <span className={cn("flex-none transition-transform motion-reduce:transition-none", ouvert && "rotate-180")}>
            <ChevronRepli />
          </span>
        </button>
      </div>
      <nav
        ref={carte}
        id="menu-etapes"
        aria-labelledby="menu-etapes-titre"
        className={cn(
          CADRE_CARTE_NEUTRE,
          "flex flex-col max-lg:absolute max-lg:inset-x-4 max-lg:top-full max-lg:max-h-[calc(100dvh-13rem)] max-lg:shadow-xl md:max-lg:inset-x-6 lg:sticky lg:top-[8.5625rem] lg:max-h-[calc(100dvh-10.0625rem)]",
          !ouvert && "max-lg:hidden",
        )}
        data-menu-etapes=""
      >
        {/* Tour 7 (relecture design v4, point 16 : titre du parcours et « Étape n sur N » répétés à 375) : sous 1024 px, le
            titre (nom du menu, gardé pour `aria-labelledby`) et l'avancée (déjà sur le bouton) sont masqués. */}
        <div className={cn("flex-none p-6 pb-4 max-lg:pt-4", !details && "max-lg:hidden")}>
          <p id="menu-etapes-titre" className={cn(TITRE_CARTE, "max-lg:hidden")}>
            {frTypoTexte(titre)}
          </p>
          <p className={cn(META_FORT, "mt-2 tabular-nums max-lg:hidden")}>{avancee}</p>
          {details}
        </div>
        <div
          ref={corps}
          className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border py-2", !details && "max-lg:border-t-0")}
          data-menu-corps=""
          // Tour 7 : une sous-étape choisie dans le menu déplié le replie aussi.
          onClickCapture={(e) => {
            if (e.target instanceof Element && e.target.closest("a[data-fiche]")) setOuvert(false);
          }}
        >
          <ol>
            {etapes.map((e) => {
              const fait = faites.includes(e.order);
              const estActive = e.order === active;
              return (
                <li key={e.order} className="group/etape">
                  <a
                    href={`#etape-${e.order}`}
                    onClick={choisir(e.order)}
                    aria-current={estActive ? "step" : undefined}
                    data-ligne-etape={e.order}
                    // Tour 7 (relecture design v4, point 19 : double barre blanche) : filet de l'étape active retiré quand
                    // une de ses sous-étapes porte le sien.
                    className={cn(LIGNE, estActive && "bg-background-elevated before:bg-text-primary group-has-[[data-fiche-active]]/etape:before:!bg-transparent")}
                  >
                    <span className={cn(TEXTE_FORT, "w-5 flex-none tabular-nums text-text-secondary")} aria-hidden="true">
                      {e.order}
                    </span>
                    {/* Tour 7 : graisse constante (l'actif est le fond et le filet), une ligne active ne passe plus sur deux. */}
                    <span className={cn("min-w-0 flex-1 [overflow-wrap:anywhere]", META, "text-text-primary")}>
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
                    ) : e.verrouillee ? (
                      <span className="inline-flex flex-none items-center" data-statut="verrouillee">
                        <Cadenas />
                      </span>
                    ) : null}
                  </a>
                  {sousEtapes?.(e.order)}
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
              onClick={() => {
                setOuvert(false);
                onChoisir(reprendre.order);
              }}
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
