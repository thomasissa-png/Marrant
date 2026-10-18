/**
 * Briques d'affichage de la page admin (s21) : mêmes jetons que le site
 * (background-card, border, text-*, accent-*), lisibles dès 320 px.
 */
import type { ReactNode } from "react";

const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

/** Nombre formaté, « n.d. » si la donnée manque. */
export function fmt(n: number | null | undefined): string {
  return n === null || n === undefined ? "n.d." : nf.format(n);
}

export function euros(cents: number | null | undefined): string {
  return cents === null || cents === undefined
    ? "n.d."
    : `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100)} €`;
}

/** « 1 compte de test exclu. » ; vide sans compte de test (même libellé que l'e-mail du lundi). */
export function comptesTestExclus(n: number | null | undefined): string {
  return n ? `${n} compte${n > 1 ? "s" : ""} de test exclu${n > 1 ? "s" : ""}.` : "";
}

export function dateCourte(iso: string | null | undefined): string {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", timeZone: "Europe/Paris" });
}

export function dateHeure(iso: string | null | undefined): string {
  if (!iso) return "–";
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

type Couleur = "success" | "warning" | "error" | "accent";
const COULEURS: Record<Couleur, string> = {
  success: "text-success",
  warning: "text-yellow-500",
  error: "text-error",
  accent: "text-accent-primary",
};

export function KpiCard({ label, value, subtitle, color }: { label: string; value: string; subtitle?: string; color?: Couleur }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background-card p-3 md:p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted md:text-xs">{label}</p>
      <p className={`mt-1 text-xl font-bold md:text-2xl ${color ? COULEURS[color] : "text-text-primary"}`}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-text-muted">{subtitle}</p>}
    </div>
  );
}

export function Section({ titre, sousTitre, children, action }: { titre: string; sousTitre?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="space-y-3" aria-label={titre}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold text-text-primary">{titre}</h2>
          {sousTitre && <p className="text-xs text-text-muted">{sousTitre}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Tableau libellé / valeur (une colonne de chiffres à droite), lisible sur téléphone. */
export function LignesChiffres({ lignes }: { lignes: Array<[string, ReactNode]> }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background-card">
      <table className="w-full text-sm">
        <tbody>
          {lignes.map(([label, value]) => (
            <tr key={label} className="border-b border-border/60 last:border-0">
              <td className="px-3 py-2 text-text-secondary">{label}</td>
              <td className="px-3 py-2 text-right font-semibold tabular-nums text-text-primary">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Libellé puis valeurs (texte long, plusieurs lignes) : toujours en pile, valeurs alignées à gauche
 * (revue visuelle s21, R15 : plus de chaînes longues renvoyées à la ligne en alignement droit).
 * Une valeur à segments « a | b | c » s'affiche segment par segment, chacun d'un tenant.
 */
export function LignesEmpilees({ lignes }: { lignes: Array<[string, string[]]> }) {
  return (
    <ul className="divide-y divide-border/60 overflow-hidden rounded-lg border border-border bg-background-card text-sm">
      {lignes.map(([label, valeurs]) => (
        <li key={label} className="grid gap-1 px-3 py-2">
          <span className="text-text-secondary">{label}</span>
          <span className="min-w-0 space-y-1">
            {valeurs.map((v) => (
              <span key={v} className="flex flex-wrap gap-x-3 text-xs font-semibold leading-5 tabular-nums text-text-primary">
                {v.split(" | ").map((segment, i) => (
                  <span key={i} className="whitespace-nowrap">{segment}</span>
                ))}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Avertissement({ children }: { children: ReactNode }) {
  return <p className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-600">{children}</p>;
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-xs text-text-muted">{children}</p>;
}

export function Chargement() {
  return (
    <div className="flex items-center justify-center py-16" role="status" aria-label="Chargement">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-primary border-t-transparent" />
    </div>
  );
}

export function Erreur({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-2 rounded-md border border-error/40 px-3 py-1 text-xs hover:bg-error/10">
          Réessayer
        </button>
      )}
    </div>
  );
}

export function BoutonActualiser({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-background-elevated disabled:opacity-50"
    >
      {loading ? "Chargement…" : "Actualiser"}
    </button>
  );
}

export function Pastille({ children, ton = "neutre" }: { children: ReactNode; ton?: "neutre" | "success" | "warning" | "error" | "accent" }) {
  const styles = {
    neutre: "bg-background-elevated text-text-muted",
    success: "bg-success/20 text-success",
    warning: "bg-yellow-500/20 text-yellow-600",
    error: "bg-error/20 text-error",
    accent: "bg-accent-primary/20 text-accent-primary",
  } as const;
  return <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${styles[ton]}`}>{children}</span>;
}

export function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const bouton = "rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-background-elevated disabled:opacity-40";
  return (
    <nav className="flex items-center justify-center gap-3" aria-label="Pagination">
      <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className={bouton}>
        Précédent
      </button>
      <span className="text-sm text-text-muted">
        Page {page} / {totalPages}
      </span>
      <button type="button" disabled={page >= totalPages} onClick={() => onPage(page + 1)} className={bouton}>
        Suivant
      </button>
    </nav>
  );
}
