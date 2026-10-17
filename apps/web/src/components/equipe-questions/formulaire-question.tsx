"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { trackUmami } from "@/lib/umami";
import { CHEMIN_QUESTIONS, LIMITES } from "@/config/equipe-questions";
import { TEXTES_EQUIPE_ETATS as E, TEXTES_EQUIPE_PAGE as T } from "@/config/textes/equipe-questions";
import { formaterDateLimite } from "@/lib/equipe-questions/regles";

const CLE_BROUILLON = "equipe-question-brouillon";
const DELAI_RESEAU_MS = 15_000;

type Etat =
  | { type: "saisie" }
  | { type: "envoi" }
  | { type: "succes"; dateLimite: string; email: string }
  | { type: "erreur"; message: string; champ?: "situation" | "retour" };

function nouvelleCle(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

/** Formulaire de « Ta question à l'équipe ». Saisie gardée dans le navigateur (erreur, session expirée). */
export function FormulaireQuestion() {
  const [situation, setSituation] = useState("");
  const [retour, setRetour] = useState("");
  const [reutilisation, setReutilisation] = useState(false);
  const [etat, setEtat] = useState<Etat>({ type: "saisie" });
  const router = useRouter();
  const cle = useRef(nouvelleCle());
  const ids = { situation: useId(), retour: useId(), erreur: useId(), compteur: useId(), consigne: useId() };

  useEffect(() => {
    try {
      const b = JSON.parse(localStorage.getItem(CLE_BROUILLON) ?? "null") as { situation?: string; retour?: string } | null;
      if (b?.situation) setSituation(b.situation);
      if (b?.retour) setRetour(b.retour);
    } catch {
      /* brouillon illisible : on repart de zéro */
    }
  }, []);

  useEffect(() => {
    if (etat.type === "succes") return;
    try {
      localStorage.setItem(CLE_BROUILLON, JSON.stringify({ situation, retour }));
    } catch {
      /* stockage indisponible : sans effet */
    }
  }, [situation, retour, etat.type]);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (etat.type === "envoi") return;
    setEtat({ type: "envoi" });
    const controleur = new AbortController();
    const minuteur = setTimeout(() => controleur.abort(), DELAI_RESEAU_MS);
    try {
      const res = await fetch("/api/equipe-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, retour, reutilisation, idempotencyKey: cle.current }),
        signal: controleur.signal,
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string; champ?: "situation" | "retour"; code?: string;
        question?: { dueAt: string }; email?: string;
      };
      if (res.status === 401) {
        trackUmami("equipe-question-echec", { raison: "session" });
        window.location.href = `/login?callbackUrl=${encodeURIComponent(CHEMIN_QUESTIONS)}`;
        return;
      }
      if (res.ok && data.question && data.email) {
        trackUmami("equipe-question-envoi");
        localStorage.removeItem(CLE_BROUILLON);
        cle.current = nouvelleCle();
        setEtat({ type: "succes", dateLimite: formaterDateLimite(new Date(data.question.dueAt)), email: data.email });
        router.refresh();
        return;
      }
      trackUmami("equipe-question-echec", { raison: data.code === "corps" ? "situation" : data.code === "garde-fou" ? "garde-fou" : "serveur" });
      setEtat({ type: "erreur", message: data.error ?? E.erreurServeur, champ: data.code === "corps" ? data.champ : undefined });
    } catch {
      trackUmami("equipe-question-echec", { raison: "reseau" });
      setEtat({ type: "erreur", message: E.erreurServeur });
    } finally {
      clearTimeout(minuteur);
    }
  }

  if (etat.type === "succes") {
    return (
      <div role="status" className="rounded-lg border border-border bg-background-elevated p-5">
        <p className="text-text-primary">{E.succes(etat.dateLimite, etat.email)}</p>
        <Link href="#mes-questions" className="mt-3 inline-block text-accent-link hover:underline">
          {E.voirQuestions}
        </Link>
      </div>
    );
  }

  const enEnvoi = etat.type === "envoi";
  const erreurChamp = etat.type === "erreur" ? etat.champ : undefined;
  return (
    <form onSubmit={envoyer} noValidate className="space-y-5">
      <p id={ids.consigne} className="text-sm text-text-secondary">
        {T.consigne}
        <Link href="/confidentialite" className="text-accent-link hover:underline">{T.lienConfidentialite}</Link>.
      </p>
      <div>
        <label htmlFor={ids.situation} className="block font-semibold text-text-primary">{T.labelSituation}</label>
        <p className="text-sm text-text-secondary">{T.aideSituation}</p>
        <textarea
          id={ids.situation} value={situation} onChange={(e) => setSituation(e.target.value)} readOnly={enEnvoi} rows={6}
          aria-invalid={erreurChamp === "situation"}
          aria-describedby={`${ids.consigne} ${ids.compteur}${erreurChamp === "situation" ? ` ${ids.erreur}` : ""}`}
          className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-text-primary"
        />
        <p id={ids.compteur} className="text-right text-xs text-text-secondary">{T.compteur(situation.trim().length, LIMITES.situationMax)}</p>
      </div>
      <div>
        <label htmlFor={ids.retour} className="block font-semibold text-text-primary">
          {T.labelRetour} <span className="font-normal text-text-secondary">{T.facultatif}</span>
        </label>
        <textarea
          id={ids.retour} value={retour} onChange={(e) => setRetour(e.target.value)} readOnly={enEnvoi} rows={2}
          aria-invalid={erreurChamp === "retour"} aria-describedby={erreurChamp === "retour" ? ids.erreur : undefined}
          className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-text-primary"
        />
      </div>
      <label className="flex items-start gap-3 text-sm text-text-primary">
        <input type="checkbox" checked={reutilisation} onChange={(e) => setReutilisation(e.target.checked)} disabled={enEnvoi} className="mt-1 h-5 w-5" />
        <span>{T.labelReutilisation}</span>
      </label>
      {etat.type === "erreur" && (
        <p id={ids.erreur} role="alert" className="text-sm text-error">{etat.message}</p>
      )}
      <Button type="submit" aria-busy={enEnvoi}>{enEnvoi ? T.boutonEnvoi : T.bouton}</Button>
    </form>
  );
}
