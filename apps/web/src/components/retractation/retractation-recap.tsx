"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TEXTES_RETRACTATION_FORM as T } from "@/config/textes/paiement";
import { frTypo } from "@/lib/fr-typo";

export interface DeclarationRetractation {
  nom: string;
  email: string;
  dateAchat: string;
  motif: string;
}

/** « 2026-11-01 » → « 1er novembre 2026 » (date saisie, sans fuseau ; même forme que l'accusé). */
function dateSaisie(iso: string): string {
  const [a, m, j] = iso.split("-").map(Number);
  if (!a || !m || !j) return iso;
  const mois = new Date(Date.UTC(a, m - 1, 1, 12)).toLocaleDateString("fr-FR", { month: "long", timeZone: "UTC" });
  return `${j === 1 ? "1er" : j} ${mois} ${a}`;
}

interface RetractationRecapProps {
  declaration: DeclarationRetractation;
  envoi: boolean;
  erreur: string | null;
  lienContact: React.ReactNode;
  onConfirmer: () => void;
  onModifier: () => void;
}

/**
 * Étape 2 de la fonction de rétractation (D.221-5, audit s23) : récapitulatif
 * de la déclaration, puis « Confirmer la rétractation », seul bouton qui envoie.
 */
export function RetractationRecap({ declaration: d, envoi, erreur, lienContact, onConfirmer, onModifier }: RetractationRecapProps) {
  const lignes: Array<[string, string]> = [
    [T.recapNom, d.nom.trim()],
    [T.recapEmail, d.email.trim()],
    [T.recapDateAchat, d.dateAchat ? dateSaisie(d.dateAchat) : T.recapNonIndique],
    [T.recapMotif, d.motif.trim() || T.recapNonIndique],
  ];
  // Changement d'étape : le focus suit (clavier et lecteur d'écran), sinon il retombe sur la page.
  const titreRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => titreRef.current?.focus(), []);
  return (
    <Card data-testid="retractation-recap">
      <CardContent className="space-y-4 py-6">
        <h3 ref={titreRef} tabIndex={-1} className="text-lg font-semibold text-text-primary focus:outline-none">{T.recapTitre}</h3>
        <p className="text-sm text-text-secondary">{frTypo(T.recapTexte)}</p>
        <dl className="space-y-2 text-sm">
          {lignes.map(([terme, valeur]) => (
            <div key={terme}>
              <dt className="font-medium text-text-primary">{terme}</dt>
              <dd className="whitespace-pre-wrap break-words text-text-secondary">{valeur}</dd>
            </div>
          ))}
        </dl>
        {erreur && (
          <p id="retractation-erreur" role="alert" className="text-sm text-error">
            {erreur} {erreur === T.erreurServeur && lienContact}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="primary" size="lg" onClick={onConfirmer} disabled={envoi} aria-describedby={erreur ? "retractation-erreur" : undefined}>
            {envoi ? T.envoi : T.confirmer}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={onModifier} disabled={envoi}>
            {T.modifier}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
