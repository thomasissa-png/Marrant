/**
 * Widget « La vanne du jour » (s22) : sélection et mise en forme, partagées
 * par l'API publique et la page d'iframe (pas d'auto-appel HTTP).
 *
 * Garde-fous (synthèse s22) : seule une vanne de la liste blanche, encore dans
 * le pool validé (barre Alexa) et hors DATING/SOIREES/COUPLE peut sortir. Rien
 * d'autre que l'amorce, la chute et l'URL de la fiche : jamais de décryptage,
 * de technique, de conseil, de vidéo ni de champ Premium.
 */
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { VALIDATED_JOKE_WHERE } from "@/lib/ai/daily-joke-pool";
import { buildJokeSlug } from "@/lib/catalogue-slug";
import { frTypo } from "@/lib/fr-typo";
import {
  DOMAINES_BLOQUES,
  WIDGET_ATTRIBUTION,
  WIDGET_CATEGORIES_EXCLUES,
  WIDGET_JOKE_IDS,
  WIDGET_LICENCE_URL,
  WIDGET_ORIGIN,
  WIDGET_UTM,
  WIDGET_UTM_CONTENT_INCONNU,
} from "@/config/widget-vanne-du-jour";

/** Type de contenu : `replique` réservé à la V1.1 (synthèse s22, point 1). */
export type WidgetType = "vanne" | "replique";

/** Vanne du jour du widget, déjà réduite aux seuls champs publiables. */
export interface WidgetVanne {
  type: WidgetType;
  /** Jour UTC, AAAA-MM-JJ (convention du site : todayUTC, /api/daily). */
  date: string;
  amorce: string;
  chute: string;
  /** Chemin de la fiche publique, sans paramètre (ex. /vannes/<slug>). */
  fichePath: string;
}

/** Réponse JSON publique : liste blanche de champs, texte brut. */
export interface WidgetApiPayload {
  type: WidgetType;
  date: string;
  amorce: string;
  chute: string;
  url: string;
  attribution: typeof WIDGET_ATTRIBUTION;
  license: string;
}

const PARIS_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * Jour de Paris (AAAA-MM-JJ). Depuis la v2 (QA m3), la rotation suit le jour
 * UTC du site ; fonction conservée pour les tests QA et les rapports.
 */
export function parisDateKey(now: Date = new Date()): string {
  return PARIS_DATE.format(now);
}

/** Jour UTC (AAAA-MM-JJ), même convention que la vanne du jour du site (todayUTC). */
export function widgetDateKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** Secondes restantes avant minuit UTC (au moins 1). */
export function secondsUntilUtcMidnight(now: Date = new Date()): number {
  const fin = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return Math.max(1, Math.ceil((fin - now.getTime()) / 1000));
}

/** Durée de cache partagé : jusqu'à minuit UTC (changement de vanne), 1 h au plus. */
export function widgetSharedMaxAge(now: Date = new Date()): number {
  return Math.min(3600, secondsUntilUtcMidnight(now));
}

/**
 * Empreinte (FNV-1a 32 bits, 8 caractères hexadécimaux) de la liste blanche et
 * des catégories exclues : toute liste modifiée change la clé du cache edge,
 * donc une vanne retirée disparaît au déploiement suivant (QA M1, revue M2).
 */
