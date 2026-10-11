// ───────────────────────────────────────────────────────────────────
// Carte LinkedIn en test alterné texte / image (v5 §4 et §8, mesure §7)
//
// Un post LINKEDIN marqué `[variante:image]` part avec une carte unique 4:5
// (la carte chute d'Instagram) ; le texte envoyé est l'amorce seule, mot pour
// mot, entre « » si la vanne est à la 1re personne (R6). En base, le post garde
// son texte complet (amorce puis chute, 2 lignes) : c'est exactement le texte
// du bras « texte » et celui du repli si la carte ne se rend pas.
// ───────────────────────────────────────────────────────────────────

import { amorceLinkedInEligible } from "./carrousel-piste-a";

export const VARIANTE_IMAGE = "[variante:image]";
export const VARIANTE_TEXTE = "[variante:texte]";

export interface PostLinkedIn {
  id?: string;
  platform?: string | null;
  content: string;
  threadParts: string[];
  directorNote?: string | null;
  imageUrls?: string[];
}

export interface VanneLinkedIn {
  amorce: string;
  chute: string;
  /** Texte envoyé avec la carte : 1re ligne du post (l'amorce, guillemets R6 compris). */
  texte: string;
}

/** Sans guillemets ni espaces insécables : comparaison « mot pour mot ». */
function nu(t: string): string {
  return t.replace(/[«»“”]/g, " ").replace(/[\s  ]+/g, " ").trim();
}

export function estVarianteImage(post: Pick<PostLinkedIn, "platform" | "directorNote">): boolean {
  return post.platform === "LINKEDIN" && !!post.directorNote?.includes(VARIANTE_IMAGE);
}

/**
 * Vanne d'un post LinkedIn éligible à la carte, sinon null : marqueur
 * `[variante:image]`, threadParts = [amorce, chute], texte en 2 lignes dont la
 * 1re est l'amorce mot pour mot, sans lien, amorce de 140 caractères au plus.
 */
export function vanneLinkedInImage(post: PostLinkedIn): VanneLinkedIn | null {
  if (!estVarianteImage(post) || post.threadParts.length !== 2) return null;
  const [amorce, chute] = post.threadParts.map((p) => p?.trim() ?? "");
  if (!amorce || !chute || /https?:\/\//.test(post.content)) return null;
  const lignes = post.content.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lignes.length !== 2 || nu(lignes[0]) !== nu(amorce) || nu(lignes[1]) !== nu(chute)) return null;
  if (!amorceLinkedInEligible(lignes[0])) return null;
  return { amorce, chute, texte: lignes[0] };
}

export type EnvoiLinkedIn =
  | { ok: true; texte: string; url: string; alt: string }
  | { ok: false; raison: string };

/**
 * Prépare l'envoi image d'un post `[variante:image]` : éligibilité, puis rendu
 * de la carte dans le Worker (pas d'appel à l'URL publique : self-fetch exclu).
 * Échec = { ok: false } ; l'appelant envoie alors le texte seul.
 */
export async function preparerCarteLinkedIn(
  post: PostLinkedIn & { id: string },
  baseUrl: string,
  rendre: () => Promise<{ png: Uint8Array; alt: string }>,
): Promise<EnvoiLinkedIn> {
  const v = vanneLinkedInImage(post);
  if (!v) return { ok: false, raison: "post non éligible à la carte (2 lignes amorce/chute, amorce de 140 caractères au plus, sans lien)" };
  try {
    const { png, alt } = await rendre();
    const signature = [0x89, 0x50, 0x4e, 0x47];
    if (png.length < 1000 || signature.some((o, i) => png[i] !== o)) return { ok: false, raison: `rendu invalide (${png.length} octets)` };
    const url = post.imageUrls?.[0] ?? `${baseUrl.replace(/\/$/, "")}/api/social/image?postId=${post.id}&slide=0`;
    return { ok: true, texte: v.texte, url, alt };
  } catch (err) {
    return { ok: false, raison: `rendu en échec (${err instanceof Error ? err.message : String(err)})`.slice(0, 200) };
  }
}

/** directorNote après un repli : le bras devient « texte » (mesure §7), la cause est consignée. */
export function noteRepliTexte(note: string | null, raison: string): string {
  const base = (note ?? "").split(VARIANTE_IMAGE).join(VARIANTE_TEXTE);
  return `${base.includes(VARIANTE_TEXTE) ? base : `${VARIANTE_TEXTE} ${base}`.trim()} Repli texte seul (prévu avec carte) : ${raison}.`.trim();
}
