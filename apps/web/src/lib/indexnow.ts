/**
 * Soumission IndexNow (Bing, Yandex, Naver, Seznam) : source unique.
 *
 * Utilisé par la route POST /api/indexnow, le cron weekly-seo et la
 * publication programmée des articles (prepared-content). Appel direct à
 * api.indexnow.org, jamais de self-fetch vers le site.
 *
 * Clé lue à l'appel (pas au chargement du module : sous Workers, l'env est
 * injecté par requête). Placeholder ou format invalide → soumission ignorée.
 */
export const INDEXNOW_HOST = "deviens-marrant.fr";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_TIMEOUT_MS = 5_000;

/** Spécification IndexNow : 8 à 128 caractères [a-zA-Z0-9-]. */
export function getIndexNowKey(): string | null {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) return null;
  return key;
}

export function toAbsoluteSiteUrl(url: string): string {
  return url.startsWith("http") ? url : `https://${INDEXNOW_HOST}${url.startsWith("/") ? "" : "/"}${url}`;
}

export type IndexNowResult =
  | { ok: true; status: number; submitted: number }
  | { ok: false; reason: "missing-key" | "no-urls" | "error"; status?: number; message?: string };

export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  const key = getIndexNowKey();
  if (!key) {
    console.warn("[IndexNow] INDEXNOW_KEY absente ou invalide : soumission ignorée.");
    return { ok: false, reason: "missing-key" };
  }
  const urlList = Array.from(new Set(urls.map(toAbsoluteSiteUrl)));
  if (urlList.length === 0) return { ok: false, reason: "no-urls" };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key,
        keyLocation: `https://${INDEXNOW_HOST}/indexnow-key.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(INDEXNOW_TIMEOUT_MS),
      cache: "no-store",
    });
    // 200 et 202 = acceptés (202 : clé en cours de vérification).
    if (response.status === 200 || response.status === 202) {
      console.log(`[IndexNow] ${urlList.length} URL soumise(s) (status ${response.status}).`);
      return { ok: true, status: response.status, submitted: urlList.length };
    }
    const message = (await response.text().catch(() => "")).slice(0, 300);
    console.warn(`[IndexNow] Refus (status ${response.status}) : ${message}`);
    return { ok: false, reason: "error", status: response.status, message };
  } catch (err) {
    console.warn("[IndexNow] Erreur (non bloquante) :", err);
    return { ok: false, reason: "error", message: err instanceof Error ? err.message : String(err) };
  }
}
