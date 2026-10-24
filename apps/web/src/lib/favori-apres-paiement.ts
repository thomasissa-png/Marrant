/**
 * Favori après paiement (trajet de conversion s21, tour 2, arbitrage 1).
 *
 * Le clic sur l'étoile d'un visiteur ou d'un compte gratuit ouvre la fenêtre Premium ; l'élément
 * cliqué est mémorisé DANS `returnTo` (`/vannes?favori=JOKE.<id>`). `returnTo` voyage déjà, validé
 * à chaque étape, de la fenêtre à /register (callback), /abonnement (`auto=1`), Stripe
 * (`success_url`), puis /abonnement/success : rien à stocker ailleurs, rien de perdu par Google ou
 * par un changement d'onglet. Au retour d'un paiement VÉRIFIÉ (plan Premium), /abonnement/success
 * ajoute le favori (POST /api/favorites, qui exige Premium) puis retire le paramètre de la
 * destination. Un doublon (409) compte comme ajouté.
 */
export type ContenuFavori = "JOKE" | "TIP" | "VIDEO";

export interface FavoriEnAttente {
  contentType: ContenuFavori;
  contentId: string;
}

export const FAVORI_PARAM = "favori";

const VALEUR = /^(JOKE|TIP|VIDEO)\.([A-Za-z0-9_-]{1,64})$/;

/** `JOKE.<id>` ; `null` si l'identifiant n'a pas la forme attendue (rien n'est mémorisé). */
export function encoderFavori(f: FavoriEnAttente): string | null {
  const valeur = `${f.contentType}.${f.contentId}`;
  return VALEUR.test(valeur) ? valeur : null;
}

export function lireFavori(raw: string | null | undefined): FavoriEnAttente | null {
  const m = typeof raw === "string" ? VALEUR.exec(raw) : null;
  return m ? { contentType: m[1] as ContenuFavori, contentId: m[2] } : null;
}

function separer(chemin: string): { path: string; params: URLSearchParams; hash: string } {
  const [avantHash, ...resteHash] = chemin.split("#");
  const [path, query = ""] = avantHash.split("?");
  return { path, params: new URLSearchParams(query), hash: resteHash.length ? `#${resteHash.join("#")}` : "" };
}

function recoller(path: string, params: URLSearchParams, hash: string): string {
  const q = params.toString();
  return `${path}${q ? `?${q}` : ""}${hash}`;
}

/** Ajoute (ou remplace) le favori à mémoriser dans un chemin interne (la page à retrouver). */
export function avecFavori(chemin: string, f: FavoriEnAttente): string {
  const valeur = encoderFavori(f);
  if (!valeur) return chemin;
  const { path, params, hash } = separer(chemin);
  params.set(FAVORI_PARAM, valeur);
  return recoller(path, params, hash);
}

/** Lit le favori mémorisé dans un chemin interne et rend le chemin sans lui. */
export function extraireFavori(chemin: string): { favori: FavoriEnAttente | null; chemin: string } {
  const { path, params, hash } = separer(chemin);
  const favori = lireFavori(params.get(FAVORI_PARAM));
  if (!params.has(FAVORI_PARAM)) return { favori: null, chemin };
  params.delete(FAVORI_PARAM);
  return { favori, chemin: recoller(path, params, hash) };
}

/** Lit le favori mémorisé dans le `returnTo` d'un callback (`/abonnement?returnTo=…`), pour /register. */
export function favoriDepuisCallback(callback: string | null | undefined): FavoriEnAttente | null {
  if (!callback) return null;
  const { params } = separer(callback);
  const returnTo = params.get("returnTo");
  return returnTo ? extraireFavori(returnTo).favori : lireFavori(params.get(FAVORI_PARAM));
}

/**
 * Ajout du favori mémorisé, au retour d'un paiement vérifié (/abonnement/success). Vrai si le favori
 * est en place : créé (2xx) ou déjà là (409). Faux sur toute autre réponse, une erreur réseau ou
 * après 5 s (timeout explicite, la redirection a lieu quand même).
 */
export async function ajouterFavoriApresPaiement(f: FavoriEnAttente): Promise<boolean> {
  try {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: f.contentType, contentId: f.contentId }),
      signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(5_000) : undefined,
    });
    return res.ok || res.status === 409;
  } catch {
    return false;
  }
}

/**
 * Drapeau « favori ajouté » sur la destination (textes-trajet-v3 §5 point 4) : `favori=JOKE|TIP|VIDEO`,
 * le TYPE seulement, jamais l'identifiant. Posé uniquement après un ajout réussi ; lu par
 * `PremiumWelcome` (liste blanche) pour dire « Ta vanne est dans tes favoris. ».
 */
export function avecDrapeauFavori(chemin: string, type: ContenuFavori): string {
  const { path, params, hash } = separer(chemin);
  params.set(FAVORI_PARAM, type);
  return recoller(path, params, hash);
}

const TYPES: readonly ContenuFavori[] = ["JOKE", "TIP", "VIDEO"];

export function lireDrapeauFavori(raw: string | null | undefined): ContenuFavori | null {
  return TYPES.find((t) => t === raw) ?? null;
}
