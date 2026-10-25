"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LETTRE_CONFIDENTIALITE_HREF, LETTRE_HEBDO_INSCRIPTIONS_OUVERTES, LETTRE_HEBDO_PROFIL_ANCRE, type LettreHebdoOrigineActivation } from "@/config/lettre";
import { LETTRE_HEBDO_CASE, LETTRE_HEBDO_LIGNE_SOUS_CASE as LIGNE, LETTRE_HEBDO_UI as UI } from "@/config/textes/lettre-hebdo-s21";
import { frTypo } from "@/lib/fr-typo";
import { trackUmamiWhenReady } from "@/lib/umami";
import { cn } from "@/lib/utils";

export const LETTRE_HEBDO_API = "/api/lettre-premium/preference";

interface Preference {
  enabled: boolean;
  activatedAt: string | null;
  finPrevue: string | null;
  adresseVerifiee: boolean;
  email: string;
}

const dateLongue = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric" });
const date = (iso: string) => dateLongue.format(new Date(iso));

/**
 * Case de la lettre de la semaine (spec US-H1 au retour de paiement, US-H2 au profil ;
 * textes de la case et de la ligne : avis @legal §2.1 et §2.2, identiques aux deux
 * endroits). Jamais cochée d'avance : l'état affiché est celui de la base. Absente si
 * les inscriptions sont fermées, si l'API ne répond pas, ou pour un compte sans Premium.
 */
export function LettreHebdoCase({ emplacement, className }: { emplacement: LettreHebdoOrigineActivation; className?: string }) {
  const [pref, setPref] = useState<Preference | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | "session" | null>(null);
  const enregistrement = useRef(false);
  const vue = useRef(false);
  const id = useId();

  useEffect(() => {
    if (!LETTRE_HEBDO_INSCRIPTIONS_OUVERTES) return;
    const controller = new AbortController();
    fetch(LETTRE_HEBDO_API, { signal: controller.signal, cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((d: (Preference & { eligible?: boolean }) | null) => {
        if (!d || d.eligible !== true || typeof d.email !== "string") return;
        setPref({ enabled: d.enabled === true, activatedAt: d.activatedAt, finPrevue: d.finPrevue, adresseVerifiee: d.adresseVerifiee === true, email: d.email });
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const charge = pref !== null;
  useEffect(() => {
    if (!charge || vue.current) return;
    vue.current = true;
    trackUmamiWhenReady("lettre-hebdo-case-vue", { emplacement });
    if (emplacement === "profil" && window.location.hash === `#${LETTRE_HEBDO_PROFIL_ANCRE}`) {
      document.getElementById(LETTRE_HEBDO_PROFIL_ANCRE)?.scrollIntoView?.({ block: "start" });
      document.getElementById(`${id}-case`)?.focus({ preventScroll: true });
    }
  }, [charge, emplacement, id]);

  if (!LETTRE_HEBDO_INSCRIPTIONS_OUVERTES || !pref) return null;

  async function enregistrer(enabled: boolean) {
    if (enregistrement.current || !pref) return;
    enregistrement.current = true;
    const avant = pref;
    setPref({ ...pref, enabled });
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(LETTRE_HEBDO_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, origine: emplacement }),
        signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(5000) : undefined,
      });
      if (res.status === 401) {
        setPref(avant);
        setMessage("session");
        trackUmamiWhenReady("lettre-hebdo-echec", { raison: "session" });
        return;
      }
      if (!res.ok) {
        if (res.status === 403) trackUmamiWhenReady("lettre-hebdo-echec", { raison: "non-premium" });
        throw new Error(String(res.status));
      }
      const d = (await res.json()) as { enabled: boolean };
      setPref({ ...avant, enabled: d.enabled, activatedAt: d.enabled ? (avant.enabled ? avant.activatedAt : new Date().toISOString()) : null });
      setMessage({ texte: d.enabled ? UI.succesActivation(avant.email) : UI.succesArret, erreur: false });
      trackUmamiWhenReady(d.enabled ? "lettre-hebdo-activee" : "lettre-hebdo-arretee", { origine: emplacement });
    } catch {
      setPref(avant);
      setMessage({ texte: emplacement === "paiement" ? UI.erreurPaiement : UI.erreurProfil, erreur: true });
      trackUmamiWhenReady("lettre-hebdo-echec", { raison: "reseau" });
    } finally {
      enregistrement.current = false;
      setSaving(false);
    }
  }

  const ligne = (
    <p id={`${id}-ligne`} className="mt-2 text-xs text-text-muted">
      {frTypo(LIGNE.avantLien(pref.email))}
      <Link href={LETTRE_CONFIDENTIALITE_HREF} className="underline underline-offset-2 hover:text-text-secondary">
        {LIGNE.lien}
      </Link>
      {LIGNE.apresLien}
    </p>
  );

  return (
    <Card
      id={emplacement === "profil" ? LETTRE_HEBDO_PROFIL_ANCRE : undefined}
      role="region"
      aria-labelledby={`${id}-titre`}
      data-testid={`lettre-hebdo-${emplacement}`}
      className={cn("scroll-mt-24 text-left", className)}
    >
      <CardHeader className="pb-2">
        <CardTitle id={`${id}-titre`}>{UI.titre}</CardTitle>
        {emplacement === "profil" && (
          <p className="text-sm text-text-muted" data-testid="lettre-hebdo-statut">
            {pref.enabled && pref.activatedAt ? UI.activeeDepuis(date(pref.activatedAt)) : UI.pasActivee}
          </p>
        )}
      </CardHeader>
      {pref.adresseVerifiee ? (
        <>
          <label htmlFor={`${id}-case`} className="flex min-h-[44px] cursor-pointer items-start gap-3">
            <input
              id={`${id}-case`}
              type="checkbox"
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
              checked={pref.enabled}
              disabled={saving}
              aria-describedby={`${id}-ligne ${id}-etat`}
              onChange={(e) => void enregistrer(e.target.checked)}
            />
            <span className="text-sm text-text-secondary">{frTypo(LETTRE_HEBDO_CASE)}</span>
          </label>
          {ligne}
          {pref.enabled && pref.finPrevue && <p className="mt-2 text-sm text-text-secondary">{frTypo(UI.finPrevue(date(pref.finPrevue)))}</p>}
        </>
      ) : (
        <p className="text-sm text-text-secondary">{frTypo(UI.adresseNonVerifiee)}</p>
      )}
      <p
        id={`${id}-etat`}
        role="status"
        aria-live="polite"
        className={cn("mt-2 text-sm empty:mt-0", message === "session" || message?.erreur ? "text-error" : "text-text-secondary")}
      >
        {saving ? (
          UI.enregistrement
        ) : message === "session" ? (
          <>
            {UI.sessionExpiree.avant}
            <Link href="/login?callbackUrl=/profil" className="underline underline-offset-2">
              {UI.sessionExpiree.lien}
            </Link>
            {UI.sessionExpiree.apres}
          </>
        ) : message ? (
          frTypo(message.texte)
        ) : null}
      </p>
    </Card>
  );
}
