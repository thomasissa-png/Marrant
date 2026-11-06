import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { RESILIATION_PAGE_OUVERTE } from "@/config/resiliation";

/**
 * s23, UX C4 : l'interrupteur est testé ICI, au-dessus de la frontière Suspense de
 * `(formulaire)/loading.tsx` : `notFound()` part avant tout flux, donc statut 404 interrupteur fermé (un
 * `notFound()` dans la seule page, sous le Suspense, donnait 200). Les pages gardent leur propre
 * test (double sécurité). Preuve build + curl : REPLIT_ACTIONS.md, entrée « À DÉPLOYER ».
 */
export default function ResiliationLayout({ children }: { children: ReactNode }) {
  if (!RESILIATION_PAGE_OUVERTE) notFound();
  return children;
}
