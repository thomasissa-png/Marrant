"use client";

/**
 * Lecture d'une API /api/admin/* depuis la page admin (s21) : en-tête Bearer
 * lu dans sessionStorage (connexion existante, inchangée), timeout 20 s, erreur
 * affichable (jamais d'écran vide silencieux). 401 : `onUnauthorized`.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export const ADMIN_PASS_KEY = "admin_pass";
const TIMEOUT_MS = 20_000;

export function adminAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const pass = sessionStorage.getItem(ADMIN_PASS_KEY);
  return pass ? { Authorization: `Bearer ${pass}` } : {};
}

export function useAdminFetch<T>(url: string | null, onUnauthorized?: () => void) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const unauthorized = useRef(onUnauthorized);
  unauthorized.current = onUnauthorized;

  const load = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { headers: adminAuthHeader(), signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (res.status === 401) {
        unauthorized.current?.();
        return;
      }
      const body = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
      if (!res.ok || !body) {
        setError(body?.error ?? `Erreur ${res.status}`);
        return;
      }
      setData(body);
    } catch (err) {
      setError(err instanceof DOMException && err.name === "TimeoutError" ? "Délai dépassé (20 s) : réessaie." : "Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, error, loading, reload: load };
}
