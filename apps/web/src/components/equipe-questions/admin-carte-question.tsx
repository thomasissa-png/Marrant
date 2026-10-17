"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LIBELLES_STATUT_ADMIN, type StatutQuestion } from "@/lib/equipe-questions/regles";

export type QuestionAdmin = {
  id: string;
  situation: string;
  retour: string | null;
  statut: StatutQuestion;
  sensible: boolean;
  origine: string;
  receivedAt: string;
  dueAt: string;
  brouillon: string | null;
  reponse: string | null;
  reponseModifieeParAdmin: boolean;
  relueMode: string | null;
  sentAt: string | null;
  reutilisationAcceptee: boolean;
  extraitTexte: string | null;
  extraitStatut: string;
};

export type ActionAdmin = (corps: Record<string, unknown>) => Promise<string | null>;

const dateHeure = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", dateStyle: "short", timeStyle: "short" });

function badgeEcheance(q: QuestionAdmin, now: number): string | null {
  if (q.statut === "ENVOYEE" || q.statut === "ECARTEE") return null;
  const reste = new Date(q.dueAt).getTime() - now;
  if (reste < 0) return "En retard";
  if (reste < 12 * 3_600_000) return "Échéance proche";
  return null;
}

/** Carte d'une question dans la file du back-office (même design system que le site). */
export function CarteQuestionAdmin({ q, agir }: { q: QuestionAdmin; agir: ActionAdmin }) {
  const [reponse, setReponse] = useState(q.reponse ?? q.brouillon ?? "");
  const [extrait, setExtrait] = useState(q.extraitTexte ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const enCours = q.statut === "RECUE" || q.statut === "BROUILLON" || q.statut === "RELUE";
  const badge = badgeEcheance(q, Date.now());

  async function lancer(corps: Record<string, unknown>) {
    setMessage(await agir({ id: q.id, ...corps }));
  }

  return (
    <li className="rounded-lg border border-border bg-background-elevated p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded bg-background px-2 py-0.5 font-semibold text-text-primary">{LIBELLES_STATUT_ADMIN[q.statut]}</span>
        {badge && <span className="rounded bg-error px-2 py-0.5 font-semibold text-white">{badge}</span>}
        {q.sensible && <span className="rounded border border-error px-2 py-0.5 text-error">Sensible</span>}
        <span className="text-text-secondary">
          Reçue {dateHeure.format(new Date(q.receivedAt))}, échéance {dateHeure.format(new Date(q.dueAt))}
          {q.origine === "admin" ? " (saisie admin)" : ""}
        </span>
        <code className="ml-auto text-xs text-text-secondary">{q.id}</code>
      </div>
      <p className="mt-3 whitespace-pre-line text-text-primary">{q.situation}</p>
      {q.retour && <p className="mt-2 whitespace-pre-line text-sm text-text-secondary">Sa réponse : {q.retour}</p>}

      {enCours && (
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-semibold text-text-primary" htmlFor={`rep-${q.id}`}>
            Réponse {q.brouillon ? "(brouillon préparé, modifiable)" : ""}
          </label>
          <textarea id={`rep-${q.id}`} rows={8} value={reponse} onChange={(e) => setReponse(e.target.value)}
            className="w-full rounded-lg border border-border bg-background p-3 text-text-primary" />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => lancer({ action: "enregistrer", reponse })}>Enregistrer</Button>
            <Button size="sm" variant="outline" disabled={q.statut !== "BROUILLON"} onClick={() => lancer({ action: "relue" })}>Marquer relue</Button>
            <Button size="sm" disabled={q.statut !== "RELUE"} onClick={() => lancer({ action: "envoyer" })}>Envoyer</Button>
            <Button size="sm" variant="ghost" onClick={() => lancer({ action: "sensible", sensible: !q.sensible })}>
              {q.sensible ? "Retirer « sensible »" : "Marquer sensible"}
            </Button>
            <Button size="sm" variant="danger" onClick={() => window.confirm("Écarter cette question ? L'abonné reçoit un message.") && lancer({ action: "ecarter" })}>Écarter</Button>
          </div>
        </div>
      )}

      {q.statut === "ENVOYEE" && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-text-secondary">
            Envoyée {q.sentAt ? dateHeure.format(new Date(q.sentAt)) : ""}{q.reponseModifieeParAdmin ? ", brouillon réécrit" : ""}.
          </p>
          {q.reutilisationAcceptee ? (
            <>
              <label className="block text-sm font-semibold text-text-primary" htmlFor={`ext-${q.id}`}>
                Extrait retouché pour la lettre (accord : {q.extraitStatut})
              </label>
              <textarea id={`ext-${q.id}`} rows={4} value={extrait} onChange={(e) => setExtrait(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-3 text-text-primary" />
              <Button size="sm" variant="outline" onClick={() => lancer({ action: "extrait", texte: extrait })}>
                Proposer cet extrait à l&apos;abonné
              </Button>
            </>
          ) : (
            <p className="text-sm text-text-secondary">Case de reprise non cochée : aucun extrait possible.</p>
          )}
        </div>
      )}
      {message && <p role="status" className="mt-2 text-sm text-text-primary">{message}</p>}
    </li>
  );
}
