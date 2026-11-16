import type { ReactNode } from "react";
import { frPonctuation } from "@/lib/fr-typo";

/** Adresse brute du corps d'une lettre (jusqu'au premier blanc). */
const ADRESSE = /https?:\/\/[^\s]+/g;
/** Ponctuation de fin de phrase collée à une adresse : hors du lien. */
const PONCTUATION_FINALE = /[.,;:!?)»]+$/;
const HOTE_SITE = "deviens-marrant.fr";

type Lien = { href: string; texte: string };

/**
 * Adresse lisible d'un lien de la lettre : hôte et chemin, sans ancre. Sur le site lui-même, le lien est relatif
 * et garde l'ancre (`/parcours/repartie#etape-3`). Décision de Thomas du 16/11 : les paramètres de mesure de
 * l'e-mail (`utm_*`) sont retirés de l'adresse affichée ET du `href` (une visite depuis /lettre n'est pas une visite
 * depuis l'e-mail) ; tout autre paramètre est gardé, dans les deux. Adresse illisible : `null`, le texte reste tel quel.
 */
export function lienSansParametres(brute: string): Lien | null {
  try {
    const url = new URL(brute);
    for (const cle of Array.from(url.searchParams.keys())) if (cle.toLowerCase().startsWith("utm_")) url.searchParams.delete(cle);
    const hote = url.hostname.replace(/^www\./, "");
    const chemin = url.pathname === "/" ? "" : url.pathname;
    const texte = `${hote}${chemin}${url.search}`;
    if (hote === HOTE_SITE) return { href: `${url.pathname}${url.search}${url.hash}`, texte };
    return { href: `${url.origin}${url.pathname}${url.search}${url.hash}`, texte };
  } catch {
    return null;
  }
}

/** Fin de ligne qui empêche l'intertitre : ponctuation de phrase, guillemet ou parenthèse fermants. */
const FIN_DE_PHRASE = /[.,;:!?…»)"]$/;
/** Ligne qui porte une adresse : jamais un intertitre. */
const PORTE_UNE_ADRESSE = /https?:\/\/|www\.|deviens-marrant\.fr/i;

export type BlocLettre = { intertitre: string | null; lignes: string[] };

/**
 * v6 tour 3, point 10 : une ligne est un intertitre si elle ouvre un paragraphe de plusieurs lignes, ne finit par
 * aucune ponctuation (« La sûre », « Comment choisir ») et ne porte pas d'adresse. « Salut, », « À bientôt, », une
 * ligne qui finit par « : » ou qui porte une adresse restent du texte.
 */
export function estIntertitre(ligne: string, lignesDuParagraphe: number): boolean {
  const l = ligne.trim();
  return lignesDuParagraphe > 1 && l.length > 0 && !FIN_DE_PHRASE.test(l) && !PORTE_UNE_ADRESSE.test(l);
}

/** Découpe du corps en paragraphes (lignes vides), avec l'intertitre éventuel de chacun. Texte inchangé. */
export function decouperCorps(texte: string): BlocLettre[] {
  return texte
    .split(/\n[ \t]*\n+/)
    .map((p) => p.split("\n").filter((l) => l.trim().length > 0))
    .filter((lignes) => lignes.length > 0)
    .map((lignes) =>
      estIntertitre(lignes[0], lignes.length) ? { intertitre: lignes[0].trim(), lignes: lignes.slice(1) } : { intertitre: null, lignes },
    );
}

/** Texte d'une ligne avec ses adresses brutes rendues en liens courts (`lienSansParametres`). */
function avecLiens(texte: string, cle: string): ReactNode[] {
  const morceaux: ReactNode[] = [];
  let curseur = 0;
  for (const m of texte.matchAll(ADRESSE)) {
    const debut = m.index ?? 0;
    const finale = m[0].match(PONCTUATION_FINALE)?.[0] ?? "";
    const brute = finale ? m[0].slice(0, -finale.length) : m[0];
    const lien = lienSansParametres(brute);
    if (!lien) continue;
    morceaux.push(frPonctuation(texte.slice(curseur, debut)));
    morceaux.push(
      <a key={`${cle}-${debut}`} href={lien.href} className="text-accent-link underline underline-offset-2" data-lettre-lien="">
        {lien.texte}
      </a>,
    );
    curseur = debut + brute.length;
  }
  morceaux.push(frPonctuation(texte.slice(curseur)));
  return morceaux;
}

/**
 * v6 tour 2, point 8 (interrupteur ouvert seulement, monté par `app/(dashboard)/lettre/page.tsx`) : corps du
 * dernier numéro sur /lettre. Les adresses brutes deviennent des liens dont le texte est l'adresse sans
 * paramètres ; le reste du texte est celui de la lettre, ponctuation française comprise (`frPonctuation`,
 * appliquée au texte seul pour ne jamais toucher une adresse). `min-w-0 [overflow-wrap:anywhere]` : aucun mot
 * ni lien ne fait déborder la page à 375 px. v6 tour 3, point 10 : paragraphes séparés par de l'espace (plus de
 * `whitespace-pre-line` brut), mesure `max-w-prose`, intertitres repérés par `estIntertitre` (la carte à filet
 * qui l'entoure est posée par la page).
 */
export function LettreCorpsApercu({ texte }: { texte: string }) {
  return (
    <div className="mt-4 min-w-0 max-w-prose space-y-4 text-text-secondary [overflow-wrap:anywhere]" data-lettre-corps="">
      {decouperCorps(texte).map((bloc, i) => (
        <div key={i}>
          {bloc.intertitre && (
            <h3 className="font-semibold text-text-primary" data-lettre-intertitre="">
              {frPonctuation(bloc.intertitre)}
            </h3>
          )}
          {bloc.lignes.length > 0 && (
            <p className={bloc.intertitre ? "mt-1" : undefined}>
              {bloc.lignes.map((ligne, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {avecLiens(ligne, `${i}-${j}`)}
                </span>
              ))}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
