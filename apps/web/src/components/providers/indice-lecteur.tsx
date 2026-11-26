"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  ATTRIBUT_INDICE_LECTEUR,
  COOKIE_INDICE_LECTEUR,
  DUREE_INDICE_LECTEUR_S,
  indiceDepuisPlan,
  lireIndiceLecteur,
  type IndiceLecteur as Indice,
} from "@/lib/indice-lecteur";

function ecrireCookie(valeur: Indice | null) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    valeur === null
      ? `${COOKIE_INDICE_LECTEUR}=; Path=/; Max-Age=0; SameSite=Lax${secure}`
      : `${COOKIE_INDICE_LECTEUR}=${valeur}; Path=/; Max-Age=${DUREE_INDICE_LECTEUR_S}; SameSite=Lax${secure}`;
}

/**
 * Tient à jour l'indice « abonné » (`lib/indice-lecteur.ts`, s27 D2) une fois la session lue : cookie et attribut de
 * <html>. Abonné : posé (prochain chargement sans offre, même un instant) ; compte sans abonnement : « compte » (les
 * offres réapparaissent) ; pas de session : effacé. Pendant la lecture de la session : rien ne change. Ne rend rien.
 */
export function IndiceLecteur() {
  const { status, data } = useSession();
  const plan = (data?.user as { plan?: string } | undefined)?.plan;

  useEffect(() => {
    if (status === "loading") return;
    const voulu: Indice | null = status === "authenticated" ? indiceDepuisPlan(plan) : null;
    if (lireIndiceLecteur(document.cookie) !== voulu) ecrireCookie(voulu);
    const html = document.documentElement;
    if (voulu === "abonne") html.setAttribute(ATTRIBUT_INDICE_LECTEUR, "abonne");
    else html.removeAttribute(ATTRIBUT_INDICE_LECTEUR);
  }, [status, plan]);

  return null;
}
