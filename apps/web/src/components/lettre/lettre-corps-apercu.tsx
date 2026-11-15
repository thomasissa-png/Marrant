import type { ReactNode } from "react";
import { frPonctuation } from "@/lib/fr-typo";

/** Adresse brute du corps d'une lettre (jusqu'au premier blanc). */
const ADRESSE = /https?:\/\/[^\s]+/g;
/** Ponctuation de fin de phrase collée à une adresse : hors du lien. */
const PONCTUATION_FINALE = /[.,;:!?)»]+$/;
const HOTE_SITE = "deviens-marrant.fr";

type Lien = { href: string; texte: string };

/**
 * Adresse lisible d'un lien de la lettre : hôte et chemin, sans paramètres (`utm_*`) ni ancre. Sur le site
 * lui-même, le lien est relatif et garde l'ancre (`/parcours/repartie#etape-3`) mais perd les paramètres de
 * mesure de l'e-mail (une visite depuis /lettre n'est pas une visite depuis l'e-mail). Adresse illisible :
 * `null`, le texte reste tel quel.
 */
export function lienSansParametres(brute: string): Lien | null {
  try {
    const url = new URL(brute);
    const hote = url.hostname.replace(/^www\./, "");
    const chemin = url.pathname === "/" ? "" : url.pathname;
    const texte = `${hote}${chemin}`;
    if (hote === HOTE_SITE) return { href: `${url.pathname}${url.hash}`, texte };
    return { href: `${url.origin}${url.pathname}${url.hash}`, texte };
  } catch {
    return null;
  }
}

/**
 * v6 tour 2, point 8 (interrupteur ouvert seulement, monté par `app/(dashboard)/lettre/page.tsx`) : corps du
 * dernier numéro sur /lettre. Les adresses brutes deviennent des liens dont le texte est l'adresse sans
 * paramètres ; le reste du texte est celui de la lettre, ponctuation française comprise (`frPonctuation`,
 * appliquée au texte seul pour ne jamais toucher une adresse). `min-w-0 [overflow-wrap:anywhere]` : aucun mot
 * ni lien ne fait déborder la page à 375 px.
 */
export function LettreCorpsApercu({ texte }: { texte: string }) {
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
      <a key={debut} href={lien.href} className="text-accent-link underline underline-offset-2" data-lettre-lien="">
        {lien.texte}
      </a>,
    );
    curseur = debut + brute.length;
  }
  morceaux.push(frPonctuation(texte.slice(curseur)));
  return (
    <div className="mt-2 min-w-0 max-w-full whitespace-pre-line text-text-secondary [overflow-wrap:anywhere]" data-lettre-corps="">
      {morceaux}
    </div>
  );
}
