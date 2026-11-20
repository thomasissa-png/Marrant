/**
 * Validation client du formulaire d'inscription, partagée par /register et la
 * modale (passe UX s12, T41). Messages repris à l'identique de /register.
 * Le serveur (/api/auth/register, zod) reste la source de vérité.
 */
import { EMAIL_LONGUEUR_MAX } from "@/lib/email-longueur";

export interface RegisterFields {
  /** s21 concision (18/10) : plus demandé par /register (renseigné ensuite dans /profil). */
  name?: string;
  email: string;
  password: string;
}

export type RegisterFieldErrors = Partial<Record<keyof RegisterFields, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegisterFields({ name = "", email, password }: RegisterFields): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  // s21 B17 : prénom facultatif ; s'il est donné, au moins 2 caractères.
  if (name.trim() && name.trim().length < 2) {
    errors.name = "Ton prénom doit faire au moins 2 caractères.";
  }

  // s26 batterie (défaut n°1) : même borne que l'API (254 caractères), même message.
  if (!EMAIL_REGEX.test(email) || email.trim().length > EMAIL_LONGUEUR_MAX) {
    errors.email = "Cette adresse email a l’air bizarre. Tu peux vérifier ?";
  }

  if (password.length < 8) {
    errors.password = "Ton mot de passe doit faire au moins 8 caractères.";
  }

  return errors;
}

/** Erreurs zod renvoyées par l'API (`details[].path[0]`) ramenées aux champs du formulaire. */
export function fieldErrorsFromApiDetails(details: unknown): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};
  if (!Array.isArray(details)) return errors;
  for (const detail of details as { path?: unknown[]; message?: string }[]) {
    const field = String(detail.path?.[0]);
    if ((field === "name" || field === "email" || field === "password") && detail.message) {
      errors[field] = detail.message;
    }
  }
  return errors;
}
