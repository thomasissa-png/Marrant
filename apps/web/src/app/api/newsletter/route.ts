import { NextResponse } from "next/server";
import { z } from "zod";
import { LETTRE_EMPLACEMENTS, LETTRE_INSCRIPTIONS_OUVERTES, lettreSource } from "@/config/lettre";
import { LETTRE_CONTACT } from "@/config/textes/lettre-s21";
import { sendServiceTextEmail } from "@/lib/email";
import { inscrireALaLettre } from "@/lib/lettre/inscription";
import { siteBaseUrl } from "@/lib/newsletter";
import { getClientIp, retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { refuserSiAutreSite } from "@/lib/same-site";

export const dynamic = "force-dynamic";

/**
 * Inscription à la lettre mensuelle gratuite (s21, double opt-in).
 *
 * Interrupteur `LETTRE_INSCRIPTIONS_OUVERTES` fermé : 410 sans rien lire ni écrire (comme
 * depuis le 01/10). Ouvert : validation zod, case obligatoire, champ piège,
 * contrôle d'origine, limite par IP (429 + Retry-After) et par adresse
 * (silencieuse), puis réponse IDENTIQUE quel que soit le statut de l'adresse
 * (anti-fuite, spec §2.4) : `{ ok: true }`. Codes d'erreur pour le formulaire :
 * `email`, `case`, `limite`, `serveur`. Jamais d'adresse dans les journaux.
 */
const corpsSchema = z.object({
  email: z.string().trim().min(3).max(254).email(),
  consent: z.literal(true),
  emplacement: z.enum(LETTRE_EMPLACEMENTS),
  slug: z.string().trim().max(150).regex(/^[a-z0-9-]*$/).optional(),
  /** Champ piège : rempli = robot. */
  "site-web": z.string().max(500).optional(),
});

const MESSAGE_FERME = "Les inscriptions sont fermées pour le moment.";

export async function POST(request: Request) {
  if (!LETTRE_INSCRIPTIONS_OUVERTES) {
    return NextResponse.json({ error: MESSAGE_FERME, code: "ferme" }, { status: 410 });
  }

  const autreSite = refuserSiAutreSite(request, "newsletter");
  if (autreSite) return autreSite;

  // Sans JavaScript, le formulaire part en POST classique : même traitement, réponse
  // par redirection vers /lettre (spec §9.3 « JavaScript lent ou bloqué »).
  const formulaire = (request.headers.get("content-type") ?? "").includes("form");
  const repondre = (code: "ok" | "email" | "case" | "limite" | "serveur", status: number, headers?: Record<string, string>) => {
    if (formulaire) {
      const statut = code === "ok" ? "verifie" : code === "email" || code === "case" ? `saisie-${code}` : "erreur";
      return NextResponse.redirect(new URL(`/lettre?statut=${statut}`, process.env.NEXTAUTH_URL || request.url), 303);
    }
    return NextResponse.json(code === "ok" ? { ok: true } : { code }, { status, headers });
  };

  const ip = getClientIp(request.headers);
  const limiteIp = await sharedRateLimit("lettre-ip", ip, { maxRequests: 5, windowMs: 60_000 });
  if (!limiteIp.allowed) return repondre("limite", 429, { "Retry-After": String(retryAfterSeconds(limiteIp)) });

  let brut: unknown;
  try {
    if (formulaire) {
      const f = await request.formData();
      const texte = (k: string) => (typeof f.get(k) === "string" ? (f.get(k) as string) : undefined);
      brut = {
        email: texte("email") ?? "",
        consent: texte("consent") === "true",
        emplacement: texte("emplacement"),
        slug: texte("slug") || undefined,
        "site-web": texte("site-web") || undefined,
      };
    } else {
      brut = await request.json();
    }
  } catch {
    return repondre("email", 400);
  }
  const parsed = corpsSchema.safeParse(brut);
  if (!parsed.success) {
    const champs = new Set(parsed.error.issues.map((i) => String(i.path[0])));
    return repondre(!champs.has("email") && champs.has("consent") ? "case" : "email", 400);
  }
  const { email, emplacement, slug } = parsed.data;

  // Robot : même réponse, rien n'est écrit ni envoyé.
  if (parsed.data["site-web"]) return repondre("ok", 200);

  // Limite par adresse : silencieuse (une réponse différente révélerait l'adresse).
  const limiteEmail = await sharedRateLimit("lettre-email", email.toLowerCase(), { maxRequests: 5, windowMs: 3_600_000 });
  if (!limiteEmail.allowed) return repondre("ok", 200);

  try {
    await inscrireALaLettre(
      { email, source: lettreSource(emplacement, slug), ip: ip === "local" ? null : ip },
      {
        baseUrl: siteBaseUrl(),
        envoyer: (to, subject, text, headers) =>
          sendServiceTextEmail(to, subject, text, "lettre-confirmation", { headers, replyTo: LETTRE_CONTACT }),
      },
    );
    return repondre("ok", 200);
  } catch (err) {
    console.error("[lettre] Inscription en échec :", err instanceof Error ? err.message : "erreur inconnue");
    return repondre("serveur", 500);
  }
}
