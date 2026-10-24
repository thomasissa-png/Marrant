"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Identifiants des deux boutons d'achat observés (B2 et B6 de /abonnement). */
export const ID_ACHAT_PRINCIPAL = "abonnement-achat-principal";
export const ID_ACHAT_FINAL = "abonnement-achat-final";

/**
 * B2b de /abonnement (trajet de conversion s21, @ux §5) : barre collante sous 768 px, même libellé
 * et même formule que le bouton principal. Visible quand le bouton principal a quitté l'écran par
 * le haut et tant que le bouton final n'y est pas : un seul bouton plein à l'écran. Pas
 * d'animation (rien à réduire pour `prefers-reduced-motion`) ; la page réserve sa hauteur
 * (`scroll-padding-bottom` et marge basse) pour ne jamais masquer le focus (WCAG 2.2, 2.4.11).
 */
export function BarreAchatMobile({ children }: { children: ReactNode }) {
  const [principalVisible, setPrincipalVisible] = useState(true);
  const [principalDessous, setPrincipalDessous] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);
  const barre = useRef<HTMLDivElement>(null);

  // v3 M3 : hauteur réelle de la barre (le libellé peut passer sur 2 lignes à 320 px), publiée en
  // variable CSS pour la marge basse de la page : la fin de la FAQ se lit en entier au-dessus de la barre.
  useEffect(() => {
    const el = barre.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const racine = document.documentElement;
    const publier = () => racine.style.setProperty("--abonnement-barre-h", `${Math.ceil(el.getBoundingClientRect().height) + 16}px`);
    publier();
    const ro = new ResizeObserver(publier);
    ro.observe(el);
    return () => {
      ro.disconnect();
      racine.style.removeProperty("--abonnement-barre-h");
    };
  }, []);

  useEffect(() => {
    const principal = document.getElementById(ID_ACHAT_PRINCIPAL);
    const final = document.getElementById(ID_ACHAT_FINAL);
    if (!principal || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === principal) {
          setPrincipalVisible(entry.isIntersecting);
          // Bouton principal sous l'écran (page ouverte plus bas) : pas de barre.
          setPrincipalDessous(!entry.isIntersecting && entry.boundingClientRect.top > 0);
        } else if (entry.target === final) {
          setFinalVisible(entry.isIntersecting);
        }
      }
    });
    observer.observe(principal);
    if (final) observer.observe(final);
    return () => observer.disconnect();
  }, []);

  const visible = !principalVisible && !principalDessous && !finalVisible;

  return (
    <div
      ref={barre}
      data-testid="abonnement-barre-collante"
      data-visible={visible ? "oui" : "non"}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden",
        // Cachée mais mesurable (`invisible` : ni vue, ni focus, ni lecteur d'écran).
        !visible && "invisible",
      )}
    >
      {children}
    </div>
  );
}
