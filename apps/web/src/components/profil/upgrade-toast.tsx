"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/toast";
import { useUserStore } from "@/stores/user-store";

export function UpgradeToast({ status }: { status: string }) {
  const fetchUser = useUserStore((s) => s.fetchUser);

  useEffect(() => {
    if (status === "success") {
      toast("Bienvenue en Premium ! Accès illimité débloqué.", "success");
      // Rafraîchir les données user pour refléter le nouveau plan
      fetchUser();
    } else if (status === "cancel") {
      toast("Paiement annulé, tu peux réessayer quand tu veux.", "info");
    }
  }, [status, fetchUser]);

  return null;
}
