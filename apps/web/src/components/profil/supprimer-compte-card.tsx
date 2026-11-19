"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { trackUmami } from "@/lib/umami";
import { dateLongue, MOT_CONFIRMATION_SUPPRESSION, TEXTES_SUPPRESSION as T } from "@/config/textes/compte";
import { LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { LETTRE_HEBDO_SUPPRESSION } from "@/config/textes/lettre-hebdo-s21";
import { frTypo } from "@/lib/fr-typo";

/** Mot retapé conforme (casse et espaces ignorés, comme côté serveur). */
export function confirmationValide(saisie: string): boolean {
  return saisie.trim().toUpperCase() === MOT_CONFIRMATION_SUPPRESSION;
}

/**
 * v6 tour 4, point 5 : contenu de la carte, interrupteur ouvert. s26 tour 3 (point 12) : plus de `lg:justify-between`
 * (355 à 380 px vides au milieu de la carte dès 1024 au tour 2) : l'action passe SOUS le texte, alignée à gauche, à
 * toutes les largeurs.
 */
export const SUPPRESSION_CONTENU_OUVERT = "flex flex-col items-start";
/**
 * s26 tour 3 (point 12) : bouton « Supprimer mon compte » en contour rouge de 1 px (forme de bouton), cible de 44 px,
 * aligné sur le texte (plus de `-ml-3`). Texte en `text-error-text` (l'AA sur carte, `error` reste pour les bordures).
 */
const BOUTON_SUPPRIMER_OUVERT = "mt-4 h-11 border border-error text-error-text hover:bg-error/10";

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

  const texte = (
    <>
        <p className="text-sm text-text-secondary">{T.intro}</p>
        {/* s21, avis @legal lettre hebdo §6.3 : texte exact, publié avec l'ouverture des inscriptions. */}
        {LETTRE_HEBDO_INSCRIPTIONS_OUVERTES && <p className="mt-2 text-sm text-text-secondary">{frTypo(LETTRE_HEBDO_SUPPRESSION)}</p>}
        {abonne && <AvertissementAbonne fin={finPeriode ? dateLongue(finPeriode) : null} resilie={resilie} />}
    </>
  );

  // v6 tour 4, point 6 (ouvert seulement) : boutons `sm` en cible de 44 px dès 768 (`md:h-11`), `Button` inchangé.
  const action = !ouvert ? (
          <Button
            variant="ghost"
            size="sm"
            className={ESPACE_CLIENT_PUBLIE ? BOUTON_SUPPRIMER_OUVERT : "-ml-3 mt-4 text-error-text"}
            onClick={ouvrir}
          >
            {T.ouvrir}
          </Button>
        ) : (
          <form className={ESPACE_CLIENT_PUBLIE ? "mt-4 flex flex-col gap-4" : "mt-4 flex flex-col gap-3"} onSubmit={supprimer}>
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
              <p id="suppression-erreur" className="text-sm text-error-text" role="alert">
                {erreur}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" variant="danger" size="sm" className={ESPACE_CLIENT_PUBLIE ? "md:h-11" : undefined} disabled={enCours}>
                {enCours ? T.enCours : T.confirmer}
              </Button>
              <Button type="button" variant="ghost" size="sm" className={ESPACE_CLIENT_PUBLIE ? "md:h-11" : undefined} onClick={annuler} disabled={enCours}>
                {T.annuler}
              </Button>
            </div>
          </form>
        );

  return (
    <Card className="md:col-span-2" filet={ESPACE_CLIENT_PUBLIE}>
      <CardHeader>
        <CardTitle>{T.titre}</CardTitle>
      </CardHeader>
      {/* v6 tour 3, point 5 (ouvert) : carte longue en pleine largeur, texte à la mesure de lecture (`max-w-prose`).
          v6 tour 4, point 5 (ouvert) : dès `lg`, texte à gauche (`max-w-prose`), action à droite (plus de moitié
          droite vide). Fermé : contenu d'avant, au caractère près. */}
      {ESPACE_CLIENT_PUBLIE ? (
        <CardContent className={SUPPRESSION_CONTENU_OUVERT} data-suppression-colonnes="">
          <div className="max-w-prose">{texte}</div>
          <div className={ouvert ? "w-full max-w-prose" : undefined}>{action}</div>
        </CardContent>
      ) : (
        <CardContent>
          {texte}
          {action}
        </CardContent>
      )}
    </Card>
  );
}

function AvertissementAbonne({ fin, resilie }: { fin: string | null; resilie: boolean }) {
  return (
    // s26 finitions (relecture design tour 3, point 4), ouvert seulement : marge et marge intérieure au pas de 8 (12 -> 16 px).
    <div
      className={ESPACE_CLIENT_PUBLIE ? "mt-4 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-text-primary" : "mt-3 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-text-primary"}
      role="note"
    >
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
