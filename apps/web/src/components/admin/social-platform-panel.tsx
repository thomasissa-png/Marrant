"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";

// ───────────────────────────────────────────────────────────────────
// Admin social (s15 cycle 3) : interrupteur Pause / Reprise par réseau
// (en base, sans redéploiement) + rapport « prévu contre publié » (7 jours).
// ───────────────────────────────────────────────────────────────────

interface Interrupteur {
  platform: "TWITTER" | "INSTAGRAM" | "LINKEDIN";
  paused: boolean;
  reason: string | null;
  changedBy: string | null;
  pausedAt: string | null;
  canal: string;
}

interface Compteurs {
  prevus: number;
  remis: number;
  confirmes: number;
  echecs: number;
  nonConfirmes: number;
  bloques: number;
  aVenir: number;
  ecart: number;
}

interface Rapport {
  du: string;
  au: string;
  totaux: Partial<Record<Interrupteur["platform"], Compteurs>>;
  ecartTotal: number;
}

const LABEL: Record<Interrupteur["platform"], string> = { TWITTER: "X", INSTAGRAM: "Instagram", LINKEDIN: "LinkedIn" };
const COLONNES: Array<[keyof Compteurs, string]> = [
  ["prevus", "Prévus"], ["remis", "Remis"], ["confirmes", "Publiés"], ["echecs", "Échecs"],
  ["nonConfirmes", "Non confirmés"], ["bloques", "Bloqués"], ["aVenir", "À venir"], ["ecart", "Écart"],
];

export function SocialPlatformPanel({ adminPassword }: { adminPassword: string }) {
  const [etats, setEtats] = useState<Interrupteur[]>([]);
  const [rapport, setRapport] = useState<Rapport | null>(null);
  const [enCours, setEnCours] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(async () => {
    const headers = { Authorization: `Bearer ${adminPassword}` };
    try {
      const [p, r] = await Promise.all([
        fetch("/api/admin/social/platforms", { headers, signal: AbortSignal.timeout(10_000) }),
        fetch("/api/admin/social/report?jours=7", { headers, signal: AbortSignal.timeout(10_000) }),
      ]);
      if (!p.ok || !r.ok) throw new Error();
      setEtats((await p.json()).platforms);
      setRapport(await r.json());
      setErreur(null);
    } catch {
      setErreur("Impossible de lire l'état des réseaux. Réessaie dans une minute.");
    }
  }, [adminPassword]);

  useEffect(() => {
    void charger();
  }, [charger]);

  const basculer = async (e: Interrupteur) => {
    const action = e.paused ? "reprise" : "pause";
    if (action === "reprise" && !window.confirm(`Reprendre la publication ${LABEL[e.platform]} ? Les posts approuvés partiront à leur heure.`)) return;
    setEnCours(e.platform);
    try {
      const res = await fetch("/api/admin/social/platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminPassword}` },
        body: JSON.stringify({ platform: e.platform, action }),
        signal: AbortSignal.timeout(10_000),
      });
      const data = await res.json();
      if (!res.ok || !data.success) toast(data.error ?? "Action refusée.", "error");
      else toast(data.message);
      await charger();
    } catch {
      toast("Pas de réponse du serveur : réessaie.", "error");
    } finally {
      setEnCours(null);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Publication par réseau</CardTitle>
      </CardHeader>
      <CardContent>
        {erreur && <p role="alert" className="mb-3 text-sm text-error">{erreur}</p>}
        <ul className="divide-y divide-border">
          {etats.map((e) => (
            <li key={e.platform} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{LABEL[e.platform]}</span>
                  <Badge variant={e.paused ? "error" : "success"}>{e.paused ? "En pause" : "Actif"}</Badge>
                  {e.canal !== "ok" && <Badge variant="error">{e.canal === "inconnu" ? "Canal : état inconnu" : "Canal en panne"}</Badge>}
                </div>
                {e.paused && e.reason && <p className="mt-1 text-sm text-text-secondary">{e.reason}</p>}
                {e.canal !== "ok" && e.canal !== "inconnu" && <p className="mt-1 text-sm text-error">{e.canal}</p>}
              </div>
              <Button
                variant={e.paused ? "primary" : "outline"}
                size="sm"
                disabled={enCours !== null}
                onClick={() => basculer(e)}
                aria-label={`${e.paused ? "Reprendre" : "Mettre en pause"} la publication ${LABEL[e.platform]}`}
              >
                {enCours === e.platform ? "..." : e.paused ? "Reprendre" : "Mettre en pause"}
              </Button>
            </li>
          ))}
        </ul>

        {rapport && (
          <div className="mt-6 overflow-x-auto">
            <h3 className="mb-2 text-sm font-semibold">
              Prévu contre publié, du {rapport.du} au {rapport.au}{" "}
              <span className={rapport.ecartTotal > 0 ? "text-error" : "text-success"}>(écart {rapport.ecartTotal})</span>
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-secondary">
                  <th scope="col" className="py-1 text-left font-medium">Réseau</th>
                  {COLONNES.map(([k, l]) => <th key={k} scope="col" className="py-1 text-right font-medium">{l}</th>)}
                </tr>
              </thead>
              <tbody>
                {(Object.keys(rapport.totaux) as Interrupteur["platform"][]).map((pf) => (
                  <tr key={pf} className="border-t border-border">
                    <th scope="row" className="py-1 text-left font-medium">{LABEL[pf] ?? pf}</th>
                    {COLONNES.map(([k]) => (
                      <td key={k} className={`py-1 text-right ${k === "ecart" && (rapport.totaux[pf]?.[k] ?? 0) > 0 ? "font-bold text-error" : ""}`}>
                        {rapport.totaux[pf]?.[k] ?? 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {Object.keys(rapport.totaux).length === 0 && <p className="mt-2 text-sm text-text-secondary">Aucun post prévu sur la période.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