export function widgetListFingerprint(
  ids: readonly string[] = WIDGET_JOKE_IDS,
  exclues: readonly string[] = WIDGET_CATEGORIES_EXCLUES,
): string {
  let h = 0x811c9dc5;
  for (const ch of `${ids.join(",")}|${exclues.join(",")}`) {
    h ^= ch.codePointAt(0) ?? 0;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

/** Rang du jour (jours depuis le 01/01/1970) : rotation continue, sans saut au 1er janvier. */
export function dayNumber(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

/** Filtre Prisma du widget : liste blanche ∩ pool validé, catégories exclues. */
export function widgetJokeWhere(ids: readonly string[]): Prisma.JokeWhereInput {
  return {
    ...VALIDATED_JOKE_WHERE,
    id: { in: [...ids] },
    category: { notIn: [...WIDGET_CATEGORIES_EXCLUES] },
  };
}

/**
 * Vanne du jour du widget, ou `null` (liste vide, aucune vanne encore valide).
 * Choix déterministe : tri par id, rang du jour modulo la taille du pool.
 */
export async function pickWidgetVanne(
  dateKey: string,
  ids: readonly string[] = WIDGET_JOKE_IDS,
): Promise<WidgetVanne | null> {
  if (ids.length === 0) return null;
  const pool = await prisma.joke.findMany({
    where: widgetJokeWhere(ids),
    select: { id: true, content: true, punchline: true, category: true },
    orderBy: { id: "asc" },
  });
  // Double garde (le filtre SQL fait foi) : jamais une catégorie exclue.
  const eligible = pool.filter(
    (j) => !(WIDGET_CATEGORIES_EXCLUES as readonly string[]).includes(j.category),
  );
  if (eligible.length === 0) return null;
  const joke = eligible[dayNumber(dateKey) % eligible.length];
  return {
    type: "vanne",
    date: dateKey,
    amorce: frTypo(joke.content),
    chute: frTypo(joke.punchline),
    fichePath: `/vannes/${buildJokeSlug(joke)}`,
  };
}

/**
 * Cache edge (Cache API de Cloudflare, `caches.default`) de la vanne du jour,
 * clé = jour UTC + empreinte de la liste blanche : une requête base par jour
 * et par point de présence, et une liste corrigée prend effet au déploiement.
 * Hors Workers (Node, tests) : appel direct. Seul un résultat non nul est mis
 * en cache (une liste corrigée prend effet au déploiement suivant).
 */
export async function getWidgetVanneDuJour(now: Date = new Date()): Promise<WidgetVanne | null> {
  const dateKey = widgetDateKey(now);
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  if (!cache) return pickWidgetVanne(dateKey);
  // Clé = jour UTC + empreinte de la liste : WIDGET_JOKE_IDS est lu à chaque appel.
  const key = new Request(
    `${WIDGET_ORIGIN}/__cache/widget/v1/vanne-du-jour/${dateKey}/${widgetListFingerprint(WIDGET_JOKE_IDS)}`,
  );
  try {
    const hit = await cache.match(key);
    if (hit) return (await hit.json()) as WidgetVanne;
  } catch {
    // Cache illisible : on retombe sur la base.
  }
  const vanne = await pickWidgetVanne(dateKey);
  if (vanne) {
    try {
      await cache.put(
        key,
        new Response(JSON.stringify(vanne), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": `public, max-age=${secondsUntilUtcMidnight(now)}`,
          },
        }),
      );
    } catch {
      // Écriture du cache impossible : sans effet sur la réponse.
    }
  }
  return vanne;
}

/** Domaine hôte (minuscules, sans « www. ») tiré d'un Referer ou d'une Origin ; `null` si absent ou illisible. */
export function hostFromHeader(value: string | null | undefined): string | null {
  if (!value || value === "null") return null;
  try {
    // Point final du nom complet (« exemple.fr. ») retiré : il contournait le blocage (QA m2).
    const host = new URL(value).hostname.toLowerCase().replace(/\.+$/, "");
    return host ? host.replace(/^www\./, "") : null;
  } catch {
    return null;
  }
}

/** Domaine égal à une entrée de la liste ou sous-domaine de celle-ci (point final ignoré). */
export function matchesDomaine(host: string | null, liste: readonly string[]): boolean {
  if (!host) return false;
  const h = host.toLowerCase().replace(/\.+$/, "");
  return liste.some((d) => {
    const domaine = d.trim().toLowerCase().replace(/^www\./, "").replace(/\.+$/, "");
    return domaine !== "" && (h === domaine || h.endsWith(`.${domaine}`));
  });
}

/** Domaine bloqué : égal à une entrée de DOMAINES_BLOQUES ou sous-domaine de celle-ci. */
export function isDomaineBloque(host: string | null, liste: readonly string[] = DOMAINES_BLOQUES): boolean {
  return matchesDomaine(host, liste);
}

/** Nombre de vannes réellement servables (stock du widget, alerte sous 90 : revue m7). */
export async function countWidgetVannesEligibles(ids: readonly string[] = WIDGET_JOKE_IDS): Promise<number> {
  if (ids.length === 0) return 0;
  return prisma.joke.count({ where: widgetJokeWhere(ids) });
}

/** URL absolue avec les UTM du widget (`utm_content` = domaine hôte ou « inconnu »). */
export function withWidgetUtm(path: string, host: string | null): string {
  const url = new URL(path, WIDGET_ORIGIN);
  for (const [k, v] of Object.entries(WIDGET_UTM)) url.searchParams.set(k, v);
  url.searchParams.set("utm_content", host ?? WIDGET_UTM_CONTENT_INCONNU);
  return url.toString();
}

/** Charge utile publique : champs listés un par un (jamais de `select *`). */
export function toWidgetApiPayload(vanne: WidgetVanne, host: string | null): WidgetApiPayload {
  return {
    type: vanne.type,
    date: vanne.date,
    amorce: vanne.amorce,
    chute: vanne.chute,
    url: withWidgetUtm(vanne.fichePath, host),
    attribution: WIDGET_ATTRIBUTION,
    license: WIDGET_LICENCE_URL,
  };
}
