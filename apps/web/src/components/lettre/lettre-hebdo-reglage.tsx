"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LETTRE_CONFIDENTIALITE_HREF, LETTRE_HEBDO_INSCRIPTIONS_OUVERTES, LETTRE_HEBDO_PROFIL_ANCRE } from "@/config/lettre";
import { LETTRE_HEBDO_LIGNE_REGLAGE as LIGNE, LETTRE_HEBDO_REGLAGE, LETTRE_HEBDO_UI as UI } from "@/config/textes/lettre-hebdo-s21";
import { frTypo } from "@/lib/fr-typo";
import { trackUmamiWhenReady } from "@/lib/umami";
import { cn } from "@/lib/utils";

export const LETTRE_HEBDO_API = "/api/lettre-premium/preference";

interface Preference {
  enabled: boolean;
  opposition: boolean;
  finPrevue: string | null;
  email: string;
}

/** Texte de la ligne, l'adresse e-mail rendue d'un bloc (jamais coupée sur un tiret), le reste avec frTypo. */
function ligneAvecAdresse(texte: string, email: string) {
  const i = texte.indexOf(email);
  if (i < 0) return frTypo(texte);
  return (
    <>
      {frTypo(texte.slice(0, i))}
      <span className="whitespace-nowrap" data-testid="lettre-hebdo-adresse">
        {email}
      </span>
      {frTypo(texte.slice(i + email.length))}
    </>
  );
}

const dateLongue = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric" });
const date = (iso: string) => dateLongue.format(new Date(iso));

/**
 * Réglage « Je reçois la lettre de la semaine » du profil (s22, inscription d'office des Premium,
 * décision de Thomas du 25/10) : activé par défaut ; le désactiver = arrêt (respecté à vie),
 * le réactiver = reprise. L'état affiché est celui de la base. Absent si les inscriptions sont
 * fermées, si l'API ne répond pas, ou pour un compte sans Premium.
 */
export function LettreHebdoReglage({ className }: { className?: string }) {
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
        setPref({ enabled: d.enabled === true, opposition: d.opposition === true, finPrevue: d.finPrevue, email: d.email });
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const charge = pref !== null;
  useEffect(() => {
    if (!charge || vue.current) return;
    vue.current = true;
    trackUmamiWhenReady("lettre-hebdo-case-vue", { emplacement: "profil" });
    if (window.location.hash === `#${LETTRE_HEBDO_PROFIL_ANCRE}`) {
      document.getElementById(LETTRE_HEBDO_PROFIL_ANCRE)?.scrollIntoView?.({ block: "start" });
      document.getElementById(`${id}-reglage`)?.focus({ preventScroll: true });
    }
  }, [charge, id]);

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
        body: JSON.stringify({ enabled, origine: "profil" }),
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
      setPref({ ...avant, enabled: d.enabled });
      setMessage({ texte: d.enabled ? UI.succesActivation(avant.email) : UI.succesArret, erreur: false });
      trackUmamiWhenReady(d.enabled ? "lettre-hebdo-activee" : "lettre-hebdo-arretee", { origine: "profil" });
    } catch {
      setPref(avant);
      setMessage({ texte: UI.erreurProfil, erreur: true });
      trackUmamiWhenReady("lettre-hebdo-echec", { raison: "reseau" });
    } finally {
      enregistrement.current = false;
      setSaving(false);
    }
  }

  return (
    <Card
      id={LETTRE_HEBDO_PROFIL_ANCRE}
      role="region"
      aria-labelledby={`${id}-titre`}
      data-testid="lettre-hebdo-profil"
      className={cn("scroll-mt-24 text-left", className)}
    >
      <CardHeader className="pb-2">
        <CardTitle id={`${id}-titre`}>{UI.titre}</CardTitle>
      </CardHeader>
      {pref.opposition ? (
        <p className="text-sm text-text-secondary">{frTypo(UI.opposition)}</p>
      ) : (
        <>
          {/* Même interrupteur que « Rappel de parcours » (taille, couleurs, à gauche du libellé ; relecture s22).
              La case elle-même est l'interrupteur visible : le clic, le clavier et les tests visent le même élément.
              Pas de `disabled` pendant l'envoi (Chromium retire le focus) : aria-disabled + garde dans `enregistrer`. */}
          <label htmlFor={`${id}-reglage`} className="flex min-h-[44px] cursor-pointer items-center gap-3">
            <span className="relative inline-flex h-6 w-11 shrink-0">
              <input
                id={`${id}-reglage`}
                type="checkbox"
                role="switch"
                className="peer h-6 w-11 cursor-pointer appearance-none rounded-full border border-border-hover bg-background-elevated transition-colors hover:border-text-muted checked:border-accent-primary checked:bg-accent-primary checked:hover:border-accent-primary-hover checked:hover:bg-accent-primary-hover aria-disabled:cursor-wait aria-disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary motion-reduce:transition-none"
                checked={pref.enabled}
                aria-disabled={saving || undefined}
                aria-describedby={`${id}-ligne ${id}-etat`}
                onChange={(e) => void enregistrer(e.target.checked)}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 motion-reduce:transition-none"
              />
            </span>
            <span className="text-sm text-text-secondary">{LETTRE_HEBDO_REGLAGE}</span>
          </label>
          <p id={`${id}-ligne`} className="mt-2 max-w-prose text-xs text-text-muted">
            {/* Relecture finale v3 (m2) : adresse insécable (elle se coupait sur un tiret en 1440). */}
            {ligneAvecAdresse(LIGNE.avantLien(pref.email), pref.email)}
            <Link href={LETTRE_CONFIDENTIALITE_HREF} className="underline underline-offset-2 hover:text-text-secondary">
              {LIGNE.lien}
            </Link>
            {LIGNE.apresLien}
          </p>
          {pref.enabled && pref.finPrevue && <p className="mt-2 text-sm text-text-secondary">{frTypo(UI.finPrevue(date(pref.finPrevue)))}</p>}
        </>
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
