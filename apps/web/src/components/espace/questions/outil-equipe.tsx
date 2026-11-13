"use client";

import { useState } from "react";
import { SCENES_BUT, SCENES_OU, TYPES_QUESTION, type TypeQuestion } from "@/lib/espace/questions-types";
import type { EtatEmail, FilEquipe } from "@/lib/espace/questions-equipe";
import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";
import { BOUTON_PRINCIPAL, BOUTON_SECONDAIRE, CARTE } from "@/components/espace/carte/styles";
import { dateCourte } from "@/components/espace/questions/appel";

/**
 * Outil de l'équipe pour « Mes questions » (s24, lot D7 ; INTERNE, jamais vu par un abonné). Même accès que
 * les autres outils d'admin (mot de passe admin, `Authorization: Bearer`). Fils en attente d'abord (retard
 * signalé), réponse enregistrée PUIS e-mail (brouillon tant que son texte n'est pas validé : l'outil le dit),
 * étiquette de scène (deux valeurs au plus), recopie d'un échange fait par e-mail.
 */
type Donnees = { fils: FilEquipe[]; attente: number; enRetard: number; alerte: boolean };

const ETAT_EMAIL: Record<EtatEmail | "aucun", string> = {
  envoye: "Réponse enregistrée, e-mail envoyé.",
  brouillon: "Réponse enregistrée. E-mail NON envoyé : son texte attend la validation de Thomas. Réponds à la main en attendant.",
  adresse: "Réponse enregistrée. E-mail non envoyé : adresse du compte inutilisable.",
  echec: "Réponse enregistrée. L'e-mail n'est pas parti (Resend) : réessaie plus tard ou réponds à la main.",
  aucun: "Échange recopié (aucun e-mail).",
};

const CHAMP = "w-full min-w-0 rounded-lg border border-border-input bg-background-light px-3 py-2 text-base text-text-primary";

