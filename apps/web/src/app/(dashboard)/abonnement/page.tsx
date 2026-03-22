"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useContentStats } from "@/hooks/use-content-stats";
import { FaqSection } from "@/components/home/faq-section";

export default function AbonnementPage() {
  const { status } = useSession();
  const stats = useContentStats();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error("[Checkout]", data.error);
        toast(data.error || "Erreur lors de la création du paiement", "error");
      }
    } catch {
      toast("Connexion perdue, réessaie", "error");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="text-center">
        <Badge variant="primary" className="mb-4">
          Plus qu&apos;une étape
        </Badge>
        <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
          Active ton accès pour commencer
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-text-secondary">
          Ton compte est créé ! Plus qu&apos;un clic pour accéder à tout
          le catalogue et commencer à devenir la personne la plus drôle du groupe.
        </p>
      </div>

      {/* Offre principale */}
      <Card className="mt-10 border-2 border-accent-primary shadow-lg shadow-accent-primary/10">
        <CardContent className="p-8">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-text-primary">
              Accès complet
            </h2>
            <Badge variant="primary">Prix de lancement</Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-text-primary">0,99 &euro;</span>
            <span className="text-text-muted">/ mois</span>
          </div>
          <p className="mt-1 text-sm font-medium text-accent-primary">
            Sans engagement, annulable &agrave; tout moment
          </p>

          <ul className="mt-6 space-y-3 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">&#10003;</span>
              <span>
                <strong>Toutes les vannes</strong> :{" "}
                {stats.jokes > 0 ? `${stats.jokes}+` : "des centaines"} class&eacute;es
                par cat&eacute;gorie
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">&#10003;</span>
              <span>
                <strong>Tous les conseils</strong> :{" "}
                {stats.tips > 0 ? `${stats.tips}+` : "des dizaines"} + exemples
                concrets + exercices
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">&#10003;</span>
              <span>
                <strong>Toutes les vid&eacute;os stand-up</strong> :{" "}
                {stats.videos > 0 ? `${stats.videos}+` : "des dizaines"} analys&eacute;es
                avec les techniques
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">&#10003;</span>
              <span>
                <strong>Contenu quotidien</strong> : vanne + conseil + vid&eacute;o
                chaque jour
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">&#10003;</span>
              <span>
                <strong>Filtres avanc&eacute;s</strong> : cat&eacute;gorie, niveau, recherche
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">&#10003;</span>
              <span>
                <strong>Favoris illimit&eacute;s</strong> : sauvegarde ce que tu veux
                ressortir
              </span>
            </li>
          </ul>

          {status === "authenticated" ? (
            <Button
              variant="primary"
              size="lg"
              className="mt-8 w-full"
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
            >
              {isCheckoutLoading
                ? "Redirection vers le paiement..."
                : "S'abonner \u00e0 0,99 \u20ac/mois"}
            </Button>
          ) : (
            <Link href="/register" className="mt-8 block">
              <Button variant="primary" size="lg" className="w-full">
                Cr&eacute;er un compte pour commencer
              </Button>
            </Link>
          )}

          <p className="mt-3 text-center text-xs text-text-muted">
            Droit de{" "}
            <Link
              href="/retractation"
              className="underline hover:text-text-secondary"
            >
              r&eacute;tractation
            </Link>{" "}
            &middot; Paiement s&eacute;curis&eacute; par Stripe
          </p>
        </CardContent>
      </Card>

      {/* Garantie */}
      <div className="mt-6 rounded-xl bg-background-elevated p-6 text-center">
        <p className="font-semibold text-text-primary">
          Tu annules quand tu veux
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          Ton acc&egrave;s reste actif jusqu&apos;à la fin de ta p&eacute;riode en cours.
          Pas de frais cach&eacute;s, pas de pi&egrave;ge.
        </p>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <FaqSection />
      </div>
    </div>
  );
}
