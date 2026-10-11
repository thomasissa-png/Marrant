/**
 * Garde des relais d'article (s15, plan v2 §6, §7 et R3) : un post qui relaie un
 * article n'est remis à Buffer que si l'article est visible au moment de l'envoi
 * (même règle que la page /blog/<slug> : `findBlogArticle`, publié et date échue).
 * Sinon le relais passe en REJECTED et son REPLI part à sa place, sur le même
 * créneau : une vanne du même thème, sans lien, préparée et relue avec le lot
 * (ligne SocialPost en réserve, statut REJECTED, marqueur `[repli-de:<id>]`).
 * Même créneau = jamais un dimanche ni un jour déjà occupé (c'est celui du relais).
 * Sans repli en réserve : le relais est REJECTED, le créneau reste vide. Alerte
 * dans les deux cas, par réseau.
 *
 * Marqueurs posés par le script de lot dans `directorNote` (aucune migration) :
 *  - `[article:<slug>]` : slug relayé (seul moyen pour un relais Instagram, sans lien) ;
 *    à défaut, lien `/blog/<slug>` du texte ou du 1er commentaire LinkedIn (`cta`) ;
 *  - `[repli:<id>]` : post de repli en réserve ;
 *  - `[date:AAAA-MM-JJ]` : post daté (pivot, saison), jamais rattrapé à la reprise.
 */
const MARQUEUR_ARTICLE = /\[article:([a-z0-9-]+)\]/;
const MARQUEUR_REPLI = /\[repli:([a-z0-9]+)\]/;
const MARQUEUR_DATE = /\[date:\d{4}-\d{2}-\d{2}\]/;
// `[variante:texte|image]` et `[heure:A|B]` (tests alternés, mesure §7) survivent aussi
// aux relances et aux échecs définitifs (compteur par bras).
const MARQUEURS = /\[(?:article|repli|date|variante|heure):[^\]\s]+\]/g;
const LIEN_BLOG = /\/blog\/([a-z0-9-]+)/;

/** Note d'un repli en réserve : `[repli-de:<id du relais>]`. */
export const PREFIXE_REPLI_DE = "[repli-de:";

export interface PostRelais {
  content: string;
  cta: string | null;
  directorNote: string | null;
}

export function articleSlugDuPost(post: PostRelais): string | null {
  return post.directorNote?.match(MARQUEUR_ARTICLE)?.[1]
    ?? post.content.match(LIEN_BLOG)?.[1]
    ?? post.cta?.match(LIEN_BLOG)?.[1]
    ?? null;
}

export function repliDuPost(note: string | null): string | null {
  return note?.match(MARQUEUR_REPLI)?.[1] ?? null;
}

/** Post daté (pivot, saison) ou relais : jamais reprogrammé à la reprise (plan v2 §7, §8). */
export function estDateOuRelais(post: PostRelais): boolean {
  return (!!post.directorNote && MARQUEUR_DATE.test(post.directorNote)) || articleSlugDuPost(post) !== null;
}

/** Note conservée lors d'un échec temporaire : les marqueurs survivent à la note de relance. */
export function conserverMarqueurs(ancienne: string | null, nouvelle: string): string {
  const marques = ancienne?.match(MARQUEURS) ?? [];
  return marques.length ? `${marques.join(" ")} ${nouvelle}` : nouvelle;
}

/** Note du relais rejeté (article non visible). */
export function noteRelaisRejete(slug: string, repliId: string | null, note: string | null): string {
  const motif = repliId ? `repli ${repliId} envoyé sur le même créneau` : "aucun repli en réserve, créneau vide";
  return `Relais rejeté : article « ${slug} » non publié à l'heure de l'envoi (${motif}).${note ? ` ${note}` : ""}`;
}

/** Le repli est-il bien celui du relais, encore en réserve ? */
export function repliValide(repli: { status: string; platform: string; directorNote: string | null } | null, relais: { id: string; platform: string }): boolean {
  return !!repli && repli.status === "REJECTED" && repli.platform === relais.platform
    && !!repli.directorNote?.startsWith(`${PREFIXE_REPLI_DE}${relais.id}]`);
}
