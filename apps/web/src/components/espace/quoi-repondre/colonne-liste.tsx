"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { TEXTES_FICHE_LIGNE, TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import {
  ADRESSE_LISTE_QUOI_REPONDRE,
  cleDefilementListe,
  ficheParDefaut,
  filtrerLignes,
  filtresDeQuery,
  hrefFicheListe,
  queryFiltres,
  type FiltresListe,
  type LigneQuoiRepondre,
} from "@/lib/espace/quoi-repondre-liste";
import { useFaitsQuoiRepondre } from "@/components/espace/quoi-repondre/faits-contexte";
import { CompteFaits, sansPrefixe } from "@/components/espace/liste-fiches";
import { Coche } from "@/components/espace/aujourdhui/tableau";
import { ChevronRepli } from "@/components/espace/carte/chevron-repli";
import { CADRE_CARTE_NEUTRE, LIEN_NEUTRE, SOMMAIRE_REPLIABLE, pastilleFiltre } from "@/components/espace/carte/styles";
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { ETIQUETTE, META, META_FORT, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";

const T = frEspaceProfond(TEXTES_QUOI_REPONDRE);
const L = frEspaceProfond(TEXTES_FICHE_LIGNE);

export interface Lieu {
  cle: string;
  titre: string;
}

/** Garde un élément visible dans son conteneur défilant, sans toucher au défilement de la page (`nearest`). */
function rendreVisible(conteneur: HTMLElement, el: HTMLElement) {
  const haut = el.offsetTop - conteneur.offsetTop;
  const bas = haut + el.offsetHeight;
  if (haut < conteneur.scrollTop) conteneur.scrollTop = haut;
  else if (bas > conteneur.scrollTop + conteneur.clientHeight) conteneur.scrollTop = bas - conteneur.clientHeight;
}

const lire = (cle: string) => {
  try {
    return window.sessionStorage.getItem(cle);
  } catch {
    return null;
  }
};
const ecrire = (cle: string, valeur: string) => {
  try {
    window.sessionStorage.setItem(cle, valeur);
  } catch {
    // Stockage refusé (navigation privée stricte) : la position n'est simplement pas gardée.
  }
};

/**
 * s26 liste et détail, colonne de gauche dès 1024 (`docs/design/liste-detail-quoi-repondre-s26.md` §1-§2, spec UX §2) :
 * carte collante à défilement propre, titre de la rubrique, filtres repliés, situations par lieu (une colonne), une ligne
 * `aria-current` (filet blanc de 2 px, arbitrage du 19/11), carnet en pied. Montée dans le layout : jamais démontée entre
 * deux fiches, `scrollTop` gardé (et en `sessionStorage` pour le retour navigateur). Filtres lus dans la query (le layout
 * ne reçoit pas `searchParams`), reportés sur chaque lien de fiche ; un filtre remplace l'entrée d'historique, une fiche
 * en ajoute une. Clavier : flèches haut et bas d'une ligne à l'autre, Entrée ouvre.
 */
export function ColonneListe({ lignes, lieux, valides }: { lignes: readonly LigneQuoiRepondre[]; lieux: readonly Lieu[]; valides: { ou: readonly string[]; pour: readonly string[] } }) {
  const parametres = useSearchParams();
  const segment = useSelectedLayoutSegment();
  const faits = useFaitsQuoiRepondre();
  const corps = useRef<HTMLDivElement>(null);
  const [annonce, setAnnonce] = useState("");

  const filtres = filtresDeQuery((c) => parametres.get(c), valides);
  const cle = cleDefilementListe(filtres);
  const avecFaits = useMemo(() => lignes.map((l) => ({ ...l, fait: faits?.faitDe(l.id) ?? l.fait })), [lignes, faits]);
  const ordre = filtrerLignes(avecFaits, filtres);
  const idOuvert = segment ? decodeURIComponent(segment) : null;
  const actif = idOuvert ?? ficheParDefaut(ordre, new Set(ordre.filter((l) => l.fait).map((l) => l.id)))?.id ?? null;
  const groupes = lieux.map((g) => ({ ...g, lignes: ordre.filter((l) => l.lieu === g.cle) })).filter((g) => g.lignes.length > 0);

  // Position de la liste : restaurée au montage (retour navigateur), remise en haut à chaque changement de filtre.
  const cleAvant = useRef<string | null>(null);
  useEffect(() => {
    const el = corps.current;
    if (!el) return;
    el.scrollTop = cleAvant.current === null || cleAvant.current === cle ? Number(lire(cle) ?? 0) : 0;
    cleAvant.current = cle;
  }, [cle]);

  // Ligne active visible dans la liste (sans bouger la page) ; annonce polie du titre ouvert après un changement.
  const premierActif = useRef(true);
  useEffect(() => {
    const el = corps.current;
    const ligne = actif ? el?.querySelector<HTMLElement>(`[data-ligne-qr="${CSS.escape(actif)}"]`) : null;
    if (el && ligne) rendreVisible(el, ligne);
    if (premierActif.current) premierActif.current = false;
    else setAnnonce(ligne?.dataset.titre ?? "");
  }, [actif]);

  const surTouche = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const liens = Array.from(corps.current?.querySelectorAll<HTMLAnchorElement>("a[data-ligne-qr]") ?? []);
    const i = liens.indexOf(document.activeElement as HTMLAnchorElement);
    if (i < 0) return;
    e.preventDefault();
    liens[Math.min(liens.length - 1, Math.max(0, i + (e.key === "ArrowDown" ? 1 : -1)))]?.focus();
  };

  /** Lien d'un filtre (bascule) : la fiche ouverte est gardée si elle est dans le nouveau filtre, sinon la liste. */
  const hrefFiltre = (c: keyof FiltresListe, v: string) => {
    const suivant = { ...filtres, [c]: filtres[c] === v ? null : v };
    const garde = idOuvert && filtrerLignes(lignes.filter((l) => l.id === idOuvert), suivant).length > 0;
    return garde ? hrefFicheListe(idOuvert, suivant) : `${ADRESSE_LISTE_QUOI_REPONDRE}${queryFiltres(suivant)}`;
  };
  const resume = [filtres.ou ? T.univers[filtres.ou as keyof typeof T.univers] : null, filtres.pour ? T.pourQuoiFaire[filtres.pour as keyof typeof T.pourQuoiFaire] : null].filter(Boolean).join(", ");

  return (
    <nav aria-labelledby="qr-liste-titre" className={cn(CADRE_CARTE_NEUTRE, "flex flex-col lg:sticky lg:top-36 lg:max-h-[calc(100dvh-10.5rem)]")} data-colonne-liste>
      <h2 id="qr-liste-titre" className={cn(TITRE_CARTE, "px-6 pb-4 pt-8")}>
        {T.titre}
      </h2>
      <details className="group/repli px-6 pb-4" data-filtres-liste>
        <summary className={SOMMAIRE_REPLIABLE}>
          <span className="min-w-0 [overflow-wrap:anywhere]">{resume || T.filtrerLesCartes}</span>
          <ChevronRepli />
        </summary>
        {(
          [
            ["ou", T.filtreOu, valides.ou, T.univers],
            ["pour", T.filtrePour, valides.pour, T.pourQuoiFaire],
          ] as const
        ).map(([c, titre, valeurs, libelles]) => (
          <div key={c} className="mt-4">
            <h3 id={`qr-filtre-${c}`} className={ETIQUETTE}>
              {titre}
            </h3>
            <ul aria-labelledby={`qr-filtre-${c}`} className="mt-2 flex flex-wrap gap-2">
              {valeurs.map((v) => (
                <li key={v}>
                  <Link href={hrefFiltre(c, v)} replace scroll={false} prefetch={false} aria-current={filtres[c] === v ? "true" : undefined} className={pastilleFiltre(filtres[c] === v)} data-filtre={v}>
                    {(libelles as Record<string, string>)[v]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </details>
      <div ref={corps} className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border" onKeyDown={surTouche} onScroll={(e) => ecrire(cle, String(e.currentTarget.scrollTop))} data-liste-corps>
        {groupes.length === 0 ? (
          <div className="p-6" data-testid="quoi-repondre-vide-liste">
            <p className={TEXTE_FORT}>{T.vide}</p>
            <Link href={`${ESPACE_ACCUEIL}/questions`} className={cn("mt-2", LIEN_NEUTRE)}>
              {T.raconte}
            </Link>
          </div>
        ) : (
          groupes.map((g) => {
            const n = g.lignes.filter((l) => l.fait).length;
            return (
              <section key={g.cle} aria-labelledby={`qr-lieu-${g.cle}`} data-lieu={g.cle}>
                <div className="flex items-baseline justify-between gap-4 px-6 pb-2 pt-4">
                  <h3 id={`qr-lieu-${g.cle}`} className={ETIQUETTE}>
                    {g.titre}
                  </h3>
                  <CompteFaits faits={n} total={g.lignes.length} />
                </div>
                <ul aria-labelledby={`qr-lieu-${g.cle}`}>
                  {g.lignes.map((l) => {
                    const estActif = l.id === actif;
                    const titre = frEspace(sansPrefixe(l.titre, g.titre));
                    return (
                      <li key={l.id}>
                        <Link
                          href={hrefFicheListe(l.id, filtres)}
                          scroll={false}
                          prefetch={false}
                          aria-current={estActif ? "page" : undefined}
                          onClick={() => faits?.demanderFocus()}
                          data-ligne-qr={l.id}
                          data-titre={titre}
                          className={cn(
                            "relative flex min-h-11 items-center gap-3 px-6 py-2 hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary before:absolute before:inset-y-0 before:left-0 before:w-0.5",
                            estActif && "bg-background-elevated before:bg-text-primary",
                          )}
                        >
                          <span className={cn("min-w-0 flex-1 [overflow-wrap:anywhere]", estActif ? META_FORT : l.fait ? META : `${META} text-text-primary`)}>{titre}</span>
                          {l.fait ? (
                            <span className={cn("inline-flex flex-none items-center gap-2", META)} data-fait>
                              <Coche className="h-4 w-4 text-success" />
                              {L.fait}
                            </span>
                          ) : (
                            <span className={cn("flex-none tabular-nums", META)}>{L.minutes(l.minutes)}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })
        )}
      </div>
      <div className="border-t border-border">
        <Link href="/carnet" className={cn(META, "inline-flex min-h-11 items-center px-6 underline underline-offset-2 hover:text-text-primary")} data-carnet>
          {T.carnet}
        </Link>
      </div>
      <p className="sr-only" aria-live="polite" data-annonce-fiche>
        {annonce}
      </p>
    </nav>
  );
}
