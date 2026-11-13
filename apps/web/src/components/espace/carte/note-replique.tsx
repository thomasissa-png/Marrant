"use client";

import { useId, useRef, useState } from "react";
import { TEXTES_GESTE as G } from "@/config/textes/espace-cartes";
import { REPLIQUE_MAX_CLIENT } from "@/components/espace/carte/limites";
import { appelEspace } from "@/components/espace/carte/appel";
import { BOUTON_PRINCIPAL, BOUTON_SECONDAIRE } from "@/components/espace/carte/styles";

type Etat = "repos" | "enregistree" | "echec" | "confirmer" | "supprimee";

/**
 * « Ma réplique à moi » (architecture v20 2.7, maquette `carte-rafale.html#note=…`) : une phrase, sous
 * le geste. États : vide (placeholder sans reproche), saisie (compteur, jamais d'alerte rouge),
 * enregistrée, échec SANS perte (le texte reste dans le champ, « Réessayer »), confirmation de
 * suppression (un seul « Supprimer » à l'écran, focus sur « Annuler »), supprimée. Le texte ne quitte
 * le navigateur que vers `/api/espace/replique` ; il n'est jamais journalisé ni mesuré.
 */
export function NoteReplique({ ficheId, initiale }: { ficheId: string; initiale: string | null }) {
  const [texte, setTexte] = useState(initiale ?? "");
  const [enregistre, setEnregistre] = useState(Boolean(initiale));
  const [etat, setEtat] = useState<Etat>("repos");
  const [occupe, setOccupe] = useState(false);
  const champ = useRef<HTMLTextAreaElement>(null);
  const annuler = useRef<HTMLButtonElement>(null);
  const supprimer = useRef<HTMLButtonElement>(null);
  const id = useId();

  const enregistrer = async () => {
    if (occupe || texte.trim() === "") return;
    setOccupe(true);
    const ok = await appelEspace<{ ok: true }>("/api/espace/replique", "PUT", { ficheId, texte });
    setOccupe(false);
    setEtat(ok ? "enregistree" : "echec");
    if (ok) setEnregistre(true);
  };

  const confirmer = async () => {
    setOccupe(true);
    const ok = await appelEspace<{ ok: true }>("/api/espace/replique", "DELETE", { ficheId });
    setOccupe(false);
    if (!ok) {
      setEtat("echec");
      return;
    }
    setTexte("");
    setEnregistre(false);
    setEtat("supprimee");
    champ.current?.focus();
  };

  const statut = etat === "enregistree" ? G.note.enregistree : etat === "echec" ? G.note.echec : etat === "supprimee" ? G.note.supprimee : "";

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        void enregistrer();
      }}
    >
      <label htmlFor={`${id}-t`} className="block text-sm font-semibold text-text-primary">
        {G.note.label}
      </label>
      <textarea
        ref={champ}
        id={`${id}-t`}
        rows={2}
        value={texte}
        maxLength={REPLIQUE_MAX_CLIENT}
        placeholder={G.note.placeholder}
        aria-describedby={`${id}-c ${id}-s`}
        onChange={(e) => {
          setTexte(e.target.value);
          if (etat !== "confirmer") setEtat("repos");
        }}
        className="block w-full min-w-0 rounded-md border border-border-input bg-background-light px-3 py-2 text-base text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      />
      <div className="flex flex-wrap items-center gap-2">
        {etat !== "confirmer" && (
          <button type="submit" className={BOUTON_PRINCIPAL} aria-busy={occupe} disabled={texte.trim() === ""}>
            {etat === "echec" ? G.note.reessayer : G.note.enregistrer}
          </button>
        )}
        {enregistre && etat !== "confirmer" && (
          <button
            ref={supprimer}
            type="button"
            className={BOUTON_SECONDAIRE}
            onClick={() => {
              setEtat("confirmer");
              requestAnimationFrame(() => annuler.current?.focus());
            }}
          >
            {G.note.supprimer}
          </button>
        )}
        <span id={`${id}-c`} className="text-xs text-text-muted">
          {G.note.compteur(texte.length, REPLIQUE_MAX_CLIENT)}
        </span>
      </div>
      <p id={`${id}-s`} role="status" className="text-sm text-text-secondary">
        {statut}
      </p>
      {etat === "confirmer" && (
        <div role="group" aria-labelledby={`${id}-q`} className="space-y-2">
          <p id={`${id}-q`} className="text-sm text-text-secondary">
            {G.note.confirmer}
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={BOUTON_SECONDAIRE} aria-busy={occupe} onClick={() => void confirmer()}>
              {G.note.supprimer}
            </button>
            <button
              ref={annuler}
              type="button"
              className={BOUTON_SECONDAIRE}
              onClick={() => {
                setEtat("enregistree");
                requestAnimationFrame(() => supprimer.current?.focus());
              }}
            >
              {G.note.annuler}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
