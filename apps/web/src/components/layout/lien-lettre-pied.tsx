"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { isPremiumPlan } from "@/lib/parcours-access";

/**
 * Lien « La lettre du mois » du pied de page (s21). Revue s21 m4 : masqué pour un
 * abonné Premium connecté, comme l'onglet du menu et le bloc d'accueil (il reçoit
 * la lettre hebdomadaire ; `/lettre` ne lui propose pas de formulaire).
 */
export function LienLettrePied({ href, label, className }: { href: string; label: string; className: string }) {
  const { data: session, status } = useSession();
  const plan = (session?.user as { plan?: string } | undefined)?.plan;
  if (status === "authenticated" && isPremiumPlan(plan)) return null;
  return (
    <li>
      <Link href={href} className={className}>
        {label}
      </Link>
    </li>
  );
}
