/**
 * Wrapper RevenueCat pour les achats In-App Purchase mobile.
 * Couvre Apple IAP (iOS) et Google Play Billing (Android).
 *
 * Architecture :
 *   - Côté client : ce wrapper appelle RevenueCat pour purchase / restore / getCustomerInfo
 *   - RevenueCat appelle notre webhook serveur (/api/iap/revenuecat-webhook) lors des events
 *   - Le webhook met à jour user.plan = PREMIUM en DB
 *
 * Setup nécessaire (voir REPLIT_ACTIONS.md section MOBILE) :
 *   - Compte RevenueCat
 *   - Public API key dans NEXT_PUBLIC_REVENUECAT_API_KEY (différente iOS / Android)
 *   - Webhook secret dans REVENUECAT_WEBHOOK_SECRET (côté serveur)
 *   - Products configurés : "premium_monthly" + "premium_yearly"
 */

import { isMobileNative } from "./api-base";

export type IAPProduct = {
  identifier: string;
  description: string;
  title: string;
  priceString: string;
  price: number;
  currencyCode: string;
};

export type IAPCustomerInfo = {
  isPremium: boolean;
  expirationDate: string | null;
  productIdentifier: string | null;
  managementURL: string | null;
};

let initialized = false;

async function ensureInit(userId?: string): Promise<void> {
  if (initialized) return;
  if (!isMobileNative()) {
    throw new Error("RevenueCat ne peut être initialisé qu'en mode native mobile");
  }
  // eslint-disable-next-line
  const { Purchases, LOG_LEVEL } = require("@revenuecat/purchases-capacitor");

  const apiKey = (() => {
    // eslint-disable-next-line
    const { Capacitor } = require("@capacitor/core");
    const platform = Capacitor.getPlatform();
    if (platform === "ios") return process.env.NEXT_PUBLIC_REVENUECAT_API_KEY_IOS ?? "";
    if (platform === "android") return process.env.NEXT_PUBLIC_REVENUECAT_API_KEY_ANDROID ?? "";
    return "";
  })();

  if (!apiKey) {
    throw new Error("RevenueCat API key manquante pour la plateforme");
  }

  await Purchases.setLogLevel({ level: LOG_LEVEL.INFO });
  await Purchases.configure({ apiKey, appUserID: userId ?? null });
  initialized = true;
}

/**
 * Liste les produits disponibles à l'achat (mensuel + annuel).
 */
export async function getOfferings(): Promise<IAPProduct[]> {
  if (!isMobileNative()) return [];
  await ensureInit();
  // eslint-disable-next-line
  const { Purchases } = require("@revenuecat/purchases-capacitor");
  const offerings = await Purchases.getOfferings();
  const current = offerings.current;
  if (!current) return [];
  return current.availablePackages.map((pkg: any) => ({
    identifier: pkg.product.identifier,
    description: pkg.product.description,
    title: pkg.product.title,
    priceString: pkg.product.priceString,
    price: pkg.product.price,
    currencyCode: pkg.product.currencyCode,
  }));
}

/**
 * Lance un achat IAP. Apple/Google prend le relais avec son prompt natif.
 * Au succès, RevenueCat appelle notre webhook serveur qui met à jour user.plan.
 */
export async function purchasePackage(productIdentifier: string, userId?: string): Promise<IAPCustomerInfo> {
  if (!isMobileNative()) {
    throw new Error("L'achat IAP n'est disponible que sur mobile");
  }
  await ensureInit(userId);
  // eslint-disable-next-line
  const { Purchases } = require("@revenuecat/purchases-capacitor");
  const offerings = await Purchases.getOfferings();
  const current = offerings.current;
  if (!current) throw new Error("Aucun offering disponible");

  const pkg = current.availablePackages.find((p: any) => p.product.identifier === productIdentifier);
  if (!pkg) throw new Error(`Produit ${productIdentifier} introuvable`);

  const result = await Purchases.purchasePackage({ aPackage: pkg });
  return mapCustomerInfo(result.customerInfo);
}

/**
 * Restaure les achats d'un user (changement d'appareil, réinstall, etc.).
 */
export async function restorePurchases(userId?: string): Promise<IAPCustomerInfo> {
  if (!isMobileNative()) {
    throw new Error("Restore IAP indisponible en web");
  }
  await ensureInit(userId);
  // eslint-disable-next-line
  const { Purchases } = require("@revenuecat/purchases-capacitor");
  const result = await Purchases.restorePurchases();
  return mapCustomerInfo(result.customerInfo);
}

/**
 * Récupère le statut Premium courant du user (lit le cache RevenueCat local + sync serveur).
 */
export async function getCustomerInfo(userId?: string): Promise<IAPCustomerInfo> {
  if (!isMobileNative()) {
    return { isPremium: false, expirationDate: null, productIdentifier: null, managementURL: null };
  }
  await ensureInit(userId);
  // eslint-disable-next-line
  const { Purchases } = require("@revenuecat/purchases-capacitor");
  const result = await Purchases.getCustomerInfo();
  return mapCustomerInfo(result.customerInfo);
}

function mapCustomerInfo(info: any): IAPCustomerInfo {
  const premiumEntitlement = info?.entitlements?.active?.premium;
  return {
    isPremium: !!premiumEntitlement,
    expirationDate: premiumEntitlement?.expirationDate ?? null,
    productIdentifier: premiumEntitlement?.productIdentifier ?? null,
    managementURL: info?.managementURL ?? null,
  };
}
