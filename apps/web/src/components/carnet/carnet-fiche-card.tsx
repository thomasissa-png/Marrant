import type { CarnetFiche, CarnetFicheApercu } from "@/lib/carnet";
import { frTypo } from "@/lib/fr-typo";
import { Card } from "@/components/ui/card";

/**
 * Fiche complète (Server Component : aucune donnée ne part dans le JS client).
 * `extrait` (lot 2 s21, /abonnement) : le bloc qui l'entoure porte déjà « Situation N,
 * offerte » ; la carte ne montre que le titre, la situation, la réplique et
 * « Pourquoi ça marche » (sans contexte, « Si ça se tend » ni « À toi de jouer »).
 */
export function CarnetFicheCard({
  fiche,
  numero,
  offerte = false,
  extrait = false,
}: {
  fiche: CarnetFiche;
  numero: number;
  offerte?: boolean;
  extrait?: boolean;
}) {
  const Titre = extrait ? "h3" : "h2";
  const blocTitre = extrait ? "h4" : "h3";
  return (
    <Card className="space-y-4 p-4 hover:border-border sm:p-6" id={extrait ? undefined : `fiche-${fiche.id}`}>
      <header className="space-y-1">
        {!extrait && (
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-link">
            Situation {numero}
            {offerte ? " · offerte" : ""}
          </p>
        )}
        <Titre className="font-display text-xl font-bold text-text-primary">{frTypo(fiche.titre)}</Titre>
        {!extrait && <p className="text-sm text-text-muted">{frTypo(fiche.contexte)}</p>}
      </header>

      <p className="text-sm text-text-secondary">{frTypo(fiche.situation)}</p>

      <div className="rounded-lg bg-background-elevated p-3">
        <p className="text-xs font-medium text-text-muted">On te dit</p>
        <p className="mt-1 text-sm italic text-text-primary">{frTypo(fiche.onTeDit)}</p>
      </div>

      <div className="rounded-lg border border-accent-primary/30 bg-accent-primary/10 p-3">
        <p className="text-xs font-medium text-accent-link">Tu réponds</p>
        <p className="mt-1 text-base font-semibold text-text-primary">{frTypo(fiche.reponse)}</p>
      </div>

      <FicheBloc titre="Pourquoi ça marche" as={blocTitre}>{frTypo(fiche.pourquoi)}</FicheBloc>
      {!extrait && (
        <>
          <FicheBloc titre="Si ça se tend" as={blocTitre}>{frTypo(fiche.siTendu)}</FicheBloc>
          <FicheBloc titre="À toi de jouer" as={blocTitre}>{frTypo(fiche.exercice)}</FicheBloc>
        </>
      )}
    </Card>
  );
}

function FicheBloc({ titre, as: Heading, children }: { titre: string; as: "h3" | "h4"; children: string }) {
  return (
    <div>
      <Heading className="mb-1 text-sm font-semibold text-text-primary">{titre}</Heading>
      <p className="text-sm text-text-secondary">{children}</p>
    </div>
  );
}

/** Fiche réservée : titre et contexte uniquement (le reste n'a jamais quitté le serveur). */
export function CarnetFicheLocked({ fiche, numero }: { fiche: CarnetFicheApercu; numero: number }) {
  return (
    <li className="flex items-center gap-4 rounded-lg border border-border bg-background-card p-4">
      <svg
        className="h-5 w-5 shrink-0 text-text-muted/60"
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
        <p className="font-semibold text-text-primary">{frTypo(fiche.titre)}</p>
        <p className="mt-0.5 text-sm text-text-secondary">{frTypo(fiche.contexte)}</p>
      </div>
    </li>
  );
}
