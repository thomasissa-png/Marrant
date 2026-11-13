import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { TEXTES_AUJOURDHUI as T } from "@/config/textes/espace-aujourdhui";

/**
 * « Si tu as 5 minutes » (architecture 4.4 état 2, maquette `aujourdhui.html#etat=rafale`) :
 * COQUE du lot D3, remplie par le moteur de cartes du lot D5 (jusqu'à 3 cartes : situations
 * nouvelles puis cartes à revoir ; « C'est tout pour aujourd'hui » une fois faites). Accroche
 * au-dessus du titre, le titre collé au bouton (aucun bloc entre les deux, condition du libellé 7).
 * Jamais montée le jour 1 (le premier pas est la seule action principale).
 */
export type CarteDuJour = { titre: string; href: string; nouvelle: boolean; autreContexte?: boolean };

const Chevron = () => (
  <svg className="h-4 w-4 flex-none text-text-muted" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export function CartesDuJour({ cartes: toutes, href, fini: finiMoteur }: { cartes: readonly CarteDuJour[]; href: string; fini: boolean }) {
  // Lot D11b (Q-6, @ux D-4) : une carte sans titre n'est jamais montrée, et une rafale sans carte
  // montrable (catalogue épuisé, tirage vide) rend l'état « C'est tout pour aujourd'hui », jamais un
  // bouton au sous-titre vide vers une page sans carte.
  const cartes = toutes.filter((c) => c.titre.trim() !== "");
  const fini = finiMoteur || cartes.length === 0;
  const autres = cartes.filter((c) => c.autreContexte).length;
  const nouvelles = cartes.filter((c) => c.nouvelle && !c.autreContexte).length;
  const aRevoir = cartes.filter((c) => !c.nouvelle).length;
  return (
    <section aria-labelledby="rafale-titre" className="space-y-3 rounded-lg border border-border bg-background-card p-4 md:p-6">
      <p className="text-sm text-text-secondary">{T.rafale.accroche}</p>
      <h2 id="rafale-titre" className="font-display text-xl font-bold text-text-primary">
        {T.rafale.titre}
      </h2>
      {fini ? (
        <p className="text-base font-semibold text-text-primary">{T.rafale.fini}</p>
      ) : (
        <>
          <Link href={href} className={buttonVariants({ variant: "primary", className: "h-11" })}>
            {T.rafale.bouton}
          </Link>
          <p className="text-sm text-text-secondary">{T.rafale.sousTitre(nouvelles, aRevoir, autres)}</p>
          <ul className="flex flex-col gap-2">
            {cartes.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="flex min-h-14 items-center gap-3 rounded-md border border-border bg-background-light px-3 py-2 text-text-primary hover:border-border-hover hover:bg-background-elevated"
                >
                  <span className={c.nouvelle ? "rounded-full border border-accent-link px-2 py-0.5 text-xs font-semibold text-accent-link" : "rounded-full border border-border-input px-2 py-0.5 text-xs font-semibold text-text-secondary"}>
                    {c.nouvelle ? T.rafale.nouvelle : T.rafale.aRevoir}
                  </span>
                  <span className="min-w-0 flex-1 text-sm">{c.titre}</span>
                  <Chevron />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
