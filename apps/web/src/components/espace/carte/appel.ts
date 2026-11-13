/**
 * Appel d'une route de l'espace depuis le navigateur : JSON, jamais en cache, délai de 5 s (aucun
 * indicateur sans fin). Renvoie le corps si la réponse est 2xx, sinon null. Aucun texte n'est journalisé.
 */
export async function appelEspace<T>(url: string, methode: "GET" | "POST" | "PUT" | "DELETE", corps?: unknown): Promise<T | null> {
  const controleur = new AbortController();
  const delai = setTimeout(() => controleur.abort(), 5_000);
  try {
    const res = await fetch(url, {
      method: methode,
      headers: corps === undefined ? undefined : { "Content-Type": "application/json" },
      body: corps === undefined ? undefined : JSON.stringify(corps),
      cache: "no-store",
      signal: controleur.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(delai);
  }
}
