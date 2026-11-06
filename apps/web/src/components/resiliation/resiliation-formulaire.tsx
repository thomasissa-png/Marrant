"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { QuestionMotif } from "@/components/resiliation/question-motif";
import { BarreConfirmation } from "@/components/resiliation/barre-confirmation";
import { CarteAppStore } from "@/components/resiliation/carte-app-store";
import { garderSaisie, reprendreSaisie } from "@/components/resiliation/saisie-session";
import { trackUmami } from "@/lib/umami";
import { ORIGINES_APPLI_MOBILE } from "@/config/appli-mobile";
import {
  CLE_REPONSE_SESSION,
  RESILIATION_API,
  RESILIATION_CONFIRMEE_HREF,
  RESILIATION_DELAI_LENT_MS,
  RESILIATION_HREF,
  type RaisonResiliation,
} from "@/config/resiliation";
import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";

/** `stripe` : demande transmise (202, 503) ; `refus` : refus du serveur ; `hors-ligne` : aucune réponse. */
type Erreur = "stripe" | "refus" | "hors-ligne" | "app-store";

const MESSAGES: Record<Exclude<Erreur, "app-store">, string> = {
  stripe: T.erreurStripe,
  refus: T.refus,
  "hors-ligne": T.horsLigne,
};

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
  /** Ni client ni abonnement Stripe : dans l'appli, l'abonnement passe par Apple (UX O5, C6). */
  appStorePossible?: boolean;
}

/**
 * Écran /resiliation : récapitulatif, question facultative, puis barre « Confirmer la résiliation »
 * collée en bas (sticky), TOUJOURS active : jamais conditionnée à la réponse, jamais `disabled`
 * (pendant l'envoi : `aria-disabled` + clics ignorés). Saisie conservée en cas d'erreur.
 */
export function ResiliationFormulaire({ recap, appStorePossible = false }: ResiliationFormulaireProps) {
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
    // UX O5 : achat App Store connu dès l'ouverture (même hypothèse que l'API : origine de l'appli et
    // aucun client Stripe), jamais après un clic qui boucle.
    if (appStorePossible && ORIGINES_APPLI_MOBILE.includes(window.location.origin)) setErreur("app-store");
    // UX O3 : saisie reprise après une reconnexion.
    const reprise = reprendreSaisie();
    if (reprise) {
      setRaisons(new Set(reprise.raisons));
      setCommentaire(reprise.commentaire);
    }
    trackUmami("resiliation-ecran-vu");
  }, [appStorePossible]);

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
        garderSaisie({ raisons: liste, commentaire });
        window.location.assign(`/login?callbackUrl=${encodeURIComponent(RESILIATION_HREF)}`);
        return;
      }
      if (res.ok && data?.etat === "resilie") {
        try {
          sessionStorage.setItem(CLE_REPONSE_SESSION, JSON.stringify({ raisons: liste, repondu: liste.length > 0 || mot.length > 0 }));
        } catch {
          // Stockage refusé (navigation privée) : la page finale s'affiche sans la ligne d'aide.
        }
        trackUmami("resiliation-confirmee");
        router.push(RESILIATION_CONFIRMEE_HREF);
        return;
      }
      // @reviewer S3 : déjà résilié (2e onglet) = ni e-mail ni motif : l'écran se relit (état « Enregistrée »).
      if (data?.etat === "aucun" || data?.etat === "deja_resilie") {
        router.refresh();
        return;
      }
      if (data?.etat === "app_store") echec("app-store");
      // 202 (transmis) et 503 : l'équipe a reçu la demande, « on résilie pour toi » est vrai.
      else if (res.status === 202 || res.status === 503) echec("stripe");
      // Autre refus (429, 403, 500…) : rien n'est transmis, on ne promet rien (UX O4).
      else echec("refus");
    } catch {
      // Aucune réponse : la demande n'est peut-être pas arrivée.
      echec("hors-ligne");
    }
  };

  // UX O5 : abonnement Apple, carte seule (ni question ni bouton « Confirmer » qui bouclerait).
  if (erreur === "app-store") return <CarteAppStore />;

  return (
    <form onSubmit={confirmer} noValidate aria-busy={envoi || undefined}>
      {erreur && (
        <div
          ref={bandeauRef}
          role="alert"
          tabIndex={-1}
          className="mb-6 rounded-lg border border-error/50 bg-error/10 p-4 text-sm text-error-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
        >
          {MESSAGES[erreur]}
        </div>
      )}
      {recap}
      <QuestionMotif raisons={raisons} commentaire={commentaire} fige={envoi} onBasculer={basculer} onCommentaire={setCommentaire} />
      {/* UX O8 : « Réessayer » seulement après une demande transmise ; sinon « Confirmer la résiliation ». */}
      <BarreConfirmation envoi={envoi} lent={lent} reessayer={erreur === "stripe"} />
    </form>
  );
}
