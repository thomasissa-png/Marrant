import Link from "next/link";
import { INDEX_ESPACE } from "@/components/espace/rubriques";
import { TEXTES_ESPACE_NAVIGATION as N } from "@/config/textes/espace-navigation";

/**
 * Carte « Dans ton espace » de « Aujourd'hui » (v5 §3 et §4.2) : l'index de « Mon espace », une ligne
 * de 44 px par rubrique (libellé et chevron), une colonne, dans l'ordre de `INDEX_ESPACE`. Ni bouton
 * plein ni fond par ligne : la carte du jour reste l'action la plus visible (critère 14). Colonne 2 de la
 * grille, `min-w-0`.
 */
const Chevron = () => (
  <svg className="h-4 w-4 flex-none text-text-muted" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export function DansTonEspace() {
  return (
    <section aria-labelledby="index-titre" className="min-w-0 rounded-lg border border-border bg-background-card p-4 md:p-6" data-index-espace>
      <h2 id="index-titre" className="font-display text-xl font-bold text-text-primary">
        {N.index.titre}
      </h2>
      <ul className="mt-3 divide-y divide-border">
        {INDEX_ESPACE.map((e) => (
          <li key={e.cle}>
            <Link
              href={e.href}
              className="-mx-2 flex min-h-11 items-center justify-between gap-3 rounded-md px-2 text-sm font-medium text-text-primary transition-colors hover:text-accent-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            >
              {e.label}
              <Chevron />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
