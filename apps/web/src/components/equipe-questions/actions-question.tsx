"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CHEMIN_QUESTIONS } from "@/config/equipe-questions";
import { TEXTES_EQUIPE_DETAIL as D, TEXTES_EQUIPE_ETATS as E } from "@/config/textes/equipe-questions";

/** Bouton « Supprimer cette question » (effacement immédiat, confirmation). */
export function SupprimerQuestion({ id }: { id: string }) {
  const router = useRouter();
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function supprimer() {
    if (!window.confirm(D.supprimerConfirmer)) return;
    setEnCours(true);
    setErreur(null);
    const res = await fetch(`/api/equipe-questions/${id}`, { method: "DELETE" }).catch(() => null);
    if (res && (res.status === 204 || res.status === 404)) {
      router.push(CHEMIN_QUESTIONS);
      router.refresh();
      return;
    }
    setEnCours(false);
    setErreur(E.erreurServeur);
  }

  return (
    <div>
      <Button variant="outline" size="sm" onClick={supprimer} disabled={enCours}>{D.supprimer}</Button>
      {erreur && <p role="alert" className="mt-2 text-sm text-error">{erreur}</p>}
    </div>
  );
}

/**
 * Accord par extrait : l'abonné voit le texte exact et clique « Publier ».
 * Le texte affiché est renvoyé au serveur : l'accord ne vaut que pour lui.
 */
export function DecisionExtrait({
  id,
  texte,
  statut,
}: {
  id: string;
  texte: string;
  statut: "PROPOSE" | "ACCEPTE" | "REFUSE";
}) {
  const router = useRouter();
  const [courant, setCourant] = useState(statut);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function decider(decision: "publier" | "refuser") {
    setEnCours(true);
    setErreur(null);
    const res = await fetch(`/api/equipe-questions/${id}/extrait`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, texte }),
    }).catch(() => null);
    setEnCours(false);
    if (res?.ok) {
      const data = (await res.json()) as { extraitStatut: "ACCEPTE" | "REFUSE" };
      setCourant(data.extraitStatut);
      return;
    }
    if (res?.status === 409) router.refresh();
    setErreur(E.erreurServeur);
  }

  return (
    <section aria-labelledby={`extrait-${id}`} className="rounded-lg border border-border p-5">
      <h2 id={`extrait-${id}`} className="font-display text-lg font-bold text-text-primary">{D.extraitTitre}</h2>
      <p className="mt-2 text-sm text-text-secondary">{D.extraitIntro}</p>
      <blockquote className="mt-3 whitespace-pre-line border-l-4 border-border pl-4 text-text-primary">{texte}</blockquote>
      {courant === "ACCEPTE" && <p role="status" className="mt-3 text-sm text-text-primary">{D.extraitAccepte}</p>}
      {courant === "REFUSE" && <p role="status" className="mt-3 text-sm text-text-primary">{D.extraitRefuse}</p>}
      <p className="mt-3 text-sm text-text-secondary">{D.extraitSilence}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {courant !== "ACCEPTE" && (
          <Button size="sm" onClick={() => decider("publier")} disabled={enCours}>{D.publier}</Button>
        )}
        {courant !== "REFUSE" && (
          <Button size="sm" variant="outline" onClick={() => decider("refuser")} disabled={enCours}>{D.refuser}</Button>
        )}
      </div>
      {erreur && <p role="alert" className="mt-2 text-sm text-error">{erreur}</p>}
    </section>
  );
}
