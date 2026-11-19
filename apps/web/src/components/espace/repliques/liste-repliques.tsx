"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { TEXTES_REPLIQUES } from "@/config/textes/espace-repliques";
import { TEXTES_GESTE } from "@/config/textes/espace-cartes";
import type { RepliqueListee } from "@/lib/espace/repliques";
import { REPLIQUE_MAX_CLIENT } from "@/components/espace/carte/limites";
import { appelEspace } from "@/components/espace/carte/appel";
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";
import { BOUTON_DESTRUCTIF, BOUTON_PRINCIPAL, BOUTON_SECONDAIRE, CADRE_CARTE_NEUTRE, CARTE, LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { CARTE_ACTION } from "@/components/espace/aujourdhui/tableau";
import { buttonVariants } from "@/components/ui/button";
import { META, TEXTE, TITRE_CARTE, TITRE_PAGE } from "@/components/espace/typo";
import { FINE, frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const R = frEspaceProfond(TEXTES_REPLIQUES);
const G = frEspaceProfond(TEXTES_GESTE);
const N = frEspaceProfond(TEXTES_ESPACE_NAVIGATION);
const QUOI_REPONDRE = "/mon-espace/quoi-repondre";

type Mode = { ficheId: string; quoi: "modifier" | "confirmer" } | null;

/**
 * Liste de « Mes répliques » (2.7, maquette `mes-repliques.html`) : vide (texte validé, sans reproche) ;
 * liste ; « Modifier » (la réplique n'est pas affichée deux fois) ; « Supprimer » avec confirmation
 * (focus sur « Annuler ») ; « Supprimée » annoncé ; échec sans perte. Lecture seule (après la
 * résiliation, depuis « Mon profil ») : ni modification, la suppression reste. Cibles de 44 px.
 * v6 tour 3 (arbitrage 3) : `grille` (page « Mes répliques » seulement, interrupteur ouvert) : les répliques en grille
 * pleine coque (`md:grid-cols-2 xl:grid-cols-3`, cartes de même hauteur, actions en bas) ; l'état vide en colonne
 * centrée `mx-auto max-w-3xl`, comme une réplique seule (une carte de 389 px calée à gauche d'une grille de trois
 * colonnes laissait les deux tiers vides, mesuré à 1280). Sans `grille` (historique du profil) : le rendu d'avant.
 * s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §2.2, design §5) : `grille` porte aussi l'en-tête de la page
 * (titre à gauche, compteur à droite, lien « Écrire ma prochaine réplique » quand il y a des répliques : compteur et
 * lien suivent la liste vivante). Liste en 3 colonnes dès 1024, 2 dès 768, cartes neutres, « Modifier » et
 * « Supprimer » en liens gris au bas de la carte. Vide : tuile d'action (8, seul aplat) et rappel de « Quoi répondre » (4).
 */
const GRILLE_REPLIQUES = "mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3";
const CARTE_GRILLE = cn(CADRE_CARTE_NEUTRE, "flex h-full min-w-0 flex-col p-6 [overflow-wrap:anywhere]");
const ACTION_GRILLE = cn(LIEN_NEUTRE, "bg-transparent");
export function ListeRepliques({
  initiales,
  lectureSeule,
  grille = false,
}: {
  initiales: RepliqueListee[];
  lectureSeule: boolean;
  grille?: boolean;
}) {
  const [liste, setListe] = useState(initiales);
  const [mode, setMode] = useState<Mode>(null);
  const [brouillon, setBrouillon] = useState("");
  const [statut, setStatut] = useState("");
  const [occupe, setOccupe] = useState(false);
  const annuler = useRef<HTMLButtonElement>(null);

  const enregistrer = async (ficheId: string) => {
    if (occupe || brouillon.trim() === "") return;
    setOccupe(true);
    const ok = await appelEspace<{ ok: true }>("/api/espace/replique", "PUT", { ficheId, texte: brouillon });
    setOccupe(false);
    if (!ok) {
      setStatut(R.echec);
      return;
    }
    setListe((l) => [{ ...l.find((r) => r.ficheId === ficheId)!, texte: brouillon.trim() }, ...l.filter((r) => r.ficheId !== ficheId)]);
    setMode(null);
    setStatut(G.note.enregistree);
  };

  const supprimer = async (ficheId: string) => {
    if (occupe) return;
    setOccupe(true);
    const ok = await appelEspace<{ ok: true }>("/api/espace/replique", "DELETE", { ficheId });
    setOccupe(false);
    if (!ok) {
      setStatut(R.echec);
      return;
    }
    setListe((l) => l.filter((r) => r.ficheId !== ficheId));
    setMode(null);
    setStatut(R.supprimee);
  };

  if (grille && liste.length === 0) {
    return (
      <section aria-labelledby="h-repliques">
        <h1 id="h-repliques" className={TITRE_PAGE}>
          {R.titre}
        </h1>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div className={cn(CARTE_ACTION, "lg:col-span-8")} data-testid="repliques-vide">
            <p className={TEXTE}>{R.vide}</p>
            {!lectureSeule && (
              <Link href={QUOI_REPONDRE} className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full whitespace-normal md:w-auto md:self-start")}>
                {R.ecrirePremiere}
              </Link>
            )}
          </div>
          {!lectureSeule && (
            <div className={cn(CADRE_CARTE_NEUTRE, "p-6 lg:col-span-4")} data-repliques-rappel>
              <Link href={QUOI_REPONDRE} className={LIEN_NEUTRE}>
                {N.index.quoiRepondre}
              </Link>
            </div>
          )}
        </div>
        <p role="status" className={cn("mt-4", META)}>
          {statut}
        </p>
      </section>
    );
  }

  return (
    <section aria-label={grille ? undefined : R.titre} aria-labelledby={grille ? "h-repliques" : undefined} className={grille ? undefined : "space-y-3"}>
      {grille && (
        <header className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 id="h-repliques" className={TITRE_PAGE}>
            {R.titre}
          </h1>
          <div className="flex flex-wrap items-baseline gap-x-6">
            {!lectureSeule && (
              <Link href={QUOI_REPONDRE} className={LIEN_NEUTRE} data-repliques-ecrire>
                {R.ecrireProchaine}
              </Link>
            )}
            <p className={cn("tabular-nums", META)} data-compteur-repliques>
              {liste.length}
            </p>
          </div>
        </header>
      )}
      {lectureSeule && <p className="text-sm text-text-secondary">{R.lectureSeule}</p>}
      {liste.length === 0 ? (
        // Relecture des captures nav s24 (design 4, ux F5) : état vide à sa largeur de lecture, avec une sortie.
        <div className={`${CARTE} flex flex-col items-start gap-4 md:p-8${grille ? " mx-auto w-full max-w-3xl" : ""}`} data-testid="repliques-vide">
          <p className="text-base text-text-primary">{R.vide}</p>
          {!lectureSeule && (
            // v6 tour 1 (point 15) : seule action de la page, en bouton plein.
            <Link href="/mon-espace/quoi-repondre" className={BOUTON_PRINCIPAL}>
              {R.ecrirePremiere}
            </Link>
          )}
        </div>
      ) : (
        <ul className={grille ? GRILLE_REPLIQUES : "flex flex-col gap-3"}>
          {liste.map((r) => {
            const enEdition = mode?.ficheId === r.ficheId && mode.quoi === "modifier";
            const enConfirmation = mode?.ficheId === r.ficheId && mode.quoi === "confirmer";
            return (
              <li key={r.ficheId} className={grille ? CARTE_GRILLE : CARTE} data-replique={r.ficheId}>
                {r.titre &&
                  (r.href && !lectureSeule ? (
                    <Link
                      href={r.href}
                      className={
                        grille
                          ? cn(TITRE_CARTE, "hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary")
                          : "inline-flex min-h-11 items-center font-semibold text-accent-link underline underline-offset-2"
                      }
                    >
                      {frEspace(r.titre)}
                    </Link>
                  ) : (
                    <p className={grille ? TITRE_CARTE : "font-semibold text-text-primary"}>{frEspace(r.titre)}</p>
                  ))}
                {enEdition ? (
                  <form
                    className={grille ? "mt-4 space-y-2" : "space-y-2"}
                    onSubmit={(e) => {
                      e.preventDefault();
                      void enregistrer(r.ficheId);
                    }}
                  >
                    <label htmlFor={`e-${r.ficheId}`} className="block text-sm font-semibold text-text-primary">
                      {R.label}
                    </label>
                    <textarea
                      id={`e-${r.ficheId}`}
                      rows={2}
                      value={brouillon}
                      maxLength={REPLIQUE_MAX_CLIENT}
                      onChange={(e) => setBrouillon(e.target.value)}
                      aria-describedby={`c-${r.ficheId}`}
                      className={
                        grille
                          ? "block w-full min-w-0 rounded-xl border border-border-input bg-background-elevated p-4 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                          : "block w-full min-w-0 rounded-md border border-border-input bg-background-light px-3 py-2 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                      }
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="submit" className={BOUTON_PRINCIPAL} aria-busy={occupe} disabled={brouillon.trim() === ""}>
                        {R.enregistrer}
                      </button>
                      <button type="button" className={BOUTON_SECONDAIRE} onClick={() => setMode(null)}>
                        {R.annuler}
                      </button>
                      <span id={`c-${r.ficheId}`} className={grille ? META : "text-xs text-text-muted"}>
                        {G.note.compteur(brouillon.length, REPLIQUE_MAX_CLIENT)}
                      </span>
                    </div>
                  </form>
                ) : (
                  // v6 tour 3 : en grille, la réplique prend la hauteur libre (actions au bas des cartes d'une rangée).
                  <p className={grille ? cn("mt-2 flex-1", TEXTE) : "text-base text-text-primary"}>«{FINE}{r.texte}{FINE}»</p>
                )}
                {enConfirmation ? (
                  <div role="group" aria-labelledby={`q-${r.ficheId}`} className={grille ? "mt-4 space-y-2 border-t border-border pt-4" : "space-y-2"}>
                    <p id={`q-${r.ficheId}`} className={grille ? META : "text-sm text-text-secondary"}>
                      {R.confirmer}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {/* v6 tour 1 (point 15) : « Supprimer » en style destructif, « Annuler » en secondaire. */}
                      <button type="button" className={BOUTON_DESTRUCTIF} aria-busy={occupe} onClick={() => void supprimer(r.ficheId)}>
                        {R.supprimer}
                      </button>
                      <button ref={annuler} type="button" className={BOUTON_SECONDAIRE} onClick={() => setMode(null)}>
                        {R.annuler}
                      </button>
                    </div>
                  </div>
                ) : (
                  !enEdition && (
                    <div className={grille ? "mt-4 flex flex-wrap gap-x-6 border-t border-border pt-4" : "flex flex-wrap gap-2"}>
                      {!lectureSeule && (
                        <button
                          type="button"
                          className={grille ? ACTION_GRILLE : BOUTON_SECONDAIRE}
                          onClick={() => {
                            setBrouillon(r.texte);
                            setStatut("");
                            setMode({ ficheId: r.ficheId, quoi: "modifier" });
                          }}
                        >
                          {R.modifier}
                        </button>
                      )}
                      <button
                        type="button"
                        className={grille ? ACTION_GRILLE : BOUTON_SECONDAIRE}
                        onClick={() => {
                          setStatut("");
                          setMode({ ficheId: r.ficheId, quoi: "confirmer" });
                          requestAnimationFrame(() => annuler.current?.focus());
                        }}
                      >
                        {R.supprimer}
                      </button>
                    </div>
                  )
                )}
              </li>
            );
          })}
        </ul>
      )}
      <p role="status" className={grille ? cn("mt-4", META) : "text-sm text-text-secondary"}>
        {statut}
      </p>
    </section>
  );
}
