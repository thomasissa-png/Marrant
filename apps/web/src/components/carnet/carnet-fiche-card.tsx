import type { CarnetFiche, CarnetFicheApercu } from "@/lib/carnet";
import { Card } from "@/components/ui/card";

/** Fiche complète (Server Component : aucune donnée ne part dans le JS client). */
export function CarnetFicheCard({
  fiche,
  numero,
  offerte = false,
}: {
  fiche: CarnetFiche;
  numero: number;
  offerte?: boolean;
}) {
  return (
    <Card className="space-y-4 p-5" id={`fiche-${fiche.id}`}>
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-accent-link">
          Situation {numero}
          {offerte ? " · offerte" : ""}
        </p>
        <h2 className="font-display text-xl font-bold text-text-primary">{fiche.titre}</h2>
        <p className="text-sm text-text-muted">{fiche.contexte}</p>
      </header>

      <p className="text-sm text-text-secondary">{fiche.situation}</p>

      <div className="rounded-lg bg-background-elevated p-3">
        <p className="text-xs font-medium text-text-muted">On te dit</p>
        <p className="mt-1 text-sm italic text-text-primary">{fiche.onTeDit}</p>
      </div>

      <div className="rounded-lg border border-accent-primary/30 bg-accent-primary/10 p-3">
        <p className="text-xs font-medium text-accent-link">Tu réponds</p>
        <p className="mt-1 text-base font-semibold text-text-primary">{fiche.reponse}</p>
      </div>

      <FicheBloc titre="Pourquoi ça marche">{fiche.pourquoi}</FicheBloc>
      <FicheBloc titre="Si ça se tend">{fiche.siTendu}</FicheBloc>
      <FicheBloc titre="À toi de jouer">{fiche.exercice}</FicheBloc>
    </Card>
  );
}

function FicheBloc({ titre, children }: { titre: string; children: string }) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-text-primary">{titre}</h3>
      <p className="text-sm text-text-secondary">{children}</p>
    </div>
  );
}

/** Fiche réservée : titre et contexte uniquement (le reste n'a jamais quitté le serveur). */
export function CarnetFicheLocked({ fiche, numero }: { fiche: CarnetFicheApercu; numero: number }) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-border bg-background-card p-4">
      <svg
        className="mt-0.5 h-5 w-5 shrink-0 text-text-muted/60"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <div>
        <p className="text-xs text-text-muted">Situation {numero}</p>
        <p className="font-semibold text-text-primary">{fiche.titre}</p>
        <p className="mt-0.5 text-sm text-text-secondary">{fiche.contexte}</p>
      </div>
    </li>
  );
}
