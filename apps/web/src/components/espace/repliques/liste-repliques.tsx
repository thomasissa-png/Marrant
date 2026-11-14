"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { TEXTES_REPLIQUES } from "@/config/textes/espace-repliques";
import { TEXTES_GESTE } from "@/config/textes/espace-cartes";
import type { RepliqueListee } from "@/lib/espace/repliques";
import { REPLIQUE_MAX_CLIENT } from "@/components/espace/carte/limites";
import { appelEspace } from "@/components/espace/carte/appel";
import { BOUTON_PRINCIPAL, BOUTON_SECONDAIRE, CARTE } from "@/components/espace/carte/styles";
import { FINE, frEspace, frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const R = frEspaceProfond(TEXTES_REPLIQUES);
const G = frEspaceProfond(TEXTES_GESTE);

type Mode = { ficheId: string; quoi: "modifier" | "confirmer" } | null;

/**
 * Liste de « Mes répliques » (2.7, maquette `mes-repliques.html`) : vide (texte validé, sans reproche) ;
 * liste ; « Modifier » (la réplique n'est pas affichée deux fois) ; « Supprimer » avec confirmation
 * (focus sur « Annuler ») ; « Supprimée » annoncé ; échec sans perte. Lecture seule (après la
 * résiliation, depuis « Mon profil ») : ni modification, la suppression reste. Cibles de 44 px.
 */
export function ListeRepliques({ initiales, lectureSeule }: { initiales: RepliqueListee[]; lectureSeule: boolean }) {
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

  return (
    <section aria-label={R.titre} className="space-y-3">
      {lectureSeule && <p className="text-sm text-text-secondary">{R.lectureSeule}</p>}
      {liste.length === 0 ? (
        <p className={`${CARTE} text-sm text-text-secondary`}>{R.vide}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {liste.map((r) => {
            const enEdition = mode?.ficheId === r.ficheId && mode.quoi === "modifier";
            const enConfirmation = mode?.ficheId === r.ficheId && mode.quoi === "confirmer";
            return (
              <li key={r.ficheId} className={CARTE} data-replique={r.ficheId}>
                {r.titre &&
                  (r.href && !lectureSeule ? (
                    <Link href={r.href} className="inline-flex min-h-11 items-center font-semibold text-accent-link underline underline-offset-2">
                      {frEspace(r.titre)}
                    </Link>
                  ) : (
                    <p className="font-semibold text-text-primary">{frEspace(r.titre)}</p>
                  ))}
                {enEdition ? (
                  <form
                    className="space-y-2"
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
                      className="block w-full min-w-0 rounded-md border border-border-input bg-background-light px-3 py-2 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="submit" className={BOUTON_PRINCIPAL} aria-busy={occupe} disabled={brouillon.trim() === ""}>
                        {R.enregistrer}
                      </button>
                      <button type="button" className={BOUTON_SECONDAIRE} onClick={() => setMode(null)}>
                        {R.annuler}
                      </button>
                      <span id={`c-${r.ficheId}`} className="text-xs text-text-muted">
                        {G.note.compteur(brouillon.length, REPLIQUE_MAX_CLIENT)}
                      </span>
                    </div>
                  </form>
                ) : (
                  <p className="text-base text-text-primary">«{FINE}{r.texte}{FINE}»</p>
                )}
                {enConfirmation ? (
                  <div role="group" aria-labelledby={`q-${r.ficheId}`} className="space-y-2">
                    <p id={`q-${r.ficheId}`} className="text-sm text-text-secondary">
                      {R.confirmer}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className={BOUTON_SECONDAIRE} aria-busy={occupe} onClick={() => void supprimer(r.ficheId)}>
                        {R.supprimer}
                      </button>
                      <button ref={annuler} type="button" className={BOUTON_SECONDAIRE} onClick={() => setMode(null)}>
                        {R.annuler}
                      </button>
                    </div>
                  </div>
                ) : (
                  !enEdition && (
                    <div className="flex flex-wrap gap-2">
                      {!lectureSeule && (
                        <button
                          type="button"
                          className={BOUTON_SECONDAIRE}
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
                        className={BOUTON_SECONDAIRE}
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
      <p role="status" className="text-sm text-text-secondary">
        {statut}
      </p>
    </section>
  );
}
