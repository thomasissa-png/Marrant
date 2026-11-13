"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { TEXTES_AUJOURDHUI as T } from "@/config/textes/espace-aujourdhui";
import { cn } from "@/lib/utils";
import type { CategorieToucher } from "@/lib/espace/vanne";
import { RepliquesCategorie } from "@/components/espace/aujourdhui/repliques-categorie";

/**
 * Vanne du contenu du jour et son toucher « Ce soir, c'est plutôt ? » (architecture v20 4.4,
 * maquette `aujourdhui.html`). Puces de 44 px, « Peu importe » par défaut (= la vanne du jour),
 * puce choisie marquée par une coche ET un contour de 2 px (`aria-pressed`), vanne remplacée dans
 * le même bloc (jamais en double), annonce polie, focus gardé sur la puce. « Une autre » de même
 * taille. Non-répétition dans la mémoire de la page seulement (rien sur le compte). Chaque toucher
 * et chaque « Une autre » est compté SANS identité (`/api/espace/compteur`, catégorie seule).
 * Catégories : celles qui atteignent le seuil (serveur) ; aucune : seul « Une autre » reste.
 * Lot D5 : sous le toucher, « Tes répliques à toi pour {catégorie} » quand l'abonné en a pour la
 * catégorie choisie (chargées à la demande) ; « Peu importe » : aucune ligne (2.7).
 */
export type VanneAffichee = { id: string; content: string; punchline: string };

/** Thème du catalogue de chaque catégorie (`lib/vannes-themes.ts`), pour « Tu as fait le tour ». */
const THEME: Record<CategorieToucher, string> = { soiree: "soirees", boulot: "boulot", famille: "famille", rencard: "dating" };

function compter(cle: "toucher" | "une-autre", valeur: CategorieToucher | "peu-importe") {
  void fetch("/api/espace/compteur", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cle, valeur }),
    keepalive: true,
  }).catch(() => undefined);
}

const Coche = () => (
  <svg className="h-4 w-4 text-accent-link" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export function VanneToucher({ vanneDuJour, categories }: { vanneDuJour: VanneAffichee; categories: readonly CategorieToucher[] }) {
  const [choix, setChoix] = useState<CategorieToucher | null>(null);
  const [vanne, setVanne] = useState<VanneAffichee>(vanneDuJour);
  const [annonce, setAnnonce] = useState("");
  const [tourFait, setTourFait] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const vues = useRef(new Set<string>([vanneDuJour.id]));

  const tirer = async (categorie: CategorieToucher | null): Promise<VanneAffichee | null | undefined> => {
    const params = new URLSearchParams({ vues: Array.from(vues.current).join(",") });
    if (categorie) params.set("categorie", categorie);
    const controleur = new AbortController();
    const delai = setTimeout(() => controleur.abort(), 5_000);
    try {
      const res = await fetch(`/api/espace/vanne?${params.toString()}`, { signal: controleur.signal, cache: "no-store" });
      if (!res.ok) return undefined;
      return ((await res.json()) as { vanne: VanneAffichee | null }).vanne;
    } catch {
      return undefined;
    } finally {
      clearTimeout(delai);
    }
  };

  const montrer = (v: VanneAffichee, texte: string) => {
    vues.current.add(v.id);
    setVanne(v);
    setTourFait(false);
    setAnnonce(texte);
  };

  const choisir = async (categorie: CategorieToucher | null) => {
    if (enCours) return;
    setChoix(categorie);
    compter("toucher", categorie ?? "peu-importe");
    if (!categorie) {
      montrer(vanneDuJour, T.jour.annonceDuJour);
      return;
    }
    setEnCours(true);
    const v = await tirer(categorie);
    setEnCours(false);
    if (v) montrer(v, T.jour.annonceCategorie(T.categories[categorie]));
    else if (v === null) setTourFait(true);
  };

  const uneAutre = async () => {
    if (enCours) return;
    compter("une-autre", choix ?? "peu-importe");
    setEnCours(true);
    const v = await tirer(choix);
    setEnCours(false);
    if (v) montrer(v, T.jour.annonceAutre);
    else if (v === null) setTourFait(true);
  };

  const puce = (categorie: CategorieToucher | null, libelle: string) => {
    const choisie = choix === categorie;
    return (
      <button
        key={categorie ?? "peu-importe"}
        type="button"
        aria-pressed={choisie}
        onClick={() => void choisir(categorie)}
        className={cn(
          "inline-flex min-h-11 min-w-11 items-center gap-1 rounded-full border px-4 text-sm font-medium text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          choisie ? "border-2 border-accent-link bg-background-elevated px-3.5" : "border-border-input hover:border-text-muted hover:bg-background-elevated",
        )}
      >
        {choisie && <Coche />}
        {libelle}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-base text-text-primary" data-vanne={vanne.id}>
        {vanne.content}
      </p>
      <p className="text-base font-semibold text-text-primary">{vanne.punchline}</p>
      {categories.length > 0 && (
        <>
          <p id="toucher-titre" className="text-xs text-text-muted">
            {T.jour.toucher}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="toucher-titre">
            {categories.map((c) => puce(c, T.categories[c]))}
            {puce(null, T.jour.peuImporte)}
          </div>
        </>
      )}
      {choix && <RepliquesCategorie key={choix} categorie={choix} libelle={T.categories[choix]} />}
      <p className="sr-only" aria-live="polite">
        {annonce}
      </p>
      {tourFait ? (
        <p className="text-sm text-text-secondary">
          <Link
            href={choix ? `/vannes/theme/${THEME[choix]}` : "/mon-espace/bibliotheque"}
            className="inline-flex min-h-11 items-center text-accent-link underline underline-offset-2"
          >
            {T.jour.tourFait}
          </Link>
        </p>
      ) : (
        <button
          type="button"
          onClick={() => void uneAutre()}
          aria-busy={enCours}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border-input px-4 text-sm font-semibold text-text-primary transition-colors hover:border-text-muted hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        >
          {T.jour.uneAutre}
        </button>
      )}
      <p className="text-sm text-text-secondary">{T.jour.geste}</p>
    </div>
  );
}
