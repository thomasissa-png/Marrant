"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useUserStore } from "@/stores/user-store";
import { PRENOM_MAX, TEXTES_PRENOM as T } from "@/config/textes/compte";
import { lierComposes } from "@/lib/fr-typo";

/**
 * v6 tour 4, point 4 (interrupteur ouvert seulement) : dès `lg`, carte à côté d'une voisine (groupe des cartes
 * courtes du profil, deux par ligne) : champ puis bouton empilés, la carte prend la hauteur de sa voisine sans vide
 * (plus de carte étirée autour d'une seule ligne). Carte seule sur sa ligne (rang impair, dernière du groupe, donc
 * pleine largeur) : champ et bouton sur une ligne, comme sous `lg`. Fermé : classes d'avant.
 */
export const PRENOM_CARTE_OUVERTE =
  "min-w-0 md:col-span-2 lg:[&:nth-child(odd)_form]:flex-row lg:[&:nth-child(odd)_form]:items-end";
export const PRENOM_FORM_OUVERT = "flex flex-col gap-3 sm:flex-row sm:items-end lg:flex-col lg:items-start";

/**
 * Prénom du compte (s21 concision, choix de Thomas du 18/10) : il n'est plus demandé à
 * l'inscription, on le renseigne (ou on le corrige) ici. Facultatif : vide = aucun prénom,
 * les e-mails disent « Salut, ». PATCH /api/user (zod, session, même site).
 */
export function PrenomCard({ prenom }: { prenom: string | null }) {
  const setName = useUserStore((s) => s.setName);
  const [valeur, setValeur] = useState(prenom ?? "");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  const enregistrer = async (e: React.FormEvent) => {
    e.preventDefault();
    const propre = valeur.trim();
    if (propre && propre.length < 2) {
      setErreur(T.tropCourt);
      return;
    }
    setErreur("");
    setEnCours(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: propre }),
      });
      const data = (await res.json().catch(() => ({}))) as { name?: string | null; error?: string };
      if (!res.ok) {
        // Saisie refusée (400) : le message de validation ; tout autre échec : le message de la carte.
        setErreur(res.status === 400 && data.error ? data.error : T.erreur);
        return;
      }
      setName(data.name ?? null);
      setValeur(data.name ?? "");
      toast(T.succes, "success");
    } catch {
      setErreur(T.erreur);
    } finally {
      setEnCours(false);
    }
  };

  return (
    <Card className={ESPACE_CLIENT_PUBLIE ? PRENOM_CARTE_OUVERTE : "md:col-span-2"} data-testid="profil-prenom" filet={ESPACE_CLIENT_PUBLIE}>
      <CardHeader>
        <CardTitle>{T.titre}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className={ESPACE_CLIENT_PUBLIE ? PRENOM_FORM_OUVERT : "flex flex-col gap-3 sm:flex-row sm:items-end"} onSubmit={enregistrer} noValidate>
          <div className={ESPACE_CLIENT_PUBLIE ? "flex-1 lg:w-full" : "flex-1"}>
            <label htmlFor="profil-prenom" className="mb-1 block text-sm text-text-secondary">
              {lierComposes(T.label)}
            </label>
            <Input
              id="profil-prenom"
              type="text"
              placeholder={T.placeholder}
              value={valeur}
              onChange={(e) => setValeur(e.target.value)}
              maxLength={PRENOM_MAX}
              autoComplete="given-name"
              aria-describedby={erreur ? "profil-prenom-erreur" : undefined}
              aria-invalid={!!erreur}
              // s22 (revue design C1) : même bordure à 3:1 que le champ voisin « Ta question à l'équipe ».
              // s26 tour 3 (point 11, ouvert seulement) : 44 px de haut à toutes les largeurs, aligné sur son bouton.
              className={ESPACE_CLIENT_PUBLIE ? "h-11 border-border-input" : "border-border-input"}
            />
          </div>
          <Button type="submit" variant="outline" className={ESPACE_CLIENT_PUBLIE ? "min-h-11 md:h-11" : "min-h-11"} disabled={enCours}>
            {enCours ? T.enCours : T.bouton}
          </Button>
        </form>
        {erreur && (
          <p id="profil-prenom-erreur" className="mt-2 text-xs text-error-text" role="alert">
            {erreur}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
