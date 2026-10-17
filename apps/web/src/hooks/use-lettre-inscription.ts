"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import {
  LETTRE_ABANDON_MS,
  LETTRE_ATTENTE_LONGUE_MS,
  LETTRE_DRAPEAU_JOURS,
  LETTRE_RENVOI_SECONDES,
  LETTRE_STORAGE_KEY,
  type LettreEmplacement,
} from "@/config/lettre";
import { trackUmami } from "@/lib/umami";

/** Seuil de visibilité de `lettre-vu` (même règle que `blog-cta-vu`, CTA_VU_RATIO). */
export const LETTRE_VU_RATIO = 0.5;

export type LettreEtat = "formulaire" | "envoi" | "succes" | "drapeau";
export type LettreErreur = "email" | "case" | "reseau" | "limite" | null;

/** Propriétés Umami : emplacement + slug (article) ou profil (quiz). Aucune donnée personnelle. */
export type LettreMesure = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function drapeauActif(): boolean {
  try {
    const brut = window.localStorage.getItem(LETTRE_STORAGE_KEY);
    const date = brut ? Date.parse(brut) : NaN;
    return Number.isFinite(date) && Date.now() - date < LETTRE_DRAPEAU_JOURS * 24 * 3600 * 1000;
  } catch {
    return false;
  }
}

function poserDrapeau() {
  try {
    window.localStorage.setItem(LETTRE_STORAGE_KEY, new Date().toISOString());
  } catch {
    // Stockage indisponible (navigation privée) : pas de drapeau, rien de grave.
  }
}

/** `lettre-vu` une fois par emplacement et par vue de page, visible à 50 % ou plus. */
export function useLettreVu(ref: RefObject<HTMLElement>, actif: boolean, mesure: LettreMesure) {
  const envoye = useRef(false);
  const mesureRef = useRef(mesure);
  mesureRef.current = mesure;
  useEffect(() => {
    const el = ref.current;
    if (!actif || !el || envoye.current || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio >= LETTRE_VU_RATIO) && !envoye.current) {
          envoye.current = true;
          trackUmami("lettre-vu", mesureRef.current);
          obs.disconnect();
        }
      },
      { threshold: LETTRE_VU_RATIO },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, actif]);
}

export function useLettreInscription(emplacement: LettreEmplacement, slug: string | undefined, mesure: LettreMesure) {
  const [etat, setEtat] = useState<LettreEtat>("formulaire");
  const [erreur, setErreur] = useState<LettreErreur>(null);
  const [lente, setLente] = useState(false);
  const [attente, setAttente] = useState(0);
  const enCours = useRef(false);

  useEffect(() => {
    if (drapeauActif()) setEtat("drapeau");
  }, []);

  useEffect(() => {
    if (attente <= 0) return;
    const t = window.setTimeout(() => setAttente((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [attente]);

  const envoyer = useCallback(
    async (email: string, consent: boolean, siteWeb: string, renvoi = false): Promise<LettreErreur> => {
      if (enCours.current) return null;
      const propre = email.trim();
      const local: LettreErreur = !EMAIL_RE.test(propre) ? "email" : !consent ? "case" : null;
      if (local) {
        setErreur(local);
        trackUmami("lettre-echec", { emplacement, raison: local });
        return local;
      }
      enCours.current = true;
      setErreur(null);
      // Renvoi : on reste sur « Regarde ta boîte mail » (pas de retour au formulaire).
      if (!renvoi) {
        setEtat("envoi");
        trackUmami("lettre-envoi", mesure);
      }
      const controleur = new AbortController();
      const lenteT = window.setTimeout(() => setLente(true), LETTRE_ATTENTE_LONGUE_MS);
      const abandonT = window.setTimeout(() => controleur.abort(), LETTRE_ABANDON_MS);
      let resultat: LettreErreur = "reseau";
      let raison = "reseau";
      try {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: propre, consent: true, emplacement, ...(slug ? { slug } : {}), "site-web": siteWeb }),
          signal: controleur.signal,
        });
        if (res.ok) {
          resultat = null;
        } else if (res.status === 429) {
          resultat = raison = "limite";
        } else if (res.status === 400) {
          const corps = (await res.json().catch(() => ({}))) as { code?: string };
          resultat = raison = corps.code === "case" ? "case" : "email";
        } else if (res.status === 410) {
          raison = "ferme";
        }
      } catch {
        resultat = "reseau";
      } finally {
        window.clearTimeout(lenteT);
        window.clearTimeout(abandonT);
        setLente(false);
        enCours.current = false;
      }
      if (resultat === null) {
        poserDrapeau();
        setAttente(LETTRE_RENVOI_SECONDES);
        setEtat("succes");
      } else {
        setErreur(resultat);
        setEtat(renvoi ? "succes" : "formulaire");
        trackUmami("lettre-echec", { emplacement, raison });
      }
      return resultat;
    },
    [emplacement, slug, mesure],
  );

  return { etat, setEtat, erreur, setErreur, lente, attente, envoyer };
}
