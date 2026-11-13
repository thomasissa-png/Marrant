import Link from "next/link";
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { TEXTES_LETTRES as T } from "@/config/textes/espace-bibliotheque";
import type { LettreArchive, LettreLue } from "@/lib/espace/lettres";
import { CARTE, LIEN } from "@/components/espace/carte/styles";

export const hrefLettre = (numero: string) => `${ESPACE_ACCUEIL}/lettres/${numero}`;

/**
 * Archive « Lettres » (s24, lot D6 ; architecture v20 2.8) : une ligne par lettre envoyée, la plus récente
 * d'abord, titrée par sa date d'envoi (« La lettre du jeudi 12 novembre ») et son objet ; aucun compteur
 * d'âge, aucun mot « ancienne » ni « archive ». Aucune lettre envoyée : rien n'est rendu sous le titre.
 */
export function ArchiveLettres({ lettres }: { lettres: readonly LettreArchive[] }) {
  if (lettres.length === 0) return null;
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
            {p}
          </p>
        ))}
      </div>
    </article>
  );
}
