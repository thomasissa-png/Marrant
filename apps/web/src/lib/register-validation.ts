/**
 * Validation client du formulaire d'inscription, partagée par /register et la
 * modale (passe UX s12, T41). Messages repris à l'identique de /register.
 * Le serveur (/api/auth/register, zod) reste la source de vérité.
 */
export interface RegisterFields {
  name: string;
  email: string;
  password: string;
}

export type RegisterFieldErrors = Partial<Record<keyof RegisterFields, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegisterFields({ name, email, password }: RegisterFields): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  if (!name.trim()) {
    errors.name = "Il nous manque ton prénom.";
  } else if (name.trim().length < 2) {
    errors.name = "Ton prénom doit faire au moins 2 caractères.";
  }

  if (!EMAIL_REGEX.test(email)) {
    errors.email = "Cette adresse email a l'air bizarre. Tu peux vérifier ?";
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
