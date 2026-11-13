import Link from "next/link";
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { TEXTES_LETTRES as T } from "@/config/textes/espace-bibliotheque";
import type { LettreArchive, LettreLue } from "@/lib/espace/lettres";
import { CARTE, LIEN } from "@/components/espace/carte/styles";

export const hrefLettre = (numero: string) => `${ESPACE_ACCUEIL}/lettres/${numero}`;

/**
 * Archive « Lettres » (s24, lot D6 ; architecture v20 2.8) : une ligne par lettre envoyée, la plus récente
 * d'abord, titrée par sa date d'envoi (« La lettre du jeudi 12 novembre ») et son objet ; aucun compteur
 * d'âge, aucun mot « ancienne » ni « archive ». Aucune lettre envoyée (reste du D6) : une ligne, sans
 * reproche ni date promise, et une sortie vers « Aujourd'hui » ; état statique, sans `role="status"`.
 */
export function ArchiveLettres({ lettres }: { lettres: readonly LettreArchive[] }) {
  if (lettres.length === 0) {
    return (
      <div className={`${CARTE} flex flex-col items-start gap-2`} data-testid="lettres-vide">
        <p className="text-base text-text-primary">{T.vide}</p>
        <Link href={ESPACE_ACCUEIL} className={LIEN}>
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
 * Lot D11b (revue @design D9) : une adresse du texte approuvé devient un lien cliquable (même texte affiché,
 * rien de réécrit) ; ponctuation finale laissée hors du lien.
 */
function avecLiens(texte: string): React.ReactNode[] {
  return texte.split(/(https?:\/\/[^\s]+[^\s.,;:!?»)])/).map((morceau, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={morceau}
        className="text-accent-link underline underline-offset-2 [overflow-wrap:anywhere] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      >
        {morceau}
      </a>
    ) : (
      morceau
    ),
  );
}

/** Une lettre telle qu'envoyée : sa date, son objet, son texte (paragraphes du texte approuvé). */
export function LettreVue({ lettre }: { lettre: LettreLue }) {
  return (
    <article aria-labelledby="lettre-titre" className="flex flex-col gap-4">
      <Link href={`${ESPACE_ACCUEIL}/lettres`} className={`${LIEN} self-start`}>
        {T.titre}
      </Link>
      <p className="text-sm text-text-secondary">{lettre.titre}</p>
      <h1 id="lettre-titre" className="font-display text-2xl font-bold text-text-primary [overflow-wrap:anywhere] md:text-3xl">
        {lettre.objet}
      </h1>
      <div className={CARTE}>
        {lettre.corps.split(/\n{2,}/).map((p, i) => (
          <p key={i} className="whitespace-pre-line text-base leading-7 text-text-primary">
            {avecLiens(p)}
          </p>
        ))}
      </div>
    </article>
  );
}
