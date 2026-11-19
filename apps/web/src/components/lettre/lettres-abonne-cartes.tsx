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
/** s26 finitions (relectures tour 3, design point 1, UX critère 2) : contenu à gauche, chevron à droite, centré en hauteur. */
const LIGNE_CHEVRON = "flex-row items-center justify-between gap-4";

/** Signe d'action de la carte (aucun texte, le titre reste le nom du lien). */
function Chevron() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

/**
 * « La lettre » vue par l'abonné actif à `/lettre` (décision de Thomas du 14/11) : même lecture, même compteur anonyme
 * et même état vide que l'ex-`LettresAbonne` ; H1 « La lettre » (libellé validé de la bande, `TEXTES_LETTRE.menu`).
 * s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §3.2, design §6.2) : titre à gauche avec le nombre de
 * lettres (chiffre seul, aucun état « lue » n'existe : pas de « lues / envoyées ») ; la dernière lettre en tuile pleine
 * largeur (prochaine action), les précédentes en cartes neutres 3/2/1 colonnes. Pas de bouton « Lire » (aucune
 * constante) : la carte entière est le lien, aucun aplat. Nouvel abonné : l'état vide existant (8/4 : texte, rail vers Aujourd'hui).
 * Rendu serveur, appelé seulement par `app/(dashboard)/lettre/page.tsx`, interrupteur ouvert, pour un abonné actif.
 */
export async function LettresAbonneCartes() {
  const lettres = await listerLettres(prisma);
  await compterAnonyme({ cle: "ouverture", valeur: "archive-lettres" });
  const [derniere, ...precedentes] = lettres;
  return (
    <div className="pb-16" data-lettres-abonne>
      {/* s26 tour 2 (L3) : le nombre suit le titre (au tour 1, 1 089 px d'écart à 1280 : il se lisait comme un résidu). */}
      <header className="flex flex-wrap items-baseline justify-start gap-4">
        <h1 className={TITRE_PAGE}>{TEXTES_LETTRE.menu}</h1>
        {lettres.length > 0 && (
          <p className={cn("tabular-nums", META)} data-compteur-lettres>
            {lettres.length}
          </p>
        )}
      </header>
      {!derniere ? (
        // s26 : l'état vide porte sa grille 8/4 (texte, rail vers Aujourd'hui) ; voir `ArchiveLettres`.
        <div className="mt-8">
          <ArchiveLettres lettres={lettres} />
        </div>
      ) : (
        <>
          <div className={cn(CARTE_ACTION, "relative mt-8", LIGNE_CHEVRON, ANNEAU)} data-lettre-derniere={derniere.numero}>
            <div className="min-w-0">
              <h2 className={TITRE_CARTE}>
                <Link href={hrefLettre(derniere.numero)} data-lettre={derniere.numero} className={LIEN_ETIRE}>
                  {frTypo(derniere.titre)}
                </Link>
              </h2>
              <p className={cn("mt-2", TEXTE)}>{frTypo(derniere.objet)}</p>
            </div>
            <Chevron />
          </div>
          {precedentes.length > 0 && (
            <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {precedentes.map((l) => (
                <li key={l.numero} className={cn(CADRE_CARTE_NEUTRE, "flex min-h-11 p-6 transition-colors hover:border-border-hover [overflow-wrap:anywhere]", LIGNE_CHEVRON, ANNEAU)}>
                  <div className="min-w-0">
                    <Link href={hrefLettre(l.numero)} data-lettre={l.numero} className={cn(TEXTE_FORT, LIEN_ETIRE)}>
                      {frTypo(l.titre)}
                    </Link>
                    <p className={cn("mt-2", META)}>{frTypo(l.objet)}</p>
                  </div>
                  <Chevron />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
