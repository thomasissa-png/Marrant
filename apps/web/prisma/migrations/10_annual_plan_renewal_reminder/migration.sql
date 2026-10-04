-- Formule annuelle Premium (s14, 04/10/2026) + rappel légal de reconduction (L.215-1).
-- Idempotente : rejouable sans erreur (ADD COLUMN IF NOT EXISTS, CREATE ... IF NOT EXISTS).
-- Additive uniquement : aucune donnée existante modifiée, aucun abonné touché.

-- Subscription : intervalle, montant réel et annulation programmée (renseignés par le webhook Stripe)
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "billingInterval" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "priceAmountCents" INTEGER;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false;

-- RenewalReminder : une ligne par (abonnement, fin de période), insérée AVANT l'envoi
CREATE TABLE IF NOT EXISTS "RenewalReminder" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RenewalReminder_pkey" PRIMARY KEY ("id")
);

-- Colonnes du CREATE rejouées une à une (table éventuellement créée avec un schéma minimal)
ALTER TABLE "RenewalReminder" ADD COLUMN IF NOT EXISTS "subscriptionId" TEXT NOT NULL;
ALTER TABLE "RenewalReminder" ADD COLUMN IF NOT EXISTS "periodEnd" TIMESTAMP(3) NOT NULL;
ALTER TABLE "RenewalReminder" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "RenewalReminder" ADD COLUMN IF NOT EXISTS "sentAt" TIMESTAMP(3);
ALTER TABLE "RenewalReminder" ADD COLUMN IF NOT EXISTS "error" TEXT;
ALTER TABLE "RenewalReminder" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "RenewalReminder" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "RenewalReminder_subscriptionId_periodEnd_key" ON "RenewalReminder"("subscriptionId", "periodEnd");
CREATE INDEX IF NOT EXISTS "RenewalReminder_status_idx" ON "RenewalReminder"("status");

DO $$ BEGIN
  ALTER TABLE "RenewalReminder" ADD CONSTRAINT "RenewalReminder_subscriptionId_fkey"
    FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
