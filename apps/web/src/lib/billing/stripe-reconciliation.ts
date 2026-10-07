/**
 * Réconciliation quotidienne Stripe ↔ base (s16, 07/10/2026, reco 8).
 *
 * Lecture seule (aucune écriture ni chez Stripe ni en base). Écarts relevés :
 *  1. abonnement en cours chez Stripe (active, trialing, past_due) sans
 *     Premium en base (paiement « perdu ») ;
 *  2. compte Premium en base sans abonnement en cours chez Stripe (accès
 *     offert par erreur, ou abonnement résilié non répercuté) ;
 *  3. plusieurs abonnements en cours pour le même client (double prélèvement) ;
 *  4. événements Stripe non livrés au webhook sur les 3 derniers jours.
 * Résultat non nul → alerte A (`stripe-reconciliation`, `stripe-webhook-livraison`)
 * dans le digest du matin. Aucune donnée personnelle dans l'alerte (identifiants seulement).
 */
import type Stripe from "stripe";
import { CLES_TUNNEL, recordAdminAlert } from "@/lib/admin-alerts";

const EN_COURS = ["active", "trialing", "past_due"];
const LIVRAISON_JOURS = 3;

export interface ReconciliationDb {
  subscription: {
    findMany(args: {
      select: { userId: true; stripeSubscriptionId: true; stripeCustomerId: true; status: true };
    }): Promise<Array<{ userId: string; stripeSubscriptionId: string | null; stripeCustomerId: string | null; status: string }>>;
  };
  user: {
    findMany(args: { where: { plan: "PREMIUM" }; select: { id: true } }): Promise<Array<{ id: string }>>;
  };
}

export interface ReconciliationDeps {
  stripe: Pick<Stripe, "subscriptions" | "events">;
  db: ReconciliationDb;
  record?: typeof recordAdminAlert;
}

export interface ReconciliationResult {
  stripeEnCours: number;
  payeSansPremium: string[];
  premiumSansAbonnement: string[];
  doublons: string[];
  evenementsNonLivres: string[];
}

export async function runStripeReconciliation(now: Date, deps: ReconciliationDeps): Promise<ReconciliationResult> {
  const record = deps.record ?? recordAdminAlert;

  const enCours: Stripe.Subscription[] = [];
  for await (const s of deps.stripe.subscriptions.list({ status: "all", limit: 100 })) {
    if (EN_COURS.includes(s.status)) enCours.push(s);
  }

  const [rows, premiums] = await Promise.all([
    deps.db.subscription.findMany({
      select: { userId: true, stripeSubscriptionId: true, stripeCustomerId: true, status: true },
    }),
    deps.db.user.findMany({ where: { plan: "PREMIUM" }, select: { id: true } }),
  ]);
  const premiumIds = new Set(premiums.map((u) => u.id));
  const rowBySub = new Map(rows.filter((r) => r.stripeSubscriptionId).map((r) => [r.stripeSubscriptionId as string, r]));
  const enCoursIds = new Set(enCours.map((s) => s.id));

  const payeSansPremium = enCours
    .filter((s) => {
      const row = rowBySub.get(s.id);
      return !row || !premiumIds.has(row.userId);
    })
    .map((s) => `${s.id} (${s.status}, client ${typeof s.customer === "string" ? s.customer : s.customer?.id ?? "?"})`);

  const premiumSansAbonnement = [...premiumIds]
    .filter((userId) => {
      const row = rows.find((r) => r.userId === userId);
      return !row?.stripeSubscriptionId || !enCoursIds.has(row.stripeSubscriptionId);
    })
    .map((userId) => `utilisateur ${userId}`);

  const parClient = new Map<string, string[]>();
  for (const s of enCours) {
    const c = typeof s.customer === "string" ? s.customer : s.customer?.id ?? "?";
    parClient.set(c, [...(parClient.get(c) ?? []), s.id]);
  }
  const doublons = [...parClient.entries()].filter(([, ids]) => ids.length > 1).map(([c, ids]) => `client ${c} : ${ids.join(", ")}`);

  const evenementsNonLivres: string[] = [];
  const depuis = Math.floor(now.getTime() / 1000) - LIVRAISON_JOURS * 86_400;
  for await (const e of deps.stripe.events.list({ delivery_success: false, created: { gte: depuis }, limit: 100 })) {
    evenementsNonLivres.push(`${e.id} (${e.type}, ${new Date(e.created * 1000).toISOString().slice(0, 16)} UTC)`);
  }

  const ecarts = payeSansPremium.length + premiumSansAbonnement.length + doublons.length;
  if (ecarts > 0) {
    const bloc = (titre: string, items: string[]) =>
      items.length ? `<p>${titre} (${items.length}) :</p><ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>` : "";
    await record({
      cle: CLES_TUNNEL.reconciliation,
      sujet: `Stripe et la base ne sont pas d'accord (${ecarts} écart${ecarts > 1 ? "s" : ""})`,
      html:
        bloc("Abonnement en cours chez Stripe sans Premium sur le site", payeSansPremium) +
        bloc("Premium sur le site sans abonnement en cours chez Stripe", premiumSansAbonnement) +
        bloc("Plusieurs abonnements en cours pour un même client (double prélèvement)", doublons),
      now,
    });
  }
  if (evenementsNonLivres.length > 0) {
    await record({
      cle: CLES_TUNNEL.webhookLivraison,
      sujet: `${evenementsNonLivres.length} événement(s) Stripe non livré(s) au webhook`,
      html: `<p>Sur les ${LIVRAISON_JOURS} derniers jours (Stripe réessaie, puis abandonne) :</p><ul>${evenementsNonLivres
        .slice(0, 20)
        .map((i) => `<li>${i}</li>`)
        .join("")}</ul><p>Voir Stripe, Développeurs, Webhooks : réponse de l'endpoint.</p>`,
      now,
    });
  }

  return { stripeEnCours: enCours.length, payeSansPremium, premiumSansAbonnement, doublons, evenementsNonLivres };
}
