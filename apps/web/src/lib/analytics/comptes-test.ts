/**
 * Comptes de test exclus des chiffres (s17, data-analyst §6 et §7).
 *
 * Variable d'environnement `ANALYTICS_EMAILS_EXCLUS` : liste d'e-mails
 * séparés par des virgules, espaces ou retours à la ligne (casse ignorée).
 * Absente ou vide : aucune exclusion. Utilisée par le bloc « Parcours » du
 * rapport du lundi et par les alertes des parcours, jamais affichée.
 */
export const ENV_EMAILS_EXCLUS = "ANALYTICS_EMAILS_EXCLUS";

export function emailsExclus(env: Record<string, string | undefined> = process.env): string[] {
  const raw = env[ENV_EMAILS_EXCLUS] ?? "";
  return Array.from(
    new Set(
      raw
        .split(/[\s,;]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.includes("@")),
    ),
  );
}
