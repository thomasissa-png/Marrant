/**
 * Comptes de test exclus des chiffres (s17, data-analyst §6 et §7).
 *
 * Variable d'environnement `ANALYTICS_EMAILS_EXCLUS` : liste d'e-mails
 * séparés par des virgules, espaces ou retours à la ligne (casse ignorée).
 * Utilisée par le bloc « Parcours » du rapport du lundi et par les alertes des
 * parcours, jamais affichée.
 *
 * s21 (19/10, feu vert de Thomas) : les adresses internes de
 * `EMAILS_INTERNES_EXCLUS` sont TOUJOURS exclues, fusionnées avec la variable
 * (jamais à sa place). La variable est un secret Cloudflare illisible : un
 * `secret put` l'écraserait, d'où cette liste dans le code.
 */
export const ENV_EMAILS_EXCLUS = "ANALYTICS_EMAILS_EXCLUS";

/** Adresses de l'équipe exclues des chiffres quelle que soit la variable. */
export const EMAILS_INTERNES_EXCLUS: readonly string[] = ["alex@deviens-marrant.fr"];

export function emailsExclus(env: Record<string, string | undefined> = process.env): string[] {
  const raw = env[ENV_EMAILS_EXCLUS] ?? "";
  return Array.from(
    new Set(
      [...raw.split(/[\s,;]+/), ...EMAILS_INTERNES_EXCLUS]
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.includes("@")),
    ),
  );
}

/**
 * Identifiants des comptes du site dont l'e-mail est un compte de test (casse
 * ignorée). Liste vide sans exclusion : aucune lecture en base. s21 (18/10) :
 * partagé par l'entonnoir et les conversions du rapport du lundi et par l'admin.
 */
export async function idsComptesTest(exclus: string[] = emailsExclus()): Promise<string[]> {
  if (exclus.length === 0) return [];
  const { prisma } = await import("@/lib/prisma");
  const comptes = await prisma.user.findMany({
    where: { OR: exclus.map((email) => ({ email: { equals: email, mode: "insensitive" as const } })) },
    select: { id: true },
  });
  return comptes.map((c) => c.id);
}
