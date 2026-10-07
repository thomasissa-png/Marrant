"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { isPremiumPlan } from "@/lib/parcours-access";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RAPPEL_PARCOURS_UI } from "@/config/textes/entrees-parcours";
import { JOURS_SEMAINE, RAPPEL_PARCOURS_CONSENTEMENT } from "@/config/textes/parcours-emails";

/**
 * Contrat d'API du lot A (`app/api/user/rappel-parcours/route.ts`, D7) :
 * GET  → `{ enabled, weekday, eligible, ... }` (weekday ISO : 1 = lundi … 7 = dimanche)
 * POST ← `{ enabled: boolean, weekday?: 1..7 }` → même forme. La version du texte
 * de consentement est enregistrée côté serveur.
 */
export const RAPPEL_PARCOURS_API = "/api/user/rappel-parcours";

interface RappelPreference {
  enabled: boolean;
  weekday: number | null;
}

/**
 * Interrupteur du rappel e-mail de parcours (profil). Conditions legal C1 :
 * case décochée par défaut, visible seulement pour un Premium actif (session
 * ET `eligible` renvoyé par le serveur), texte voisin exact (source unique :
 * RAPPEL_PARCOURS_CONSENTEMENT). API en erreur au chargement : rien n'est affiché.
 */
export function RappelParcoursToggle({ className }: { className?: string } = {}) {
  const { data: session, status } = useSession();
  const isPremium =
    status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);
  const [pref, setPref] = useState<RappelPreference | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // Case cochée sans jour choisi : le choix du jour active le rappel (consentement déjà donné).
  const [activationEnAttente, setActivationEnAttente] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const checkboxId = useId();
  const selectId = useId();

  useEffect(() => {
    if (!isPremium) return;
    const controller = new AbortController();
    fetch(RAPPEL_PARCOURS_API, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: (Partial<RappelPreference> & { eligible?: boolean }) | null) => {
        if (!data || data.eligible !== true) return;
        setPref({
          enabled: data.enabled === true,
          weekday: typeof data.weekday === "number" ? data.weekday : null,
        });
      })
      .catch(() => {});
    return () => controller.abort();
  }, [isPremium]);

  // s17 tour 1 (UXV-1-02) : arrivée par /profil#rappel-parcours, la section vient à l'écran et l'interrupteur prend le focus.
  const loaded = pref !== null;
  useEffect(() => {
    if (!loaded || typeof window === "undefined" || window.location.hash !== "#rappel-parcours") return;
    const input = document.getElementById(checkboxId);
    document.getElementById("rappel-parcours")?.scrollIntoView?.({ block: "start" });
    input?.focus({ preventScroll: true });
  }, [loaded, checkboxId]);

  // s17 tour 2 (UXV-2-03) : le sélecteur, inactif interrupteur éteint, s'active puis prend le focus.
  useEffect(() => {
    if (activationEnAttente) selectRef.current?.focus();
  }, [activationEnAttente]);

  if (!isPremium || !pref) return null;

  // Étalon 3.7 : aucun jour présélectionné tant que le rappel n'a jamais été réglé.
  const weekday = pref.weekday;

  async function save(next: { enabled: boolean; weekday: number }) {
    const previous = pref;
    setPref(next);
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(RAPPEL_PARCOURS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
        signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(5000) : undefined,
      });
      if (!res.ok) throw new Error(String(res.status));
      setMessage(RAPPEL_PARCOURS_UI.enregistre);
    } catch {
      setPref(previous);
      setMessage(RAPPEL_PARCOURS_UI.erreur);
    } finally {
      setSaving(false);
    }
  }

  return (
    // s17 tour 1 (DES-1-08) : carte du système (Card, CardTitle) et vrai interrupteur (role="switch").
    <Card
      id="rappel-parcours"
      role="region"
      aria-labelledby={`${checkboxId}-titre`}
      data-testid="rappel-parcours"
      className={cn("scroll-mt-24", className)}
    >
      <CardHeader className="pb-2">
        <CardTitle id={`${checkboxId}-titre`}>{RAPPEL_PARCOURS_UI.titre}</CardTitle>
      </CardHeader>
      <label htmlFor={checkboxId} className="flex min-h-[44px] cursor-pointer items-center gap-3">
        <span className="relative inline-flex h-6 w-11 shrink-0">
          <input
            id={checkboxId}
            type="checkbox"
            role="switch"
            className="peer sr-only"
            checked={pref.enabled}
            disabled={saving}
            aria-describedby={activationEnAttente ? `${selectId}-aide` : undefined}
            onChange={(e) => {
              if (!e.target.checked) {
                setActivationEnAttente(false);
                void save({ enabled: false, weekday: weekday ?? 1 });
              } else if (weekday === null) {
                setActivationEnAttente(true);
                setMessage(RAPPEL_PARCOURS_UI.choisirJour);
              } else {
                void save({ enabled: true, weekday });
              }
            }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-border-hover bg-background-elevated transition-colors peer-checked:border-accent-primary peer-checked:bg-accent-primary peer-disabled:opacity-60 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-primary"
          />
          <span
            aria-hidden="true"
            className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 motion-reduce:transition-none"
          />
        </span>
        <span className="text-sm text-text-secondary">{RAPPEL_PARCOURS_CONSENTEMENT.texte}</span>
      </label>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label htmlFor={selectId} className="text-sm text-text-secondary">
          {RAPPEL_PARCOURS_UI.jourLabel}
        </label>
        <select
          id={selectId}
          className="min-h-[44px] rounded-md border border-border-hover bg-background-light px-3 text-sm text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary disabled:cursor-not-allowed disabled:border-border disabled:text-text-muted"
          ref={selectRef}
          value={weekday ?? ""}
          // s17 tour 2 (UXV-2-03) : pas de jour à choisir tant que le rappel est éteint (on ne croit pas l'avoir programmé).
          disabled={saving || (!pref.enabled && !activationEnAttente)}
          onChange={(e) => {
            const nextDay = Number(e.target.value);
            if (!nextDay) return;
            setActivationEnAttente(false);
            void save({ enabled: true, weekday: nextDay });
          }}
        >
          {weekday === null && (
            <option value="" disabled>
              {RAPPEL_PARCOURS_UI.jourVide}
            </option>
          )}
          {JOURS_SEMAINE.map((label, i) => (
            <option key={label} value={i + 1}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <p id={`${selectId}-aide`} role="status" aria-live="polite" className="mt-2 text-xs text-text-muted empty:mt-0">
        {message}
      </p>
    </Card>
  );
}
