import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { listerLettres } from "@/lib/espace/lettres";
import { compterAnonyme } from "@/lib/espace/compteurs";
import { ArchiveLettres, hrefLettre } from "@/components/espace/archive-lettres";
import { PageHeader } from "@/components/layout/page-header";
import { COLONNE_LECTURE } from "@/components/layout/gabarit";
import { CARTE_A_FILET, FiletCarte } from "@/components/ui/card";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { cn } from "@/lib/utils";

// v6 tour 3, point 11 : signal de clic (chevron à droite, filet de bord violet au survol, anneau au focus).
const CARTE_LETTRE = cn(
  "group flex h-full min-h-14 items-center gap-3 border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link [overflow-wrap:anywhere]",
  CARTE_A_FILET,
);

function Chevron() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-accent-link"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      data-lettre-chevron=""
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

/**
 * « La lettre » vue par l'abonné actif à `/lettre` (décision de Thomas du 14/11), v6 tour 1, point 10 : même
 * lecture, même compteur anonyme et même état vide que l'ex-`LettresAbonne` (retiré à l'intégration), mais le H1 reprend le libellé
 * validé de la bande (« La lettre », `TEXTES_LETTRE.menu`) et chaque lettre envoyée est une carte à filet de
 * l'accueil. v6 tour 2, point 9 : une colonne centrée `max-w-3xl` à toutes les largeurs (plus de tiers droit
 * vide à 1280 et plus), H1 centré comme l'accueil, cartes deux par ligne dès 640 px. v6 tour 3, point 11 : plus de
 * hauteur minimale (`min-h-[60vh]` créait le vide avant le pied de page), chevron et survol sur chaque carte. Rendu serveur, appelé seulement par `app/(dashboard)/lettre/page.tsx`,
 * interrupteur ouvert, pour un abonné actif.
 */
export async function LettresAbonneCartes() {
  const lettres = await listerLettres(prisma);
  await compterAnonyme({ cle: "ouverture", valeur: "archive-lettres" });
  return (
    <div className={COLONNE_LECTURE} data-lettres-abonne>
      <div className="text-center">
        <PageHeader title={TEXTES_LETTRE.menu} />
      </div>
      {lettres.length === 0 ? (
        <ArchiveLettres lettres={lettres} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {lettres.map((l) => (
            <li key={l.numero}>
              <Link href={hrefLettre(l.numero)} data-lettre={l.numero} className={CARTE_LETTRE}>
                <FiletCarte />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-text-primary">{l.titre}</span>
                  <span className="text-sm text-text-secondary">{l.objet}</span>
                </span>
                <Chevron />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
