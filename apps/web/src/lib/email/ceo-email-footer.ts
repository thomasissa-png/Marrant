/**
 * CEO Email Footer — conformité CPCE L34-5 + RGPD art. 13/21.
 *
 * BLOQUANT @legal s9 (cf docs/legal/ceo-dpa-audit-s3.md point n°3) :
 * tout email envoyé par l'agent CEO DOIT inclure ce footer pour passer
 * pré-S3 (envois auto activés).
 *
 * Contenu obligatoire :
 *  - Adresse postale identifiable (CPCE L34-5)
 *  - Lien désinscription 1-clic avec token unique signé HMAC
 *  - Formulation explicite "Tu reçois cet email parce que..."
 *  - Lien politique de confidentialité (RGPD art. 13)
 *
 * Pas de mention IA (préférence fondateur s8 verbatim — règle PERMANENTE).
 * Signature collective "L'Équipe Deviens Marrant" (jamais "Alex").
 */
import { createHmac } from "crypto";

const HOST = "deviens-marrant.fr";
const POSTAL_ADDRESS_FALLBACK = "[ADRESSE_POSTALE_PLACEHOLDER — à configurer via env ADRESSE_POSTALE]";

/** Clé HMAC dédiée — à provisionner dans Replit Secrets. */
function getUnsubscribeHmacSecret(): string {
  const secret = process.env.UNSUBSCRIBE_HMAC_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "UNSUBSCRIBE_HMAC_SECRET absent ou trop court (>=32 chars requis pour HMAC-SHA256)",
    );
  }
  return secret;
}

/**
 * Génère un token désinscription signé HMAC-SHA256.
 * Format : `<base64url(email)>.<hmac8>`
 *  - 8 chars HMAC suffisent pour anti-tampering (pas de cryptage, juste auth)
 *  - email en base64url pour roundtrip sans encodage URL exotique
 *
 * Pas d'expiration : un lien unsubscribe doit fonctionner pour toujours
 * (sinon désinscription bloquée si email lu tardivement).
 */
export function generateUnsubscribeToken(recipientEmail: string): string {
  const normalized = recipientEmail.trim().toLowerCase();
  const secret = getUnsubscribeHmacSecret();
  const payload = Buffer.from(normalized).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("hex")
    .slice(0, 16);
  return `${payload}.${signature}`;
}

/**
 * Vérifie + extrait l'email d'un token. Retourne null si signature invalide.
 * Utilisé par /api/unsubscribe pour valider la requête.
 */
export function verifyUnsubscribeToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const secret = getUnsubscribeHmacSecret();
  const expected = createHmac("sha256", secret)
    .update(payload)
    .digest("hex")
    .slice(0, 16);
  if (expected !== signature) return null;
  try {
    return Buffer.from(payload, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

/** URL absolue de désinscription pour un destinataire donné. */
export function buildUnsubscribeUrl(recipientEmail: string): string {
  const token = generateUnsubscribeToken(recipientEmail);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${HOST}`;
  return `${baseUrl}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}

/** Marker idempotence : si déjà présent dans le HTML, n'append PAS le footer. */
const FOOTER_MARKER = "<!-- CEO_FOOTER_V1 -->";

/**
 * Génère le bloc HTML footer pour un destinataire donné.
 * Variables substituées : adresse postale + lien désinscription.
 */
function buildFooterHtml(recipientEmail: string): string {
  const address = process.env.ADRESSE_POSTALE ?? POSTAL_ADDRESS_FALLBACK;
  const unsubUrl = buildUnsubscribeUrl(recipientEmail);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${HOST}`;

  return `
${FOOTER_MARKER}
<hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;color:#888;line-height:1.5;">
  <tr><td>
    <p style="margin:0 0 8px;">
      Tu reçois cet email parce que tu t'es inscrit·e sur ${HOST}.
    </p>
    <p style="margin:0 0 8px;">
      <a href="${unsubUrl}" style="color:#888;text-decoration:underline;">Se désinscrire en 1 clic</a>
      &nbsp;·&nbsp;
      <a href="${baseUrl}/confidentialite" style="color:#888;text-decoration:underline;">Politique de confidentialité</a>
      &nbsp;·&nbsp;
      <a href="${baseUrl}/mentions-legales" style="color:#888;text-decoration:underline;">Mentions légales</a>
    </p>
    <p style="margin:0;color:#aaa;">
      ${address}<br>
      L'Équipe Deviens Marrant
    </p>
  </td></tr>
</table>
`;
}

/**
 * Append le footer à un body HTML s'il est absent. Idempotent grâce au
 * marker `CEO_FOOTER_V1`. Si déjà présent → renvoie l'input tel quel.
 *
 * Usage obligatoire avant TOUT envoi outbound CEO :
 *
 *   const finalHtml = enforceEmailFooter(rawHtml, lead.email);
 *   await resend.emails.send({ to: lead.email, html: finalHtml, ... });
 */
export function enforceEmailFooter(htmlBody: string, recipientEmail: string): string {
  if (htmlBody.includes(FOOTER_MARKER)) {
    return htmlBody;
  }
  const footer = buildFooterHtml(recipientEmail);

  // Insère avant la fermeture </body> si présente, sinon append à la fin.
  const closingBodyIdx = htmlBody.lastIndexOf("</body>");
  if (closingBodyIdx !== -1) {
    return (
      htmlBody.slice(0, closingBodyIdx) +
      footer +
      htmlBody.slice(closingBodyIdx)
    );
  }
  return htmlBody + footer;
}

/**
 * Variante texte brut pour les sujets/clients qui ne rendent pas le HTML.
 * Append le footer texte minimal.
 */
export function enforceEmailFooterText(textBody: string, recipientEmail: string): string {
  if (textBody.includes("--- CEO_FOOTER_V1 ---")) return textBody;
  const address = process.env.ADRESSE_POSTALE ?? POSTAL_ADDRESS_FALLBACK;
  const unsubUrl = buildUnsubscribeUrl(recipientEmail);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${HOST}`;

  return `${textBody}

--- CEO_FOOTER_V1 ---
Tu reçois cet email parce que tu t'es inscrit·e sur ${HOST}.
Se désinscrire : ${unsubUrl}
Politique de confidentialité : ${baseUrl}/confidentialite
${address}
L'Équipe Deviens Marrant`;
}
