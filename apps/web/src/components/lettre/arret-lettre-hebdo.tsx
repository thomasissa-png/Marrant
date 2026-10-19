"use client";

import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { LETTRE_HEBDO_ARRET as T } from "@/config/textes/lettre-hebdo-s21";
import { frTypo } from "@/lib/fr-typo";
import { trackUmamiWhenReady } from "@/lib/umami";
import { cn } from "@/lib/utils";

type Etat = "defaut" | "en-cours" | "succes" | "deja" | "inconnu" | "erreur";

/**
 * Page d'arrêt de la lettre de la semaine (avis @legal §3, spec US-H3). L'ouverture
 * (GET) ne change rien : un scanner de liens n'arrête personne. Seul le bouton envoie
 * le POST. Textes exacts de l'avis @legal. Délai de 5 s, puis état d'erreur.
 */
export function ArretLettreHebdo({ token }: { token: string | null }) {
  const [etat, setEtat] = useState<Etat>(token ? "defaut" : "inconnu");
  const envoi = useRef(false);
  // Bouton actif une fois la page interactive : jamais de clic perdu avant l'hydratation.
  const [pret, setPret] = useState(false);

  useEffect(() => {
    setPret(true);
    trackUmamiWhenReady("lettre-hebdo-arret-vu");
  }, []);

  async function arreter() {
    if (!token || envoi.current) return;
    envoi.current = true;
    setEtat("en-cours");
    try {
      const res = await fetch("/api/lettre-premium/arret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(5000) : undefined,
      });
      if (res.status === 404 || res.status === 400) {
        setEtat("inconnu");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { deja?: boolean };
      if (data.deja) {
        setEtat("deja");
      } else {
        setEtat("succes");
        trackUmamiWhenReady("lettre-hebdo-arretee", { origine: "lien-email" });
      }
    } catch {
      setEtat("erreur");
    } finally {
      envoi.current = false;
    }
  }

  const message = etat === "succes" ? T.succes : etat === "deja" ? T.dejaArretee : etat === "inconnu" ? T.lienInconnu : null;

  return (
    <div className="mx-auto max-w-3xl py-10" data-testid="arret-lettre-hebdo">
      <h1 className="text-balance font-display text-2xl font-bold text-text-primary sm:text-3xl">{frTypo(T.titre)}</h1>
      <div role="status" aria-live="polite">
        {message ? (
          <p className="mt-2 max-w-lg text-text-secondary" data-etat={etat}>
            {frTypo(message)}
          </p>
        ) : (
          <p className="mt-2 max-w-lg text-text-secondary" data-etat={etat}>
            {frTypo(T.defaut)}
          </p>
        )}
        {etat === "erreur" && <p className="mt-3 max-w-lg text-sm text-error">{frTypo(T.erreur)}</p>}
      </div>
      {(etat === "defaut" || etat === "en-cours" || etat === "erreur") && (
        <button
          type="button"
          onClick={arreter}
          disabled={!pret || etat === "en-cours"}
          className={cn(buttonVariants({ variant: "outline-accent", size: "lg" }), "mt-6 w-full sm:w-auto")}
        >
          {etat === "en-cours" ? T.enCours : T.bouton}
        </button>
      )}
    </div>
  );
}
