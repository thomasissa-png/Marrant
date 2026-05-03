"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isMobileNative, api } from "@/lib/api-base";
import { getOfferings, purchasePackage, restorePurchases, type IAPProduct } from "@/lib/iap";

type Props = {
  userId?: string;
  onSuccess?: () => void;
};

/**
 * Paywall Premium qui détecte le mode (web vs mobile native) :
 * - Web → Stripe Checkout (POST /api/stripe/checkout)
 * - Mobile → IAP via RevenueCat (Apple ou Google selon plateforme)
 *
 * Conforme Apple Guideline 3.1.1 : aucune mention prix web ou lien externe en mobile.
 */
export function PremiumPaywall({ userId, onSuccess }: Props) {
  const router = useRouter();
  const [isNative, setIsNative] = useState(false);
  const [products, setProducts] = useState<IAPProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsNative(isMobileNative());
  }, []);

  useEffect(() => {
    if (!isNative) return;
    let cancelled = false;
    (async () => {
      try {
        const offerings = await getOfferings();
        if (!cancelled) setProducts(offerings);
      } catch (err) {
        if (!cancelled) setError("Achats indisponibles. Réessaie plus tard.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isNative]);

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Impossible de démarrer le paiement.");
      }
    } catch {
      setError("Erreur réseau. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const handleIAPPurchase = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const info = await purchasePackage(productId, userId);
      if (info.isPremium) {
        onSuccess?.();
        router.refresh();
      } else {
        setError("L'achat n'a pas été confirmé. Contacte le support.");
      }
    } catch (err: any) {
      // RevenueCat retourne userCancelled = true si annulé : pas d'erreur affichée
      if (err?.userCancelled) {
        setLoading(false);
        return;
      }
      setError("L'achat a échoué. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await restorePurchases(userId);
      if (info.isPremium) {
        onSuccess?.();
        router.refresh();
      } else {
        setError("Aucun achat à restaurer trouvé.");
      }
    } catch {
      setError("Restauration impossible. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  if (isNative) {
    return (
      <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-6">
        <h3 className="text-2xl font-bold mb-2">Passe Premium</h3>
        <p className="text-gray-300 mb-4">
          Accès illimité à toutes les vannes, conseils, vidéos et parcours.
        </p>

        {products.length === 0 ? (
          <p className="text-gray-400 text-sm">Chargement des offres…</p>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <button
                key={p.identifier}
                onClick={() => handleIAPPurchase(p.identifier)}
                disabled={loading}
                className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-4 py-3 text-left transition"
              >
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-200">{p.priceString}</div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleRestore}
          disabled={loading}
          className="mt-4 text-sm text-violet-300 hover:text-violet-200 underline disabled:opacity-50"
        >
          Restaurer mes achats
        </button>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <p className="mt-4 text-xs text-gray-400">
          Abonnement géré via {/* iOS / Android dynamique */}ton store. Annulation à tout moment dans
          les paramètres de ton compte. Renouvellement automatique sauf annulation 24h avant la fin
          de la période.
        </p>
      </div>
    );
  }

  // Mode web → Stripe
  return (
    <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-6">
      <h3 className="text-2xl font-bold mb-2">Passe Premium</h3>
      <p className="text-gray-300 mb-4">Accès illimité à tout le catalogue.</p>
      <button
        onClick={handleStripeCheckout}
        disabled={loading}
        className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-4 py-3 font-semibold transition"
      >
        {loading ? "Redirection…" : "S'abonner — 4,99€/mois"}
      </button>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      <p className="mt-3 text-xs text-gray-400">
        Sans engagement. Voir{" "}
        <a href="/retractation" className="underline">
          conditions de rétractation
        </a>
        .
      </p>
    </div>
  );
}
