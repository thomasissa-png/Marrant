import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { EN_TETE_CHEMIN_ESPACE, ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { garderEspace } from "@/lib/espace/garde";
import { lireLecteurApercu } from "@/components/espace/apercu/acces";
import { listerFils } from "@/lib/espace/questions";
import { QuestionsListeDetail } from "@/components/espace/questions/questions-liste-detail";

/**
 * s26 contrôle d'ensemble, abonné (C6 : à 1280, le clic sur un envoi démontait « Mes envois » et montait un rail, autre
 * nœud) : la liste des fils de Mes questions est un LAYOUT qui reste monté, comme Quoi répondre et le Carnet ; seule la
 * partie droite change (« Écrire à l'équipe » sur `/mon-espace/questions`, le fil sur `/mon-espace/questions/<id>`), dès
 * 1024. Sous 1024, la colonne est masquée : la page liste OU le fil plein écran, comme avant.
 * Rendu : dynamique (fils de l'abonné, jamais en cache).
 *
 * Interrupteur fermé : aucune enveloppe, aucune lecture, layout synchrone (les pages rendent leur 404 d'avant). Ouvert :
 * visiteur et inscrit gratuit, aucune enveloppe (la page rend l'aperçu, ou la garde de la page du fil) ; abonné : garde,
 * puis la liste de ses fils (type et statut, jamais le texte).
 */
export const dynamic = "force-dynamic";

const BASE_FIL = "/mon-espace/questions/";

/** Identifiant du fil demandé (`/mon-espace/questions/<id>`), ou null sur la liste. */
function idDeFil(chemin: string | null): string | null {
  const route = (chemin ?? "").split(/[?#]/)[0].replace(/\/$/, "");
  if (!route.startsWith(BASE_FIL) || route.length === BASE_FIL.length) return null;
  const segment = route.slice(BASE_FIL.length);
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

async function ListeDetailAbonne({ children }: { children: React.ReactNode }) {
  if (await lireLecteurApercu()) return <>{children}</>;
  const chemin = headers().get(EN_TETE_CHEMIN_ESPACE);
  const { userId } = await garderEspace(chemin ?? "/mon-espace/questions");
  const fils = await listerFils(userId);
  // s26 batterie (défaut n°3) : fil inexistant ou d'un autre abonné (jamais distingués : seuls SES fils sont listés), la
  // vraie 404 de statut. Posée ici, au-dessus de `loading.tsx` (sous lui, la réponse partait en 200 avant le `notFound()`
  // de la page), comme Quoi répondre. Aucune donnée du fil demandé n'est lue. La page garde son propre `notFound()`.
  const id = idDeFil(chemin);
  if (id !== null && !fils.some((f) => f.id === id)) notFound();
  return <QuestionsListeDetail fils={fils}>{children}</QuestionsListeDetail>;
}

export default function QuestionsLayout({ children }: { children: React.ReactNode }) {
  if (!ESPACE_CLIENT_PUBLIE) return children;
  return <ListeDetailAbonne>{children}</ListeDetailAbonne>;
}
