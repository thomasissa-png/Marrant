"use client";

import { createContext, useContext, useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { TEXTES_COMPTE_A_REBOURS } from "@/config/textes/espace-cartes";
import { DUREES_COMPTE_A_REBOURS, type DureeCompteARebours, type EtatCompteARebours } from "@/lib/espace/compte-a-rebours";
import { BOUTON_SECONDAIRE, puce } from "@/components/espace/carte/styles";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_COMPTE_A_REBOURS);

/**
 * Compte à rebours facultatif sous « Ta réponse d'abord » (lot D5b, libellés validés du 13/11, règles
 * dans `lib/espace/compte-a-rebours.ts`). Une puce par durée déjà essayée (`aria-pressed`, nom « {n}
 * secondes pour répondre, compte à rebours ») : toucher une puce lance le décompte de CETTE carte, un
 * second toucher l'arrête, une autre puce change de durée (moyen visible de revenir à la durée
 * précédente). Décompte : `role="timer"` nommé « Temps restant », sans annonce seconde par seconde ; une
 * seule annonce à la fin (`role="status"`). Rien ne se bloque, rien n'est noté. Sans fournisseur (ou à
 * la toute première carte) : rien n'est rendu.
 */
type Contexte = {
  etat: EtatCompteARebours;
  ajouter: (d: DureeCompteARebours) => void;
  fermerProposition: () => void;
};
const Ctx = createContext<Contexte | null>(null);

export function FournisseurCompteARebours({ etat, children }: { etat: EtatCompteARebours; children: ReactNode }) {
  const [durees, setDurees] = useState(etat.durees);
  const [proposition, setProposition] = useState(etat.proposition);
  const valeur = useMemo<Contexte>(
    () => ({
      etat: { visible: etat.visible, durees, proposition },
      ajouter: (d) => setDurees((x) => (x.includes(d) ? x : DUREES_COMPTE_A_REBOURS.filter((v) => x.includes(v) || v === d))),
      fermerProposition: () => setProposition(null),
    }),
    [etat.visible, durees, proposition],
  );
  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}

export function CompteARebours({
  repondu,
  proposer,
  onChange,
}: {
  /** Carte répondue : le compte à rebours disparaît (la durée reste enregistrée avec la réponse). */
  repondu: boolean;
  /** La proposition de raccourcir n'est montrée que sur une carte (la première de la page). */
  proposer: boolean;
  onChange: (duree: DureeCompteARebours | null) => void;
}) {
  const ctx = useContext(Ctx);
  const [duree, setDuree] = useState<DureeCompteARebours | null>(null);
  const [debut, setDebut] = useState(0);
  const [reste, setReste] = useState(0);
  const id = useId();

  // Décompte calé sur l'heure de départ (aucune dérive, onglet en arrière-plan compris).
  useEffect(() => {
    if (duree === null || repondu) return;
    const t = setInterval(() => {
      const k = Math.max(0, duree - Math.floor((Date.now() - debut) / 1_000));
      setReste(k);
      if (k === 0) clearInterval(t);
    }, 250);
    return () => clearInterval(t);
  }, [duree, debut, repondu]);

  if (!ctx || !ctx.etat.visible || repondu) return null;
  const { etat } = ctx;

  const lancer = (d: DureeCompteARebours | null) => {
    setDuree(d);
    setDebut(Date.now());
    setReste(d ?? 0);
    onChange(d);
  };
  const proposition = proposer ? etat.proposition : null;

  return (
    <div className="space-y-2" data-compte-a-rebours>
      {proposition && (
        <div role="group" aria-labelledby={`${id}-p`} className="space-y-2 rounded-md bg-background-light p-3">
          <p id={`${id}-p`} className="text-sm text-text-primary">
            {T.proposition(proposition.essayer, proposition.garder)}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={BOUTON_SECONDAIRE}
              onClick={() => {
                ctx.ajouter(proposition.essayer);
                ctx.fermerProposition();
                lancer(proposition.essayer);
              }}
            >
              {T.essayer(proposition.essayer)}
            </button>
            <button
              type="button"
              className={BOUTON_SECONDAIRE}
              onClick={() => {
                ctx.fermerProposition();
                lancer(proposition.garder);
              }}
            >
              {T.garder(proposition.garder)}
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {etat.durees.map((d) => (
          <button
            key={d}
            type="button"
            className={puce(duree === d)}
            aria-pressed={duree === d}
            aria-label={T.nom(d)}
            onClick={() => lancer(duree === d ? null : d)}
          >
            {T.libelle(d)}
          </button>
        ))}
      </div>
      {duree !== null && reste > 0 && (
        <p role="timer" aria-label={T.minuteur} className="text-sm font-semibold text-text-primary">
          {T.reste(reste)}
        </p>
      )}
      <p role="status" className="text-sm text-text-secondary">
        {duree !== null && reste <= 0 ? T.passees(duree) : ""}
      </p>
    </div>
  );
}
