/**
 * Lecture en base du lien de retour (s24, lot D3) : titre et adresse de la cible du premier pas.
 * Fiche du catalogue (vanne, conseil, vidéo active), étape d'un parcours actif (titre du conseil
 * de l'étape), parcours actif sans étape (son étape 1). Cible introuvable ou inactive : null
 * (aucun signal, on passe à la suite de l'ordre 1). Lecture seule.
 */
import { capDepuisXp, type NumeroCap } from "@/lib/espace/caps";
import { auMoinsUneFicheFaite } from "@/lib/espace/fiche-fait";
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

/**
 * Premier pas fait ? (lot D5) : une fiche déclarée faite (`FicheFait`) ou une carte de la rafale jouée.
 * Tant que non, « Aujourd'hui » reste à l'état 1 (4.4) et la question C9 (posée APRÈS) n'est pas montée.
 */
export async function premierPasFait(userId: string): Promise<boolean> {
  return auMoinsUneFicheFaite(userId);
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
