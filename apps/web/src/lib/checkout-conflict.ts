import { TEXTES_CHECKOUT } from "@/config/textes/paiement";

/**
 * Refus 409 de POST /api/stripe/checkout (audit s16, lot A) : abonnement déjà
 * en cours (`deja-abonne`) ou en impayé (`paiement-en-retard`). Le client ne
 * doit pas repayer : on affiche le message du serveur et un lien vers /profil.
 */
export type CheckoutConflictCode = "deja-abonne" | "paiement-en-retard";

export type CheckoutConflict = {
  code: CheckoutConflictCode;
  message: string;
};

/** Lit un refus 409 ; `null` pour toute autre réponse (toast habituel). */
export function readCheckoutConflict(status: number, data: unknown): CheckoutConflict | null {
  if (status !== 409) return null;
  const body = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const code: CheckoutConflictCode = body.code === "paiement-en-retard" ? "paiement-en-retard" : "deja-abonne";
  const fallback = code === "paiement-en-retard" ? TEXTES_CHECKOUT.impaye : TEXTES_CHECKOUT.dejaAbonne;
  const message = typeof body.error === "string" && body.error.trim() ? body.error : fallback;
  return { code, message };
}
