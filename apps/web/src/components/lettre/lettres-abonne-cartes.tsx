import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { listerLettres } from "@/lib/espace/lettres";
import { compterAnonyme } from "@/lib/espace/compteurs";
import { ArchiveLettres, hrefLettre } from "@/components/espace/archive-lettres";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { CARTE_ACTION } from "@/components/espace/aujourdhui/tableau";
import { META, TEXTE, TEXTE_FORT, TITRE_CARTE, TITRE_PAGE } from "@/components/espace/typo";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { cn } from "@/lib/utils";
import { frTypo } from "@/lib/fr-typo";

/** Lien couvrant toute la carte (pseudo-élément) : une seule cible, le titre reste le nom accessible. */
const LIEN_ETIRE = "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none";
const ANNEAU = "focus-within:ring-2 focus-within:ring-accent-link";

/**
 * « La lettre » vue par l'abonné actif à `/lettre` (décision de Thomas du 14/11) : même lecture, même compteur anonyme
 * et même état vide que l'ex-`LettresAbonne` ; H1 « La lettre » (libellé validé de la bande, `TEXTES_LETTRE.menu`).
 * s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §3.2, design §6.2) : titre à gauche avec le nombre de
 * lettres (chiffre seul, aucun état « lue » n'existe : pas de « lues / envoyées ») ; la dernière lettre en tuile pleine
 * largeur (prochaine action), les précédentes en cartes neutres 3/2/1 colonnes. Pas de bouton « Lire » (aucune
 * constante) : la carte entière est le lien, aucun aplat. Nouvel abonné : l'état vide existant (8 colonnes).
 * Rendu serveur, appelé seulement par `app/(dashboard)/lettre/page.tsx`, interrupteur ouvert, pour un abonné actif.
 */
export async function LettresAbonneCartes() {
  const lettres = await listerLettres(prisma);
  await compterAnonyme({ cle: "ouverture", valeur: "archive-lettres" });
  const [derniere, ...precedentes] = lettres;
  return (
    <div className="pb-16" data-lettres-abonne>
      <header className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className={TITRE_PAGE}>{TEXTES_LETTRE.menu}</h1>
        {lettres.length > 0 && (
          <p className={cn("tabular-nums", META)} data-compteur-lettres>
            {lettres.length}
          </p>
        )}
      </header>
      {!derniere ? (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ArchiveLettres lettres={lettres} />
          </div>
        </div>
      ) : (
        <>
          <div className={cn(CARTE_ACTION, "relative mt-8", ANNEAU)} data-lettre-derniere={derniere.numero}>
            <h2 className={TITRE_CARTE}>
              <Link href={hrefLettre(derniere.numero)} data-lettre={derniere.numero} className={LIEN_ETIRE}>
                {frTypo(derniere.titre)}
              </Link>
            </h2>
            <p className={cn("mt-2", TEXTE)}>{frTypo(derniere.objet)}</p>
          </div>
          {precedentes.length > 0 && (
            <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {precedentes.map((l) => (
                <li key={l.numero} className={cn(CADRE_CARTE_NEUTRE, "min-h-11 p-6 transition-colors hover:border-border-hover [overflow-wrap:anywhere]", ANNEAU)}>
                  <Link href={hrefLettre(l.numero)} data-lettre={l.numero} className={cn(TEXTE_FORT, LIEN_ETIRE)}>
                    {frTypo(l.titre)}
                  </Link>
                  <p className={cn("mt-2", META)}>{frTypo(l.objet)}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
