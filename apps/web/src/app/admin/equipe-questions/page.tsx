"use client";

// Stratégie de rendu : Client Component (back-office interactif, mot de passe
// admin gardé en sessionStorage comme /admin). Données jamais mises en cache.
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CarteQuestionAdmin, type QuestionAdmin } from "@/components/equipe-questions/admin-carte-question";
import { OutilsLot } from "@/components/equipe-questions/admin-outils";
import { LIBELLES_STATUT_ADMIN, type StatutQuestion } from "@/lib/equipe-questions/regles";

const STATUTS = Object.keys(LIBELLES_STATUT_ADMIN) as StatutQuestion[];

function entetes(): Record<string, string> {
  const pass = typeof window !== "undefined" ? sessionStorage.getItem("admin_pass") : null;
  return pass ? { Authorization: `Bearer ${pass}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

export default function AdminEquipeQuestionsPage() {
  const [motDePasse, setMotDePasse] = useState("");
  const [connecte, setConnecte] = useState(false);
  const [file, setFile] = useState<QuestionAdmin[]>([]);
  const [mode, setMode] = useState("");
  const [ouvert, setOuvert] = useState(false);
  const [filtre, setFiltre] = useState<StatutQuestion | "">("");
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(async () => {
    const res = await fetch(`/api/admin/equipe-questions${filtre ? `?statut=${filtre}` : ""}`, { headers: entetes(), cache: "no-store" });
    if (res.status === 401) {
      setConnecte(false);
      return;
    }
    if (!res.ok) {
      setErreur("File indisponible (migration 14 appliquée ?)");
      return;
    }
    const data = (await res.json()) as { file: QuestionAdmin[]; mode: string; ouvert: boolean };
    setFile(data.file);
    setMode(data.mode);
    setOuvert(data.ouvert);
    setErreur(null);
    setConnecte(true);
  }, [filtre]);

  useEffect(() => {
    if (sessionStorage.getItem("admin_pass")) void charger();
  }, [charger]);

  const agir = useCallback(async (corps: Record<string, unknown>): Promise<string | null> => {
    const res = await fetch("/api/admin/equipe-questions", { method: "POST", headers: entetes(), body: JSON.stringify(corps) });
    const data = (await res.json().catch(() => ({}))) as { code?: string; defauts?: string[]; deja?: boolean; importes?: string[]; refuses?: { id: string; defauts: string[] }[] };
    await charger();
    if (data.importes) return `${data.importes.length} importé(s), ${data.refuses?.length ?? 0} refusé(s) ${JSON.stringify(data.refuses ?? [])}`;
    if (res.ok) return data.deja ? "Déjà fait, rien de renvoyé." : "Fait.";
    return `Refusé (${data.code ?? res.status})${data.defauts ? ` : ${data.defauts.join(", ")}` : ""}`;
  }, [charger]);

  const exporter = useCallback(async () => {
    const res = await fetch("/api/admin/equipe-questions?lot=1", { headers: entetes(), cache: "no-store" });
    return res.ok ? JSON.stringify((await res.json()).lot, null, 2) : "Export impossible";
  }, []);

  if (!connecte) {
    return (
      <form className="mx-auto max-w-sm space-y-3" onSubmit={(e) => { e.preventDefault(); sessionStorage.setItem("admin_pass", motDePasse); void charger(); }}>
        <h1 className="font-display text-2xl font-bold text-text-primary">Ta question à l&apos;équipe</h1>
        <label htmlFor="admin-pass" className="block text-sm text-text-secondary">Mot de passe admin</label>
        <input id="admin-pass" type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}
          className="w-full rounded-lg border border-border bg-background p-2 text-text-primary" />
        <Button type="submit">Entrer</Button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">Ta question à l&apos;équipe</h1>
      <p className="text-sm text-text-secondary">
        Interrupteur : {ouvert ? "ouvert" : "fermé (rien de visible pour les abonnés)"}. Validation : {mode === "validation_humaine" ? "humaine, rien ne part sans ton clic « Envoyer »" : mode}.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="filtre" className="text-sm text-text-secondary">Statut</label>
        <select id="filtre" value={filtre} onChange={(e) => setFiltre(e.target.value as StatutQuestion | "")}
          className="rounded-lg border border-border bg-background p-2 text-text-primary">
          <option value="">Tous</option>
          {STATUTS.map((s) => <option key={s} value={s}>{LIBELLES_STATUT_ADMIN[s]}</option>)}
        </select>
        <Button size="sm" variant="ghost" onClick={() => void charger()}>Actualiser</Button>
      </div>
      {erreur && <p role="alert" className="text-sm text-error">{erreur}</p>}
      <OutilsLot agir={agir} exporter={exporter} />
      {file.length === 0 ? (
        <p className="text-text-secondary">Aucune question.</p>
      ) : (
        <ul className="space-y-4">{file.map((q) => <CarteQuestionAdmin key={`${q.id}-${q.statut}`} q={q} agir={agir} />)}</ul>
      )}
    </div>
  );
}
