import Link from "next/link";
import { TEXTES_BIBLIOTHEQUE } from "@/config/textes/espace-bibliotheque";
import type { LigneFiche } from "@/lib/espace/lignes-fiches";
import { CADRE_CARTE, LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { CompteFaits, ListeFiches, compteFaits } from "@/components/espace/liste-fiches";
import { META, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { EMOJIS_ACCUEIL } from "@/components/espace/da-espace";
import { EMOJI_CONTENU } from "@/components/home/da-site";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_BIBLIOTHEQUE);

/**
 * Un bloc de la Bibliothèque (maquette `bibliotheque.html`, `.card`) : titre de niveau 2 et contenu.
 * s26 (`docs/ux/rubriques-premium-s26.md` §2.2) : cadre des rubriques (`CADRE_CARTE_RUBRIQUE`, `p-6`), titre en
 * `TITRE_CARTE`, et à sa droite le compteur « faits/total » (chiffres seuls) quand le bloc a des lignes.
 * s26 bibliothèque liste et détail (DA du site, décision de Thomas du 20/11) : cadre à bandeau violet de l'accueil
 * (`CADRE_CARTE`), comme les tuiles de Quoi répondre ; `CADRE_CARTE_RUBRIQUE` reste neutre pour S'entraîner.
 */
export function BlocBibliotheque({
  id,
  titre,
  children,
  className,
  compte,
  emoji = EMOJIS_ACCUEIL.conseil,
}: {
  id: string;
  titre: string;
  children: React.ReactNode;
  className?: string;
  compte?: { faits: number; total: number } | null;
  /** s26 contrôle d'ensemble, abonné (C2) : émoji de l'accueil devant le titre (💡 du panneau de la Bibliothèque). */
  emoji?: string;
}) {
  return (
    <section aria-labelledby={id} className={cn(CADRE_CARTE, "min-w-0 p-6 [overflow-wrap:anywhere]", className)} data-bloc={id}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className={cn(TITRE_CARTE, "flex items-center gap-2")}>
          <span className={cn(EMOJI_CONTENU, "max-e300:hidden")} aria-hidden="true">
            {emoji}
          </span>
          <span className="min-w-0">{titre}</span>
        </h2>
        {compte && compte.total > 0 && <CompteFaits faits={compte.faits} total={compte.total} />}
      </div>
      {children}
    </section>
  );
}

/**
 * Bloc « Vannes, conseils, vidéos » (6.2) : ouvert sur les thèmes, pages publiques existantes
 * `/vannes/theme/[slug]` (aucune copie), les liens `/vannes`, `/conseils`, `/videos` (reste du D6), puis « Écouter, repérer » avec les bonus des caps 2 à 4 ouverts
 * (un bonus non ouvert n'existe pas ici : ni ligne grisée ni phrase d'attente, 5.4).
 * s26 : compteur sur les lignes « Écouter, repérer » (seule partie à faire), prochaine ligne marquée ; sans ligne, le
 * bloc ne montre que ses thèmes et ses liens (existant).
 */
export function BlocVannes({ ecouter, className }: { ecouter: readonly LigneFiche[]; className?: string }) {
  return (
    <BlocBibliotheque id="bloc-vannes" titre={T.blocVannes} emoji={EMOJIS_ACCUEIL.vanne} compte={compteFaits(ecouter)} className={className}>
      <ul aria-label={T.themesNom} className="mt-4 flex flex-wrap gap-2">
        {T.themes.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/vannes/theme/${t.slug}`}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border border-border-input px-4 transition-colors hover:border-border-hover hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                META,
                "text-text-primary",
              )}
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
      {/* Reste du D6 : le catalogue complet (la barre de l'abonné remplace les onglets du site). */}
      <ul className="mt-2 flex flex-wrap gap-x-4" data-testid="bibliotheque-catalogue">
        {T.catalogue.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className={LIEN_NEUTRE}>
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
      {ecouter.length > 0 && (
        <div className="mt-6 border-t border-border pt-6">
          <h3 id="bloc-ecouter" className={TEXTE_FORT}>
            {T.ecouter}
          </h3>
          <div className="mt-4">
            <ListeFiches lignes={ecouter} labelledBy="bloc-ecouter" marquerProchaine />
          </div>
        </div>
      )}
    </BlocBibliotheque>
  );
}
