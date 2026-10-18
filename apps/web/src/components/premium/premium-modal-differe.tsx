"use client";

import { useRef, type ComponentProps } from "react";
import dynamic from "next/dynamic";
import type { PremiumModal as PremiumModalType } from "@/components/premium/premium-modal";

/**
 * s21 (QA m3, budget JS) : la fenêtre Premium et ses textes ne sont chargés qu'à la
 * première ouverture (cœur, carte floutée, vote), jamais au premier affichage des pages.
 * Une fois ouverte, elle reste montée (animation de fermeture et réouverture instantanée).
 */
const PremiumModal = dynamic(() => import("@/components/premium/premium-modal").then((m) => m.PremiumModal), {
  ssr: false,
});

export function PremiumModalDiffere(props: ComponentProps<typeof PremiumModalType>) {
  const dejaOuverte = useRef(false);
  if (props.isOpen) dejaOuverte.current = true;
  if (!dejaOuverte.current) return null;
  return <PremiumModal {...props} />;
}
