"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { trackUmami } from "@/lib/umami";
import { dateLongue, MOT_CONFIRMATION_SUPPRESSION, TEXTES_SUPPRESSION as T } from "@/config/textes/compte";

/** Mot retapé conforme (casse et espaces ignorés, comme côté serveur). */
export function confirmationValide(saisie: string): boolean {
  return saisie.trim().toUpperCase() === MOT_CONFIRMATION_SUPPRESSION;
}

/**
 * Suppression du compte (s16, reco 5) : confirmation explicite (mot retapé),
 * puis DELETE /api/user (résiliation Stripe immédiate puis effacement), puis
 * déconnexion vers l'accueil.
 * Abonné : avertissement avant confirmation (lot G, @legal point 8) : période
 * payée perdue et non remboursée, résilier d'abord, rétractation si < 14 jours.
 */
export function SupprimerCompteCard({
  abonne,
  finPeriode = null,
  resilie = false,
}: {
  abonne: boolean;
  /** Fin de la période payée (ISO), si le résumé d'abonnement est connu. */
  finPeriode?: string | null;
  /** Résiliation déjà programmée en fin de période. */
  resilie?: boolean;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [saisie, setSaisie] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);
  const champRef = useRef<HTMLInputElement>(null);

  const ouvrir = () => {
    setOuvert(true);
    window.setTimeout(() => champRef.current?.focus(), 0);
  };

  const annuler = () => {
    setOuvert(false);
    setSaisie("");
    setErreur("");
  };

  const supprimer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationValide(saisie)) {
      setErreur(T.motIncorrect);
      champRef.current?.focus();
      return;
    }
    setErreur("");
    setEnCours(true);
    try {
      const res = await fetch("/api/user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: saisie }),
      });
      if (res.ok) {
        trackUmami("compte-supprime", { abonne: abonne ? "oui" : "non" });
        toast(T.succes, "success");
        await signOut({ callbackUrl: "/" });
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setErreur(data.error ?? T.echec);
    } catch {
      setErreur(T.echec);
    }
    setEnCours(false);
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>{T.titre}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-secondary">{T.intro}</p>
        {abonne && <AvertissementAbonne fin={finPeriode ? dateLongue(finPeriode) : null} resilie={resilie} />}
        {!ouvert ? (
          <Button variant="ghost" size="sm" className="mt-4 text-error" onClick={ouvrir}>
            {T.ouvrir}
          </Button>
        ) : (
          <form className="mt-4 flex flex-col gap-3" onSubmit={supprimer}>
            <label htmlFor="confirmation-suppression" className="text-sm text-text-primary">
              {T.consigne}
            </label>
            <Input
              ref={champRef}
              id="confirmation-suppression"
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              aria-invalid={!!erreur}
              aria-describedby={erreur ? "suppression-erreur" : undefined}
            />
            {erreur && (
              <p id="suppression-erreur" className="text-sm text-error" role="alert">
                {erreur}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" variant="danger" size="sm" disabled={enCours}>
                {enCours ? T.enCours : T.confirmer}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={annuler} disabled={enCours}>
                {T.annuler}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function AvertissementAbonne({ fin, resilie }: { fin: string | null; resilie: boolean }) {
  return (
    <div className="mt-3 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-text-primary" role="note">
      <p>{resilie && fin ? T.avecAbonnementResilie(fin) : T.avecAbonnement(fin)}</p>
      <p className="mt-2">
        {T.retractationAvant}
        <Link href="/retractation" className="underline underline-offset-2 hover:text-text-primary">
          {T.retractationLien}
        </Link>
        {T.retractationApres}
      </p>
    </div>
  );
}
