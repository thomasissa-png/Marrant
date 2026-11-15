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

const CARTE_LETTRE = cn(
  "flex h-full min-h-14 flex-col justify-center gap-0.5 border border-border bg-background-card p-4 transition-colors hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link [overflow-wrap:anywhere]",
  CARTE_A_FILET,
);

/**
 * « La lettre » vue par l'abonné actif à `/lettre` (décision de Thomas du 14/11), v6 tour 1, point 10 : même
 * lecture, même compteur anonyme et même état vide que l'ex-`LettresAbonne` (retiré à l'intégration), mais le H1 reprend le libellé
 * validé de la bande (« La lettre », `TEXTES_LETTRE.menu`) et chaque lettre envoyée est une carte à filet de
 * l'accueil (grille dès 768 px). Rendu serveur, appelé seulement par `app/(dashboard)/lettre/page.tsx`,
 * interrupteur ouvert, pour un abonné actif.
 */
export async function LettresAbonneCartes() {
  const lettres = await listerLettres(prisma);
  await compterAnonyme({ cle: "ouverture", valeur: "archive-lettres" });
  return (
    <div className={lettres.length === 0 ? COLONNE_LECTURE : undefined} data-lettres-abonne>
      <PageHeader title={TEXTES_LETTRE.menu} />
      {lettres.length === 0 ? (
        <ArchiveLettres lettres={lettres} />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lettres.map((l) => (
            <li key={l.numero}>
              <Link href={hrefLettre(l.numero)} data-lettre={l.numero} className={CARTE_LETTRE}>
                <FiletCarte />
                <span className="text-sm font-semibold text-text-primary">{l.titre}</span>
                <span className="text-sm text-text-secondary">{l.objet}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
