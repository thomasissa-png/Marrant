"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { QuestionMotif } from "@/components/resiliation/question-motif";
import { BarreConfirmation } from "@/components/resiliation/barre-confirmation";
import { trackUmami } from "@/lib/umami";
import {
  CLE_REPONSE_SESSION,
  RESILIATION_API,
  RESILIATION_CONFIRMEE_HREF,
  RESILIATION_DELAI_LENT_MS,
  RESILIATION_HREF,
  type RaisonResiliation,
} from "@/config/resiliation";
import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";

type Erreur = "stripe" | "hors-ligne" | "app-store";

/** Clé UUID v4 de la demande ; repli `getRandomValues` (anciens Safari, contexte non sécurisé). */
export function nouvelleCle(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const o = crypto.getRandomValues(new Uint8Array(16));
  o[6] = (o[6] & 0x0f) | 0x40;
  o[8] = (o[8] & 0x3f) | 0x80;
  const h = Array.from(o, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

interface ResiliationFormulaireProps {
  /** Récapitulatif rendu côté serveur (`RecapContrat`). */
  recap: ReactNode;
}

/**
 * Écran /resiliation : récapitulatif, question facultative, puis barre « Confirmer la résiliation »
 * collée en bas (sticky), TOUJOURS active : jamais conditionnée à la réponse, jamais `disabled`
 * (pendant l'envoi : `aria-disabled` + clics ignorés). Saisie conservée en cas d'erreur.
 */
export function ResiliationFormulaire({ recap }: ResiliationFormulaireProps) {
  const router = useRouter();
  const [raisons, setRaisons] = useState<Set<RaisonResiliation>>(() => new Set());
  const [commentaire, setCommentaire] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [lent, setLent] = useState(false);
  const [erreur, setErreur] = useState<Erreur | null>(null);
  const cle = useRef<string>("");
  const bandeauRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cle.current = nouvelleCle();
    trackUmami("resiliation-ecran-vu");
  }, []);

  useEffect(() => {
    if (!envoi) return;
    const t = window.setTimeout(() => setLent(true), RESILIATION_DELAI_LENT_MS);
    return () => window.clearTimeout(t);
  }, [envoi]);

  useEffect(() => {
    if (!erreur || !bandeauRef.current) return;
    bandeauRef.current.focus();
    bandeauRef.current.scrollIntoView?.({ block: "center" });
  }, [erreur]);

  const basculer = (code: RaisonResiliation) =>
    setRaisons((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });

  const echec = (e: Erreur) => {
    cle.current = nouvelleCle(); // Réessayer = nouvelle demande (Stripe garde la réponse d'une clé)
    setErreur(e);
    setEnvoi(false);
    setLent(false);
  };

  const confirmer = async (e: FormEvent) => {
    e.preventDefault();
    if (envoi) return;
    setEnvoi(true);
    setErreur(null);
    const liste = Array.from(raisons);
    const mot = commentaire.trim();
    try {
      const res = await fetch(RESILIATION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reasons: liste, comment: mot, cle: cle.current || nouvelleCle() }),
      });
      const data = (await res.json().catch(() => null)) as { etat?: string } | null;
      if (res.status === 401) {
        window.location.assign(`/login?callbackUrl=${encodeURIComponent(RESILIATION_HREF)}`);
        return;
      }
      if (res.ok && (data?.etat === "resilie" || data?.etat === "deja_resilie")) {
        try {
          sessionStorage.setItem(CLE_REPONSE_SESSION, JSON.stringify({ raisons: liste, repondu: liste.length > 0 || mot.length > 0 }));
        } catch {
          // Stockage refusé (navigation privée) : la page finale s'affiche sans la ligne d'aide.
        }
        trackUmami("resiliation-confirmee");
        router.push(RESILIATION_CONFIRMEE_HREF);
        return;
      }
      if (data?.etat === "aucun") {
        router.refresh();
        return;
      }
      if (data?.etat === "app_store") echec("app-store");
      // 202 (transmis) et 503 : l'équipe a reçu la demande, « on résilie pour toi » est vrai.
      else if (res.status === 202 || res.status === 503) echec("stripe");
      // Autre refus (429, 403…) : rien n'est transmis, on ne promet rien, on invite à réessayer.
      else echec("hors-ligne");
    } catch {
      // Aucune réponse : la demande n'est peut-être pas arrivée.
      echec("hors-ligne");
    }
  };

  const messageErreur = erreur === "hors-ligne" ? T.horsLigne : erreur === "app-store" ? T.appStore : T.erreurStripe;

  return (
    <form onSubmit={confirmer} noValidate aria-busy={envoi || undefined}>
      {erreur && (
        <div
          ref={bandeauRef}
          role="alert"
          tabIndex={-1}
          className="mb-6 rounded-lg border border-error/50 bg-error/10 p-4 text-sm text-error-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
        >
          {messageErreur}
        </div>
      )}
      {recap}
      <QuestionMotif raisons={raisons} commentaire={commentaire} fige={envoi} onBasculer={basculer} onCommentaire={setCommentaire} />
      <BarreConfirmation envoi={envoi} lent={lent} reessayer={erreur !== null && erreur !== "app-store"} />
    </form>
  );
}
