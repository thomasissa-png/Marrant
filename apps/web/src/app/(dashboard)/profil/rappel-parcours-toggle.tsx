"use client";

import { useEffect, useId, useState } from "react";
import { useSession } from "next-auth/react";
import { isPremiumPlan } from "@/lib/parcours-access";
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
export function RappelParcoursToggle() {
  const { data: session, status } = useSession();
  const isPremium =
    status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);
  const [pref, setPref] = useState<RappelPreference | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
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

  if (!isPremium || !pref) return null;

  const weekday = pref.weekday ?? 1;

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
    <section
      aria-labelledby={`${checkboxId}-titre`}
      data-testid="rappel-parcours"
      className="rounded-xl border border-border bg-background-card p-5"
    >
      <h2 id={`${checkboxId}-titre`} className="font-display text-lg font-bold text-text-primary">
        {RAPPEL_PARCOURS_UI.titre}
      </h2>
      <div className="mt-3 flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          className="mt-1 h-5 w-5 accent-accent-primary"
          checked={pref.enabled}
          disabled={saving}
          onChange={(e) => void save({ enabled: e.target.checked, weekday })}
        />
        <label htmlFor={checkboxId} className="text-sm text-text-secondary">
          {RAPPEL_PARCOURS_CONSENTEMENT.texte}
        </label>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <label htmlFor={selectId} className="text-sm text-text-secondary">
          {RAPPEL_PARCOURS_UI.jourLabel}
        </label>
        <select
          id={selectId}
          className="min-h-[44px] rounded-md border border-border bg-background px-3 text-sm text-text-primary"
          value={weekday}
          disabled={saving}
          onChange={(e) => {
            const nextDay = Number(e.target.value);
            if (pref.enabled) void save({ enabled: true, weekday: nextDay });
            else setPref({ ...pref, weekday: nextDay });
          }}
        >
          {JOURS_SEMAINE.map((label, i) => (
            <option key={label} value={i + 1}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-[1.25rem] text-xs text-text-muted">
        {message}
      </p>
    </section>
  );
}
