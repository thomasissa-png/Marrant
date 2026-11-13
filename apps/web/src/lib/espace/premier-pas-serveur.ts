/**
 * Lecture en base du lien de retour (s24, lot D3) : titre et adresse de la cible du premier pas.
 * Fiche du catalogue (vanne, conseil, vidéo active), étape d'un parcours actif (titre du conseil
 * de l'étape), parcours actif sans étape (son étape 1). Cible introuvable ou inactive : null
 * (aucun signal, on passe à la suite de l'ordre 1). Lecture seule.
 */
import { capDepuisXp, type NumeroCap } from "@/lib/espace/caps";
import { auMoinsUneFicheFaite } from "@/lib/espace/fiche-fait";
import { figerPremierPas } from "@/lib/espace/premier-pas-fige";

export { figerPremierPas };
import { prisma } from "@/lib/prisma";
import { buildJokeSlug, buildTipSlug, buildVideoSlug, parseShortIdFromSlug } from "@/lib/catalogue-slug";
import type { Origine, OrigineResolue } from "@/lib/espace/premier-pas";

async function ficheCatalogue(o: Extract<Origine, { genre: "fiche" }>): Promise<OrigineResolue | null> {
  const prefixe = o.id ?? (o.slug ? parseShortIdFromSlug(o.slug) : null);
  if (!prefixe) return null;
  const where = o.id ? { id: o.id, isActive: true } : { id: { startsWith: prefixe }, isActive: true };
  if (o.type === "JOKE") {
    const j = await prisma.joke.findFirst({ where, select: { id: true, content: true } });
    return j ? { genre: "fiche", titre: j.content, href: `/vannes/${buildJokeSlug(j)}` } : null;
  }
  if (o.type === "TIP") {
    const t = await prisma.tip.findFirst({ where, select: { id: true, title: true } });
    return t ? { genre: "fiche", titre: t.title, href: `/conseils/${buildTipSlug(t)}` } : null;
  }
  const v = await prisma.video.findFirst({ where, select: { id: true, title: true } });
  return v ? { genre: "fiche", titre: v.title, href: `/videos/${buildVideoSlug(v)}` } : null;
}

async function etapeDeParcours(slug: string, ordre: number): Promise<{ titre: string } | null> {
  const etape = await prisma.learningPathStep.findFirst({
    where: { order: ordre, learningPath: { slug, isActive: true } },
    select: { tip: { select: { title: true } } },
  });
  return etape ? { titre: etape.tip.title } : null;
}

export async function resoudreOrigine(origine: Origine | null): Promise<OrigineResolue | null> {
  if (!origine) return null;
  if (origine.genre === "fiche") return ficheCatalogue(origine);
  const ordre = origine.genre === "etape" ? origine.etape : 1;
  const etape = await etapeDeParcours(origine.parcours, ordre);
  return etape ? { genre: origine.genre, titre: etape.titre, href: `/parcours/${origine.parcours}#etape-${ordre}` } : null;
}

/** Traces lues pour le premier pas (arbitrage @ux D5 n°3, `docs/ux/arbitrages-d5-s24.md`). */
export interface TracesPremierPas {
  /** Fiche déclarée faite (`FicheFait`) ou carte de la rafale jouée, « Rien » compris (`CarteReponse`). */
  ficheOuCarte: boolean;
  /** Étapes de parcours validées (`UserPathStepCompletion`) : une étape est une fiche (2.1). */
  etapesValidees: number;
  /** Réponse à la question C9 enregistrée : elle n'est posée qu'APRÈS le premier pas. */
  c9Repondue: boolean;
}

/**
 * Règle du premier pas : une fiche « Fait », OU une carte jouée, OU une étape validée. Ne comptent pas :
 * réplique écrite, retour de mission, favori. La réponse à C9 (posée seulement après le premier pas) le
 * garde vrai pour les comptes d'avant la migration 26.
 */
export function premierPasDepuis(t: TracesPremierPas): boolean {
  return t.ficheOuCarte || t.etapesValidees > 0 || t.c9Repondue;
}

/**
 * Premier pas fait ? STRICTEMENT monotone : une fois `premierPasLe` posé, vrai pour toujours. Sinon, les
 * traces (lectures en parallèle, comptes seulement) ; vraies, la date est posée avant de répondre. Tant que
 * non, « Aujourd'hui » reste à l'état 1 (4.4) et la question C9 (posée APRÈS) n'est pas montée.
 */
export async function premierPasFait(userId: string): Promise<boolean> {
  const [ficheOuCarte, etapesValidees, compte] = await Promise.all([
    auMoinsUneFicheFaite(userId),
    prisma.userPathStepCompletion.count({ where: { userId } }),
    prisma.espaceCompte.findUnique({ where: { userId }, select: { aise: true, premierPasLe: true } }),
  ]);
  if (compte?.premierPasLe) return true;
  const fait = premierPasDepuis({ ficheOuCarte, etapesValidees, c9Repondue: Boolean(compte?.aise) });
  if (fait) await figerPremierPas(userId);
  return fait;
}

/** Jours depuis la création de l'abonnement, étapes validées : de quoi décider « Ton mois » (J25, 4.4). */
export async function lireMois(
  userId: string,
  maintenant: Date = new Date(),
): Promise<{ serie: number; montrer: boolean; cap: NumeroCap }> {
  const [compte, etapes] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true, xp: true, subscription: { select: { createdAt: true } } },
    }),
    prisma.userPathStepCompletion.count({ where: { userId } }),
  ]);
  const debut = compte?.subscription?.createdAt;
  const jours = debut ? (maintenant.getTime() - debut.getTime()) / 86_400_000 : 0;
  // Lot D4 : cap AFFICHÉ (total d'XP), mêmes textes que la carte « Ton cap » (architecture 4.4 point 2).
  return { serie: compte?.streak ?? 0, montrer: jours >= JOUR_TON_MOIS && etapes > 0, cap: capDepuisXp(compte?.xp ?? 0) };
}

/** « Ton mois » à partir de J25 environ (architecture 4.4). */
export const JOUR_TON_MOIS = 25;
