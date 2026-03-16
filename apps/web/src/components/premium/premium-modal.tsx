"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { useContentStats } from "@/hooks/use-content-stats";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const { status } = useSession();
  const stats = useContentStats();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
      } else {
        toast("Erreur lors de la création du paiement", "error");
      }
    } catch {
      toast("Connexion perdue, réessaie", "error");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="rounded-2xl border-2 border-accent-primary bg-background-card p-6 shadow-lg shadow-accent-primary/10">
        <Badge variant="primary" className="mb-3">
          Prix de lancement
        </Badge>
        <h3 className="font-display text-xl font-bold text-text-primary">
          Débloque tout le contenu
        </h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-text-primary">0,99 €</span>
          <span className="text-text-muted">/ mois</span>
        </div>
        <p className="mt-1 text-sm text-accent-primary font-medium">
          Sans engagement, annulable à tout moment
        </p>

        <ul className="mt-5 space-y-2.5 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-success">✓</span>
            <span>
              <strong>Toutes les vannes</strong> :{" "}
              {stats.jokes > 0 ? `${stats.jokes}+` : "des centaines"} classées
              par catégorie
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-success">✓</span>
            <span>
              <strong>Tous les conseils</strong> :{" "}
              {stats.tips > 0 ? `${stats.tips}+` : "des dizaines"} + exemples +
              exercices
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-success">✓</span>
            <span>
              <strong>Toutes les vidéos</strong> :{" "}
              {stats.videos > 0 ? `${stats.videos}+` : "des dizaines"} stand-up
              analysées
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-success">✓</span>
            <span>
              <strong>Filtres avancés</strong> : catégorie, niveau, recherche
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-success">✓</span>
            <span>
              <strong>Contenu quotidien</strong> : vanne + conseil + vidéo
              chaque jour
            </span>
          </li>
        </ul>

        {status === "authenticated" ? (
          <Button
            variant="primary"
            size="lg"
            className="mt-6 w-full"
            onClick={handleCheckout}
            disabled={isCheckoutLoading}
          >
            {isCheckoutLoading ? "Redirection..." : "Passer à l'offre complète"}
          </Button>
        ) : (
          <Link href="/register" className="mt-6 block" onClick={onClose}>
            <Button variant="primary" size="lg" className="w-full">
              Commencer à 0,99 €/mois
            </Button>
          </Link>
        )}

        <p className="mt-3 text-center text-xs text-text-muted">
          Droit de{" "}
          <Link
            href="/retractation"
            className="underline hover:text-text-secondary"
            onClick={onClose}
          >
            rétractation
          </Link>
        </p>
      </div>
    </Modal>
  );
}