export function OutilQuestions() {
  const [motDePasse, setMotDePasse] = useState("");
  const [donnees, setDonnees] = useState<Donnees | null>(null);
  const [message, setMessage] = useState("");
  const [reponses, setReponses] = useState<Record<string, string>>({});

  const appel = async (methode: "GET" | "POST" | "PATCH", corps?: unknown) => {
    const res = await fetch("/api/admin/questions-equipe", {
      method: methode,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${motDePasse}` },
      body: corps === undefined ? undefined : JSON.stringify(corps),
      cache: "no-store",
    });
    return { ok: res.ok, status: res.status, corps: (await res.json().catch(() => ({}))) as Record<string, unknown> };
  };

  const charger = async () => {
    const r = await appel("GET");
    if (!r.ok) return setMessage(r.status === 401 ? "Mot de passe incorrect." : "Lecture impossible.");
    setDonnees(r.corps as unknown as Donnees);
  };

  const repondre = async (filId: string) => {
    const r = await appel("POST", { filId, reponse: reponses[filId] ?? "" });
    setMessage(r.ok ? ETAT_EMAIL[r.corps.email as EtatEmail] : "Réponse refusée (vide ou trop longue).");
    if (r.ok) {
      setReponses((x) => ({ ...x, [filId]: "" }));
      await charger();
    }
  };

  const etiqueter = async (fil: FilEquipe, sceneOu: string | null, sceneBut: string | null) => {
    const r = await appel("PATCH", { filId: fil.id, sceneOu, sceneBut });
    setMessage(r.ok ? "Étiquette enregistrée." : "Étiquette refusée.");
    if (r.ok) await charger();
  };

  const recopier = async (form: HTMLFormElement) => {
    const f = new FormData(form);
    const r = await appel("POST", {
      recopie: { email: String(f.get("email") ?? ""), type: String(f.get("type") ?? "") as TypeQuestion, question: String(f.get("question") ?? ""), reponse: String(f.get("reponse") ?? "") },
    });
    setMessage(r.ok ? ETAT_EMAIL.aucun : r.status === 404 ? "Aucun compte à cette adresse." : "Recopie refusée.");
    if (r.ok) {
      form.reset();
      await charger();
    }
  };

  if (!donnees) {
    return (
      <form
        className={`${CARTE} mx-auto max-w-md`}
        onSubmit={(e) => {
          e.preventDefault();
          void charger();
        }}
      >
        <h1 className="font-display text-2xl font-bold">Mes questions, outil de l&apos;équipe</h1>
        <label className="block text-sm font-semibold" htmlFor="mdp">
          Mot de passe admin
        </label>
        <input id="mdp" type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} className={CHAMP} />
        <button type="submit" className={BOUTON_PRINCIPAL}>
          Connexion
        </button>
        <p role="status" className="text-sm text-error-text">
          {message}
        </p>
      </form>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 py-8">
      <h1 className="font-display text-3xl font-bold">Mes questions, outil de l&apos;équipe</h1>
      <p className={donnees.alerte ? "text-warning" : "text-text-secondary"} data-alerte={donnees.alerte || undefined}>
        {donnees.attente} en attente, dont {donnees.enRetard} en retard (3 jours ouvrés).
      </p>
      <p role="status" className="text-sm text-text-secondary">
        {message}
      </p>
      <ul className="flex flex-col gap-4">
        {donnees.fils.map((fil) => (
          <li key={fil.id} className={CARTE} data-fil-admin={fil.id}>
            <p className="text-sm text-text-secondary">
              {Q.types[fil.type].nom} · {fil.email} · {Q.envois.envoyeLe(dateCourte(fil.creeLe))}
              {fil.enRetard && <strong className="text-warning"> · en retard</strong>}
              {fil.statut === "REPONDU" && " · répondu"}
            </p>
            {fil.messages.map((m, i) => (
              <div key={i}>
                <p className="text-xs font-semibold text-text-muted">{m.auteur === "EQUIPE" ? `Équipe, ${dateCourte(m.creeLe)}` : `Abonné, ${dateCourte(m.creeLe)}`}</p>
                <p className="whitespace-pre-line">{m.corps}</p>
              </div>
            ))}
            <div className="flex flex-wrap gap-3">
              <select aria-label="Où et avec qui ?" value={fil.sceneOu ?? ""} onChange={(e) => void etiqueter(fil, e.target.value || null, fil.sceneBut)} className={CHAMP + " w-auto"}>
                <option value="">Où et avec qui ?</option>
                {SCENES_OU.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select aria-label="Pour quoi faire ?" value={fil.sceneBut ?? ""} onChange={(e) => void etiqueter(fil, fil.sceneOu, e.target.value || null)} className={CHAMP + " w-auto"}>
                <option value="">Pour quoi faire ?</option>
                {SCENES_BUT.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {fil.statut === "EN_ATTENTE" && (
              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void repondre(fil.id);
                }}
              >
                <label className="block text-sm font-semibold" htmlFor={`rep-${fil.id}`}>
                  Réponse (signée « {Q.envois.signature} » dans l&apos;e-mail)
                </label>
                <textarea id={`rep-${fil.id}`} value={reponses[fil.id] ?? ""} onChange={(e) => setReponses((x) => ({ ...x, [fil.id]: e.target.value }))} className={`${CHAMP} min-h-40`} />
                <button type="submit" className={BOUTON_PRINCIPAL}>
                  Enregistrer la réponse
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
      <form
        className={CARTE}
        onSubmit={(e) => {
          e.preventDefault();
          void recopier(e.currentTarget);
        }}
      >
        <h2 className="font-display text-xl font-bold">Recopier un échange fait par e-mail</h2>
        <input name="email" type="email" required placeholder="Adresse du compte" aria-label="Adresse du compte" className={CHAMP} />
        <select name="type" aria-label="Type" className={CHAMP} defaultValue="QUESTION">
          {TYPES_QUESTION.map((t) => (
            <option key={t} value={t}>
              {Q.types[t].nom}
            </option>
          ))}
        </select>
        <textarea name="question" required aria-label="Question de l'abonné" placeholder="Question de l'abonné" className={`${CHAMP} min-h-24`} />
        <textarea name="reponse" required aria-label="Réponse de l'équipe" placeholder="Réponse de l'équipe" className={`${CHAMP} min-h-24`} />
        <button type="submit" className={BOUTON_SECONDAIRE}>
          Recopier
        </button>
      </form>
    </div>
  );
}
