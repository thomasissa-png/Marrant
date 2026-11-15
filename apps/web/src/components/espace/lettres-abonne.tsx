import { prisma } from "@/lib/prisma";
import { listerLettres } from "@/lib/espace/lettres";
import { compterAnonyme } from "@/lib/espace/compteurs";
import { TEXTES_LETTRES } from "@/config/textes/espace-bibliotheque";
import { ArchiveLettres } from "@/components/espace/archive-lettres";
import { PageHeader } from "@/components/layout/page-header";
import { COLONNE_LECTURE } from "@/components/layout/gabarit";
import { frEspaceProfond } from "@/lib/fr-typo";

const T = frEspaceProfond(TEXTES_LETTRES);

/**
 * « La lettre » vue par l'abonné actif, à `/lettre` (décision de Thomas du 14/11 : une seule section pour tous ; le
 * visiteur et le compte gratuit y gardent l'inscription). C'est l'archive de toutes les lettres envoyées qui vivait
 * à `/mon-espace/lettres` (cette adresse renvoie ici, 308) : même titre, même liste, même état vide, même compteur
 * anonyme `ouverture` / `archive-lettres` (awaité avant le rendu). Page de premier niveau (navigation v6, décision
 * du 15/11) : ni fil d'Ariane ni « Retour : Mon espace », la bande des rubriques allume « La lettre ». Gabarit B ;
 * sans lettre, colonne de lecture (titre et état vide ensemble). Rendu serveur, appelé seulement par
 * `app/(dashboard)/lettre/page.tsx`, interrupteur ouvert, pour un abonné actif.
 */
export async function LettresAbonne() {
  const lettres = await listerLettres(prisma);
  await compterAnonyme({ cle: "ouverture", valeur: "archive-lettres" });
  return (
    <div className={lettres.length === 0 ? COLONNE_LECTURE : undefined} data-lettres-abonne>
      <PageHeader title={T.titre} />
      <ArchiveLettres lettres={lettres} />
    </div>
  );
}
