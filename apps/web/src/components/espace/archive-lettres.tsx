import Link from "next/link";
import { LienRetour } from "@/components/espace/lien-retour";
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { TEXTES_LETTRES } from "@/config/textes/espace-bibliotheque";
import type { LettreArchive, LettreLue } from "@/lib/espace/lettres";
import { BOUTON_SECONDAIRE, CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { META, TEXTE, TEXTE_FORT, TITRE_PAGE } from "@/components/espace/typo";
import { frEspaceProfond, frTypo } from "@/lib/fr-typo";
import { lienSansParametres } from "@/components/lettre/lettre-corps-apercu";
import { cn } from "@/lib/utils";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_LETTRES);

export const hrefLettre = (numero: string) => `${ESPACE_ACCUEIL}/lettres/${numero}`;

/**
 * Archive « Lettres » (s24, lot D6 ; architecture v20 2.8) : une ligne par lettre envoyée, la plus récente
 * d'abord, titrée par sa date d'envoi (« La lettre du jeudi 12 novembre ») et son objet ; aucun compteur
 * d'âge, aucun mot « ancienne » ni « archive ». Aucune lettre envoyée (reste du D6) : une ligne, sans
 * reproche ni date promise, et une sortie vers « Aujourd'hui » ; état statique, sans `role="status"`.
 * s26 (design `questions-repliques-lettre-profil-s26.md` §6.2) : état vide en cadre neutre (plus de filet violet).
 */
export function ArchiveLettres({ lettres }: { lettres: readonly LettreArchive[] }) {
  if (lettres.length === 0) {
    return (
      // v6 tour 1 : carte à filet de l'accueil (`CARTE` repose sur `CADRE_CARTE` depuis le lot 1 : `rounded-xl`, filet).
      <div className={cn(CADRE_CARTE_NEUTRE, "flex flex-col items-start gap-4 p-6")} data-testid="lettres-vide">
        <p className={TEXTE}>{T.vide}</p>
        {/* Relecture des captures nav s24, tour 2 (reviewer P11) : même sortie qu'un état vide de Mes répliques (bouton). */}
        <Link href={ESPACE_ACCUEIL} className={BOUTON_SECONDAIRE}>
          {T.allerAujourdhui}
        </Link>
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {lettres.map((l) => (
        <li key={l.numero}>
          <Link
            href={hrefLettre(l.numero)}
            data-lettre={l.numero}
            className="flex min-h-14 flex-col justify-center gap-0.5 rounded-md border border-border bg-background-light px-3 py-2 transition-colors hover:border-border-hover hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link [overflow-wrap:anywhere]"
          >
            <span className="text-sm font-semibold text-text-primary">{l.titre}</span>
            <span className="text-sm text-text-secondary">{l.objet}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Lot D11b (revue @design D9) : une adresse du texte approuvé devient un lien cliquable ; ponctuation finale laissée
 * hors du lien. s26 (`docs/design/questions-repliques-lettre-profil-s26.md` §6.3, décision de Thomas du 16/11 déjà
 * appliquée à /lettre) : paramètres `utm_*` retirés de l'adresse affichée ET du lien (`lienSansParametres`, même
 * règle que le dernier numéro de /lettre) ; adresse illisible : le texte tel quel.
 */
function avecLiens(texte: string): React.ReactNode[] {
  return texte.split(/(https?:\/\/[^\s]+[^\s.,;:!?»)])/).map((morceau, i) => {
    if (i % 2 === 0) return morceau;
    const lien = lienSansParametres(morceau);
    return (
      <a
        key={i}
        href={lien?.href ?? morceau}
        className="text-text-primary underline underline-offset-2 [overflow-wrap:anywhere] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      >
        {lien?.texte ?? morceau}
      </a>
    );
  });
}

/** Lettre voisine dans le rail (précédente ou suivante) : son titre daté, cible de 44 px. */
function Voisine({ lettre }: { lettre: LettreArchive }) {
  return (
    <Link
      href={hrefLettre(lettre.numero)}
      className="flex min-h-11 flex-col justify-center gap-1 py-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary [overflow-wrap:anywhere]"
      data-lettre-voisine={lettre.numero}
    >
      <span className={TEXTE_FORT}>{frTypo(lettre.titre)}</span>
      <span className={META}>{frTypo(lettre.objet)}</span>
    </Link>
  );
}

/**
 * Une lettre telle qu'envoyée : sa date, son objet, son texte (paragraphes du texte approuvé).
 * s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §3.3, design §6.3) : colonne de lecture gardée (8 colonnes,
 * 760 px au plus) mais encadrée par un rail de 4 colonnes collant (`lg:top-36`) : les lettres précédente et suivante
 * (plus récente d'abord dans l'archive : la précédente est la plus ancienne). Sous 1024, le rail passe sous la lettre.
 * Liens du corps neutres (soulignés, plus de violet) et sans `utm_*` (texte approuvé, aucun paramètre ajouté).
 */
export function LettreVue({
  lettre,
  precedente = null,
  suivante = null,
}: {
  lettre: LettreLue;
  precedente?: LettreArchive | null;
  suivante?: LettreArchive | null;
}) {
  return (
    <div className="pb-16">
      <header>
        {/* Décision de Thomas du 14/11 : la liste des lettres est à `/lettre` (une seule section pour tous). */}
        <LienRetour href="/lettre" label={T.titre} />
        <h1 id="lettre-titre" className={cn("[overflow-wrap:anywhere]", TITRE_PAGE)}>
          {lettre.objet}
        </h1>
        <p className={cn("mt-2", META)}>{lettre.titre}</p>
      </header>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:items-start">
        <article
          aria-labelledby="lettre-titre"
          className={cn(CADRE_CARTE_NEUTRE, "min-w-0 space-y-4 p-6 [overflow-wrap:anywhere] md:col-span-2 lg:col-span-8 lg:max-w-[47.5rem]")}
          data-lettre-vue
        >
          {lettre.corps.split(/\n{2,}/).map((p, i) => (
            <p key={i} className={cn("whitespace-pre-line", TEXTE)}>
              {avecLiens(p)}
            </p>
          ))}
        </article>
        {(precedente || suivante) && (
          <nav
            aria-label={T.titre}
            className={cn(CADRE_CARTE_NEUTRE, "min-w-0 divide-y divide-border p-6 md:col-span-2 lg:sticky lg:top-36 lg:col-span-4 lg:self-start")}
            data-lettre-rail
          >
            {precedente && <Voisine lettre={precedente} />}
            {suivante && <Voisine lettre={suivante} />}
          </nav>
        )}
      </div>
    </div>
  );
}
