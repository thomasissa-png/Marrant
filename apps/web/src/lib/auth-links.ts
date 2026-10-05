/**
 * Liens d'inscription et de connexion (tunnel s15).
 *
 * Tout bouton « créer un compte » d'un visiteur anonyme est un vrai lien vers
 * `/register` (présent dans le HTML serveur, une seule page, mesurable),
 * avec la destination voulue (`callbackUrl`, chemin interne uniquement) et la
 * source du clic (`src`, mesure Umami, jamais de donnée personnelle).
 */
import { sanitizeCallbackUrl } from "@/lib/safe-callback";

/** Paramètre de retour après Google (lu par AuthReturnTracker puis retiré de l'URL). */
export const AUTH_RETURN_PARAM = "auth";
export const AUTH_RETURN_SIGNUP_GOOGLE = "inscription-google";
export const AUTH_RETURN_LOGIN_GOOGLE = "connexion-google";

/** Source de mesure : minuscules, chiffres et tirets, 120 caractères max. */
export function sanitizeSignupSrc(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== "string") return null;
  return /^[a-z0-9][a-z0-9-]{0,119}$/.test(raw) ? raw : null;
}

interface AuthLinkOptions {
  callbackUrl?: string | null;
  src?: string | null;
}

function buildAuthUrl(path: "/register" | "/login", { callbackUrl, src }: AuthLinkOptions): string {
  const params = new URLSearchParams();
  const safeCallback = sanitizeCallbackUrl(callbackUrl);
  if (safeCallback) params.set("callbackUrl", safeCallback);
  const safeSrc = sanitizeSignupSrc(src);
  if (safeSrc) params.set("src", safeSrc);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

/** `/register?callbackUrl=…&src=…` (paramètres omis s'ils sont vides ou non sûrs). */
export function buildRegisterUrl(options: AuthLinkOptions = {}): string {
  return buildAuthUrl("/register", options);
}

/** `/login?callbackUrl=…&src=…`. */
export function buildLoginUrl(options: AuthLinkOptions = {}): string {
  return buildAuthUrl("/login", options);
}

/**
 * Ajoute le marqueur de retour Google (et la source) à la destination, pour que
 * la page d'arrivée mesure l'inscription ou la connexion réussie.
 */
export function withAuthReturnMarker(target: string, marker: string, src?: string | null): string {
  const [beforeHash, hash] = target.split("#");
  const params = new URLSearchParams();
  params.set(AUTH_RETURN_PARAM, marker);
  const safeSrc = sanitizeSignupSrc(src);
  if (safeSrc) params.set("src", safeSrc);
  const separator = beforeHash.includes("?") ? "&" : "?";
  const withParams = `${beforeHash}${separator}${params.toString()}`;
  return hash !== undefined ? `${withParams}#${hash}` : withParams;
}
