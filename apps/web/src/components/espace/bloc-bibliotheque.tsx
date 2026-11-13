import Link from "next/link";
import { TEXTES_BIBLIOTHEQUE as T } from "@/config/textes/espace-bibliotheque";
import type { LigneFiche } from "@/lib/espace/lignes-fiches";
import { CARTE } from "@/components/espace/carte/styles";
import { ListeFiches } from "@/components/espace/liste-fiches";

/** Un bloc de la Bibliothèque (maquette `bibliotheque.html`, `.card`) : titre de niveau 2 et contenu. */
export function BlocBibliotheque({ id, titre, children }: { id: string; titre: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className={CARTE}>
      <h2 id={id} className="font-display text-xl font-bold text-text-primary">
        {titre}
      </h2>
      {children}
    </section>
  );
}

/**
 * Bloc « Vannes, conseils, vidéos » (6.2) : ouvert sur les thèmes, pages publiques existantes
 * `/vannes/theme/[slug]` (aucune copie), puis « Écouter, repérer » avec les bonus des caps 2 à 4 ouverts
 * (un bonus non ouvert n'existe pas ici : ni ligne grisée ni phrase d'attente, 5.4).
 */
export function BlocVannes({ ecouter }: { ecouter: readonly LigneFiche[] }) {
  return (
    <BlocBibliotheque id="bloc-vannes" titre={T.blocVannes}>
      <ul aria-label={T.themesNom} className="flex flex-wrap gap-2">
        {T.themes.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/vannes/theme/${t.slug}`}
              className="inline-flex min-h-11 items-center rounded-full border border-border-input px-4 text-sm font-medium text-text-primary transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
      {ecouter.length > 0 && (
        <>
          <h3 id="bloc-ecouter" className="text-base font-semibold text-text-primary">
            {T.ecouter}
          </h3>
          <ListeFiches lignes={ecouter} labelledBy="bloc-ecouter" />
        </>
      )}
    </BlocBibliotheque>
  );
}
